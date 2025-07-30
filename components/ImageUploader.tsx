
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from './Icons';
import { MealType } from '../types';

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
    isLoading: boolean;
    mealType: MealType;
    onMealTypeChange: (type: MealType) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading, mealType, onMealTypeChange }) => {
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        setError(null);
        if (rejectedFiles.length > 0) {
            const firstError = rejectedFiles[0].errors[0];
            if (firstError.code === 'file-too-large') {
                setError('File is too large. Maximum size is 2MB.');
            } else if (firstError.code === 'file-invalid-type') {
                setError('Invalid file type. Please upload a JPG, JPEG, or PNG image.');
            } else {
                setError(firstError.message);
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            onImageUpload(acceptedFiles[0]);
        }
    }, [onImageUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/jpeg': [], 'image/png': [] },
        maxSize: 2 * 1024 * 1024, // 2MB
        multiple: false,
        disabled: isLoading,
    });

    return (
        <div className="bg-bg-main p-6 rounded-2xl shadow-lg space-y-4">
            <div>
                 <label htmlFor="mealType" className="block text-sm font-medium text-text-light">What meal is this?</label>
                 <select 
                    id="mealType" 
                    value={mealType} 
                    onChange={e => onMealTypeChange(e.target.value as MealType)} 
                    disabled={isLoading}
                    className="mt-1 block w-full p-2 border border-border-color rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary bg-white text-text-main"
                >
                     {Object.values(MealType).map(type => <option key={type} value={type}>{type}</option>)}
                 </select>
            </div>
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors duration-300 ${isLoading ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'} ${isDragActive ? 'border-brand-primary bg-brand-light' : 'border-border-color hover:border-brand-secondary'}`}
            >
                <input {...getInputProps()} />
                <UploadIcon className="w-12 h-12 text-gray-400 mb-4" />
                {isDragActive ? (
                    <p className="text-brand-dark font-semibold">Drop the image here ...</p>
                ) : (
                    <p className="text-center text-text-light">
                        <span className="font-semibold text-brand-primary">Click to upload</span> or drag and drop your meal photo
                    </p>
                )}
                <p className="text-xs text-gray-400 mt-2">PNG, JPG, or JPEG (Max 2MB)</p>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
};
