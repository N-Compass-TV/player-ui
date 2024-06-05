import { Routes } from '@angular/router';
import { HealthCheckComponent } from '@pages/health-check';
import { LicenseSetupComponent } from '@pages/license-setup';
import { ContentSetupComponent } from '@pages/content-setup';
import { PlayComponent } from '@pages/play';
import { ResetComponent } from '@pages/reset';

export const routes: Routes = [
    {
        path: '',
        component: HealthCheckComponent,
    },
    {
        path: 'license-setup',
        component: LicenseSetupComponent,
    },
    {
        path: 'content-setup',
        component: ContentSetupComponent,
    },
    {
        path: 'play',
        component: PlayComponent,
    },
    {
        path: 'reset',
        component: ResetComponent,
    },
];
