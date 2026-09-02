-- GetFinalOffer — hybrid candidate search RPC
--
-- Creates the match_candidates_hybrid function that the semantic search path
-- (features/recruiter/candidates-data-access.ts) calls through Supabase.
-- Run this once against your Postgres/Supabase project, after applying the
-- Drizzle migrations (pnpm db:migrate) and enabling the pgvector extension.
--
-- Parameters (as invoked by the app):
--   query_embedding  : vector(1536) — embedding of the recruiter's query
--   query_text       : text         — tsquery-style boolean string ('"a" OR "b"'), '' disables text matching
--   match_threshold  : float        — cosine distance threshold (0.32 strict / 0.10 loose)
--   match_count      : int          — recall pool size
--   min_experience   : int          — minimum years of experience
--   blocked_org_ids  : text[]      — organisation ids whose hidden candidates must be excluded
--
-- Returns: candidate_id, match_score (0..1, higher is better), match_content
-- (the best-matching resume chunk).
--
-- Fusion: text (BM25) and vector arms are ranked independently and combined
-- with Reciprocal Rank Fusion — 1/(k + rank) summed per candidate, k=60 —
-- instead of greatest(). RRF keeps candidates that only one arm finds, which
-- greatest() discarded, and needs no score-scale normalization between arms.

create extension if not exists vector;

-- Full-text search index over resume chunks (BM25-style ranking).
create index if not exists chunk_content_fts_idx
  on gfo_candidate_resume_chunks
  using gin (to_tsvector('english', chunk_content));

create or replace function match_candidates_hybrid(
  query_embedding vector(1536),
  query_text text,
  match_threshold float default 0.32,
  match_count int default 50,
  min_experience int default 0,
  blocked_org_ids text[] default '{}'
)
returns table (
  candidate_id text,
  match_score float,
  match_content text
)
language plpgsql stable
as $$
declare
  ts_query tsquery;
begin
  -- The app sends '"React" OR "Node.js"' style strings; convert to tsquery.
  -- On conversion failure the text arm quietly disables and the vector arm
  -- carries the query alone.
  begin
    ts_query := websearch_to_tsquery('english', replace(query_text, '"', ''));
  exception when others then
    ts_query := null;
  end;

  return query
  with
  -- BM25-style text arm: rank resume chunks per candidate.
  text_matches as (
    select
      ch.candidate_user_id as cand_id,
      row_number() over (
        order by ts_rank_cd(
          to_tsvector('english', ch.chunk_content),
          ts_query
        ) desc
      ) as arm_rank,
      ts_rank_cd(
        to_tsvector('english', ch.chunk_content),
        ts_query
      ) as text_rank,
      ch.chunk_content as best_chunk
    from gfo_candidate_resume_chunks ch
    where ts_query is not null
      and query_text <> ''
      and to_tsvector('english', ch.chunk_content) @@ ts_query
  ),
  -- Best text hit per candidate (highest-ranked chunk).
  text_best as (
    select
      cand_id,
      arm_rank,
      best_chunk
    from text_matches
    where arm_rank <= 200
    order by arm_rank
  ),
  -- Vector arm: nearest chunk per candidate inside the distance threshold.
  vector_best as (
    select
      cand_id,
      row_number() over (
        order by vec_dist
      ) as arm_rank,
      best_chunk
    from (
      select
        ch.candidate_user_id as cand_id,
        (ch.embedding <=> query_embedding) as vec_dist,
        row_number() over (
          partition by ch.candidate_user_id
          order by ch.embedding <=> query_embedding
        ) as chunk_rank,
        ch.chunk_content as best_chunk
      from gfo_candidate_resume_chunks ch
      where ch.embedding is not null
        and (ch.embedding <=> query_embedding) < match_threshold
    ) ranked
    where chunk_rank = 1
    order by vec_dist
    limit 200
  ),
  -- Union the arm hits (a candidate found by only one arm survives) and
  -- fuse: RRF k=60.
  fused as (
    select
      coalesce(t.cand_id, v.cand_id) as cand_id,
      (coalesce(1.0 / (60 + t.arm_rank), 0) + coalesce(1.0 / (60 + v.arm_rank), 0))::double precision as rrf_score,
      coalesce(t.best_chunk, v.best_chunk, '') as best_chunk
    from text_best t
    full outer join vector_best v on v.cand_id = t.cand_id
  )
  select
    c.user_id,
    f.rrf_score,
    f.best_chunk
  from fused f
  join gfo_candidates c on c.user_id = f.cand_id
  left join gfo_candidate_hidden_organisations h
    on h.candidate_user_id = c.user_id
   and h.organisation_id = any(blocked_org_ids)
  where c.years_experience >= min_experience
    and h.id is null
  order by f.rrf_score desc
  limit match_count;
end;
$$;

-- The app relies on permissive execution from the anon/service-role role that
-- Supabase exposes. On a plain Postgres deployment, grant to the role your
-- app connects as, e.g.:
--   grant execute on function match_candidates_hybrid to app_user;
