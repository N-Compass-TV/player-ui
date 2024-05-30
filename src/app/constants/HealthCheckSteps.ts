import { ProgressStep } from '@interfaces/misc';

/** Health check steps */
export const HEALTH_CHECK_STEPS: ProgressStep[] = [
    {
        title: '',
        subtitle: 'Checking database health',
        step: 1,
    },
    {
        title: '',
        subtitle: 'Making sure files are in place',
        step: 2,
    },
    {
        title: '',
        subtitle: 'Checking internet speed',
        step: 3,
    },
    {
        title: '',
        subtitle: 'Looking for available software updates',
        step: 4,
    },
    {
        title: '',
        subtitle: 'Checking saved license key',
        step: 5,
    },
    {
        title: 'Player is healthy!',
        subtitle: 'Preparing ads and schedules',
        step: 6,
    },
];
