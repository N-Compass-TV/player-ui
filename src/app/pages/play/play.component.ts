import { Component, OnInit } from '@angular/core';
import { PlaylistComponent, ZoneComponent } from '@components';
import { RequestService } from '@services';
import { API_ENDPOINTS } from '@environments';
import { switchMap, tap } from 'rxjs';
import { LPlayerProperties, LPlayerZone } from '@interfaces';
import { CommonModule } from '@angular/common';

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
}
