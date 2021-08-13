import { Result } from '../result';
import { BaseError } from './base.error';

/**
 * @desc General application errors (few of these as possible)
 * @http 500
 */
export namespace AppError {
  const _context = 'AppError';
  export class UnexpectedError extends BaseError {
    private readonly _brand?: UnexpectedError;
    public constructor(error?: Error) {
      super({
        name: 'UnexpectedError',
        message: error
          ? `An unexpected error occurred: ${error.message}`
          : 'An unexpected error occurred.',
        context: _context,
      });
    }
  }

  export type UnexpectedErrorResult<T> = Result<T, UnexpectedError>;

  export class ValidationError extends BaseError {
    private readonly _brand?: ValidationError;
    public constructor(message: string) {
      super({ name: 'ValidationError', message, context: _context });
    }
  }

  export type ValidationErrorResult<T> = Result<T, ValidationError>;

  export class InsufficientPermitsError extends BaseError {
    private readonly _brand?: InsufficientPermitsError;
    public constructor(message = `Action not permited. Unauthorized.`) {
      super({ name: 'InsufficientPermits', message, context: _context });
    }
  }

  export type InsufficientPermitsErrorResult<T> = Result<
    T,
    InsufficientPermitsError
  >;
}
