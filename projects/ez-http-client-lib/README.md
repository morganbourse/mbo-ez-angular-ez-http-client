<div align="center">

<h1>ez-http-client</h1>

<br>
<img  src="https://img.shields.io/badge/angular-%3E%3D%2014.0.0-brightgreen" alt="angular 14">
<img  src="https://img.shields.io/badge/angular-17.x-brightgreen" alt="angular 17">
<br>

</div>

## Sommaire <!-- omit in toc -->

- [Features](#features)
- [Install](#install)
- [Peer dependencies](#peer-dependencies)
- [Setup](#setup)
- [Usage](#usage)
  - [Service declaration](#service-declaration)
  - [Declare default http headers for any request](#declare-default-http-headers-for-any-request)
  - [Declare global response operators](#declare-global-response-operators)
  - [Endpoint call declaration](#endpoint-call-declaration)
  - [Declare a request parameter](#declare-a-request-parameter)
  - [Declare a query parameter](#declare-a-query-parameter)
  - [Declare a request body](#declare-a-request-body)
  - [Declare a multi part form data request](#declare-a-multi-part-form-data-request)
  - [Map the result observable into method parameter](#map-the-result-observable-into-method-parameter)
- [Demo](#demo)

## Features

- Allow to define http calls only with decorators (inspired by [OpenFeign](https://github.com/OpenFeign/feign))

## Install

Install the dependency

```bash
npm install @mbo-ez-angular/ez-http-client
```

## Peer dependencies

* @angular/common: >=14.0.0
* @angular/core: >=14.0.0
* rxjs: >=6.0.0

## Setup

1. Include `HttpClientModule` into your app module or another module where you declare your services.
2. Update your `tsconfig.json` file to add or update these properties :
   ```json
   "compilerOptions": {
      [...],
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true,
      [...]
   }
   ```


## Usage

### Service declaration

To declare the EzHttpClient service, you only have to decorate your service with `@EzHttpClient`.

This decorator take two optional parameters (the ones marked with `?` are optional) :

* `apiPath?: string` - Represents the base api path (e.g '/api/clients').
* `module?: Type<any>` - Represents the module where to include this service (like Injectable decorator). By default 'root'.

This decorator is mandatory and mark the service as an ezHttpClient service.

Example :
```ts
@EzHttpClient('/api/clients', CoreModule)
export class ClientsService {
   [...]
}
```

### Declare default http headers for any request

You can declare default http headers which applied on each declared ezHttpRequest with the class decorator `@EzHttpClientHeaders`.

Example :
```ts
@EzHttpClientHeaders({
  'content-type': 'application/json',
  'X-CUSTOM-HEADER': 'CUSTOM_HEADER_VALUE'
})
@EzHttpClient('/api/clients', CoreModule)
export class ClientsService {
    [...]
}
```

*Note: The order of the decorators is not important*

### Declare global response operators

You can declare global commons response operators executed on the observable when response is received with the class decorator `EzHttpClientCommonResponseOperators`.

This decorator takes options :
* `operators: Array<OperatorFunction<any, any>>` - The response operators executed into the same order as declared array
* `before?: boolean` - indicates to place these operators at first executed operators or after declared request operators

Example:

```ts
@EzHttpClientHeaders({
  'content-type': 'application/json',
  'X-CUSTOM-HEADER': 'CUSTOM_HEADER_VALUE'
})
@EzHttpClientCommonResponseOperators({
    operators: [
        tap(() => console.log('Http request executed !!'))
    ],
    before: true
})
@EzHttpClient('/api/clients', CoreModule)
export class ClientsService {
    @EzHttpRequestGET({
        responseType: 'json',
        responseOperators: {
            operators: [
                tap(val => {
                    console.log(val)
                }),
                map(value => value.map((val: any) => `Hello ${val.lastname} ${val.firstname} !`).join(', '))
            ]
        }
    })
    public getClients(@EzHttpResponse response?: Observable<string>): Promise<string> {
        return response!.toPromise();
    }
}
```
In this example, when the method `getClients()` is called, on response, operators have been executed in this order :
1) Print "Http request executed !!" into the console
2) Print the raw value into the console
3) Map returned value to string as "Hello John DOE !, Hello John SNOW !" for example.

If `before` parameter into options is equal to `false` or `undefined` then the action number 1 becomes the last .

*Note: The order of the decorators is not important*

### Endpoint call declaration

To make http call you must declare a method decorated with `@EzHttpRequest`.
Alias are define for each http methods :

* `@EzHttpRequestDELETE`
* `@EzHttpRequestGET`
* `@EzHttpRequestHEAD`
* `@EzHttpRequestOPTIONS`
* `@EzHttpRequestPATCH`
* `@EzHttpRequestPOST`
* `@EzHttpRequestPUT`

These decorators can take some parameters :
* `httpMethod: EzHttpMethod` - Indicate the http method to use (only for vanilla `@EzHttpRequest` decorator)
* `options: EzHttpRequestOptions`
  * `path?: string` - The request path
  * `consume?: string` - The request content-type
  * `headers?: {[header: string]: string | string[]}` - List of request headers
  * `responseType?: 'blob' | 'text' | 'json' | 'arraybuffer'` - The response type
  * `responseOperators?: EzHttpReponseOperatorsOptions` - The response operators executed into the same order as declared array
    * `operators: Array<OperatorFunction<any, any>>` - The response operators executed into the same order as declared array
    * `skipGlobalCommonsOperators?: boolean` - Indicates if declared global commons operators are ignored or merged with these operators

Example :
```ts
@EzHttpClient('/api/clients', CoreModule)
export class ClientsService {
    @EzHttpRequestGET({
        responseType: 'json',
        responseOperators: [
            operators: [
                tap(val => {
                    console.log(val)
                }),
                map(value => value.map((val: any) => `Hello ${val.lastname} ${val.firstname} !`).join(', '))
            ]
        ]
    })
    public getClients(): Promise<any> {
        return Promise.resolve(null);
    }
}
```

### Declare a request parameter

Http request parameters are parameters declared into the api path like `/clients/{uid}` for example.
`{uid}` is the request parameter.

To declare the request parameter, use the `@EzHttpRequestParam`.
This decorator takes the name of the parameter in argument (here `uid`).

Example :
```ts
@EzHttpClient('/api/clients', CoreModule)
export class ClientsService {
    @EzHttpRequestGET({
        path: '/{clientId}'
    })
    public getClientById(@EzHttpRequestParam('clientId') id: string): Promise<any> {
        return Promise.resolve(null);
    }
}
```

### Declare a query parameter

Query parameters are url parameters declared like `?param1=value1&param2=value2`

To declare query parameter use the decorator `@EzHttpQueryParam`.
This decorator takes the name of the parameter in argument (here `param1` for example).

Example :
```ts
@EzHttpRequestGET()
public getSortedClients(@EzHttpQueryParam('sort_dir') direction: 'asc' | 'desc'): Observable<any> {
    return of(null);
}
```

### Declare a request body

To make PATCH, POST, PUT http calls you can pass http request body with `@EzHttpRequestBody` decorator.

Example :
```ts
@EzHttpRequestPOST()
public addClient(@EzHttpRequestBody client: {firstname: string, lastname: string}): Observable<any> {
    return of(null);
}
```

### Declare a multi part form data request

To make POST multipart request data http calls you can pass any part file with `@EzHttpPartFile` and/or any part data with `@EzHttpPartData` decorator.

Example :
```ts
@EzHttpRequestPOST()
public addClient(@EzHttpPartFile('myFile') file: File, @EzHttpPartData('descriptorData') descriptorData: { creationDate: Date, summary: string }, @EzHttpPartData('name') name: string): Observable<any> {
    return of(null);
}
```

Here, FormData is built with one field `myFile` which represents your file, one field `descriptorData` which represents some data, and one field `name` which is arbitrary name.

`descriptorData` field is transformed to a JSON blob because he's complex type.
For example this way to do allows you to get file `myFile` and field `descriptorData` with object mapping like this in spring MVC :

```java
@RequestMapping(path = "/import", method = POST, consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
void import(@RequestPart(name = "myFile", required = false) final MultipartFile file, @RequestPart("descriptorData") final DescriptorDataDto descriptorDataDto) {
    [...]
}
```

### Map the result observable into method parameter

If you want to do something with the http call result, you can map the result observable into method parameter with `@EzHttpResponse` decorator.

Example (transform observable to promise or make some pipes if you dont want to use ezHttpRequest declarative responseOperators for example...) :
```ts
@EzHttpRequestGET()
public getClients(@EzHttpResponse response?: Observable<any>): Promise<any> {
    return response!.pipe(
      tap(val => {
        console.log('Http response received !');
      })
    ).toPromise();
}
```

## Demo

To see the library demo :

Download this project and play the following commands :

```bash
npm install
```
```bash
npm run start
```
