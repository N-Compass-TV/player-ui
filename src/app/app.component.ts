import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import io from 'socket.io-client';
import { environment } from '@environments';
import { PLAYER_SERVER_SOCKET_EVENTS } from '@constants';
import { SocketService } from '@services/socket';
import { AssetDownloadProgress } from '@interfaces/misc';
import { PlayerDetailsComponent } from '@components/player-details';
import { PlayerDetailsDirective } from '@directives/player-details';

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

    constructor(private _socket: SocketService) {
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
        this.socketClient.on('connect', () => {
            console.log('Connected to local socket server, Player server is up and running!');
        });

        this.socketClient.on(PLAYER_SERVER_SOCKET_EVENTS.fileDownloaded, (data: AssetDownloadProgress) => {
            this._socket.assetDownloaded(data);
        });

        this.socketClient.on('disconnect', () => {
            console.log('Disconnected to local socket server, Player server is down!');
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
