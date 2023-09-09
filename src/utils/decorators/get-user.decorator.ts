import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, contex: ExecutionContext): number => {
    const request = contex.switchToHttp().getRequest();
    return !data ? request.user : request.user[data];
  },
);
