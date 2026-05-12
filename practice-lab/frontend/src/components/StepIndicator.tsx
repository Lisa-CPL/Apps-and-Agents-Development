import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
          Progress
        </span>
        <span className="text-[10px] text-gray-500 font-bold">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
              i + 1 <= currentStep ? 'bg-cpl-blue' : 'bg-cpl-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
