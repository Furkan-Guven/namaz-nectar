
import { Clock } from "lucide-react";
import { PrayerName, PrayerLabels, getTimeRemaining } from "@/utils/prayerUtils";
import { cn } from "@/lib/utils";

interface PrayerTimeCardProps {
  name: PrayerName;
  time: string;
  isActive: boolean;
  isNext: boolean;
}

const PrayerTimeCard = ({ name, time, isActive, isNext }: PrayerTimeCardProps) => {
  const prayerLabel = PrayerLabels[name];
  const timeRemaining = isNext ? getTimeRemaining(time) : null;
  
  return (
    <div className={cn(
      "prayer-card", 
      isActive && "prayer-active animate-pulse-soft",
      isNext && "next-prayer"
    )}>
      <div className="flex flex-col items-center justify-center space-y-2">
        <h3 className="text-lg font-semibold">{prayerLabel}</h3>
        <span className="text-2xl font-bold">{time}</span>
        
        {isNext && (
          <div className="mt-2 flex items-center text-sm text-prayer-teal/80">
            <Clock size={14} className="mr-1" />
            <span>Kalan: {timeRemaining}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerTimeCard;
