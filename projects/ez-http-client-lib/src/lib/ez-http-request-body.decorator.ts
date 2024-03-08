import 'reflect-metadata';
import { EzHttpParameterDescriptor } from './models/ez-http-parameter-descriptor.model';

export const EZ_REQUEST_BODY_META_KEY = `EzHttpRequestBody`;

export function EzHttpRequestBody(target: object, methodName: string | symbol, parameterIndex: number): void {
    const requestParameters: Array<EzHttpParameterDescriptor> = Reflect.getOwnMetadata(EZ_REQUEST_BODY_META_KEY, target, methodName) || [];
    if (requestParameters.length >= 1) {
        throw new Error('Only one body can be defined !');
    }

    requestParameters.push({ index: parameterIndex, paramName: 'body' });
    Reflect.defineMetadata(EZ_REQUEST_BODY_META_KEY, requestParameters, target, methodName);
}
