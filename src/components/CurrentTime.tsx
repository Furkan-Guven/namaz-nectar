
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

const CurrentTime = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formattedTime = time.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  return (
    <Card className="bg-white/80 border-prayer-sand">
      <CardContent className="p-4 flex items-center justify-center space-x-2">
        <Clock size={20} className="text-prayer-teal/80" />
        <p className="text-xl font-semibold">{formattedTime}</p>
      </CardContent>
    </Card>
  );
};

export default CurrentTime;
