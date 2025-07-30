
import React, { useState } from 'react';
import type { UserProfile, UserCalculations } from '../types';
import { Gender, ActivityLevel, Goal } from '../types';
import { UserIcon } from './Icons';

interface UserProfileFormProps {
    onSave: (profile: UserProfile) => void;
    initialProfile: UserProfile | null;
    calculations: UserCalculations | null;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSave, initialProfile, calculations }) => {
    const [profile, setProfile] = useState<UserProfile>(initialProfile || {
        age: 25,
        gender: Gender.Female,
        weight: 60,
        height: 165,
        activityLevel: ActivityLevel.LightlyActive,
        goal: Goal.MaintainWeight
    });
    
    const [isEditing, setIsEditing] = useState<boolean>(!initialProfile);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(profile);
        setIsEditing(false);
    };

    const getBmiCategory = (bmi: number) => {
        if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-500' };
        if (bmi < 24.9) return { text: 'Normal', color: 'text-green-500' };
        if (bmi < 29.9) return { text: 'Overweight', color: 'text-yellow-500' };
        return { text: 'Obese', color: 'text-red-500' };
    };

    if (!isEditing && initialProfile && calculations) {
        const bmiInfo = getBmiCategory(calculations.bmi);
        return (
            <div className="bg-bg-main p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Profile</h2>
                        <div className="space-y-3 text-sm text-text-light">
                            <p><strong>Goal:</strong> <span className="font-normal text-brand-dark">{profile.goal}</span></p>
                            <p><strong>BMI:</strong> <span className={`font-bold ${bmiInfo.color}`}>{calculations.bmi} ({bmiInfo.text})</span></p>
                            <p><strong>BMR:</strong> <span className="font-bold text-gray-700">{calculations.bmr.toFixed(0)} kcal</span></p>
                            <p><strong>Daily Calorie Goal:</strong> <span className="font-bold text-brand-secondary text-base">{calculations.tdee.toFixed(0)} kcal</span></p>
                        </div>
                    </div>
                     <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-brand-primary hover:text-brand-dark">Edit</button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-bg-main p-6 rounded-2xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center"><UserIcon className="w-6 h-6 mr-2 text-brand-primary" /> Create Your Profile</h2>
                
                {Object.keys(profile).map((key) => {
                    const field = key as keyof UserProfile;
                    if (field === 'gender' || field === 'activityLevel' || field === 'goal') {
                        const enumType = field === 'gender' ? Gender : field === 'activityLevel' ? ActivityLevel : Goal;
                        return (
                            <div key={field}>
                                <label htmlFor={field} className="block text-sm font-medium text-text-light capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                <select id={field} name={field} value={profile[field]} onChange={handleChange} className="mt-1 block w-full p-2 border border-border-color rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary bg-white text-text-main">
                                    {Object.values(enumType).map(val => <option key={val} value={val}>{val}</option>)}
                                </select>
                            </div>
                        )
                    }
                    return (
                        <div key={field}>
                            <label htmlFor={field} className="block text-sm font-medium text-text-light capitalize">{field}</label>
                            <input type="number" id={field} name={field} value={profile[field]} onChange={handleChange} required min="0" className="mt-1 block w-full p-2 border border-border-color rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary bg-white text-text-main" />
                        </div>
                    )
                })}

                <button type="submit" className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-md">
                    {initialProfile ? 'Update Profile' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};
