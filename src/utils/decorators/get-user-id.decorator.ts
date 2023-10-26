import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (data: undefined, contex: ExecutionContext): number => {
    const request = contex.switchToHttp().getRequest();
    console.log('request', request);
    return request.user['sub'];
  },
);
