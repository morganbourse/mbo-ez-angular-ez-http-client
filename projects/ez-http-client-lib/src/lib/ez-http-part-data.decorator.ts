import 'reflect-metadata';
import { EzHttpParameterDescriptor } from './models/ez-http-parameter-descriptor.model';

export const EZ_REQUEST_PART_DATA_META_KEY = `EzHttpPartData`;

export function EzHttpPartData(paramName: string): any {
    return function (target: object, methodName: string | symbol, parameterIndex: number) {
        const requestParameters: Array<EzHttpParameterDescriptor> =
            Reflect.getOwnMetadata(EZ_REQUEST_PART_DATA_META_KEY, target, methodName) || [];
        requestParameters.push({ index: parameterIndex, paramName });
        Reflect.defineMetadata(EZ_REQUEST_PART_DATA_META_KEY, requestParameters, target, methodName);
    };
}
