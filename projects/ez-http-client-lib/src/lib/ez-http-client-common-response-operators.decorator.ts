import { EzHttpReponseOperatorsOptions } from "./models/ez-http-client-response-oeprators-options.model";

/**
 * Ez http client common response operators
 *
 * @param options Common response operators options
 * @returns decorator factory
 */
export function EzHttpClientCommonResponseOperators(options: EzHttpReponseOperatorsOptions): any {
    return function (targetClass: any) {
        if (!options) {
            options = {operators: []};
        }

        if (!options.operators) {
            options.operators = [];
        }

        const apiHeadersDescriptor: PropertyDescriptor = {
            enumerable: true,
            configurable: true,
            writable: false,
            value: options
        };

        const parentClass: any = Object.getPrototypeOf(targetClass.prototype).constructor;
        Object.defineProperty((parentClass.name.toLowerCase() === 'object') ? targetClass : parentClass, 'EZ_HTTP_CLIENT_COMMON_RESPONSE_OPERATORS', apiHeadersDescriptor);
        return targetClass;
    };
}
