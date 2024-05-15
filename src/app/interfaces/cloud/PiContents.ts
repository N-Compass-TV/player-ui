import { Content } from './Content';
import { Dealer } from './Dealer';
import { Host } from './Host';
import { ScreenTemplateZone } from './ScreenTemplateZones';
import { ScreenType } from './ScreenType';
import { Timezone } from './Timezone';

/**  Detailed contents within the player data */
export interface PiContents {
    contents: Content[];
    createdBy: string | null;
    dealer: Dealer;
    host: Host;
    licenses: any;
    piFieldGroupValues: any;
    screen: Screen;
    screenType: ScreenType;
    screenZonePlaylistsContents: {
        contents: Content[];
        screenTemplateZonePlaylist: ScreenTemplateZone[];
    };
    template: any;
    timezone: Timezone;
}
