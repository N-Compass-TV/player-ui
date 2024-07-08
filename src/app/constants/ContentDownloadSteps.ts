import { ProgressStep } from '@interfaces/misc';

/** Health check steps */
export const CONTENT_DOWNLOAD_STEPS: ProgressStep[] = [
    {
        title: 'Getting Player Data',
        subtitle: 'Preparing database for new player data',
        step: 1,
    },
    {
        title: 'Getting Player Data',
        subtitle: 'Grabbing all player data from the server',
        step: 2,
    },
    {
        title: 'Downloading Player Assets',
        subtitle: 'Downloading images, videos, and feeds',
        step: 3,
    },
    {
        title: 'Setting up Programmatic',
        subtitle: 'Downloading programmatic data and contents',
        step: 4,
    },
    {
        title: 'Getting Host Schedule',
        subtitle: 'Assets downloaded! Getting business hours',
        step: 5,
    },
    {
        title: 'All Set!',
        subtitle: 'Playing ads shortly!',
        step: 6,
    },
    {
        title: 'Refetch Started',
        subtitle: 'Redownloading player data and assets',
        step: 7,
    },
];
