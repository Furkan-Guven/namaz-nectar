import { PrayerTimes } from "../services/prayerApi";

export type PrayerName = "imsak" | "gunes" | "ogle" | "ikindi" | "aksam" | "yatsi";

export const PrayerLabels: Record<PrayerName, string> = {
  imsak: "İmsak",
  gunes: "Güneş",
  ogle: "Öğle",
  ikindi: "İkindi",
  aksam: "Akşam",
  yatsi: "Yatsı"
};

export const PrayerOrder: PrayerName[] = ["imsak", "gunes", "ogle", "ikindi", "aksam", "yatsi"];

export const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const getCurrentPrayer = (prayerTimes: PrayerTimes): { current: PrayerName | null; next: PrayerName } => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTotalMinutes = currentHours * 60 + currentMinutes;
  
  const times = prayerTimes.times;
  
  // Convert all prayer times to minutes
  const timeInMinutes = {
    imsak: convertTimeToMinutes(times.imsak),
    gunes: convertTimeToMinutes(times.gunes),
    ogle: convertTimeToMinutes(times.ogle),
    ikindi: convertTimeToMinutes(times.ikindi),
    aksam: convertTimeToMinutes(times.aksam),
    yatsi: convertTimeToMinutes(times.yatsi)
  };
  
  // Check current prayer time
  let current: PrayerName | null = null;
  let next: PrayerName = "imsak";
  
  // Special handling for after Yatsı and before Imsak
  if (currentTotalMinutes >= timeInMinutes.yatsi || currentTotalMinutes < timeInMinutes.imsak) {
    current = "yatsi";
    next = "imsak";
    return { current, next };
  }
  
  // Otherwise check each prayer in order
  for (let i = 0; i < PrayerOrder.length - 1; i++) {
    const prayer = PrayerOrder[i];
    const nextPrayer = PrayerOrder[i + 1];
    
    if (currentTotalMinutes >= timeInMinutes[prayer] && currentTotalMinutes < timeInMinutes[nextPrayer]) {
      current = prayer;
      next = nextPrayer;
      break;
    }
  }
  
  return { current, next };
};

export const getTimeRemaining = (targetTime: string): string => {
  const now = new Date();
  const [hours, minutes] = targetTime.split(':').map(Number);
  
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  
  // If the target time is earlier than now, it means it's for tomorrow
  if (target < now) {
    target.setDate(target.getDate() + 1);
  }
  
  const diffMs = target.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffHrs}s ${diffMins}dk`;
};
