
import React, { useState } from 'react';

interface FoodNamePromptProps {
    initialGuess: string;
    onSubmit: (name: string) => void;
    onCancel: () => void;
}

export const FoodNamePrompt: React.FC<FoodNamePromptProps> = ({ initialGuess, onSubmit, onCancel }) => {
    // Attempt to clean up common "unsure" phrases from the AI to provide a better starting point.
    const cleanGuess = initialGuess
        .replace(/I see .*?, and what looks like .*?, but I'm not sure about the exact type of .*?\./i, '')
        .replace(/I'm not sure about the exact type of/i, '')
        .replace(/I see .*?, and what looks like a/i, '')
        .replace(/I see/i, '')
        .replace(/looks like a/i, '')
        .replace(/unclear/i, '')
        .replace(/not sure/i, '')
        .replace(/It appears to be/i, '')
        .replace(/, but I am not certain./i, '')
        .replace(/"/g, '')
        .trim();

    const [foodName, setFoodName] = useState<string>(cleanGuess);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (foodName.trim()) {
            onSubmit(foodName.trim());
        }
    };

    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-2xl shadow-lg animate-fade-in">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">Confirm Food Item</h3>
            <p className="text-sm text-yellow-700 mb-4">
                The AI is not completely sure about this dish. It guessed: <em className="font-semibold">"{initialGuess}"</em>. 
                <br />
                Please confirm or correct the name below for an accurate analysis.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="foodName" className="block text-sm font-medium text-text-light">
                        Correct Food Name
                    </label>
                    <input
                        type="text"
                        id="foodName"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        className="mt-1 block w-full p-2 border border-border-color rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary bg-white text-text-main"
                        required
                        autoFocus
                    />
                </div>
                <div className="flex items-center justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md shadow-sm hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                    >
                        Confirm & Analyze
                    </button>
                </div>
            </form>
        </div>
    );
};
