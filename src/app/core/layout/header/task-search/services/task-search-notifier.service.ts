import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { Search } from "../models/search.model";

@Injectable({
    providedIn: 'root'
})
export class TaskSearchNotifyService {
    private onSearch: Subject<any>;

    public constructor() {
        this.onSearch = new Subject();
    }

    notify(search: Search): void {
        this.onSearch.next(search);
    }

    subscribe(clbk: (search: Search) => void): Subscription {
        return this.onSearch.subscribe(clbk);
    }
}