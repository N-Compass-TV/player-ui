import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/internal/operators/switchMap';

/** Components */
import { AnimatedLoaderComponent } from '@components/animated-loader';
import { LicenseFormComponent } from '@components/license-form';

/** Services */
import { RequestService } from '@services/request';

/** Interfaces */
import { LDeviceInfo, LError, LLicenseSettings } from '@interfaces/local';
import { DeviceInfo, LicenseRegistrationResponse } from '@interfaces/cloud';

/** Environments */
import { API_ENDPOINTS } from '@environments';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs/internal/operators/tap';
@Component({
    selector: 'app-license-setup',
    standalone: true,
    imports: [CommonModule, AnimatedLoaderComponent, LicenseFormComponent],
    templateUrl: './license-setup.component.html',
    styleUrl: './license-setup.component.scss',
})
export class LicenseSetupComponent implements OnInit {
    /**
     * Information about the device
     */
    public deviceInfo!: DeviceInfo;

    /**
     * Constants used in the form
     */
    public pageConstants = {
        title: 'Enter License Key',
    };

    /**
     * Indicates whether the license is currently being registered
     */
    public registeringLicense: boolean = false;

    /**
     * Indicates whether the license registration is successful
     */
    public registrationSuccess: boolean = false;

    ngOnInit() {
        this.getDeviceInfo();
    }

    constructor(
        private _request: RequestService,
        private _router: Router,
    ) {}

    /**
     * Retrieves device information and updates the deviceInfo property.
     * Makes a GET request to the device_info endpoint.
     * Updates the deviceInfo object with the received data.
     */
    private getDeviceInfo() {
        this._request.getRequest(API_ENDPOINTS.local.get.device_info).subscribe({
            next: (deviceInfo: LDeviceInfo) => {
                this.deviceInfo = {
                    appVersion: JSON.stringify(deviceInfo.app_versions),
                    internetInfo: JSON.stringify(deviceInfo.internet_info),
                    licensekey: '',
                    macaddress: deviceInfo.mac_address,
                    memory: deviceInfo.memory,
                    internettype: deviceInfo.net_type,
                    internetspeed: deviceInfo.internet_speed,
                    totalstorage: deviceInfo.storage.total,
                    freestorage: `${100 - deviceInfo.storage.used} %`,
                    serverVersion: deviceInfo.server_version,
                    uiVersion: deviceInfo.ui_version,
                };
            },
        });
    }

    /**
     * Registers the provided license key for the device.
     * Makes a POST request to register the license key.
     * Updates the deviceInfo object with the license key.
     * Stores license settings in localStorage and navigates to the content setup page upon success.
     * @param {string} licenseKeyValue - The license key to register.
     * @public
     */
    public registerLicenseKey(licenseKeyValue: string): void {
        if (!licenseKeyValue) return;

        this.deviceInfo.licensekey = licenseKeyValue;
        this.registeringLicense = true;

        this._request
            .postRequest(API_ENDPOINTS.local.post.register, this.deviceInfo)
            .pipe(
                switchMap((response: LicenseRegistrationResponse) => {
                    const licenseSettings: LLicenseSettings = {
                        license_id: response.licenseInfo.licenseId,
                        license_key: response.licenseInfo.licenseKey,
                        resource_enabled: response.licenseInfo.resourceSettings,
                        screenshot_enabled: response.licenseInfo.screenshotSettings,
                        speedtest_enabled: response.licenseInfo.speedtestSettings,
                        type_id: response.screenType.screenTypeId,
                        type_key: response.screenType.name,
                        boot_delay: response.licenseInfo.bootDelay,
                        reboot_time: response.licenseInfo.rebootTime,
                        is_cec_enabled: response.licenseInfo.isCecCtlEnabled,
                        ip_address: {
                            current: response.licenseInfo.publicIP,
                            previous: response.licenseInfo.prevPublicIP,
                        },
                        display_control_settings: response.licenseInfo.displayControlSettings,
                    };

                    localStorage.setItem('licenseData', JSON.stringify(licenseSettings));

                    return this._request.postRequest(API_ENDPOINTS.local.post.save_player_license, licenseSettings);
                }),
            )
            .subscribe({
                next: (_) => {
                    this.registrationSuccess = true;
                    this.pageConstants.title = 'License registered!';

                    setTimeout(() => {
                        this._router.navigate(['content-setup'], {
                            queryParams: { licenseKey: this.deviceInfo.licensekey },
                        });
                    }, 2000);
                },
                error: (error: LError) => {
                    this.registeringLicense = false;
                    this.pageConstants.title = `Registration Error`;
                    console.error(`License registration error: ${error}`);
                },
            });
    }
}
