/**
 * LoadingSpinner Component
 * Reusable loading indicator
 */
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({
  size = 'default', // 'small' | 'default' | 'large'
  text = 'ກຳລັງໂຫຼດ...',
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin text-blue-500 ${sizeClasses[size]}`} />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
