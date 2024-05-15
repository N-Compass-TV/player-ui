import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    /**
     * Subject to track downloaded assets.
     * @type {Subject<any>}
     * @private
     */
    private downloaded = new Subject<any>();

    /**
     * Observable to subscribe to downloaded assets notifications.
     * @type {Observable<any>}
     */
    downloaded$ = this.downloaded.asObservable();

    constructor() {}

    /**
     * Notifies that an asset has been downloaded by emitting the provided data through the downloaded subject.
     * @param {any} downloadData - The data of the downloaded asset.
     * @returns {void}
     */
    public assetDownloaded(downloadData: any): void {
        this.downloaded.next(downloadData);
    }
}
