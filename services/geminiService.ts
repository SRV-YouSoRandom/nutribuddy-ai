
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { UserProfile, Meal, NutritionInfo, UserCalculations } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const foodIdentificationSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A short, concise title for the entire meal (e.g., 'Indian Thali with Dal and Okra')." },
        description: { type: Type.STRING, description: "A detailed breakdown of the identified food items, formatted as a markdown list starting with asterisks. (e.g., '* **Dahi (Yogurt):** A small bowl of plain yogurt.')" }
    },
    required: ['title', 'description']
};


export const identifyFoodFromImage = async (file: File): Promise<{title: string, description: string}> => {
    const imagePart = await fileToGenerativePart(file);
    const prompt = `
    Analyze the food in this image with high accuracy, being specific about regional dishes like Indian curries.
    Your response MUST be a JSON object that conforms to the provided schema.

    The JSON object should have two keys: "title" and "description".
    - "title": A short, descriptive name for the meal.
    - "description": A markdown formatted string listing each identified component. Each item should start with an asterisk (*).

    Example of a confident response:
    {
      "title": "Indian Thali with Roti, Dal, and Bhindi Sabzi",
      "description": "* **Roti/Chapati:** Flat Indian bread. * **Dal:** A yellow lentil curry. * **Bhindi Sabzi:** A stir-fry made with okra. * **Dahi:** A side of plain yogurt."
    }

    If you are NOT confident about the main dish, the title MUST be "Uncertain Food". The description should then explain what you can see and why you are uncertain.
    Example of an uncertain response:
    {
       "title": "Uncertain Food",
       "description": "I can identify rice and what appears to be a form of flatbread, but I am not sure about the specific type of curry. It seems to be a thick, orange-colored gravy but its main ingredients are not visually clear."
    }
    `;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: foodIdentificationSchema
        }
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse food identification JSON:", jsonText);
        throw new Error("The AI returned an invalid format for food identification.");
    }
};


const nutritionSchema = {
    type: Type.OBJECT,
    properties: {
        calories: { type: Type.NUMBER, description: "Total calories in kcal." },
        protein: { type: Type.NUMBER, description: "Total protein in grams." },
        carbohydrates: {
            type: Type.OBJECT,
            properties: {
                total: { type: Type.NUMBER, description: "Total carbohydrates in grams." },
                fiber: { type: Type.NUMBER, description: "Dietary fiber in grams." },
                sugar: { type: Type.NUMBER, description: "Total sugar in grams." },
            },
            required: ['total', 'fiber', 'sugar']
        },
        fat: {
            type: Type.OBJECT,
            properties: {
                total: { type: Type.NUMBER, description: "Total fat in grams." },
                saturated: { type: Type.NUMBER, description: "Saturated fat in grams." },
            },
            required: ['total', 'saturated']
        },
        vitamins: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    amount: { type: Type.NUMBER },
                    unit: { type: Type.STRING }
                },
                required: ['name', 'amount', 'unit']
            }
        },
        minerals: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    amount: { type: Type.NUMBER },
                    unit: { type: Type.STRING }
                },
                required: ['name', 'amount', 'unit']
            }
        }
    },
    required: ['calories', 'protein', 'carbohydrates', 'fat', 'vitamins', 'minerals']
};


export const getNutritionalInfo = async (foodName: string): Promise<NutritionInfo> => {
    const prompt = `Provide a detailed nutritional analysis for a standard serving size of the following meal: "${foodName}". This name may represent a meal with multiple components; provide an aggregate nutritional breakdown.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: nutritionSchema
        }
    });
    
    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse nutrition JSON:", jsonText);
        throw new Error("The AI returned an invalid nutritional format.");
    }
};

export const getAIAdvice = async (profile: UserProfile, meals: Meal[], calculations: UserCalculations | null): Promise<string> => {
    if (!calculations) return "Cannot generate advice without user profile calculations.";

    const totalIntake = meals.reduce((acc, meal) => {
        acc.calories += meal.nutrition.calories;
        acc.protein += meal.nutrition.protein;
        acc.carbs += meal.nutrition.carbohydrates.total;
        acc.fat += meal.nutrition.fat.total;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const prompt = `
    Based on the following user profile and their daily food intake, provide actionable, encouraging, and concise advice.

    **User Profile:**
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Goal: ${profile.goal}
    - Daily Calorie Target: ${calculations.tdee.toFixed(0)} kcal

    **Today's Food Intake:**
    - Meals: ${meals.map(m => `${m.name} (${m.type})`).join(', ')}
    - Total Calories Consumed: ${totalIntake.calories.toFixed(0)} kcal
    - Total Protein: ${totalIntake.protein.toFixed(1)} g
    - Total Carbohydrates: ${totalIntake.carbs.toFixed(1)} g
    - Total Fat: ${totalIntake.fat.toFixed(1)} g

    **Task:**
    1. Briefly comment on the user's progress towards their daily calorie goal.
    2. Analyze the macronutrient balance. Is it aligned with their goal (e.g., higher protein for muscle gain, balanced for maintenance)?
    3. Provide 1-2 simple, actionable suggestions for their next meal or for tomorrow. For example, if protein is low, suggest a protein source. If they are over their calorie limit, suggest a lighter meal option.
    4. Keep the tone positive and motivational. Address the user directly. Use markdown for formatting, for example **bold** for emphasis.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    
    return response.text;
};
