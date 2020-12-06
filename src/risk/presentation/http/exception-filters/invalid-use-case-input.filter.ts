import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { InvalidUsecaseInputError } from 'src/risk/usecases/errors/invalid-usecase-input.error';

@Catch(InvalidUsecaseInputError)
export class InvalidUsecaseInputFilter implements ExceptionFilter {
  catch(exception: InvalidUsecaseInputError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    return response.status(400).json(exception.data);
  }
}
