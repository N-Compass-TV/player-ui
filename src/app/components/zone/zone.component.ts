import { Component, Input } from '@angular/core';
import { LPlayerZone } from '@interfaces';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-zone',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './zone.component.html',
    styleUrl: './zone.component.scss',
})
export class ZoneComponent {
    @Input() zoneData!: LPlayerZone;
    @Input() isFullscreen = false;
}
