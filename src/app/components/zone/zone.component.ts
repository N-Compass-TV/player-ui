import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Interfaces */
import { LPlayerZone } from '@interfaces/local';

@Component({
    selector: 'app-zone',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './zone.component.html',
    styleUrl: './zone.component.scss',
})
export class ZoneComponent {
    /**
     * Data for the player zone.
     * @type {LPlayerZone}
     */
    @Input() zoneData!: LPlayerZone;

    /**
     * Indicates whether the player is in fullscreen mode.
     * @type {boolean}
     * @default false
     */
    @Input() isFullscreen = false;
}
