import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, delay, switchMap, takeUntil, tap } from 'rxjs';

/** Components */
import { AnimatedLoaderComponent } from '@components/animated-loader';
import { ProgressBarComponent } from '@components/progress-bar';

/** Interfaces */
import { AssetDownloadProgress, ProgressStep } from '@interfaces/misc';
import { Content, PlayerData } from '@interfaces/cloud';

/** Constants */
import { CONTENT_DOWNLOAD_STEPS } from '@constants';

/** Services */
import { RequestService } from '@services/request';
import { SocketService } from '@services/socket';

/** Environments */
import { API_ENDPOINTS } from '@environments';

@Component({
    selector: 'app-content-setup',
    standalone: true,
    imports: [CommonModule, AnimatedLoaderComponent, ProgressBarComponent],
    templateUrl: './content-setup.component.html',
    styleUrl: './content-setup.component.scss',
})
export class ContentSetupComponent implements OnInit {
    /**
     * The progress of asset downloads.
     * @default new Subject<{ key: string; value: number }>()
     */
    public assetDownloadProgress: Subject<{ key: string; value: number }> = new Subject<{
        key: string;
        value: number;
    }>();

    /**
     * The current progress value.
     * @default 0
     */
    public currentProgress = 0;

    /**
     * The list of downloaded player assets.
     * @default []
     */
    public downloadedPlayerAssets: string[] = [];

    /**
     * Indicates if the download is completed.
     * @default false
     */
    public downloadCompleted = false;

    /**
     * The license ID.
     * @default ''
     */
    public licenseId = '';

    /**
     * The license key.
     * @default ''
     */
    public licenseKey = '';

    /**
     * The player assets to be downloaded.
     * @default []
     */
    public playerAssets: Content[] = [];

    /**
     * The width of the progress indicator.
     * @default 50
     */
    public progressWidth = 50;

    /**
     * The total width of the progress indicator.
     * @default 50
     */
    public progressWidthTotal = 50;

    /**
     * Indicates if the system is ready to download.
     * @default false
     */
    public readyToDownload = false;

    /**
     * Indicates if a refetch is needed.
     * @default false
     */
    public refetch = false;

    /**
     * The number of steps in the process.
     * @default 4
     */
    public stepCount = 4;

    /**
     * The subtitle displayed during the process.
     * @default 'Please Wait . . .'
     */
    public subtitle = 'Please Wait . . .';

    /**
     * The title displayed during the process.
     * @default 'Downloading Player Data'
     */
    public title = 'Downloading Player Data';

    /**
     * The steps for content download.
     * @default CONTENT_DOWNLOAD_STEPS
     * @private
     */
    private steps = CONTENT_DOWNLOAD_STEPS;

    /**
     * Subject to manage unsubscription.
     * @default new Subject<void>()
     * @protected
     */
    protected _unsubscribe = new Subject<void>();

    constructor(
        private _request: RequestService,
        private _activatedRoute: ActivatedRoute,
        private _socket: SocketService,
        private _router: Router,
    ) {}

    ngOnInit(): void {
        this._activatedRoute.queryParamMap.pipe(takeUntil(this._unsubscribe)).subscribe((data: any) => {
            this.licenseKey = data.params.licenseKey;
            this.licenseId = data.params.licenseId;
            this.refetch = data.params.refetch;
        });

        this.getPlayerData();
    }

