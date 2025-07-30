
export enum Gender {
    Male = 'Male',
    Female = 'Female',
}

export enum ActivityLevel {
    Sedentary = 'Sedentary (little or no exercise)',
    LightlyActive = 'Lightly Active (light exercise/sports 1-3 days/week)',
    ModeratelyActive = 'Moderately Active (moderate exercise/sports 3-5 days/week)',
    VeryActive = 'Very Active (hard exercise/sports 6-7 days a week)',
    SuperActive = 'Super Active (very hard exercise/physical job & exercise)',
}

export enum Goal {
    LoseWeight = 'Lose Weight',
    MaintainWeight = 'Maintain Weight',
    GainWeight = 'Gain Weight',
}

export enum MealType {
    Breakfast = 'Breakfast',
    Lunch = 'Lunch',
    Dinner = 'Dinner',
    Snack = 'Snack',
}

export interface UserProfile {
    age: number;
    gender: Gender;
    weight: number;
    height: number;
    activityLevel: ActivityLevel;
    goal: Goal;
}

export interface Nutrient {
    name: string;
    amount: number;
    unit: string;
}

export interface NutritionInfo {
    calories: number;
    protein: number;
    carbohydrates: {
        total: number;
        fiber: number;
        sugar: number;
    };
    fat: {
        total: number;
        saturated: number;
    };
    vitamins: Nutrient[];
    minerals: Nutrient[];
}

export interface Meal {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    nutrition: NutritionInfo;
    type: MealType;
    date: string;
}

export interface UserCalculations {
    bmi: number;
    bmr: number;
    tdee: number;
}
