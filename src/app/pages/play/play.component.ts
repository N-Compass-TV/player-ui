import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, catchError, switchMap, takeUntil, tap, throwError } from 'rxjs';

/** Components */
import { PlaylistComponent } from '@components/playlist';
import { ZoneComponent } from '@components/zone';

/** Services */
import { RequestService } from '@services/request';

/** Interfaces */
import {
    LPlayerProperties,
    LPlayerZone,
    LPlayerSchedule,
    LProgrammaticAdsResponse,
    LProgrammaticAd,
} from '@interfaces/local';

/** Environments */
import { API_ENDPOINTS } from '@environments';
import { SocketService } from '@services/socket';
import { PLAYER_SERVER_SOCKET_EVENTS } from '../../constants/SocketEvents';
import { ActivatedRoute, Router } from '@angular/router';

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
     * @default true
     */
    businessOperating = true;

    /**
     * Holds the license and hardware properties of the player
     */
    playerLicenseAndProperties!: LPlayerProperties;

    /**
     * Programmatic ads
     */
    programmaticAds!: LProgrammaticAd[];

    /**
     * Programmatic flag
     */
    programmaticEnabled = false;

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
    isFullscreen = false;

    /**
     * Subject to manage unsubscription.
     * @default new Subject<void>()
     * @protected
     */
    protected _unsubscribe = new Subject<void>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _request: RequestService,
        private _socket: SocketService,
    ) {}

    ngOnInit(): void {
        this._activatedRoute.queryParamMap.pipe(takeUntil(this._unsubscribe)).subscribe((data: any) => {
            if (data.params.operationHours) {
                this.businessOperating = data.params.operationHours === 'true';
            }

            if (data.params.programmatic) {
                this.programmaticEnabled = data.params.programmatic === 'true';
            }
        });

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
                tap((data: LPlayerProperties) => {
                    this.playerLicenseAndProperties = data;
                }),

                /** Get player template */
                switchMap(() => this._request.getRequest(API_ENDPOINTS.local.get.template)),
                tap((data: LPlayerZone[]) => {
                    this.screenZones = data;
                }),

                /** Get programmatic ads */
                switchMap(() => this._request.getRequest(API_ENDPOINTS.local.get.programmatic_ads)),
                tap((data: LProgrammaticAdsResponse) => {
                    this.programmaticAds = data.data;
                }),

                /** Custom error catcher  */
                catchError((error) => {
                    console.error('Error initializing playlist data:', error);
                    this._router.navigate(['screensaver'], { queryParams: { error: 1 } });
                    return throwError(() => ({
                        message: 'Player Server Errored, sending email notification',
                        triggerEmail: true,
                    }));
                }),
            )
            .subscribe({
                next: () => {
                    this.initiatePlayerScheduleChecker();
                },
            });
    }

    /**
     * Initializes socket observable for player schedule
     * @returns {void}
     */
    private initiatePlayerScheduleChecker() {
        this._socket.schedule$.subscribe({
            next: (data: LPlayerSchedule) => {
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
