import { Component, Input, OnInit } from '@angular/core';
import { RequestService } from '@services';
import { API_ENDPOINTS } from '../../environments/api-endpoints';

@Component({
    selector: 'app-playlist',
    standalone: true,
    imports: [],
    templateUrl: './playlist.component.html',
    styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements OnInit {
    /**
     * Playlist ID to be used to fetch playlist data
     * @type {string}
     */
    @Input() playlistId: string = '';

    constructor(private _request: RequestService) {}

    ngOnInit(): void {
        this.getPlaylistData();
    }

    private getPlaylistData() {
        if (!this.playlistId) return;

        this._request.getRequest(`${API_ENDPOINTS.local.get.playlist}${this.playlistId}`).subscribe({
            next: (res) => {
                console.log(res);
            },
        });
    }
}
