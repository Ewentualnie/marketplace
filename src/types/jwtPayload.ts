export type JwtPayload = {
  sub: string;
  email: string;
  refreshToken?: string;
};
