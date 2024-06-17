import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-screensaver',
    standalone: true,
    imports: [],
    templateUrl: './screensaver.component.html',
    styleUrl: './screensaver.component.scss',
})
export class ScreensaverComponent implements OnInit, OnDestroy {
    /**
     * The current AM/PM part of the time.
     * @type {string}
     */
    amPm!: string;

    /**
     * The current time displayed by the clock.
     * @type {string}
     */
    currentTime!: string;

    /**
     * The message to be displayed
     * @type {string}
     */
    message: string = 'Your license may be inactive, please contact your administrator';

    /**
     * The timer ID used to update the time every second.
     * @type {any}
     */
    private timerId: any;

    /**
     * Subject to manage unsubscription.
     * @default new Subject<void>()
     * @protected
     */
    protected _unsubscribe = new Subject<void>();

    constructor(private _activatedRoute: ActivatedRoute) {
        this._activatedRoute.queryParamMap.pipe(takeUntil(this._unsubscribe)).subscribe((data: any) => {
            if (data.params.error) {
                this.message = 'Something went wrong, please contact your administrator';
            }
        });
    }

    /**
     * Initializes the component and starts the timer to update the time every second.
     */
    ngOnInit(): void {
        this.updateTime();
        this.timerId = setInterval(() => this.updateTime(), 1000);
    }

    /**
     * Clears the timer when the component is destroyed to prevent memory leaks.
     */
    ngOnDestroy(): void {
        clearInterval(this.timerId);
    }

    /**
     * Updates the current time with the current time formatted as a locale string.
     * @private
     */
    private updateTime(): void {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const timeParts = timeString.split(' ');
        this.currentTime = timeParts[0];
        this.amPm = timeParts[1];
    }
}
