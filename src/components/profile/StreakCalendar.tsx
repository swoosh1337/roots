import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface StreakCalendarProps {
  currentWeekActivity: boolean[]; 
  lastWeekActivity: boolean[];    
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({
  currentWeekActivity,
  lastWeekActivity
}) => {
  const displayCurrentWeek = currentWeekActivity.length === 7 ? currentWeekActivity : Array(7).fill(false);
  const displayLastWeek = lastWeekActivity.length === 7 ? lastWeekActivity : Array(7).fill(false);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {DAYS.map((day, index) => (
          <div key={`day-${index}`} className="text-center text-xs text-[#6F8D6A] font-medium w-6">
            {day}
          </div>
        ))}
      </div>
      
      {/* Current Week */}
      <div className="flex justify-between mb-4">
        {displayCurrentWeek.map((completed, index) => (
          <TooltipProvider key={`this-week-${index}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    completed ? 'bg-ritual-green' : 'bg-ritual-moss/30'
                  }`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{completed ? 'Completed' : 'Missed'} on {DAYS[index]}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Last Week */}
      <div className="flex justify-between">
        {displayLastWeek.map((completed, index) => (
          <TooltipProvider key={`last-week-${index}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    completed ? 'bg-ritual-green' : 'bg-ritual-moss/30'
                  }`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{completed ? 'Completed' : 'Missed'} on {DAYS[index]} (last week)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default StreakCalendar;
