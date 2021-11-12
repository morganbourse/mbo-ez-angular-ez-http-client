import { OperatorFunction } from "rxjs";

export interface EzHttpReponseOperatorsOptions {
    /**
     * Operators to execute on observable
     */
    operators: Array<OperatorFunction<any, any>>;

    /**
     * Place these operators at first executed operators or after request operators
     */
    before?: boolean;
}