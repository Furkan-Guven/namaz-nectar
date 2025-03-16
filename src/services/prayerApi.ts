
import { useQuery } from "@tanstack/react-query";

// Types
export interface CitySearchResult {
  id: string;
  text: string;
  slug: string;
}

export interface PrayerTimes {
  id: string;
  name: string;
  date: {
    hijri: string;
    gregorian: string;
  };
  times: {
    imsak: string;
    gunes: string;
    ogle: string;
    ikindi: string;
    aksam: string;
    yatsi: string;
  };
}

// API functions
const searchCity = async (city: string): Promise<CitySearchResult[]> => {
  try {
    const response = await fetch(`https://prayertimes.api.abdus.dev/api/diyanet/search?q=${encodeURIComponent(city)}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching city data: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error searching for city:", error);
    throw error;
  }
};

const getPrayerTimes = async (cityId: string): Promise<PrayerTimes> => {
  try {
    const response = await fetch(`https://prayertimes.api.abdus.dev/api/diyanet/times/${cityId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching prayer times: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw error;
  }
};

// React Query hooks
export const useSearchCity = (city: string) => {
  return useQuery({
    queryKey: ['citySearch', city],
    queryFn: () => searchCity(city),
    enabled: !!city && city.length > 2, // Only run if city has at least 3 characters
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const usePrayerTimes = (cityId: string | undefined) => {
  return useQuery({
    queryKey: ['prayerTimes', cityId],
    queryFn: () => getPrayerTimes(cityId as string),
    enabled: !!cityId,
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
};
