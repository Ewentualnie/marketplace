import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/models/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'at-secret',
    });
  }
  async validate(payload: any) {
    const user: User = await this.userService.findOne(payload.sub);

    if (user && user.role === 'admin') {
      return payload;
    }

    throw new UnauthorizedException(
      'Only the Administrator is allowed to do this.',
    );
  }
}
