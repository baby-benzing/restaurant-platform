import React from 'react';
import { cn } from '../../utils/cn';

export interface HoursData {
  dayOfWeek: string;
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
  special?: string; // e.g., "Brunch", "Dinner only", "Happy Hour 4-6pm"
}

export interface HoursDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  hours: HoursData[];
  variant?: 'default' | 'compact' | 'detailed' | 'inline';
  showCurrentStatus?: boolean;
  groupByService?: boolean; // Group by service type (e.g., Lunch, Dinner)
  highlightToday?: boolean;
  format24Hour?: boolean;
  timezone?: string;
  specialHours?: Array<{
    date: string;
    description: string;
    hours?: Partial<HoursData>;
  }>;
}

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const formatTime = (time: string, format24Hour: boolean = false): string => {
  if (!time) return '';
  
  if (format24Hour) return time;
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const getCurrentDay = (): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

const isCurrentlyOpen = (hours: HoursData, currentTime: Date = new Date()): boolean => {
  if (hours.isClosed) return false;
  if (!hours.openTime || !hours.closeTime) return false;
  
  const [openHour, openMin] = hours.openTime.split(':').map(Number);
  const [closeHour, closeMin] = hours.closeTime.split(':').map(Number);
  
  const currentHour = currentTime.getHours();
  const currentMin = currentTime.getMinutes();
  const currentTotalMin = currentHour * 60 + currentMin;
  
  const openTotalMin = openHour * 60 + openMin;
  let closeTotalMin = closeHour * 60 + closeMin;
  
  // Handle closing time after midnight
  if (closeTotalMin < openTotalMin) {
    closeTotalMin += 24 * 60;
    if (currentTotalMin < openTotalMin) {
      return currentTotalMin < closeTotalMin;
    }
  }
  
  return currentTotalMin >= openTotalMin && currentTotalMin < closeTotalMin;
};

export const HoursDisplay = React.forwardRef<HTMLDivElement, HoursDisplayProps>(
  ({
    hours,
    variant = 'default',
    showCurrentStatus = true,
    groupByService = false,
    highlightToday = true,
    format24Hour = false,
    timezone,
    specialHours,
    className,
    ...props
  }, ref) => {
    const today = getCurrentDay();
    const todayHours = hours.find(h => h.dayOfWeek === today);
    const isOpen = todayHours ? isCurrentlyOpen(todayHours) : false;
    
    // Sort hours by day order
    const sortedHours = [...hours].sort((a, b) => {
      return DAYS_ORDER.indexOf(a.dayOfWeek) - DAYS_ORDER.indexOf(b.dayOfWeek);
    });
    
    // Group consecutive days with same hours
    const groupedHours = variant === 'compact' ? (() => {
      const groups: Array<{ days: string[]; hours: HoursData }> = [];
      
      sortedHours.forEach((hour) => {
        const lastGroup = groups[groups.length - 1];
        if (
          lastGroup &&
          lastGroup.hours.openTime === hour.openTime &&
          lastGroup.hours.closeTime === hour.closeTime &&
          lastGroup.hours.isClosed === hour.isClosed
        ) {
          lastGroup.days.push(hour.dayOfWeek);
        } else {
          groups.push({ days: [hour.dayOfWeek], hours: hour });
        }
      });
      
      return groups;
    })() : null;
    
    const formatDayRange = (days: string[]): string => {
      if (days.length === 1) return days[0];
      if (days.length === 2) return `${days[0]} & ${days[1]}`;
      
      const firstDay = days[0];
      const lastDay = days[days.length - 1];
      const firstIndex = DAYS_ORDER.indexOf(firstDay);
      const lastIndex = DAYS_ORDER.indexOf(lastDay);
      
      // Check if consecutive
      const expectedDays = DAYS_ORDER.slice(firstIndex, lastIndex + 1);
      if (JSON.stringify(days) === JSON.stringify(expectedDays)) {
        return `${firstDay} - ${lastDay}`;
      }
      
      return days.join(', ');
    };
    
    if (variant === 'inline') {
      return (
        <div ref={ref} className={cn('hours-inline', className)} {...props}>
          <span className="font-medium">Hours: </span>
          {todayHours ? (
            todayHours.isClosed ? (
              <span className="text-red-600">Closed Today</span>
            ) : (
              <>
                <span>{formatTime(todayHours.openTime!, format24Hour)} - {formatTime(todayHours.closeTime!, format24Hour)}</span>
                {showCurrentStatus && (
                  <span className={cn('ml-2 font-semibold', isOpen ? 'text-green-600' : 'text-red-600')}>
                    ({isOpen ? 'Open Now' : 'Closed'})
                  </span>
                )}
              </>
            )
          ) : (
            <span className="text-gray-500">Hours not available</span>
          )}
        </div>
      );
    }
    
    return (
      <div
        ref={ref}
        className={cn('hours-display', className)}
        {...props}
      >
        {showCurrentStatus && todayHours && (
          <div className={cn(
            'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4',
            isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          )}>
            <span className={cn('w-2 h-2 rounded-full', isOpen ? 'bg-green-600' : 'bg-red-600')} />
            {isOpen ? 'Open Now' : 'Closed Now'}
          </div>
        )}
        
        {variant === 'compact' && groupedHours ? (
          <div className="space-y-1">
            {groupedHours.map((group, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-medium">{formatDayRange(group.days)}</span>
                <span className="text-gray-600">
                  {group.hours.isClosed ? (
                    'Closed'
                  ) : (
                    <>
                      {formatTime(group.hours.openTime!, format24Hour)} - {formatTime(group.hours.closeTime!, format24Hour)}
                      {group.hours.special && (
                        <span className="ml-2 text-sm text-gray-500">({group.hours.special})</span>
                      )}
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn({
            'space-y-2': variant === 'default',
            'table w-full': variant === 'detailed',
          })}>
            {sortedHours.map((hour) => {
              const isToday = highlightToday && hour.dayOfWeek === today;
              
              return (
                <div
                  key={hour.dayOfWeek}
                  className={cn(
                    'flex justify-between',
                    {
                      'font-semibold bg-yellow-50 px-2 py-1 rounded': isToday,
                      'border-b pb-2': variant === 'detailed',
                    }
                  )}
                >
                  <span className={cn('flex-shrink-0', { 'w-32': variant === 'detailed' })}>
                    {hour.dayOfWeek}
                    {isToday && <span className="ml-2 text-xs text-gray-500">(Today)</span>}
                  </span>
                  <span className={cn('text-right', { 'text-gray-600': !isToday })}>
                    {hour.isClosed ? (
                      <span className="text-red-600">Closed</span>
                    ) : (
                      <>
                        {formatTime(hour.openTime!, format24Hour)} - {formatTime(hour.closeTime!, format24Hour)}
                        {hour.special && (
                          <span className="block text-sm text-gray-500 mt-1">{hour.special}</span>
                        )}
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        
        {specialHours && specialHours.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Special Hours</h4>
            <div className="space-y-1 text-sm">
              {specialHours.map((special, index) => (
                <div key={index}>
                  <span className="font-medium">{special.date}:</span>
                  <span className="ml-2">{special.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {timezone && (
          <div className="mt-2 text-xs text-gray-500">
            All times in {timezone}
          </div>
        )}
      </div>
    );
  }
);

HoursDisplay.displayName = 'HoursDisplay';

export default HoursDisplay;