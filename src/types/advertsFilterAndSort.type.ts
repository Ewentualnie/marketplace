export type FilterParams =
  | {
      teachingLanguages?: number[];
      spokenLanguages?: number[];
      specializations?: number[];
    }
  | undefined;

export type SortParams =
  | {
      teachingLanguages?: 'ASC' | 'DESC';
      spokenLanguages?: 'ASC' | 'DESC';
      specializations?: 'ASC' | 'DESC';
    }
  | undefined;
