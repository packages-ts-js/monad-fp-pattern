import { IResultError } from './interfaces/result.error.interface';

export class Result<R, E extends IResultError = IResultError> {
  public isSuccess: boolean;
  public error?: E;
  private readonly value?: R;

  protected constructor(isSuccess: boolean, error?: E, value?: R) {
    if (isSuccess && error)
      throw new Error(
        "Invalid operation: a result can't be successful and contain an error",
      );
    if (!isSuccess && !error)
      throw new Error(
        'Invalid operation: a result needs contains an error message',
      );

    this.isSuccess = isSuccess;
    this.error = error;
    this.value = value;

    Object.freeze(this);
  }

  /**
   *
   * @returns Get response if all work ok, in other case throw error
   */
  public getValue(): R {
    if (!this.isSuccess) throw new Error("Can't get value of an error result");

    return this.value;
  }

  /**
   *
   * @returns  Get error if fail, in other case get undefined.
   */
  public getError(): E {
    return !this.isSuccess ? this.error : undefined;
  }

  /**
   * Create a failure Result value. IsFailure returns true.
   *
   * @static
   * @template U
   * @template E
   * @param {E} error
   * @returns  {Result<V, E>}
   * @memberof Result
   */
  public static Fail<V, E extends IResultError = IResultError>( error: E ) : Result<V, E> {
    return new Result<V, E>(false, error);
  }

  /**
   * Create a success Result value. IsSuccess returns true.
   *
   * @static
   * @template U
   * @template E
   * @param {U} [value]
   * @returns  {Result<U, E>}
   * @memberof Result
   */
  public static Ok<U, E extends IResultError = IResultError>( value?: U ) : Result<U, E> {
    return new Result<U, E>(true, null, value);
  }

  public static combine(results: Result<unknown>[]): Result<unknown> {
    for (const r of results) if (!r.isSuccess) return r;

    return Result.Ok();
  }

  /**
   * Maps a Result<R, E> to Result<T, E> by applying a function to a contained 'OK' value,
   * leaving an 'Error' value untouched. This function can be used to compose the results of two functions.
   *
   * @template T
   * @param {(a: R) => Promise<T>} func
   * @returns  {Promise<Result<T>>}
   * @memberof Result
   */
  public async mapAsync<T>( func:(a: R) => Promise<T> ): Promise<Result<T>> {
    
    return this.isSuccess
      ? Result.Ok(await func(this.value))
      : Result.Fail(this.error);
  }

  /**
   * Maps a Result<R, E> to T by applying a function to a contained 'Ok' value, or a fallback function to
   * a contained 'Error' value. This function can be used to unpack a successful result while handling an error.
   *
   * @template T
   * @param {(a: R) => T} func
   * @param {(a: E) => T} def
   * @returns  {T}
   * @memberof Result
   */
  public mapOrElse<T>( mapFunc: (a: R) => T | Promise<T>, elseFunc:(a: E) => T  ): T {
    return this.isSuccess ? (mapFunc(this.value) as T) : elseFunc(this.error);
  }

  /**
   * Returns res if the result is 'Ok', otherwise returns the Err value of 'this'.
   *
   * @template U
   * @param {Result<U, E>} res
   * @returns  {Result<U, E>}
   * @memberof Result
   */
  public and<U>(res: Result<U, E>): Result<U, E> {
    return this.isSuccess ? res : Result.Fail(this.error);
  }

  /**
   * Returns the contained 'Err' value, consuming the 'this' value.
   *
   * @returns  {E}
   * @memberof Result
   */
  public unwrapError(): E {
    if (this.isSuccess) throw new Error(`Unwraping error in 'Ok' result`);
    return this.error;
  }

  /**
   * Returns the contained 'Ok' value. If the value is an 'Error' then throw it.
   *
   * @returns  {R}
   * @memberof Result
   */
  public unwrap(): R {
    if (!this.isSuccess) this.error.throw();
    return this.value;
  }
}
