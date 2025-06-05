export interface OnlyIdDto {
  id: string;
}

export interface ResultData<T> {
  data: T | null;
  error: Error | null;
}

export interface ResultDataWithErrorMessages<T> {
  data: T | null;
  error: string | null;
}
