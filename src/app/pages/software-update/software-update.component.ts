import { Component, OnInit } from '@angular/core';
import { AnimatedLoaderComponent } from '@components/animated-loader';
import { ProgressBarComponent } from '@components/progress-bar';
import { RequestService } from '@services/request';
import { API_ENDPOINTS } from '../../environments/api-endpoints';
import { switchMap } from 'rxjs';
import { ProgressStep } from '@interfaces/misc';
import { SOFTWARE_UPDATE_STEPS } from '../../constants/SoftwareUpdateSteps';

@Component({
    selector: 'app-software-update',
    standalone: true,
    imports: [AnimatedLoaderComponent, ProgressBarComponent],
    templateUrl: './software-update.component.html',
    styleUrl: './software-update.component.scss',
})
export class SoftwareUpdateComponent implements OnInit {
    /**
     * The current progress value.
     * @default 0
     */
    currentProgress = 0;

    /**
     * The width of the progress indicator.
     * @default 0
     */
    progressWidth = 0;

    /**
     * The total width of the progress indicator.
     * @default 50
     */
    progressWidthTotal = 0;

    /**
     * The number of steps in the process.
     * @default 2
     */
    stepCount = 2;

    /**
     * The subtitle displayed during the process.
     * @default 'Please Wait . . .'
     */
    subtitle = 'Please Wait . . .';

    /**
     * The title displayed during the process.
     * @default 'Player Startup Check'
     */
    title = 'Player Startup Check';

    /**
     * The progress steps description for display
     */
    private steps: ProgressStep[] = SOFTWARE_UPDATE_STEPS;

    constructor(private _request: RequestService) {}

    ngOnInit(): void {
        this.downloadAvailableUpdates();
    }

    /**
     * Downloads and applies available software updates.
     * @private
     * This method performs the following steps:
     * 1. Pings the server to check for connectivity.
     * 2. Downloads the update files if the server is reachable.
     * 3. Applies the downloaded updates.
     *
     * The `title` and `subtitle` properties are updated to reflect the current step in the process.
     * If any error occurs during the process, appropriate error messages are set.
     * @returns {void}
     */
    private downloadAvailableUpdates(): void {
        this._request
            .getRequest(API_ENDPOINTS.nctv.ping, {}, true)
            .pipe(
                // Download update files
                switchMap(() => {
                    const message = this.getSubtitleMessage(1);
                    this.subtitle = message.subtitle;
                    this.title = message.title;
                    return this._request.getRequest(API_ENDPOINTS.local.get.download_update);
                }),

                // Apply Updates
                switchMap(() => {
                    const message = this.getSubtitleMessage(2);
                    this.subtitle = message.subtitle;
                    this.title = message.title;
                    return this._request.getRequest(API_ENDPOINTS.local.get.apply_update);
                }),
            )
            .subscribe({
                next: (_) => {},
                error: (_: any) => {
                    this.title = 'Software Update Error';
                    this.subtitle = 'Something went wrong, please contact your administrator';
                },
            });
    }

    /**
     * Retrieves the subtitle message based on the current step. Optionally increases the progress width.
     * @private
     * @param {number} step - The current step in the process.
     * @param {boolean} [increaseProgress=true] - Whether to increase the progress width.
     * @returns {ProgressStep} The title and subtitle for the given step.
     */
    private getSubtitleMessage(step: number, increaseProgress = true): ProgressStep {
        if (increaseProgress) {
            this.currentProgress++;
            this.progressWidth = (this.currentProgress / this.stepCount) * this.progressWidthTotal;
        }

        return this.steps.find((s) => s.step === step) || { title: '', subtitle: '', step: 0 };
    }
}
