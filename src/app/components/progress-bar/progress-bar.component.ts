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
     * @default ''
     */
    @Input() progressBarInfo = '';

    /**
     *
     * Reference for the progress tracking.
     * @default ''
     */
    @Input() progressReference = '';

    /**
     * The width of the progress bar.
     * @default 0
     */
    @Input() progressWidth = 0;
}
