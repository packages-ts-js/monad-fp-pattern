import { isNil } from 'lodash';
import { IResultError } from './interfaces/result.error.interface';
import { Result } from './result';
import { IOptional } from './interfaces/option.interface'

export function Optional<A>(a: A): IOptional<A> {
  if (isNil(a)) {
    return None;
  } else {
    return new Some(a);
  }
}

class Some<A> implements IOptional<A> {
  constructor(private a: A) {}

  okOr<E extends IResultError>(err: E): Result<A> {
    return Result.Ok(this.a);
  }

  isNone(): boolean {
    return false;
  }

  isSome(): boolean {
    return true;
  }

  expect(msg: string): A {
    return this.a;
  }

  unwrap(): A {
    return this.a;
  }

  map<B>(func: (a: A) => B): IOptional<B> {
    return Optional(func(this.a));
  }
}

const None: IOptional<any> = {
  isNone(): boolean {
    return true;
  },

  isSome(): boolean {
    return false;
  },

  expect(msg: string): any {
    throw new Error(msg);
  },

  unwrap(): any {
    throw new Error(`Error unwraping 'None' value`);
  },

  map<B>(_: (_: any) => B) {
    return this;
  },

  okOr<E extends IResultError>(err: E): Result<any> {
    return Result.Fail(err);
  },
};



