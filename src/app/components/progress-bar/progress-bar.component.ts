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
export class ProgressBarComponent {
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
}
