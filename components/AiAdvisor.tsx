
import React from 'react';
import { BotIcon } from './Icons';
import { Spinner } from './Spinner';

interface AiAdvisorProps {
    advice: string;
    isLoading: boolean;
}

const formatAdvice = (text: string): string => {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-brand-dark">$1</strong>')
        .replace(/\n/g, '<br />');
};

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ advice, isLoading }) => {
    if (isLoading) {
        return (
             <div className="bg-bg-main p-6 rounded-2xl shadow-lg flex items-center justify-center">
                <Spinner />
                <p className="ml-4 text-text-light">Generating new advice...</p>
            </div>
        )
    }

    if (!advice) return null;

    return (
        <div className="bg-brand-light p-6 rounded-2xl shadow-lg border-l-4 border-brand-primary">
            <div className="flex items-start space-x-4">
                <BotIcon className="w-8 h-8 text-brand-dark flex-shrink-0 mt-1" />
                <div>
                    <h3 className="text-xl font-bold text-brand-dark mb-2">Your AI-Powered Advisor</h3>
                    <div 
                        className="text-text-main space-y-2" 
                        dangerouslySetInnerHTML={{ __html: formatAdvice(advice) }}>
                    </div>
                </div>
            </div>
        </div>
    );
};
