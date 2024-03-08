import 'reflect-metadata';
import { EzHttpParameterDescriptor } from './models/ez-http-parameter-descriptor.model';

export const EZ_REQUEST_QUERY_PARAMS_META_KEY = `EzHttpQueryParam`;

export function EzHttpQueryParam(paramName: string): any {
    return function (target: Object, methodName: string | symbol, parameterIndex: number) {
        const requestParameters: Array<EzHttpParameterDescriptor> =
            Reflect.getOwnMetadata(EZ_REQUEST_QUERY_PARAMS_META_KEY, target, methodName) || [];
        requestParameters.push({ index: parameterIndex, paramName });
        Reflect.defineMetadata(EZ_REQUEST_QUERY_PARAMS_META_KEY, requestParameters, target, methodName);
    };
}
