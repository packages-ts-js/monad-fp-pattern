import { Result } from "./result"
import { IGuardResult } from './interfaces/guard-result.interface'
import { IGuardArgument } from './interfaces/guard-argument.interface'
import { IResultError } from "./interfaces/result.error.interface"


class GuardResult implements IGuardResult, IGuardArgument<any> {
    argument: any
    argumentPath: string
    succeeded: boolean
    message: string

    constructor(argument?: any, argumentPath?: string, succeeded: boolean = true, message: string="") {
        this.argument = argument 
        this.argumentPath = argumentPath
        this.succeeded = succeeded
        this.message = message
    }

    
    getSuccessResult = (argument: any, argumentPath: string): GuardResult => (
        new GuardResult(argument, argumentPath, true, `${argumentPath}.correct`)  
    )

    getArguments (argument?: any, argumentPath?: string): GuardResult {
        if (argument === null || argument === undefined)
            if (argumentPath === null || argumentPath === undefined) return this

        return new GuardResult(argument, argumentPath)
    }

   /**
   * Determines if value isn't null or undefined.
   *
   * @static
   * @param {unknown} argument
   * @param {string} argumentPath
   * @returns  {IGuardResult}
   * @memberof Guard
   */
    againstNullOrUndefined( argument?: unknown, argumentPath?: string ): GuardResult {
        if (!this.succeeded) return this
        const guard = this.getArguments(argument, argumentPath)
        if (guard.argument === null || guard.argument === undefined)
            return new GuardResult(guard.argument, guard.argumentPath, false, `${guard.argumentPath} should be defined`)
        else 
        return this.getSuccessResult(guard.argument, guard.argumentPath);
    }
   
    /**
    * Determines if value is of type 'string'.
    *
    * @static
    * @param {unknown} value
    * @param {string} argumentPath
    * @returns  {GuardResult}
    * @memberof Guard
    */
    isString(argument?: unknown, argumentPath?: string): GuardResult {
        if (!this.succeeded) return this
        const guard = this.getArguments(argument, argumentPath)
        if (typeof guard.argument === 'string' || guard.argument instanceof String) 
            return this.getSuccessResult(guard.argument, guard.argumentPath);
        
        return new GuardResult(guard.argument, guard.argumentPath, false, `${guard.argumentPath} isnt of type string` )  
    }


    /**
   * Determines if value isn't null or undefined.
   *
   * @static
   * @param {unknown} argument
   * @param {string} argumentPath
   * @returns  {IGuardResult}
   * @memberof Guard
   */
    againstEmptyString( argument?: unknown, argumentPath?: string ): GuardResult {
        if (!this.succeeded) return this
        let guard = this.getArguments(argument, argumentPath)
        guard = guard.isString()
    
        if (!guard.succeeded) return guard
        else if (guard.argument === "")  return new GuardResult(guard.argument, guard.argumentPath, false, `${guard.argumentPath} is a empty string`)
        else return this.getSuccessResult(guard.argument, guard.argumentPath);
    }

    
    public combine(...results: GuardResult[]): GuardResult {
        for (const r of results) if (!r.succeeded) return r;
    
        return this;
    }
    public mapToResult<T>( succFunc: () => T, errorFunc: (text) => IResultError) : Result<T> {
        if(this.succeeded) return Result.Ok(succFunc())

        return Result.Fail(errorFunc(this.message))
    }
}


export type GuardArgumentCollection = IGuardArgument<unknown>[];
export const guard = new GuardResult()
