
import React from 'react';
import type { Meal } from '../types';

interface MealHistoryProps {
    meals: Meal[];
    onClearHistory: () => void;
}

const groupMealsByDate = (meals: Meal[]) => {
    return meals.reduce((acc, meal) => {
        const mealDate = new Date(meal.date);
        // Use a consistent date format key to avoid timezone issues with just the date part
        const dateKey = mealDate.toISOString().split('T')[0];
        
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(meal);
        return acc;
    }, {} as Record<string, Meal[]>);
};


export const MealHistory: React.FC<MealHistoryProps> = ({ meals, onClearHistory }) => {
    if (meals.length === 0) return null;
    
    // Sort meals newest to oldest before grouping
    const sortedMeals = [...meals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const groupedMeals = groupMealsByDate(sortedMeals);

    const getDisplayDate = (dateKey: string) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const todayKey = today.toISOString().split('T')[0];
        const yesterdayKey = yesterday.toISOString().split('T')[0];

        if (dateKey === todayKey) return "Today";
        if (dateKey === yesterdayKey) return "Yesterday";
        
        // Fallback to a readable date format for older entries
        const date = new Date(dateKey);
        // Adjust for timezone offset to show the correct local date
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() + timezoneOffset);

        return localDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-bg-main p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Meal History</h2>
                <button
                    onClick={onClearHistory}
                    className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors px-3 py-1 rounded-md hover:bg-red-50"
                    aria-label="Clear all meal history"
                >
                    Clear All
                </button>
            </div>
            <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {Object.entries(groupedMeals).map(([dateKey, mealsForDate]) => (
                    <li key={dateKey}>
                        <h3 className="text-sm font-semibold text-text-light bg-bg-secondary py-1 px-2 rounded-md my-2 sticky top-0 z-10">
                           {getDisplayDate(dateKey)}
                        </h3>
                        <ul className="space-y-3 pl-2 border-l-2 border-border-color">
                            {mealsForDate.map(meal => (
                                <li key={meal.id} className="flex items-center space-x-4 pt-2">
                                    <img src={meal.imageUrl} alt={meal.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                                    <div className="flex-grow overflow-hidden">
                                        <p className="font-semibold text-gray-700 capitalize truncate" title={meal.name}>{meal.name}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-sm text-text-light">{meal.nutrition.calories.toFixed(0)} kcal</p>
                                            <span className="text-xs font-medium text-white bg-brand-secondary px-2 py-0.5 rounded-full">{meal.type}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};
