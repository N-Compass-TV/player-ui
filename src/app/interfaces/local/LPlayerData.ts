/**
 * Interface names are prefixed with 'L' to denote Local,
 * indicating that the data originates from the local player-server.
 * Note: Data attributes from the local player-server are in snake_case format.
 */

// Defines locally saved zone data
export interface LPlayerZone {
    background: string;
    height: number;
    playlist_id: string;
    playlist_type: string | null;
    screen_id: string;
    template_id: string;
    width: number;
    x_pos: number;
    y_pos: number;
    zone_order: number;
}

// Defines locally saved license data
export interface LPlayerLicense {
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
