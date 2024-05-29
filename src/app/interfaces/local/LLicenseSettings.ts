export interface LLicenseSettings {
    license_id: string;
    license_key: string;
    resource_enabled: number;
    screenshot_enabled: number;
    speedtest_enabled: number;
    type_id: string;
    type_key: string;
    boot_delay: number;
    reboot_time: string;
    is_cec_enabled: number | null;
    ip_address: {
        current: string;
        previous: string;
    };
    display_control_settings: number;
}