    /**
     * Watches for asset download progress and updates the progress state accordingly.
     * Moves completed downloads to the beginning of the assets list and adds them to the downloaded list.
     * @private
     * @returns {void}
     */
    private assetDownloadWatch(): void {
        this._socket.downloaded$.subscribe({
            next: (data: AssetDownloadProgress) => {
                /** Update progress immediately */
                this.assetDownloadProgress.next({
                    key: data.content_id,
                    value: Number(data.progress),
                });

                if (Number(data.progress) === 100) {
                    /** Find the index of the content object */
                    const index = this.playerAssets.findIndex((asset) => asset.contentId === data.content_id);

                    /** If found, remove the object and unshift it to the beginning of the array */
                    if (index !== -1) {
                        const [contentObject] = this.playerAssets.splice(index, 1);
                        this.playerAssets.unshift(contentObject);
                    }

                    /** Delay the push to downloadedPlayerAssets to ensure it happens after reordering */
                    setTimeout(() => {
                        this.downloadedPlayerAssets.push(data.content_id);
                    }, 1000);
                }
            },
            error: (err) => {
                console.error('Error in asset download watch:', err);
            },
        });
    }

    /**
     * Retrieves player data, clears the database, saves player data locally,
     * and starts the asset download watcher. Updates the title and subtitle
     * throughout the process and navigates to the play route upon completion.
     * @private
     * @returns {void}
     */
    private getPlayerData(): void {
        this._request
            .getRequest(API_ENDPOINTS.local.get.ping)
            .pipe(
                /** Clear Database */
                tap(() => {
                    const titleSubtitle = this.getSubtitleMessage(1);
                    this.title = titleSubtitle.title;
                    this.subtitle = titleSubtitle.subtitle;
                }),
                switchMap(() => this._request.getRequest(API_ENDPOINTS.local.get.cleardb)),

                /** Get Player and Saving to Local */
                tap(() => {
                    const titleSubtitle = this.getSubtitleMessage(2);
                    this.title = titleSubtitle.title;
                    this.subtitle = titleSubtitle.subtitle;
                }),
                switchMap(() => this._request.getRequest(`${API_ENDPOINTS.local.get.player_data}${this.licenseKey}`)),
                switchMap((playerData: PlayerData) => {
                    /** Setting up a global variable for player assets */
                    this.playerAssets = playerData.piContents?.contents || [];

                    /** Save player data to local storage for quick access */
                    localStorage.setItem('playerData', JSON.stringify(playerData));

                    /** Run the asset download watcher to track asset download progress */
                    this.assetDownloadWatch();

                    /** End */
                    return this._request.postRequest(`${API_ENDPOINTS.local.post.save_player_data}`, playerData);
                }),

                /** Downloading Media Files */
                delay(2000),
                tap(() => {
                    const titleSubtitle = this.getSubtitleMessage(3);
                    this.title = titleSubtitle.title;
                    this.subtitle = titleSubtitle.subtitle;
                    this.readyToDownload = true;
                }),
                switchMap(() => this._request.getRequest(API_ENDPOINTS.local.get.download_assets)),
            )
            .subscribe({
                next: () => {
                    const titleSubtitle = this.getSubtitleMessage(4);
                    this.title = titleSubtitle.title;
                    this.subtitle = titleSubtitle.subtitle;
                    this.downloadCompleted = true;

                    setTimeout(() => {
                        this._router.navigate(['play']);
                    }, 4000);
                },
                error: (error) => {
                    /** Handle any errors that occur during the observable chain */
                    console.error('An error occurred:', error);

                    /** Update the title to reflect the error state */
                    this.title = 'Error Occurred';
                    this.subtitle = 'Something went wrong, please contact your administrator';
                },
            });
    }

    /**
     * Retrieves the subtitle message based on the current step. Optionally increases
     * the progress width.
     * @private
     * @param {number} step - The current step in the process.
     * @param {boolean} [increaseProgress=true] - Whether to increase the progress width.
     * @returns {ProgressStep} The title, subtitle and step for the given step.
     */
    private getSubtitleMessage(step: number, increaseProgress = true): ProgressStep {
        if (increaseProgress) {
            this.progressWidth = 50;
            this.currentProgress++;
            this.progressWidth += (this.currentProgress / this.stepCount) * this.progressWidthTotal;
        }

        return this.steps.find((s) => s.step === step) || { title: '', subtitle: '', step: 0 };
    }
}
