import { Injectable } from '@nestjs/common';
import { Error } from 'mongoose';

@Injectable()
export class ValidationService {
  error(path: string, message: string): Error.ValidationError {
    const error = new Error.ValidationError();
    error.errors[path] = new Error.ValidatorError({
      path,
      message,
    });
    return error;
  }
}
