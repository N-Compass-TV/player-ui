import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-progress-bar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss',
})
export class ProgressBarComponent {
    @Input() progressBarInfo: string = '';
    @Input() progressReference: string = '';
    @Input() progressWidth: number = 0;
    @Input() progressWidthWatch: Subject<{ key: string; value: number }> = new Subject<{
        key: string;
        value: number;
    }>();

    ngOnInit() {
        this.initializeProgressWidthWatcher();
    }

    initializeProgressWidthWatcher() {
        this.progressWidthWatch.subscribe({
            next: (data: { key: string; value: number }) => {
                console.log(data);
                if (data.key === this.progressReference) this.progressWidth = data.value;
            },
        });
    }
}
