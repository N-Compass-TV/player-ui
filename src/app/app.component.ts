import { Component, OnInit, NgZone } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import io from 'socket.io-client';
import { API_ENDPOINTS, environment } from '@environments';
import { PLAYER_SERVER_SOCKET_EVENTS } from '@constants';
import { SocketService } from '@services/socket';
import { AssetDownloadProgress } from '@interfaces/misc';
import { PlayerDetailsComponent } from '@components/player-details';
import { PlayerDetailsDirective } from '@directives/player-details';
import { RequestService } from '@services/request';
import { LLicenseSettings } from '@interfaces/local';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, PlayerDetailsComponent, PlayerDetailsDirective],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    /**
     * URL where your server is running.
     * @type {string}
     * @private
     */
    private url = environment.api;

    /**
     * Client for the socket connection.
     * @type {SocketIOClient.Socket}
     * @private
     */
    private socketClient!: SocketIOClient.Socket;

    /**
     * Client for the socket connection.
     * @type {boolean}
     */
    public playerDetailsToggle: boolean = false;

    constructor(
        private _request: RequestService,
        private _router: Router,
        private _socket: SocketService,
        private ngZone: NgZone,
    ) {
        this.connectToSocket();
    }

    /**
     * Lifecycle hook that is called after data-bound properties are initialized.
     * Sets up socket listeners.
     */
    ngOnInit(): void {
        this.setupSocketListeners();
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Disconnects the socket client.
     */
    ngOnDestroy(): void {
        this.socketClient.disconnect();
    }

    /**
     * Connects to the socket server.
     * @private
     * @returns {void}
     */
    private connectToSocket(): void {
        this.socketClient = io(this.url);
    }

    /**
     * Sets up listeners for socket events.
     * @private
     * @returns {void}
     */
    private setupSocketListeners(): void {
        /**
         * Event listener for socket connection.
         * Logs a message when successfully connected to the local socket server.
         */
        this.socketClient.on(PLAYER_SERVER_SOCKET_EVENTS.connect, () => {
            console.log('Connected to local socket server, Player server is up and running!');
        });

        /**
         * Event listener for file download progress from the player server.
         * Invokes the assetDownloaded method with the provided data.
         * @param {AssetDownloadProgress} data - The data related to the asset download progress.
         */
        this.socketClient.on(PLAYER_SERVER_SOCKET_EVENTS.fileDownloaded, (data: AssetDownloadProgress) => {
            this.ngZone.runOutsideAngular(() => {
                this.handleFileDownloaded(data);
            });
        });

        /**
         * Event listener for socket disconnection.
         * Logs a message when disconnected from the local socket server.
         */
        this.socketClient.on(PLAYER_SERVER_SOCKET_EVENTS.disconnect, () => {
            console.log('Disconnected to local socket server, Player server is down!');
        });

        /**
         * Event listener for content update from the player server.
         * Sends a ping request to the API and navigates to the content setup page with the license key.
         */
        this.socketClient.on(PLAYER_SERVER_SOCKET_EVENTS.contentUpdate, () => {
            this._request.getRequest(API_ENDPOINTS.nctv.ping, true).subscribe({
                next: (_) => {
                    const licenseData: LLicenseSettings | null =
                        JSON.parse(localStorage.getItem('licenseData')!) || null;

                    this._router.navigate(['/content-setup'], {
                        queryParams: { licenseKey: licenseData?.license_key },
                    });
                },
            });
        });

        /**
         * Event listener for player reset.
         * Redirects to the /reset page which triggers the Reset API
         */
        this.socketClient.on(PLAYER_SERVER_SOCKET_EVENTS.reset, () => {
            this._router.navigate(['/reset']);
        });
    }

    /**
     * Handles file download progress.
     * Runs inside Angular zone to trigger change detection.
     * @param {AssetDownloadProgress} data - The data related to the asset download progress.
     * @private
     */
    private handleFileDownloaded(data: AssetDownloadProgress): void {
        this.ngZone.run(() => {
            this._socket.assetDownloaded(data);
        });
    }

    /**
     * Toggles the visibility of the player details component.
     * @param {Event} event - The event triggered by the directive.
     */
    public togglePlayerDetails(): void {
        this.playerDetailsToggle = !this.playerDetailsToggle;
    }
}
