
import React, { useState, useCallback, useEffect } from 'react';
import { UserProfileForm } from './components/UserProfileForm';
import { ImageUploader } from './components/ImageUploader';
import { NutritionAnalysis } from './components/NutritionAnalysis';
import { MealHistory } from './components/MealHistory';
import { AiAdvisor } from './components/AiAdvisor';
import { Spinner } from './components/Spinner';
import { FoodNamePrompt } from './components/FoodNamePrompt';
import { LogoIcon } from './components/Icons';
import { identifyFoodFromImage, getNutritionalInfo, getAIAdvice } from './services/geminiService';
import type { UserProfile, Meal, MealType } from './types';
import { useCalculations } from './hooks/useCalculations';

const MEALS_STORAGE_KEY = 'nutrivision-meals';
const USER_PROFILE_STORAGE_KEY = 'nutrivision-user-profile';

const App: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
        try {
            const storedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
            return storedProfile ? JSON.parse(storedProfile) : null;
        } catch (error) {
            console.error("Could not load user profile from local storage", error);
            return null;
        }
    });

    const [meals, setMeals] = useState<Meal[]>(() => {
        try {
            const storedMeals = localStorage.getItem(MEALS_STORAGE_KEY);
            return storedMeals ? JSON.parse(storedMeals) : [];
        } catch (error) {
            console.error("Could not load meals from local storage", error);
            return [];
        }
    });

    const [currentAnalysis, setCurrentAnalysis] = useState<Meal | null>(null);
    const [aiAdvice, setAiAdvice] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [isFetchingAdvice, setIsFetchingAdvice] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [awaitingFoodNameFor, setAwaitingFoodNameFor] = useState<{file: File, description: string} | null>(null);
    const [selectedMealType, setSelectedMealType] = useState<MealType>('Lunch' as MealType);

    const { calculations } = useCalculations(userProfile);

    // Save profile to localStorage whenever it changes
    useEffect(() => {
        try {
            if (userProfile) {
                localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
            } else {
                localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Could not save user profile to local storage", error);
        }
    }, [userProfile]);

    // Save meals to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(meals));
        } catch (error) {
            console.error("Could not save meals to local storage", error);
        }
    }, [meals]);

    const handleProfileSave = (profile: UserProfile) => {
        setUserProfile(profile);
    };

    const handleClearHistory = () => {
        if (window.confirm("Are you sure you want to clear your entire meal history? This action cannot be undone.")) {
            setMeals([]);
            setCurrentAnalysis(null);
            setAiAdvice('');
            // By only updating the state, we let the `useEffect` hook for `meals` handle
            // the persistence to localStorage. This avoids race conditions and is the correct
            // React pattern for managing state that has side effects.
        }
    };

    const processFood = async (title: string, description: string, file: File) => {
        setAwaitingFoodNameFor(null);
        setIsAnalyzing(true);
        setError(null);
        setCurrentAnalysis(null);
        try {
            const nutritionInfo = await getNutritionalInfo(title);
            const newMeal: Meal = {
                id: Date.now(),
                name: title,
                description: description,
                imageUrl: URL.createObjectURL(file),
                nutrition: nutritionInfo,
                type: selectedMealType,
                date: new Date().toISOString(),
            };
            setCurrentAnalysis(newMeal);
            setMeals(prevMeals => [...prevMeals, newMeal]);
        } catch (e) {
            console.error(e);
            setError('Failed to get nutritional info. Please try again with a clearer name.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        setIsAnalyzing(true);
        setError(null);
        setCurrentAnalysis(null);
        setAwaitingFoodNameFor(null);
        try {
            const { title, description } = await identifyFoodFromImage(file);
            if (title.toLowerCase().includes("uncertain")) {
                 setAwaitingFoodNameFor({ file, description });
                 setIsAnalyzing(false);
                 return;
            }
            await processFood(title, description, file);
        } catch (e) {
            console.error(e);
            setError('Failed to identify the food from the image. Please try again.');
            setIsAnalyzing(false);
        }
    };
    
    const fetchAdvice = useCallback(async () => {
        if (!userProfile || meals.length === 0) return;

        setIsFetchingAdvice(true);
        try {
            const advice = await getAIAdvice(userProfile, meals, calculations);
            setAiAdvice(advice);
        } catch (e) {
            console.error(e);
            // Do not show an error to the user for this, as the app is still usable.
        } finally {
            setIsFetchingAdvice(false);
        }
    }, [userProfile, meals, calculations]);

    useEffect(() => {
        if (meals.length > 0 && userProfile) {
            const timer = setTimeout(() => {
                fetchAdvice();
            }, 1000); // Debounce advice fetching to allow UI to settle
            return () => clearTimeout(timer);
        }
    }, [meals, fetchAdvice, userProfile]);

    return (
        <div className="min-h-screen bg-bg-secondary text-text-main font-sans">
            <header className="bg-bg-main shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <LogoIcon className="h-10 w-10 text-brand-primary" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">NutriVision AI</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column */}
                    <aside className="lg:col-span-4 xl:col-span-3 space-y-8">
                        <UserProfileForm onSave={handleProfileSave} initialProfile={userProfile} calculations={calculations} />
                        <MealHistory meals={meals} onClearHistory={handleClearHistory} />
                    </aside>

                    {/* Center Column */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-8">
                         {!userProfile ? (
                            <div className="bg-bg-main p-8 rounded-2xl shadow-lg text-center">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to NutriVision AI</h2>
                                <p className="text-text-light">Please fill out your profile to get started. Your personal data helps us calculate your nutritional needs and provide tailored advice.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <ImageUploader 
                                    onImageUpload={handleImageUpload} 
                                    isLoading={isAnalyzing}
                                    mealType={selectedMealType}
                                    onMealTypeChange={setSelectedMealType}
                                />
                                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p>{error}</p></div>}
                                
                                {awaitingFoodNameFor && (
                                    <FoodNamePrompt 
                                        initialGuess={awaitingFoodNameFor.description}
                                        onSubmit={(name) => processFood(name, awaitingFoodNameFor.description, awaitingFoodNameFor.file)}
                                        onCancel={() => { setAwaitingFoodNameFor(null); setError(null); }}
                                    />
                                )}

                                {isAnalyzing && !awaitingFoodNameFor && (
                                    <div className="flex flex-col items-center justify-center bg-bg-main p-8 rounded-2xl shadow-lg">
                                        <Spinner />
                                        <p className="mt-4 text-text-light animate-pulse">Analyzing your meal...</p>
                                    </div>
                                )}
                                {currentAnalysis && <NutritionAnalysis meal={currentAnalysis} />}
                                {(aiAdvice || isFetchingAdvice) && <AiAdvisor advice={aiAdvice} isLoading={isFetchingAdvice} />}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;