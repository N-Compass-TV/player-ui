/** Defines locally saved license data */
export interface LPlayerProperties {
    license_id: string;
    license_key: string;
    type_id: string;
    type_key: string;
    reboot_time: string;
    is_cec_enabled: boolean | null;
    screenshot_enabled: boolean;
    speedtest_enabled: boolean;
    resource_enabled: boolean;
    boot_delay: number;
    display_control_settings: number;
}
