export type Order =
  | {
      id?: 'ASC' | 'DESC';
      email?: 'ASC' | 'DESC';
    }
  | undefined;
export type Flags =
  | {
      photoPath?: boolean;
      advert?: boolean;
    }
  | undefined;
