import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading details...' }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full min-h-[200px]">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.medium} text-brand-600 animate-spin mb-3`} />
      {message && <p className="text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
