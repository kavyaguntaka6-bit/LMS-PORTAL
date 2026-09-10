import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { clsx } from 'clsx';

export interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewsCount?: number;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 'sm',
  showNumber = true,
  reviewsCount,
  className
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const stars = [];
  for (let i = 1; i <= max; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<Star key={i} className={clsx(iconSizes[size], 'fill-amber-400 text-amber-400')} />);
    } else if (i - 0.5 <= rating) {
      stars.push(<StarHalf key={i} className={clsx(iconSizes[size], 'fill-amber-400 text-amber-400')} />);
    } else {
      stars.push(<Star key={i} className={clsx(iconSizes[size], 'text-slate-200 dark:text-slate-700 fill-slate-100 dark:fill-slate-800')} />);
    }
  }

  return (
    <div className={clsx('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">{stars}</div>
      {showNumber && (
        <span className="text-xs font-bold text-[#11184A] dark:text-white">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewsCount !== undefined && (
        <span className="text-xs text-slate-500 dark:text-slate-400">({reviewsCount.toLocaleString()})</span>
      )}
    </div>
  );
};
