import { Request } from 'express';
import { JwtPayload } from './jwtPayload';

// Визначення розширеного типу для Request з додатковою властивістю user
interface ExtendedRequest extends Request {
  user: JwtPayload; // Вкажіть відповідний тип для user, який відповідає вашим JWT Payload
}

export default ExtendedRequest;
