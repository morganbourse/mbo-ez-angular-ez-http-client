import 'reflect-metadata';
import { EzHttpParameterDescriptor } from './models/ez-http-parameter-descriptor.model';

export const EZ_RESPONSE_META_KEY = `EzHttpResponse`;

export function EzHttpResponse(target: object, methodName: string | symbol, parameterIndex: number): void {
    const requestParameters: Array<EzHttpParameterDescriptor> = Reflect.getOwnMetadata(EZ_RESPONSE_META_KEY, target, methodName) || [];
    if (requestParameters.length >= 1) {
        throw new Error('Only response mapping parameter can be defined !');
    }

    requestParameters.push({ index: parameterIndex, paramName: 'response' });
    Reflect.defineMetadata(EZ_RESPONSE_META_KEY, requestParameters, target, methodName);
}
