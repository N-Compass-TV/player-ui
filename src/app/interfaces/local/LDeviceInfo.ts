export interface LDeviceInfo {
    app_versions: string;
    internet_info: string;
    internet_speed: string;
    mac_address: string;
    memory: string;
    net_type: string;
    server_version: string;
    storage: {
        total: string;
        used: number;
    };
    total: string;
    ui_version: string;
}
