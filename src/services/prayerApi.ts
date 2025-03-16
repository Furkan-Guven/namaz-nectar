
import { useQuery } from "@tanstack/react-query";

// Types
export interface CitySearchResult {
  id: string;
  text: string;
  slug: string;
}

export interface DistrictSearchResult {
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

const searchDistrict = async (cityId: string): Promise<DistrictSearchResult[]> => {
  try {
    const response = await fetch(`https://prayertimes.api.abdus.dev/api/diyanet/regions/${cityId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching district data: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error searching for districts:", error);
    throw error;
  }
};

const getPrayerTimes = async (locationId: string): Promise<PrayerTimes> => {
  try {
    const response = await fetch(`https://prayertimes.api.abdus.dev/api/diyanet/times/${locationId}`);
    
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
    enabled: !!city && city.length > 1, // Only run if city has at least 2 characters
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useSearchDistricts = (cityId: string | undefined) => {
  return useQuery({
    queryKey: ['districtSearch', cityId],
    queryFn: () => searchDistrict(cityId as string),
    enabled: !!cityId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const usePrayerTimes = (locationId: string | undefined) => {
  return useQuery({
    queryKey: ['prayerTimes', locationId],
    queryFn: () => getPrayerTimes(locationId as string),
    enabled: !!locationId,
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

// Türkiye'nin 81 ili listesi
export const turkishCities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];
