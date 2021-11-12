/* eslint-disable */
import { EzHttpClient, EzHttpClientHeaders, EzHttpQueryParam, EzHttpRequestBody, EzHttpRequestGET, EzHttpRequestParam, EzHttpRequestPOST, EzHttpResponse, EzHttpClientCommonResponseOperators } from "ez-http-client-lib";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { CoreModule } from "../core.module";
import { Client } from "../models/client.model";

@EzHttpClient('/api/clients', CoreModule)
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
export class ClientsService {
    @EzHttpRequestGET({
        responseType: 'json',
        responseOperators: {
            operators: [
                tap(val => {
                    console.log(val);
                }),
                map(value => value.map((val: any) => `Hello ${val.lastname} ${val.firstname} !`).join(', '))
            ]
        }
    })
    public getClients(@EzHttpResponse response?: Observable<string>): Promise<string> {
        return response!.toPromise();
    }

    @EzHttpRequestGET({
        responseType: 'json',
        responseOperators: {
            operators: [
                map(value => JSON.stringify(value))
            ]
        }
    })
    public getSortedClients(@EzHttpQueryParam('sort_dir') direction: 'asc' | 'desc', @EzHttpResponse response?: Observable<Array<Client>>): Promise<Array<Client>> {
        return response!.toPromise();
    }

    @EzHttpRequestGET({
        path: '/{clientId}'
    })
    public getClientById(@EzHttpRequestParam('clientId') id: string): Observable<Client | null> {
        return of(null);
    }

    @EzHttpRequestPOST()
    public addClient(@EzHttpRequestBody client: { firstname: string, lastname: string }): Observable<Client | null> {
        return of(null);
    }
}
