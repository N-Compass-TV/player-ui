import { Component, OnInit } from '@angular/core';
import { AnimatedLoaderComponent } from '@components/animated-loader';
import { Router } from '@angular/router';
import { RequestService } from '@services/request';
import { API_ENDPOINTS } from '@environments';

@Component({
    selector: 'app-reset',
    standalone: true,
    imports: [AnimatedLoaderComponent],
    templateUrl: './reset.component.html',
    styleUrl: './reset.component.scss',
})
export class ResetComponent implements OnInit {
    constructor(
        private _request: RequestService,
        private _router: Router,
    ) {}

    ngOnInit(): void {
        this.resetPlayer();
    }

    private resetPlayer(): void {
        this._request.getRequest(API_ENDPOINTS.local.get.reset).subscribe({
            next: (response) => {
                this._router.navigate(['/license-setup']);
            },
        });
    }
}
