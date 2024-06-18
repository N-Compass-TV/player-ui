import { ProgressStep } from '@interfaces/misc';

/** Software update check steps */
export const SOFTWARE_UPDATE_STEPS: ProgressStep[] = [
    {
        title: 'Downloading Updates',
        subtitle: 'Preparing update files do not turn off player',
        step: 1,
    },
    {
        title: 'Updates Ready',
        subtitle: 'Applying updates, do not turn off the player',
        step: 2,
    },
];
