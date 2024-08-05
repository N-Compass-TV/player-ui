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
     * Subject to track socket emissions
     * @type {Subject<any>}
     * @private
     */
    private emit = new Subject<any>();

    /**
     * Subject to track player schedule related events
     * @type {Subject<any>}
     * @private
     */
    private schedule = new Subject<any>();

    /**
     * Currently playing content
     * @type {Subject<any>}
     * @private
     */
    private currentPlayingContent = new Subject<any>();

    /**
     * Observable to subscribe to downloaded assets notifications.
     * @type {Observable<any>}
     */
    public downloaded$ = this.downloaded.asObservable();

    /**
     * Observable to subscribe to socket emissions
     * @type {Observable<any>}
     */
    public emit$ = this.downloaded.asObservable();

    /**
     * Observable to subscribe to player schedule events
     * @type {Observable<any>}
     */
    public schedule$ = this.schedule.asObservable();

    /**
     * Observable to subscribe to playlist content events
     * @type {Observable<string>}
     */
    public currentPlayingContent$ = this.currentPlayingContent.asObservable();

    /**
     * Notifies that an asset has been downloaded by emitting the provided data through the downloaded subject.
     * @param {any} downloadData - The data of the downloaded asset.
     * @returns {void}
     */
    public assetDownloaded(downloadData: any): void {
        this.downloaded.next(downloadData);
    }

    /**
     * Notifies that a socket event needs to be emitted
     * @param {string} event - The socket event
     * @param {any} data - The socket event
     * @returns {void}
     */
    public emitEvent(event: string, data: any): void {
        this.emit.next({ event, data });
    }

    /**
     * Schedule checker, indicates close or open business hours
     * @param {scheduleData} event - The socket event
     * @returns {void}
     */
    public onScheduleCheck(scheduleData: any): void {
        this.schedule.next(scheduleData);
    }

    /**
     * Currently playing ad watcher
     * @param {playlistContentId} string
     * @returns {void}
     */
    public onPlayingContent(data: { playlistContentId: string; programmatic: boolean }): void {
        this.currentPlayingContent.next(data);
    }
}
