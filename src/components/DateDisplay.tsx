
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface DateDisplayProps {
  hijriDate?: string;
  gregorianDate?: string;
  cityName?: string;
}

const DateDisplay = ({ hijriDate, gregorianDate, cityName }: DateDisplayProps) => {
  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <Card className="bg-white/80 border-prayer-sand">
      <CardContent className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-1">{cityName || "Şehir"}</h3>
        
        <Separator className="my-2 bg-prayer-sand/50" />
        
        <div className="flex flex-col space-y-0.5 text-sm">
          <p className="text-prayer-teal/80">{today}</p>
          {hijriDate && (
            <p className="text-prayer-gold font-['Amiri'] text-base">{hijriDate}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DateDisplay;
