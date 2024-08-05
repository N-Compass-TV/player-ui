import { ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';

/** Pipes */
import { FeedPipe } from '@pipes/feed';
import { ImagePipe } from '@pipes/image';
import { SanitizePipe } from '@pipes/sanitize';
import { VideoPipe } from '@pipes/video';

/** Interfaces */
import { LPlaylistData } from '@interfaces/local';
import { HelperService } from '@services/helper';

/** Services */
import { RequestService } from '@services/request';

/** Environments */
import { API_ENDPOINTS } from '@environments';
import { PROGRAMMATIC } from '@constants';

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
    @Input() public playlistContent!: LPlaylistData;

    /**
     * Sets the display ticker to on or off
     * @type {boolean}
     * @default true
     */
    @Input() public activateTicker = true;

    /**
     * Event emitter that emits when the display ends.
     * @type {EventEmitter<LPlaylistData>}
     */
    @Output() public displayEnded: EventEmitter<LPlaylistData> = new EventEmitter();

    /**
     * Event emitter that emits a boolean value when there is an error rendering the content.
     * @type {EventEmitter<boolean>}
     */
    @Output() public contentRenderErrored: EventEmitter<LPlaylistData> = new EventEmitter();

    /**
     * Indicates if the content is a feed.
     * @default false
     */
    private isFeed = false;

    /**
     * Indicates if the content is a live stream.
     * @default false
     */
    private isLiveStream = false;

    /**
     * Flag to track if contentEnded has been triggered.
     * @default false
     */
    private contentEndedFlag = false;

    /**
     * Variable to hold the timeout ID.
     * @type {any}
     */
    private timeoutId: any;

    constructor(
        private _request: RequestService,
        private injector: Injector,
    ) {}

    ngOnInit(): void {
        // Retrieve the FeedPipe instance from the injector
        const feedPipe = this.injector.get(FeedPipe);
        const { file_type, classification } = this.playlistContent;

        // Determine if the content is a feed and if it is a live stream
        this.isFeed = feedPipe.transform(file_type);
        this.isLiveStream = this.isFeed && classification === 'live_stream';

        // Set the duration of live stream content to 1ms for the ticker process
        if (this.isLiveStream) {
            this.playlistContent.duration = 100;
        }

        // Run display ticker
        this.startTicker();

        if (!this.isFeed) {
            this.playlistContent.url = `${API_ENDPOINTS.local.assets}/${this.playlistContent.file_name}`;
        }
    }

    /**
     * Emits an event indicating that there was an error rendering the content.
     * @returns {void}
     */
    public contentErrored(): void {
        this.contentRenderErrored.emit(this.playlistContent);
    }

    /**
     * Starts the ticker to track the display duration of the current playlist content.
     * If the content is an image or feed, sets a timeout to emit the displayEnded event after the duration.
     * @private
     * @returns {void}
     */
    private startTicker(): void {
        const videoPipe = this.injector.get(VideoPipe);

        // Return if playlist content is null or if ticker is not activated (no contents)
        if (!this.playlistContent || !this.activateTicker) return;

        // Ticker for livestream is handled in the playlist component
        if (this.isLiveStream) return;

        /**
         * This is a safety measure for videos that might get stuck.
         * The ticker runs for 1.5 times the duration of the asset, assuming it might still be loading.
         * If the ticker reaches its end, it indicates the asset is stuck and showing a black screen.
         * In this case, the page is reloaded to refresh browser resources.
         */
        if (this.playlistContent.programmatic_source && videoPipe.transform(this.playlistContent.file_type)) {
            this.timeoutId = setTimeout(
                () => {
                    // Check if contentEnded has been triggered
                    if (!this.contentEndedFlag) {
                        this.contentEnded();
                    }
                },
                this.playlistContent.duration ? this.playlistContent.duration * 1500 : 30000, // Increased by 500 millisecond to give the asset a chance to play
            );

            return;
        }

        // Ticker for non video dealer assets
        if (!videoPipe.transform(this.playlistContent.file_type)) {
            this.timeoutId = setTimeout(
                () => {
                    if (!this.contentEndedFlag) {
                        // Check if contentEnded has been triggered
                        this.contentEnded();
                    }
                },
                this.playlistContent.duration ? this.playlistContent.duration * 1000 : 20000,
            );
        }
    }

    /**
     * Handles the event when a video ends.
     * Emits the displayEnded event with the current playlist content.
     * @returns {void}
     */
    public contentEnded(): void {
        if (this.contentEndedFlag) return;
        this.contentEndedFlag = true;

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        this.hitPlayCount(this.playlistContent.playlist_content_id || this.playlistContent.proof_of_play);
        this.displayEnded.emit(this.playlistContent);
    }

    /**
     * Increases the play count for a playlist content.
     * @param {string} playlistContentId - The ID of the playlist content.
     * @returns {void}
     * @private
     */
    private hitPlayCount(id: string): void {
        if (this.playlistContent.programmatic_source === PROGRAMMATIC.pxchange) {
            const url = `${API_ENDPOINTS.local.get.programmatic_played}/${id}`;
            this._request.getRequest(url).pipe(take(1)).subscribe();
            return;
        }

        const url = `${API_ENDPOINTS.local.get.log}/${id}`;
        this._request.getRequest(url).pipe(take(1)).subscribe();
    }
}
