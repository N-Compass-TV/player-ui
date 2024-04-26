import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, delay, switchMap, takeUntil, tap } from 'rxjs';
import { API_ENDPOINTS } from '@environments';
import { CONTENT_DOWNLOAD_STEPS } from '@constants';
import { AnimatedLoaderComponent, ProgressBarComponent } from '@components';
import { AssetDownloadProgress, Content, PlayerData, ProgressStep } from '@interfaces';
import { RequestService } from '@services';
import { SocketService } from '../../services/socket/socket.service';

@Component({
    selector: 'app-content-setup',
    standalone: true,
    imports: [CommonModule, AnimatedLoaderComponent, ProgressBarComponent],
    templateUrl: './content-setup.component.html',
    styleUrl: './content-setup.component.scss',
})
export class ContentSetupComponent implements OnInit {
    /** Public */
    assetDownloadProgress: Subject<{ key: string; value: number }> = new Subject<{ key: string; value: number }>();
    currentProgress = 0;
    downloadedPlayerAssets: string[] = [];
    downloadCompleted = false;
    licenseId = '';
    licenseKey = '';
    playerAssets: Content[] = [];
    progressWidth = 50;
    progressWidthTotal = 50;
    readyToDownload = false;
    refetch = false;
    stepCount = 4;
    subtitle = 'Please Wait . . .';
    title = 'Downloading Player Data';

    /** Private */
    private steps = CONTENT_DOWNLOAD_STEPS;
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

    private assetDownloadWatch() {
        this._socket.downloaded$.subscribe({
            next: (data: AssetDownloadProgress) => {
                // Update progress immediately
                this.assetDownloadProgress.next({
                    key: data.content_id,
                    value: Number(data.progress),
                });

                // Delay subsequent operations
                setTimeout(() => {
                    if (Number(data.progress) === 100) {
                        // Find the index of the content object
                        const index = this.playerAssets.findIndex((asset) => asset.contentId === data.content_id);

                        // If found, remove the object and unshift it to the beginning of the array
                        if (index !== -1) {
                            const [contentObject] = this.playerAssets.splice(index, 1);
                            this.playerAssets.unshift(contentObject);
                        }

                        // Delay the push to downloadedPlayerAssets to ensure it happens after reordering
                        setTimeout(() => {
                            this.downloadedPlayerAssets.push(data.content_id);
                        }, 1500); // Delay of 1500 ms before pushing to downloaded assets
                    }
                }, 500); // Initial delay before checking the progress and reordering
            },
            error: (err) => {
                console.error('Error in asset download watch:', err);
            },
        });
    }

    private getPlayerData() {
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
                    // Setting up a global variable for player assets
                    this.playerAssets = playerData.piContents?.contents || [];

                    // Save player data to local storage for quick access
                    localStorage.setItem('playerData', JSON.stringify(playerData));

                    // Run the asset download watcher to track asset download progress
                    this.assetDownloadWatch();

                    // End
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
                    // Handle any errors that occur during the observable chain
                    console.error('An error occurred:', error);

                    // Update the title to reflect the error state
                    this.title = 'Error Occurred';
                    this.subtitle = 'Something went wrong, please contact your administrator';
                },
            });
    }

    private getSubtitleMessage(step: number, increaseProgress = true): ProgressStep {
        if (increaseProgress) {
            this.progressWidth = 50;
            this.currentProgress++;
            this.progressWidth += (this.currentProgress / this.stepCount) * this.progressWidthTotal;
        }

        return this.steps.find((s) => s.step === step) || { title: '', subtitle: '', step: 0 };
    }
}
