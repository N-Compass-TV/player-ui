import { Routes } from '@angular/router';
import { HealthCheckComponent } from './pages/health-check/health-check.component';
import { LicenseSetupComponent } from './pages/license-setup/license-setup.component';
import { ContentSetupComponent } from './pages/content-setup/content-setup.component';
import { PlayComponent } from './pages/play/play.component';

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
];
