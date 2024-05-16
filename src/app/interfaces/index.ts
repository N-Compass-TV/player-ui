/**
 * This file defines the interface for data received from the .NET API.
 * Ensure this file is updated whenever new properties are added to maintain
 * alignment with the .NET API data hosted on AWS.
 */
export * from './cloud/Content';
export * from './cloud/Dealer';
export * from './cloud/GlobalSetting';
export * from './cloud/Host';
export * from './cloud/PiContents';
export * from './cloud/PlayerData';
export * from './cloud/PlaylistContentSchedule';
export * from './cloud/RebootTime';
export * from './cloud/Screen';
export * from './cloud/ScreenTemplateZones';
export * from './cloud/ScreenType';
export * from './cloud/Timezone';

/**
 * Interface names are prefixed with 'L' to denote Local,
 * indicating that the data originates from the local player-server.
 * Note: Data attributes from the local player-server are in snake_case format.
 */
export * from './local/LPlaylistData';
export * from './local/LPlayerProperties';
export * from './local/LPlayerZone';

/**
 * Miscellaneous interfaces, shared
 */
export * from './misc/ProgressStep';
export * from './misc/Filetypes';
