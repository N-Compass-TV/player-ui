import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    private downloaded = new Subject<any>();
    downloaded$ = this.downloaded.asObservable();

    constructor() {}

    assetDownloaded(downloadData: any) {
        this.downloaded.next(downloadData);
    }
}
