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
-- (the highest-scoring resume chunk).

create extension if not exists vector;

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
language sql stable
as $$
  with text_matches as (
    select
      c.candidate_user_id as candidate_id,
      1.0 as text_score,
      ch.chunk_content as match_content
    from gfo_candidate_resume_chunks ch
    join gfo_candidates c on c.user_id = ch.candidate_user_id
    where query_text <> ''
      and ch.chunk_content ilike '%' || replace(replace(query_text, '"', ''), ' OR ', '%') || '%'
  ),
  vector_matches as (
    select
      ch.candidate_user_id as candidate_id,
      1 - (ch.embedding <=> query_embedding) as vector_score,
      ch.chunk_content as match_content,
      row_number() over (
        partition by ch.candidate_user_id
        order by ch.embedding <=> query_embedding
      ) as rank_in_candidate
    from gfo_candidate_resume_chunks ch
    where ch.embedding is not null
      and (ch.embedding <=> query_embedding) < match_threshold
  ),
  best_vector as (
    select
      candidate_id,
      vector_score,
      match_content
    from vector_matches
    where rank_in_candidate = 1
  ),
  combined as (
    select
      m.candidate_id,
      greatest(
        coalesce(t.text_score, 0),
        coalesce(v.vector_score, 0)
      ) as match_score,
      coalesce(t.match_content, v.match_content, '') as match_content
    from (
      select candidate_id from text_matches
      union
      select candidate_id from best_vector
    ) m
    left join (
      select candidate_id, max(text_score) as text_score,
             (array_agg(match_content order by text_score desc))[1] as match_content
      from text_matches group by candidate_id
    ) t using (candidate_id)
    left join best_vector v using (candidate_id)
  )
  select
    c.user_id as candidate_id,
    comb.match_score,
    comb.match_content
  from combined comb
  join gfo_candidates c on c.user_id = comb.candidate_id
  left join gfo_candidate_hidden_organisations h
    on h.candidate_user_id = c.user_id
   and h.organisation_id = any(blocked_org_ids)
  where c.years_experience >= min_experience
    and h.id is null
  order by comb.match_score desc
  limit match_count;
$$;

-- The app relies on permissive execution from the anon/service-role role that
-- Supabase exposes. On a plain Postgres deployment, grant to the role your
-- app connects as, e.g.:
--   grant execute on function match_candidates_hybrid to app_user;
