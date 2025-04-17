
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, subDays, isWithinInterval } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StreakTrackerProps {
  lastCompletedDate: string | null;
  streakCount: number;
  days?: number;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ 
  lastCompletedDate, 
  streakCount, 
  days = 7 
}) => {
  const [completedDays, setCompletedDays] = useState<boolean[]>([]);
  const [dayLabels, setDayLabels] = useState<string[]>([]);
  
  useEffect(() => {
    const today = new Date();
    const daysArray: boolean[] = [];
    const labelsArray: string[] = [];
    
    // Generate array of last N days
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dayLabel = format(date, 'EEE'); // Mon, Tue, etc.
      const dayFormatted = format(date, 'yyyy-MM-dd');
      labelsArray.push(dayLabel);
      
      // If lastCompletedDate exists, check if this day was part of the streak
      if (lastCompletedDate) {
        const lastCompleted = parseISO(lastCompletedDate);
        
        // Backfill logic: if the day is between (today - streakCount) and lastCompleted, mark as completed
        const streakStartDate = subDays(lastCompleted, streakCount - 1);
        
        daysArray.push(
          isWithinInterval(date, { 
            start: streakStartDate, 
            end: lastCompleted 
          })
        );
      } else {
        daysArray.push(false);
      }
    }
    
    setCompletedDays(daysArray);
    setDayLabels(labelsArray);
  }, [lastCompletedDate, streakCount, days]);

  return (
    <div className="flex items-center justify-start space-x-1 mt-1">
      {completedDays.map((completed, index) => (
        <TooltipProvider key={index} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div 
                className={`w-4 h-4 rounded-full ${
                  completed 
                    ? 'bg-ritual-green' 
                    : 'bg-gray-200'
                }`}
                initial={completed ? { scale: 0.8 } : {}}
                animate={completed ? { scale: 1 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                aria-label={`${completed ? 'Completed' : 'Not completed'} on ${dayLabels[index]}`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{completed ? 'Completed' : 'Not completed'} on {dayLabels[index]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default StreakTracker;
