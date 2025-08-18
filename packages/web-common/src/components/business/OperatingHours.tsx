import React from 'react';
import { cn } from '../../utils/cn';
import { formatTime, getDayName, getDayAbbreviation } from '../../utils/formatters';

export interface HoursData {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface OperatingHoursProps extends React.HTMLAttributes<HTMLDivElement> {
  hours: HoursData[];
  title?: string;
  showToday?: boolean;
  compact?: boolean;
  groupSimilar?: boolean;
}

export const OperatingHours = React.forwardRef<HTMLDivElement, OperatingHoursProps>(
  ({ 
    hours, 
    title,
    showToday = false,
    compact = false,
    groupSimilar = false,
    className, 
    ...props 
  }, ref) => {
    const today = showToday ? new Date().getDay() : -1;

    if (hours.length === 0) {
      return (
        <div ref={ref} className={cn('text-neutral-500 italic', className)} {...props}>
          Hours not available
        </div>
      );
    }

    const renderHours = () => {
      if (groupSimilar) {
        return renderGroupedHours();
      }
      return renderRegularHours();
    };

    const renderRegularHours = () => {
      return hours.map((hour) => {
        const dayName = compact ? getDayAbbreviation(hour.dayOfWeek) : getDayName(hour.dayOfWeek);
        const isToday = hour.dayOfWeek === today;

        return (
          <div
            key={hour.dayOfWeek}
            className={cn(
              'flex justify-between gap-4 py-1',
              isToday && 'font-semibold text-primary-600'
            )}
          >
            <span className="text-neutral-900">{dayName}</span>
            <span className="text-neutral-700">
              {hour.isClosed 
                ? 'Closed' 
                : `${formatTime(hour.openTime)} - ${formatTime(hour.closeTime)}`
              }
            </span>
          </div>
        );
      });
    };

    const renderGroupedHours = () => {
      const groups: Array<{ days: number[]; hours: string }> = [];
      
      hours.forEach((hour) => {
        const hoursString = hour.isClosed 
          ? 'Closed' 
          : `${formatTime(hour.openTime)} - ${formatTime(hour.closeTime)}`;
        
        const lastGroup = groups[groups.length - 1];
        
        if (lastGroup && lastGroup.hours === hoursString) {
          lastGroup.days.push(hour.dayOfWeek);
        } else {
          groups.push({ days: [hour.dayOfWeek], hours: hoursString });
        }
      });

      return groups.map((group, index) => {
        const firstDay = getDayName(group.days[0]);
        const lastDay = group.days.length > 1 
          ? getDayName(group.days[group.days.length - 1])
          : null;
        
        const dayRange = lastDay ? `${firstDay} - ${lastDay}` : firstDay;
        const hasToday = group.days.includes(today);

        return (
          <div
            key={index}
            className={cn(
              'flex justify-between gap-4 py-1',
              hasToday && 'font-semibold text-primary-600'
            )}
          >
            <span className="text-neutral-900">{dayRange}</span>
            <span className="text-neutral-700">{group.hours}</span>
          </div>
        );
      });
    };

    return (
      <div ref={ref} className={cn('space-y-1', className)} {...props}>
        {title && (
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {title}
          </h3>
        )}
        {renderHours()}
      </div>
    );
  }
);

OperatingHours.displayName = 'OperatingHours';