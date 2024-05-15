import { GlobalSetting } from './GlobalSetting';
import { PiContents } from './PiContents';
import { RebootTime } from './RebootTime';

/** Main player data interface */
export interface PlayerData {
    fastEdgeMonitoringTool: number;
    globalSettings: GlobalSetting[];
    isCecEnabled: number;
    piContents: PiContents;
    rebootTime: RebootTime[];
    tvBrand: string;
}
