import { Component, OnInit } from '@angular/core';
import { PlayerData } from '@interfaces/cloud';
import { LLicenseSettings } from '@interfaces/local';
import { PlayerDetails } from '@interfaces/misc';

@Component({
    selector: 'app-player-details',
    standalone: true,
    imports: [],
    templateUrl: './player-details.component.html',
    styleUrl: './player-details.component.scss',
})
export class PlayerDetailsComponent implements OnInit {
    playerDetails: PlayerDetails = {
        licenseKey: 'Not available',
        dealerName: 'Not Available',
        hostName: 'Not Available',
        screenName: 'Not Available',
    };

    ngOnInit(): void {
        this.getPlayerData();
    }

    getPlayerData() {
        const licenseData: LLicenseSettings | null = JSON.parse(localStorage.getItem('licenseData')!) || null;
        const playerData: PlayerData | null = JSON.parse(localStorage.getItem('playerData')!) || null;

        if (!playerData || !licenseData) {
            return;
        }

        this.playerDetails = {
            licenseKey: licenseData.license_key,
            dealerName: playerData.piContents.dealer.businessName,
            hostName: playerData.piContents.host.name,
            screenName: playerData.piContents.screen.screenName,
        };
    }
}
