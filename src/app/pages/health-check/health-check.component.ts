import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { AnimatedLoaderComponent, ProgressBarComponent } from '@components';
import { HEALTH_CHECK_STEPS } from '@constants';
import { RequestService } from '@services';
import { API_ENDPOINTS } from '@environments';
import { ProgressStep } from '../../interfaces/ProgressStep';

@Component({
    selector: 'app-health-check',
    standalone: true,
    imports: [AnimatedLoaderComponent, ProgressBarComponent],
    providers: [RequestService],
    templateUrl: './health-check.component.html',
    styleUrl: './health-check.component.scss',
})
export class HealthCheckComponent implements OnInit {
    /** Public */
    currentProgress = 0;
    progressWidth = 0;
    progressWidthTotal = 50;
    stepCount = 6;
    subtitle = 'Please Wait . . .';
    title = 'Player Startup Check';

    /** Private */
    private steps = HEALTH_CHECK_STEPS;

    constructor(
        private _request: RequestService,
        private _router: Router,
    ) {}

    ngOnInit() {
        this.checkPlayerHealth();
    }

    /**
     * Entry point of the player, this method triggers a chain of
     * API calls to the player-server to check the following:
     * 1. Database health
     * 2. Required files and folders
     * 3. Internet Speed
     * 4. Check Player Server and UI Updates
     * 5. License existence
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

    private getSubtitleMessage(step: number, increaseProgress = true): ProgressStep {
        if (increaseProgress) {
            this.currentProgress++;
            this.progressWidth = (this.currentProgress / this.stepCount) * this.progressWidthTotal;
        }

        return this.steps.find((s) => s.step === step) || { title: '', subtitle: '', step: 0 };
    }
}
