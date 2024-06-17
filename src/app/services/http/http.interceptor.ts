import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SERVER_ERROR_CODE } from '@constants';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    private _router = inject(Router);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse | any) => {
                // Check for custom error object with triggerEmail flag
                if (error.triggerEmail) {
                    this.sendErrorNotification(error.message);
                    return throwError(() => new Error(error.message));
                }

                // Handle specific error codes
                if (error.error && error.error.code) {
                    switch (error.error.code) {
                        case SERVER_ERROR_CODE.no_license:
                            this._router.navigate(['license-setup']);
                            return throwError(() => new Error('No license found.'));
                        case SERVER_ERROR_CODE.player_data_failed_save:
                            this._router.navigate(['screensaver']);
                            return throwError(() => new Error('Failed to save player data.'));
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
}
