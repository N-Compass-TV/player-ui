import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import io from 'socket.io-client';
import { environment } from '@environments';
import { PLAYER_SERVER_SOCKET_EVENTS } from '@constants';
import { SocketService } from '@services';
import { AssetDownloadProgress } from '@interfaces';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    /**
     * URL where your server is running.
     * @type {string}
     * @private
     */
    private url = environment.api;

    /**
     * Client for the socket connection.
     * @type {any}
     * @private
     */
    private socketClient!: SocketIOClient.Socket;

    /**
     * Constructor for the class.
     *
     * @param {SocketService} _socket - The socket service to handle socket events.
     */
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
}
