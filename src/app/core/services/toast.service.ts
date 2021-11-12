import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { CoreModule } from "../core.module";

@Injectable({
    providedIn: CoreModule
})
export class ToastService {
    public constructor(private toastrService: ToastrService) {
    }

    /**
     * Display success notification
     *
     * @param message The message to display
     * @param title [Optional] The title to display
     */
    public success(message: string, title?: string): void {
        this.toastrService.success(message, title);
    }

    /**
     * Display error notification
     *
     * @param message The message to display
     * @param title [Optional] The title to display
     */
     public error(message: string, title?: string): void {
        this.toastrService.error(message, title);
    }
}
