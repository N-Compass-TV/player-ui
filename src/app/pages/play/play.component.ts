import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap, tap } from 'rxjs';

/** Components */
import { PlaylistComponent } from '@components/playlist';
import { ZoneComponent } from '@components/zone';

/** Services */
import { RequestService } from '@services/request';

/** Interfaces */
import { LPlayerProperties, LPlayerZone, PlayerSchedule } from '@interfaces/local';

/** Environments */
import { API_ENDPOINTS } from '@environments';
import { SocketService } from '@services/socket';
import { PLAYER_SERVER_SOCKET_EVENTS } from '../../constants/SocketEvents';

@Component({
    selector: 'app-play',
    standalone: true,
    imports: [CommonModule, PlaylistComponent, ZoneComponent],
    templateUrl: './play.component.html',
    styleUrl: './play.component.scss',
})
export class PlayComponent implements OnInit {
    /**
     * Business operation "IS OPEN" indicator
     * @type {boolean}
     */
    businessOperating: boolean = true;

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

    constructor(
        private _request: RequestService,
        private _socket: SocketService,
    ) {}

    ngOnInit(): void {
        this.initializePlaylistData();

        /** Socket Player Scheduler Watcher */
        this._socket.emitEvent(PLAYER_SERVER_SOCKET_EVENTS.start_schedule_check, {});
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
                next: () => {
                    this.initiatePlayerScheduleChecker();
                },
                error: (error) => {
                    console.error('Error initializing playlist data:', error);
                },
            });
    }

    private initiatePlayerScheduleChecker() {
        this._socket.schedule$.subscribe({
            next: (data: PlayerSchedule) => {
                console.log({ data });
                this.businessOperating = data.operation_status;
            },
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
