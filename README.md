# NutriBuddy AI 🥗🤖

An intelligent nutrition tracking application that uses AI to analyze food from photos and provide personalized dietary advice.

<img width="2272" height="4304" alt="nutribuddy ss" src="https://github.com/user-attachments/assets/500afec8-28ba-4204-b5a1-e3ffd8a19463" />

## Overview

NutriBuddy AI is a modern web application that helps users track their nutrition by simply taking photos of their meals. The app uses Google's Gemini AI to identify foods, calculate nutritional information, and provide personalized recommendations based on user goals and dietary needs.

![NutriBuddy Demo gif](https://github.com/user-attachments/assets/0d65c298-f4c9-4f4a-bec4-df5aff2d9f30)

## Key Features

- **📸 Photo-based Food Recognition**: Upload images of your meals and let AI identify the food items
- **📊 Comprehensive Nutrition Analysis**: Get detailed breakdowns of calories, macronutrients, vitamins, and minerals
- **🎯 Personalized Goals**: Set up your profile with age, gender, activity level, and health goals
- **📈 Interactive Charts**: Visualize your macronutrient distribution with pie charts
- **📱 Meal History**: Track your daily meals with an organized history by date
- **🤖 AI-Powered Advice**: Receive personalized nutrition recommendations based on your intake and goals
- **💾 Local Storage**: Your data is saved locally in your browser

## Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Recharts** - Interactive charts for nutrition visualization
- **React Dropzone** - Drag-and-drop file uploads

### AI & Backend Services
- **Google Gemini AI** - Advanced food recognition and nutrition analysis
- **@google/genai** - Official Google Generative AI SDK

### Build Tools
- **Vite** - Fast build tool and development server
- **ESM** - Modern ES modules

## Getting Started

### Prerequisites
- Node.js (18+ recommended)
- A Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SRV-YouSoRandom/nutribuddy-ai
   cd nutribuddy-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## How It Works

### 1. User Profile Setup
- Enter personal information (age, gender, weight, height)
- Select activity level and health goals
- App calculates BMI, BMR, and daily calorie targets

### 2. Food Recognition Process
- Upload a photo of your meal
- AI analyzes the image to identify food items
- If uncertain, the app prompts for manual confirmation
- Generates detailed nutritional breakdown

### 3. Nutrition Analysis
- Displays comprehensive nutrition facts
- Shows macronutrient distribution in interactive charts
- Breaks down vitamins and minerals

### 4. Personalized Recommendations
- AI advisor analyzes your daily intake
- Compares against your personal goals
- Provides actionable suggestions for future meals

### 5. Progress Tracking
- Meal history organized by date
- Running totals for daily nutrition
- Visual progress indicators

## Project Structure

```
├── components/           # React components
│   ├── UserProfileForm.tsx
│   ├── ImageUploader.tsx
│   ├── NutritionAnalysis.tsx
│   ├── MealHistory.tsx
│   └── AiAdvisor.tsx
├── services/            # External service integrations
│   └── geminiService.ts # Google Gemini AI integration
├── hooks/               # Custom React hooks
│   └── useCalculations.ts
├── types.ts            # TypeScript type definitions
├── constants.ts        # App constants
└── App.tsx            # Main application component
```

## Key Components

- **UserProfileForm**: User information input and BMI/BMR calculations
- **ImageUploader**: Drag-and-drop interface for meal photos
- **NutritionAnalysis**: Detailed nutrition breakdown with charts
- **MealHistory**: Chronological meal tracking
- **AiAdvisor**: Personalized nutrition recommendations

## Data Storage

The app uses browser localStorage to persist:
- User profile information
- Meal history and nutrition data

No data is sent to external servers except for AI analysis of food images.

## Build and Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

This is a vibe-coded application. Feel free to fork and customize it for your needs.

## License

This project is private and for personal/educational use.

---

*Built with ❤️ using React, TypeScript, and Google Gemini AI*
