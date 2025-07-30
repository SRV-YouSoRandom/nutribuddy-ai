
import { useMemo } from 'react';
import type { UserProfile, UserCalculations } from '../types';
import { Gender, ActivityLevel, Goal } from '../types';
import { ACTIVITY_LEVEL_MULTIPLIERS, GOAL_ADJUSTMENTS } from '../constants';

export const useCalculations = (profile: UserProfile | null): { calculations: UserCalculations | null } => {
    const calculations = useMemo<UserCalculations | null>(() => {
        if (!profile) return null;

        const { weight, height, age, gender, activityLevel, goal } = profile;

        if (!weight || !height || !age) return null;

        const heightInMeters = height / 100;
        const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));

        let bmr: number;
        if (gender === Gender.Male) {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        bmr = parseFloat(bmr.toFixed(2));

        const tdee = parseFloat((bmr * ACTIVITY_LEVEL_MULTIPLIERS[activityLevel]).toFixed(2));
        
        const goalAdjustedTdee = tdee + (GOAL_ADJUSTMENTS[goal] || 0);

        return { bmi, bmr, tdee: goalAdjustedTdee };
    }, [profile]);

    return { calculations };
};
