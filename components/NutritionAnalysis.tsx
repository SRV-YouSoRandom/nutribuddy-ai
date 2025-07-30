
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Meal, Nutrient } from '../types';

interface NutritionAnalysisProps {
    meal: Meal;
}

const COLORS = {
    carbs: '#f97316',   // orange-500
    fat: '#eab308',     // yellow-500
    protein: '#3b82f6'  // blue-500
};

const formatDescription = (text: string): string => {
    if (!text) return '';
    
    // Process bolded titles first, e.g., **Dahi (Yogurt):**
    let html = text.replace(/\*\*(.*?):\*\*/g, '<strong>$1:</strong>');

    // Split into list items based on the asterisk marker
    const listItems = html.split('* ').filter(item => item.trim() !== '');

    if (listItems.length > 0) {
        // If it's a list, wrap it in <ul>
        return '<ul class="list-disc list-inside space-y-2 text-text-light">' + listItems.map(item => `<li>${item.trim()}</li>`).join('') + '</ul>';
    } else {
        // Otherwise, just format any remaining bold text and handle newlines
        return html
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');
    }
};


const renderMacroNutrientChart = (meal: Meal) => {
    const { protein, carbohydrates, fat } = meal.nutrition;
    const totalMacros = protein + carbohydrates.total + fat.total;
    if (totalMacros === 0) return null;
    
    const data = [
        { name: 'Carbs', value: carbohydrates.total },
        { name: 'Fat', value: fat.total },
        { name: 'Protein', value: protein }
    ];

    const chartColors = [COLORS.carbs, COLORS.fat, COLORS.protein];

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}g`} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}

const NutrientTable: React.FC<{ title: string; nutrients: Nutrient[] }> = ({ title, nutrients }) => (
    <div>
        <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
        <div className="overflow-x-auto">
             <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 py-2">Nutrient</th>
                        <th scope="col" className="px-4 py-2 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {nutrients.map((v, i) => (
                        <tr key={i} className="bg-white border-b">
                            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{v.name}</td>
                            <td className="px-4 py-2 text-right">{v.amount ? `${v.amount} ${v.unit}`: '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


export const NutritionAnalysis: React.FC<NutritionAnalysisProps> = ({ meal }) => {
    const { nutrition, name, imageUrl, description } = meal;

    return (
        <div className="bg-bg-main p-6 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">{name}</h2>
            
            {description && (
                <div className="mb-6 pb-6 border-b border-border-color">
                    <h3 className="text-lg font-bold text-gray-700 mb-3">Meal Components</h3>
                    <div dangerouslySetInnerHTML={{ __html: formatDescription(description) }} />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <img src={imageUrl} alt={name} className="rounded-lg object-cover w-full h-48 md:h-full shadow-md" />
                </div>
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-brand-light p-4 rounded-lg text-center">
                        <p className="text-sm text-brand-dark font-semibold">Calories</p>
                        <p className="text-4xl font-bold text-brand-secondary">{nutrition.calories.toFixed(0)}</p>
                        <p className="text-sm text-gray-500">kcal</p>
                    </div>
                     <div className="col-span-1 sm:col-span-2">
                        <h3 className="text-lg font-bold text-gray-700 mb-2">Macronutrients</h3>
                        {renderMacroNutrientChart(meal)}
                    </div>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <NutrientTable title="Vitamins" nutrients={nutrition.vitamins} />
                <NutrientTable title="Minerals" nutrients={nutrition.minerals} />
            </div>
        </div>
    );
};
