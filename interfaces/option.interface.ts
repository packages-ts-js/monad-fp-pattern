import { IResultError } from './result.error.interface'
import {Result} from '../result'

export interface IOptional<A> {
    /**
     *
     * Returns true is the options is a None value
     *
     * @returns {boolean}
     * @memberof Optional
     */
    isNone(): boolean;
  
    /**
     * Returns true if the option is a Some value.
     *
     * @returns  {boolean}
     * @memberof Optional
     */
    isSome(): boolean;
  
    /**
     * Returns the contained 'Some' value, if is 'None' throw an error with the passed message.
     *
     * @param {string} msg
     * @returns  {A}
     * @memberof Optional
     */
    expect(msg: string): A;
  
    /**
     * Returns the contained 'Some' value, if is 'None' throw an error.
     *
     * @returns  {A}
     * @memberof Optional
     */
    unwrap(): A;
  
    /**
     * Maps an Option<T> to Option<U> by applying a function to a contained value.
     *
     * @template B
     * @param {(a: A) => B} func
     * @returns  {Optional<B>}
     * @memberof Optional
     */
    map<B>(func: (a: A) => B): IOptional<B>;
  
    /**
     * Transforms the Option<T> into a Result<T, E>, mapping 'Some(v)' to 'Ok(v)' and 'None' to 'Error(err)'.
     * Arguments passed to okOr are eagerly evaluated; if you are passing the result of a function call, it is
     * recommended to use okOrElse, which is lazily evaluated.
     *
     * @template E
     * @param {E} err
     * @returns  {Result<A>}
     * @memberof Optional
     */
    okOr<E extends IResultError>(err: E): Result<A>;
  }