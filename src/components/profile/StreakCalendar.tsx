
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Mock data - in a real app, this would come from props or API
const thisWeek = [true, true, false, true, false, true, true];
const lastWeek = [true, true, true, false, false, false, false];

const StreakCalendar: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {DAYS.map((day, index) => (
          <div key={`day-${index}`} className="text-center text-xs text-[#6F8D6A] font-medium">
            {day}
          </div>
        ))}
      </div>
      
      {/* Current Week */}
      <div className="flex justify-between mb-4">
        {thisWeek.map((completed, index) => (
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
        {lastWeek.map((completed, index) => (
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
