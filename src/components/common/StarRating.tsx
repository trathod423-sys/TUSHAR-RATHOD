import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  showLabel = false,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const labels = ['', 'Poor (1)', 'Fair (2)', 'Average (3)', 'Good (4)', 'Excellent (5)'];
  const activeValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className="flex items-center gap-1"
        role={readOnly ? 'img' : 'radiogroup'}
        aria-label={`Rating: ${value} of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= activeValue;
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => onChange && onChange(star)}
              onMouseEnter={() => !readOnly && setHoverValue(star)}
              onMouseLeave={() => !readOnly && setHoverValue(null)}
              className={`transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded ${
                readOnly
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-110 active:scale-95'
              }`}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                className={`${starSizes[size]} transition-colors duration-150 ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-transparent text-slate-300 dark:text-slate-600'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showLabel && activeValue > 0 && (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 tabular-nums">
          {labels[activeValue]}
        </span>
      )}
    </div>
  );
};
