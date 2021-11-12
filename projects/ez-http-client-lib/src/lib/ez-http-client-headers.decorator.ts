export function EzHttpClientHeaders(headers: {
    [header: string]: string | string[];
}): any {
    return function (targetClass: any) {
        if (!headers) {
            headers = {};
        }

        const apiHeadersDescriptor: PropertyDescriptor = {
            enumerable: true,
            configurable: true,
            writable: false,
            value: headers
        };

        const parentClass: any = Object.getPrototypeOf(targetClass.prototype).constructor;
        Object.defineProperty((parentClass.name.toLowerCase() === 'object') ? targetClass : parentClass, 'EZ_HTTP_CLIENT_GLOBAL_HEADERS', apiHeadersDescriptor);
        return targetClass;
    };
}
