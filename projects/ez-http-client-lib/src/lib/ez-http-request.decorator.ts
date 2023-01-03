import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, OperatorFunction } from 'rxjs';
import { EZ_REQUEST_QUERY_PARAMS_META_KEY } from './ez-http-query-param.decorator';
import { EZ_REQUEST_BODY_META_KEY } from './ez-http-request-body.decorator';
import { EZ_REQUEST_PARAMS_META_KEY } from './ez-http-request-param.decorator';
import { EZ_RESPONSE_META_KEY } from './ez-http-response.decorator';
import { EzHttpRequestMethod } from './models/ez-http-request-method.enum';
import { EzHttpRequestOptions } from './models/ez-http-request-options.model';
import { EzHttpParameterDescriptor } from './models/ez-http-parameter-descriptor.model';
import { EzHttpReponseOperatorsOptions } from './models/ez-http-client-response-oeprators-options.model';
import { EZ_REQUEST_PART_DATA_META_KEY } from './ez-http-part-data.decorator';
import { EZ_REQUEST_PART_FILE_META_KEY } from './ez-http-part-file.decorator';

/**
 * Http call options
 */
type HttpOptions = {
    headers?: {
        [header: string]: string | string[];
    };
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    responseType?: any;
};

// -------------------- DECORATORS --------------------
export function EzHttpRequest(httpMethod: EzHttpRequestMethod, options?: EzHttpRequestOptions): any {
    return function (
        target: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        return apply(target, key, descriptor, httpMethod, options);
    };
}

export function EzHttpRequestDELETE(options?: EzHttpRequestOptions): any {
    return function (
        target: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        return apply(target, key, descriptor, EzHttpRequestMethod.DELETE, options);
    };
}

export function EzHttpRequestGET(options?: EzHttpRequestOptions): any {
    return function (
        target: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        return apply(target, key, descriptor, EzHttpRequestMethod.GET, options);
    };
}

export function EzHttpRequestHEAD(options?: EzHttpRequestOptions): any {
    return function (
        target: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        return apply(target, key, descriptor, EzHttpRequestMethod.HEAD, options);
    };
}

export function EzHttpRequestOPTIONS(options?: EzHttpRequestOptions): any {
    return function (
        target: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        return apply(target, key, descriptor, EzHttpRequestMethod.OPTIONS, options);
    };
}

export function EzHttpRequestPATCH(options?: EzHttpRequestOptions): any {
    return function (
        target: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        return apply(target, key, descriptor, EzHttpRequestMethod.PATCH, options);
    };
}

export function EzHttpRequestPOST(options?: EzHttpRequestOptions): any {
    return function (
        target: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        return apply(target, key, descriptor, EzHttpRequestMethod.POST, options);
    };
}

export function EzHttpRequestPUT(options?: EzHttpRequestOptions): any {
    return function (
        target: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        return apply(target, key, descriptor, EzHttpRequestMethod.PUT, options);
    };
}

// -------------------- PRIVATE FUNCTIONS --------------------
/**
 * Resolve url to call
 *
 * @param targetObject The target object (the current object class)
 * @param hasParameters Indicate if the url has paameters
 * @param ezRequestParams The list of ezRequestParams
 * @param options The EzHttpRequest options
 * @param args The method arguments
 * @returns The resolved url
 */
function resolveUrl(
    targetObject: any, hasParameters: boolean, ezRequestParams: Array<EzHttpParameterDescriptor>, options: EzHttpRequestOptions, args: Array<any>
): string {
    let uri = options.path;

    // resolve uri parameters
    if (hasParameters && ezRequestParams.length > 0 && uri && uri.length > 0) {
        // replace all parameters
        ezRequestParams.forEach(paramDescriptor => {
            uri = uri?.replace(`{${paramDescriptor.paramName}}`, args[paramDescriptor.index]);
        });
    }

    // build url
    let basePath: string = targetObject.constructor.API_BASE_PATH || '';
    if (basePath.length > 0 && basePath.endsWith('/')) {
        basePath = basePath.substring(0, basePath.length - 1);
    }

    return `${basePath}${uri}`;
}

/**
 * Build the http options used pending http call
 *
 * @param options The EzHttpRequest options
 * @param ezQueryParams The list of query params (like ?name=Toto&surname=Titi)
 * @returns The built HttpOptions
 */
