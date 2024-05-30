import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap, tap } from 'rxjs';

/** Components */
import { PlaylistComponent } from '@components/playlist';
import { ZoneComponent } from '@components/zone';

/** Services */
import { RequestService } from '@services/request';

/** Interfaces */
import { LPlayerProperties, LPlayerZone } from '@interfaces/local';

/** Environments */
import { API_ENDPOINTS } from '@environments';

@Component({
    selector: 'app-play',
    standalone: true,
    imports: [CommonModule, PlaylistComponent, ZoneComponent],
    templateUrl: './play.component.html',
    styleUrl: './play.component.scss',
})
export class PlayComponent implements OnInit {
    /**
     * Holds the license and hardware properties of the player
     */
    playerLicenseAndProperties!: LPlayerProperties;

    /**
     * Holds the player screen and zone properties
     * @default []
     */
    screenZones: LPlayerZone[] = [];

    /**
     * Indicates the view mode of the content
     * @type {boolean}
     * @default false
     */
    isFullscreen: boolean = false;

    constructor(private _request: RequestService) {}

    ngOnInit(): void {
        this.initializePlaylistData();
    }

    /**
     * Initializes playlist data by making API requests to retrieve player license, properties, and screen zones.
     * @returns {void}
     */
    private initializePlaylistData(): void {
        this._request
            .getRequest(API_ENDPOINTS.local.get.license)
            .pipe(
                /** Player license exists */
                tap((data: LPlayerProperties) => {
                    this.playerLicenseAndProperties = data;
                }),

                /** Get player template and zone property */
                switchMap(() => this._request.getRequest(API_ENDPOINTS.local.get.template)),
                tap((data: LPlayerZone[]) => {
                    this.screenZones = data;
                }),
            )
            .subscribe({
                next: () => {},
                error: (error) => {},
            });
    }

    /**
     * Sets the content display mode
     * @returns {void}
     */
    public setDisplayMode(e: number, zoneOrder: number): void {
        if (this.screenZones.length > 0 && zoneOrder !== 1) return;
        this.isFullscreen = e ? true : false;
    }
}
