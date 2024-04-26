import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import socket from 'socket.io-client';
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
    private url = environment.api; // URL where your server is running
    private socketClient: any;

    constructor(private _socket: SocketService) {
        this.connectToSocket();
    }

    ngOnInit() {
        this.setupSocketListeners();
    }

    ngOnDestroy() {
        this.socketClient.disconnect();
    }

    private connectToSocket() {
        this.socketClient = socket(this.url);
    }

    private setupSocketListeners() {
        this.socketClient.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        this.socketClient.on(PLAYER_SERVER_SOCKET_EVENTS.fileDownloaded, (data: AssetDownloadProgress) => {
            this._socket.assetDownloaded(data);
        });

        this.socketClient.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });
    }
}
