import { User } from 'src/models/user.entity';
import { Tokens } from './tokens.type';
export type UserRes = {
  user: User;
  tokens: Tokens;
};
