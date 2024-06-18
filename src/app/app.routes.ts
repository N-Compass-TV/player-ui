import { Routes } from '@angular/router';
import { ContentSetupComponent } from '@pages/content-setup';
import { HealthCheckComponent } from '@pages/health-check';
import { LicenseSetupComponent } from '@pages/license-setup';
import { PlayComponent } from '@pages/play';
import { ResetComponent } from '@pages/reset';
import { ScreensaverComponent } from '@pages/screensaver';
import { SoftwareUpdateComponent } from '@pages/software-update';

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
    {
        path: 'screensaver',
        component: ScreensaverComponent,
    },
    {
        path: 'software-update',
        component: SoftwareUpdateComponent,
    },
];
