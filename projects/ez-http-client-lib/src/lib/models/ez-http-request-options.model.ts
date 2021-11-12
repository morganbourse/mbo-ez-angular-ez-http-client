import { OperatorFunction } from "rxjs";

export interface EzHttpRequestOptions {
    /**
     * The request path
     */
    path?: string;

    /**
     * The request content-type
     */
    consume?: string;

    /**
     * List of request headers
     */
    headers?: {
        [header: string]: string | string[];
    };

    /**
     * The response type
     */
    responseType?: 'blob' | 'text' | 'json' | 'arraybuffer';

    /**
     * The response operators executed into the same order as declared array
     */
    responseOperators?: {
        /**
         * Operators to execute
         */
        operators: Array<OperatorFunction<any, any>>;

        /**
         * Skip global defined commons operators (by default include global commons operators)
         */
        skipGlobalCommonsOperators?: boolean;
    };
}
