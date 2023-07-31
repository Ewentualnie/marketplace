import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublicClass = this.reflector.get<boolean>(
      'isPublic',
      context.getClass(),
    );
    const isPublicHandler = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    const isPublic = isPublicHandler || isPublicClass;
    return isPublic ? true : super.canActivate(context);
  }
}