function buildHttpOptions(options: EzHttpRequestOptions, ezQueryParams: Array<EzHttpParameterDescriptor>, args: Array<any>, targetObject: any): HttpOptions {
    const httpOptions: HttpOptions = {};
    const globalHeaders = targetObject.constructor.EZ_HTTP_CLIENT_GLOBAL_HEADERS;
    if (globalHeaders) {
        options.headers = Object.assign(globalHeaders, (options.headers || {}));
    }

    if (options.headers || options.consume) {
        httpOptions.headers = options.headers || {};
        if (options.consume && options.consume.length > 0) {
            stripContentType(httpOptions);
            httpOptions.headers['Content-Type'] = options.consume;
        }
    }

    if (options.responseType) {
        httpOptions.responseType = options.responseType;
    }

    // compute http query params
    if (ezQueryParams && ezQueryParams.length > 0) {
        httpOptions.params = {};
        ezQueryParams.forEach(paramDescriptor => {
            const paramValue: any = args[paramDescriptor.index];
            if (paramValue) {
                // @ts-ignore: Object is possibly 'null'.
                httpOptions.params[paramDescriptor.paramName] = paramValue;
            }
        });
    }

    return httpOptions;
}

/**
 * Remove content-type header
 *
 * @param httpOptions The http options
 */
function stripContentType(httpOptions: HttpOptions): void {
    if (!httpOptions) {
        return;
    }

    for (const key in httpOptions.headers) {
        if (key.toLowerCase() === 'content-type') {
            delete httpOptions.headers[key];
        }
    }
}

/**
 * Do the http call
 *
 * @param httpClient The http client instance to use
 * @param url The url to call
 * @param httpMethod The http method to use
 * @param httpOptions The http call options
 * @param body The request body
 * @param pipes The rxjs pipe (with rxjs operators)
 */
function doCall(httpClient: HttpClient, url: string, httpMethod: EzHttpRequestMethod, httpOptions: HttpOptions, body: any, responseOperators?: Array<OperatorFunction<any, any>>): Observable<any> {
    let responseObservable: Observable<any>;
    switch (httpMethod) {
        case EzHttpRequestMethod.DELETE:
            responseObservable = httpClient.delete<any>(url, httpOptions);
            break;

        case EzHttpRequestMethod.GET:
            responseObservable = httpClient.get<any>(url, httpOptions);
            break;

        case EzHttpRequestMethod.HEAD:
            responseObservable = httpClient.head<any>(url, httpOptions);
            break;

        case EzHttpRequestMethod.OPTIONS:
            responseObservable = httpClient.options<any>(url, httpOptions);
            break;

        case EzHttpRequestMethod.PATCH:
            responseObservable = httpClient.patch<any>(url, body, httpOptions);
            break;

        case EzHttpRequestMethod.POST:
            responseObservable = httpClient.post<any>(url, body, httpOptions);
            break;

        case EzHttpRequestMethod.PUT:
            responseObservable = httpClient.put<any>(url, body, httpOptions);
            break;
    }

    if (responseOperators && responseOperators.length > 0) {
        responseOperators.forEach(op => responseObservable = responseObservable.pipe(op));
    }

    return responseObservable;
}

/**
 * Apply the task
 *
 * @param target The target object (the current object class)
 * @param key The current method name
 * @param descriptor The method descriptor
 * @param httpMethod The http method to do
 * @param options The ez http request options
 * @returns The method updated descriptor
 */
