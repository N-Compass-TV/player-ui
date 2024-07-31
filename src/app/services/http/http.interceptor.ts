import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SERVER_ERROR_CODE } from '@constants';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    private _router = inject(Router);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse | any) => {
                // Check if the request has the custom header
                if (req.headers.has('Exclude-Interceptor')) {
                    const clonedRequest = req.clone({
                        headers: req.headers.delete('Exclude-Interceptor'),
                    });

                    return next.handle(clonedRequest);
                }

                // Check for custom error object with triggerEmail flag
                if (error.triggerEmail) {
                    this.sendErrorNotification(error.message);
                    return throwError(() => new Error(error.message));
                }

                // Handle specific error codes
                if (this.extractError(error)) {
                    const err = this.extractError(error);

                    switch (err.code) {
                        case SERVER_ERROR_CODE.no_license:
                            this._router.navigate(['license-setup']);
                            return throwError(() => new Error('No license found.'));
                        case SERVER_ERROR_CODE.player_data_failed_save:
                            this._router.navigate(['screensaver']);
                            return throwError(() => new Error('Failed to save player data.'));
                        case SERVER_ERROR_CODE.player_apps_fail:
                            return throwError(() => new Error('Failed to get player apps'));
                    }
                }

                // Handle all other errors
                this._router.navigate(['play']);
                return throwError(() => new Error('An error occurred'));
            }),
        );
    }

    private sendErrorNotification(message: string): void {
        /** Handle Email Sending Here
         * @todo - API endpoint for email sending
         * @description - this triggers a direct call to the .Net servers in case the player server itself failed
         * recipient should only be the TechSupport emai
         */
        console.log('Email Sent');
    }

    /**
     * Error object extractor
     * @param error
     */
    private extractError(error: any): any {
        return error.error?.error ?? error.error ?? error;
    }
}
