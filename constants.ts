
import { ActivityLevel } from './types';

export const ACTIVITY_LEVEL_MULTIPLIERS: Record<ActivityLevel, number> = {
    [ActivityLevel.Sedentary]: 1.2,
    [ActivityLevel.LightlyActive]: 1.375,
    [ActivityLevel.ModeratelyActive]: 1.55,
    [ActivityLevel.VeryActive]: 1.725,
    [ActivityLevel.SuperActive]: 1.9,
};

export const GOAL_ADJUSTMENTS: Record<string, number> = {
    'Lose Weight': -500,
    'Maintain Weight': 0,
    'Gain Weight': 500,
};