function apply(target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
    httpMethod: EzHttpRequestMethod,
    options?: EzHttpRequestOptions): PropertyDescriptor {
    if (!options) {
        options = {};
    }

    if (options.path && options.path.length > 0 && !options.path.startsWith('/')) {
        options.path = '/' + options.path;
    } else if (!options.path) {
        options.path = '';
    }

    let ezRequestParams: Array<EzHttpParameterDescriptor> = [];
    const hasParameters = !!options.path.match(/{\w+}/g);
    if (hasParameters) {
        ezRequestParams = Reflect.getOwnMetadata(EZ_REQUEST_PARAMS_META_KEY, target, key.toString()) || [];
    }

    const ezQueryParams: Array<EzHttpParameterDescriptor> =
        Reflect.getOwnMetadata(EZ_REQUEST_QUERY_PARAMS_META_KEY, target, key.toString()) || [];
    const ezBody: Array<EzHttpParameterDescriptor> = Reflect.getOwnMetadata(EZ_REQUEST_BODY_META_KEY, target, key.toString());
    const ezPartDatas: Array<EzHttpParameterDescriptor> = Reflect.getOwnMetadata(EZ_REQUEST_PART_DATA_META_KEY, target, key.toString()) || [];
    const ezPartFiles: Array<EzHttpParameterDescriptor> = Reflect.getOwnMetadata(EZ_REQUEST_PART_FILE_META_KEY, target, key.toString()) || [];
    const ezResponseMapper: Array<EzHttpParameterDescriptor> = Reflect.getOwnMetadata(EZ_RESPONSE_META_KEY, target, key.toString());

    const originalMethod: (...args: any[]) => Promise<any> = descriptor.value;
    descriptor.value = (...args: any[]) => {
        // try to get http client instance
        const httpClient: HttpClient = target.constructor.HTTP_CLIENT;
        if (!httpClient) {
            throw new Error('Unable to get http client instance !');
        }

        const url: string = resolveUrl(target, hasParameters, ezRequestParams, options!, args);

        const httpOptions: HttpOptions = buildHttpOptions(options!, ezQueryParams, args, target);
        const body: any = ezBody?.length ? args[ezBody[0].index] : {};
        const multiPartFormData: FormData = buildMultipartFormData(args, ezPartDatas, ezPartFiles, body);

        if (!!multiPartFormData) {
            stripContentType(httpOptions);
            console.log(httpOptions);
        }

        const commonOperatorsOptions: EzHttpReponseOperatorsOptions = target.constructor.EZ_HTTP_CLIENT_COMMON_RESPONSE_OPERATORS;
        if (!options!.responseOperators) {
            options!.responseOperators = {
                operators: []
            };
        }

        const operators: Array<OperatorFunction<any, any>> = [];
        if (commonOperatorsOptions && commonOperatorsOptions.operators && commonOperatorsOptions.operators.length && options!.responseOperators.skipGlobalCommonsOperators !== true) {
            if (commonOperatorsOptions.before) {
                operators.push(...commonOperatorsOptions.operators);
                operators.push(...options!.responseOperators.operators);
            } else {
                operators.push(...options!.responseOperators.operators);
                operators.push(...commonOperatorsOptions.operators);
            }
        } else {
            operators.push(...options!.responseOperators.operators);
        }

        const response: Observable<any> = doCall(httpClient, url, httpMethod, httpOptions, !!multiPartFormData ? multiPartFormData : body, operators);

        if (ezResponseMapper && ezResponseMapper.length > 0) {
            args[ezResponseMapper[0].index] = response;
            return originalMethod(...args);
        }
        return response;
    };
    return descriptor;
}

/**
 * Build multipart form data if necessary
 *
 * @param args Method args
 * @param ezPartDatas Part data descriptor array
 * @param ezPartFiles Part file descriptor array
 * @param body Request body
 * @returns FormData or undefined
 */
function buildMultipartFormData(args: Array<any>, ezPartDatas: Array<EzHttpParameterDescriptor>, ezPartFiles: Array<EzHttpParameterDescriptor>, body?: any): FormData {
    const buildFormData: boolean = (ezPartDatas && !!ezPartDatas.length) || (ezPartFiles && !!ezPartFiles.length);
    if (buildFormData) {
        const formData = new FormData();
        (ezPartDatas || []).forEach(data => {
            const value: any = args[data.index];

            // if type of value is not string then build blob otherwise push as is
            if (typeof value === 'string') {
                formData.append(data.paramName, value);
            } else {
                formData.append(data.paramName, new Blob([JSON.stringify(value)], {
                    type: "application/json"
                }));
            }
        });

        (ezPartFiles || []).forEach(data => {
            const value: any = args[data.index];

            // if type of value is not File or Blob then ignore
            if (value instanceof File || value instanceof Blob) {
                formData.append(data.paramName, value);
            }
        });

        if (!!body && Object.keys(body).length > 0) {
            // if type of body is not string then build blob otherwise push as is
            if (typeof body === 'string') {
                formData.append('body', body);
            } else {
                formData.append('body', new Blob([JSON.stringify(body)], {
                    type: "application/json"
                }));
            }
        }

        return formData;
    }

    return undefined!;
}
