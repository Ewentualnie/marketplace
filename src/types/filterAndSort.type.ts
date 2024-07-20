export type Order =
  | {
      id?: 'ASC' | 'DESC';
      email?: 'ASC' | 'DESC';
      country?: 'ASC' | 'DESC';
    }
  | undefined;

export type Flags =
  | {
      photoPath?: boolean;
      advert?: boolean;
      countryId?: number;
    }
  | undefined;
