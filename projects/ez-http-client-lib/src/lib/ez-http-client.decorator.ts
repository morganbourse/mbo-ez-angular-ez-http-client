import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';

export function EzHttpClient(apiPath?: string, module?: Type<any>): any {
    return function(targetClass: any) {
        if (!apiPath || apiPath.length === 0) {
            apiPath = '';
        }

        const apiBasePathDescriptor: PropertyDescriptor = {
            enumerable: true,
            configurable: true,
            writable: false,
            value: apiPath
        };
        Object.defineProperty(targetClass, 'API_BASE_PATH', apiBasePathDescriptor);

        @Injectable({
            providedIn: module || 'root'
        })
        class EzHttpClientDecoratedClass extends targetClass {
            constructor(protected http: HttpClient) {
                super();

                const httpClientPropertyDescriptor: PropertyDescriptor = {
                    enumerable: true,
                    configurable: true,
                    writable: false,
                    value: http
                };
                Object.defineProperty(targetClass, 'HTTP_CLIENT', httpClientPropertyDescriptor);
            }
        }
        return EzHttpClientDecoratedClass;
    };
}
