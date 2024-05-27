export const API_ENDPOINTS = {
    local: {
        api: 'http://192.168.0.114:3215',
        assets: 'http://192.168.0.114:3215/assets',
        assets_node: 'http://192.168.0.114:3215/assets',
        get: {
            apps: 'player/apps',
            apply_update: 'update/apply',
            check_db: 'checkup/database',
            check_dirs: 'checkup/dirs',
            check_license: 'checkup/license',
            check_net: 'checkup/internet',
            check_update: 'checkup/updates',
            cleardb: 'content/cleardb',
            credits: 'playlist/credits/',
            device_info: 'device',
            download_assets: 'content',
            download_update: 'update',
            fast_edge: 'player/fastedge/status',
            license: 'license',
            log: 'content/log',
            ping: 'checkup/ping',
            playlist: 'playlist/',
            player_data: 'player/data/',
            refetch: 'content/refetch',
            reset: 'content/reset',
            schedule: 'player/schedule',
            settings: 'checkup/settings',
            template: 'template',
            vistar_ad: 'vistar/get_ad',
            vistar_get_assets: 'vistar/get_assets',
            vistar_cache: 'vistar/cache',
            vistar_info: 'vistar/info',
        },
        post: {
            apps: 'update/apps',
            content_credit: 'playlist/credits',
            fast_edge_status: 'player/fastedge?enabled=',
            register: 'player/register',
            save_player_data: 'player/save-data',
            save_player_license: 'license/save',
            save_error: 'player/save-error',
            save_update_log: 'update/logs',
            update_playlist_content_schedule: 'playlist/updatecontentstatus',
        },
    },
    fast_edge: {
        api_v1: 'http://localhost:5000/',
        api_v2: 'http://localhost:5001/',
        post: {
            advetisement: 'advetisement',
            ad: 'ads',
        },
    },
    nctv: {
        ping: 'https://nctvapi.n-compass.online/api/values',
    },
};
