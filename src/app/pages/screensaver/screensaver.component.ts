import { Component, OnDestroy, OnInit } from '@angular/core';

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
     * The timer ID used to update the time every second.
     * @type {any}
     */
    private timerId: any;

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
