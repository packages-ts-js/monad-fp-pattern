import { Result } from "./result"
import { IGuardResult } from './interfaces/guard-result.interface'
import { IGuardArgument } from './interfaces/guard-argument.interface'
import { IResultError } from "./interfaces/result.error.interface"

export class Guard  {
    private readonly argument: any
    private readonly argumentPath: string
    succeeded: boolean
    message: string

    protected constructor(argument: any, argumentPath: string, succeeded: boolean = true, message: string="") {
        this.argument = argument 
        this.argumentPath = argumentPath
        this.succeeded = succeeded
        this.message = message
    }

    public static start(argument: any, argumentPath: string) {
        return new Guard(argument, argumentPath)
    }
    
    getSuccessResult = (argument: any, argumentPath: string): Guard => (
        new Guard(argument, argumentPath, true, `${argumentPath}.correct`)  
    )

   /**
   * Determines if value isn't null or undefined.
   *
   * @static
   * @param {unknown} argument
   * @param {string} argumentPath
   * @returns  {IGuardResult}
   * @memberof Guard
   */
    againstNullOrUndefined(): Guard {
        if (!this.succeeded) return this

        if (this.argument === null || this.argument === undefined)
            return new Guard(this.argument, this.argumentPath, false, `${this.argumentPath} should be defined`)
        else return this.getSuccessResult(this.argument, this.argumentPath);
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
    isString(): Guard {
        if (!this.succeeded) return this
        
        if (typeof this.argument === 'string' || this.argument instanceof String) 
            return this.getSuccessResult(this.argument, this.argumentPath);
        
        return new Guard(this.argument, this.argumentPath, false, `${this.argumentPath} isnt of type string` )  
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
    againstEmptyString( argument?: unknown, argumentPath?: string ): Guard {
        if (!this.succeeded) return this
        const guard = this.isString()
    
        if (!guard.succeeded) return guard
        else if (guard.argument === "")  return new Guard(guard.argument, guard.argumentPath, false, `${guard.argumentPath} is a empty string`)
        else return this.getSuccessResult(guard.argument, guard.argumentPath);
    }

    
    public mapToResult<T>( succFunc: () => T, errorFunc: (text) => IResultError) : Result<T> {
        if(this.succeeded) return Result.Ok(succFunc())

        return Result.Fail(errorFunc(this.message))
    }
}
