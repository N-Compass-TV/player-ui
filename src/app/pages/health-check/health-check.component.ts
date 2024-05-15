import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { AnimatedLoaderComponent, ProgressBarComponent } from '@components';
import { HEALTH_CHECK_STEPS } from '@constants';
import { RequestService } from '@services';
import { API_ENDPOINTS } from '@environments';
import { ProgressStep } from '../../interfaces/misc/ProgressStep';

@Component({
    selector: 'app-health-check',
    standalone: true,
    imports: [AnimatedLoaderComponent, ProgressBarComponent],
    providers: [RequestService],
    templateUrl: './health-check.component.html',
    styleUrl: './health-check.component.scss',
})
export class HealthCheckComponent implements OnInit {
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
    progressWidthTotal = 50;

    /**
     * The number of steps in the process.
     * @default 6
     */
    stepCount = 6;

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
    private steps: ProgressStep[] = HEALTH_CHECK_STEPS;

    constructor(
        private _request: RequestService,
        private _router: Router,
    ) {}

    ngOnInit(): void {
        this.checkPlayerHealth();
    }

    /**
     * This method updates the subtitle message at each step and finally redirects to the asset downloader page.
     * Entry point of the player, this method triggers a chain of API calls to the player-server to check the following:
     * 1. Database health
     * 2. Required files and folders
     * 3. Internet Speed
     * 4. Player Server and UI Updates
     * 5. License existence
     * @private
     * @returns {void}
     */
    private checkPlayerHealth(): void {
        this._request
            .getRequest(API_ENDPOINTS.nctv.ping, true)
            .pipe(
                // Database Health Check
                tap(() => (this.subtitle = this.getSubtitleMessage(1).subtitle)),
                switchMap(() => this._request.getRequest(API_ENDPOINTS.local.get.check_db)),

                // Directory Check
                tap(() => (this.subtitle = this.getSubtitleMessage(2).subtitle)),
                switchMap(() => this._request.getRequest(API_ENDPOINTS.local.get.check_dirs)),

                // Internet Speedtest
                tap(() => (this.subtitle = this.getSubtitleMessage(3).subtitle)),
                switchMap(() => this._request.getRequest(API_ENDPOINTS.local.get.check_net)),

                // Software Update Check
                tap(() => (this.subtitle = this.getSubtitleMessage(4).subtitle)),
                switchMap(() => this._request.getRequest(API_ENDPOINTS.local.get.apps)),
                switchMap((getAppsResponse) =>
                    this._request.postRequest(API_ENDPOINTS.local.post.apps, getAppsResponse),
                ),
                switchMap(() => this._request.getRequest(API_ENDPOINTS.local.get.check_update)),

                // License Check
                tap(() => (this.subtitle = this.getSubtitleMessage(5, false).subtitle)),
                switchMap((checkUpdateResponse) =>
                    this._request.postRequest(API_ENDPOINTS.local.post.save_update_log, checkUpdateResponse),
                ),
                switchMap(() => this._request.getRequest(API_ENDPOINTS.local.get.check_license)),
            )
            .subscribe({
                next: (checkLicenseResponse: any) => {
                    const licenseData = checkLicenseResponse[0];

                    // Update display message
                    this.title = this.getSubtitleMessage(6).title;
                    this.subtitle = this.getSubtitleMessage(6).subtitle;

                    // Redirect to asset downloader page
                    setTimeout(
                        () =>
                            this._router.navigate(['content-setup'], {
                                queryParams: { licenseKey: licenseData.license_key },
                            }),
                        2000,
                    );
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
