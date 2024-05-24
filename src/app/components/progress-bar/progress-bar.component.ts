import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-progress-bar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss',
})
export class ProgressBarComponent implements OnInit {
    /**
     * Information to be displayed on the progress bar.
     * @type {string}
     * @default ''
     */
    @Input() progressBarInfo: string = '';

    /**
     *
     * Reference for the progress tracking.
     * @type {string}
     * @default ''
     */
    @Input() progressReference: string = '';

    /**
     * The width of the progress bar.
     * @type {number}
     * @default 0
     */
    @Input() progressWidth: number = 0;

    /**
     * Observable to watch the progress width updates.
     * @type {Subject<{ key: string; value: number }>}
     * @default new Subject<{ key: string; value: number }>()
     */
    @Input() progressWidthWatch: Subject<{ key: string; value: number }> = new Subject<{
        key: string;
        value: number;
    }>();

    ngOnInit(): void {
        this.initializeProgressWidthWatcher();
    }

    /**
     * Initializes the progress width watcher by subscribing to the `progressWidthWatch` observable.
     * Updates the progress width when the progress reference matches the data key.
     * @private
     * @returns {void}
     */
    private initializeProgressWidthWatcher() {
        this.progressWidthWatch.subscribe({
            next: (data: { key: string; value: number }) => {
                if (data.key === this.progressReference) this.progressWidth = isNaN(data.value) ? 0 : data.value;
            },
        });
    }
}
