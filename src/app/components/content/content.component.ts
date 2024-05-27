import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { FeedPipe, ImagePipe, SanitizePipe, VideoPipe } from '@pipes';
import { API_ENDPOINTS } from '@environments';
import { LPlaylistData } from '@interfaces';
import { HelperService, RequestService } from '@services';

@Component({
    selector: 'app-content',
    standalone: true,
    imports: [CommonModule, FeedPipe, ImagePipe, SanitizePipe, VideoPipe],
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
    providers: [FeedPipe, ImagePipe, SanitizePipe, VideoPipe],
})
export class ContentComponent implements OnInit {
    /**
     * The playlist content to be displayed.
     * @type {LPlaylistData}
     */
    @Input() playlistContent!: LPlaylistData;

    /**
     * Sets the display ticker to on or off
     * @type {boolean}
     * @default true
     */
    @Input() activateTicker: boolean = true;

    /**
     * Event emitter that emits when the display ends.
     * @type {EventEmitter<LPlaylistData>}
     */
    @Output() displayEnded: EventEmitter<LPlaylistData> = new EventEmitter();

    /**
     * Event emitter that emits a boolean value when there is an error rendering the content.
     * @type {EventEmitter<boolean>}
     */
    @Output() contentRenderErrored: EventEmitter<LPlaylistData> = new EventEmitter();

    private isFeed: boolean = false;
    private isLiveStream: boolean = false;

    /**
     * Constructor for the component.
     * Initializes the FeedPipe and ImagePipe using the Angular injector.
     * @param {Injector} injector - The Angular injector.
     */
    constructor(
        private _helper: HelperService,
        private _request: RequestService,
        private injector: Injector,
    ) {
        const feedPipe = this.injector.get(FeedPipe);
        const { file_type, classification } = this.playlistContent;
        this.isFeed = feedPipe.transform(file_type);
        this.isLiveStream = this.isFeed && classification === 'live_stream';
    }

    /**
     * Angular lifecycle hook that is called after the component's view has been initialized.
     * Starts the ticker to track the display duration.
     * @returns {void}
     */
    ngOnInit(): void {
        // Set livestream content duration to 1ms so it goes through the ticker process
        if (this.isLiveStream) this.playlistContent.duration = 1;
        this.startTicker();
    }

    /**
     * Emits an event indicating that there was an error rendering the content.
     * @returns {void}
     */
    public contentErrored() {
        this.contentRenderErrored.emit(this.playlistContent);
    }

    /**
     * Starts the ticker to track the display duration of the current playlist content.
     * If the content is an image or feed, sets a timeout to emit the displayEnded event after the duration.
     * @private
     * @returns {void}
     */
    private startTicker(): void {
        // Return if playlist content is null or if ticker is not activated (no contents)
        if (!this.playlistContent || !this.activateTicker) return;

        setTimeout(() => {
            // Restart startTicker() if content is a livestream and is within scheduled time
            if (this.isLiveStream && this.isWithinSchedule) {
                this.startTicker();
                return;
            }

            this.contentEnded();
        }, this.playlistContent.duration * 1000);
    }

    /**
     * Handles the event when a video ends.
     * Emits the displayEnded event with the current playlist content.
     * @returns {void}
     */
    public contentEnded(): void {
        this.hitPlayCount(this.playlistContent.playlist_content_id);
        this.displayEnded.emit(this.playlistContent);
    }

    /**
     * Increases the play count for a playlist content.
     * @param {string} playlistContentId - The ID of the playlist content.
     * @returns {void}
     * @private
     */
    private hitPlayCount(playlistContentId: string): void {
        const url = `${API_ENDPOINTS.local.get.log}/${playlistContentId}`;
        this._request.getRequest(url).pipe(take(1)).subscribe();
    }

    /**
     * Check if content is supposed to play now
     *
     * @returns {boolean} Returns true if the content should play now, else false.
     * @private
     */
    private get isWithinSchedule(): boolean {
        return this._helper.canPlayContent(this.playlistContent);
    }
}
