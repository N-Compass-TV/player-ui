import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedPipe, ImagePipe, SanitizePipe, VideoPipe } from '@pipes';
import { LPlaylistData } from '@interfaces';

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

    /**
     * Pipe for transforming feed types.
     * @type {FeedPipe}
     * @private
     */
    private feedPipe: FeedPipe;

    /**
     * Pipe for transforming image types.
     * @type {ImagePipe}
     * @private
     */
    private imagePipe: ImagePipe;

    /**
     * Constructor for the component.
     * Initializes the FeedPipe and ImagePipe using the Angular injector.
     * @param {Injector} injector - The Angular injector.
     */
    constructor(private injector: Injector) {
        this.feedPipe = this.injector.get(FeedPipe);
        this.imagePipe = this.injector.get(ImagePipe);
    }

    /**
     * Angular lifecycle hook that is called after the component's view has been initialized.
     * Starts the ticker to track the display duration.
     * @returns {void}
     */
    ngOnInit(): void {
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
        if (!this.playlistContent) return;

        const isImage = this.imagePipe.transform(this.playlistContent.file_type);
        const isFeed = this.feedPipe.transform(this.playlistContent.file_type);

        if (isImage || isFeed) {
            if (!this.activateTicker) return;

            setTimeout(() => {
                this.displayEnded.emit(this.playlistContent);
            }, this.playlistContent.duration * 1000);
        }
    }

    /**
     * Handles the event when a video ends.
     * Emits the displayEnded event with the current playlist content.
     * @returns {void}
     */
    public videoEnded(): void {
        this.displayEnded.emit(this.playlistContent);
    }
}
