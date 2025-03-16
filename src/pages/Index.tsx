
import { useState, useEffect } from "react";
import { useSearchCity, usePrayerTimes } from "@/services/prayerApi";
import { getCurrentPrayer, PrayerOrder } from "@/utils/prayerUtils";
import { useToast } from "@/hooks/use-toast";

import CitySelector from "@/components/CitySelector";
import DistrictSelector from "@/components/DistrictSelector";
import PrayerTimeCard from "@/components/PrayerTimeCard";
import DateDisplay from "@/components/DateDisplay";
import CurrentTime from "@/components/CurrentTime";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, RefreshCw } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("");

  // Initialize with Istanbul if no city selected
  useEffect(() => {
    if (!selectedCityId) {
      const fetchIstanbul = async () => {
        try {
          const response = await fetch("https://prayertimes.api.abdus.dev/api/diyanet/search?q=Istanbul");
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              setSelectedCityId(data[0].id);
              setSelectedCityName(data[0].text);
            }
          }
        } catch (error) {
          console.error("Error fetching Istanbul data:", error);
        }
      };
      
      fetchIstanbul();
    }
  }, []);

  const { data: prayerTimes, isLoading, isError, refetch } = usePrayerTimes(
    selectedDistrictId || selectedCityId
  );
  
  const handleCitySelect = (cityId: string, cityName: string) => {
    setSelectedCityId(cityId);
    setSelectedCityName(cityName);
    // Reset district when city changes
    setSelectedDistrictId("");
    setSelectedDistrictName("");
    
    toast({
      title: "Şehir değiştirildi",
      description: `${cityName} için namaz vakitleri yükleniyor.`,
      duration: 3000,
    });
  };
  
  const handleDistrictSelect = (districtId: string, districtName: string) => {
    setSelectedDistrictId(districtId);
    setSelectedDistrictName(districtName);
    
    toast({
      title: "İlçe değiştirildi",
      description: `${selectedCityName}, ${districtName} için namaz vakitleri yükleniyor.`,
      duration: 3000,
    });
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Vakitler güncelleniyor",
      description: "En güncel namaz vakitleri yükleniyor.",
      duration: 3000,
    });
  };

  // Calculate current and next prayer times
  const { current, next } = prayerTimes ? getCurrentPrayer(prayerTimes) : { current: null, next: "imsak" };

  // Location display name
  const locationName = selectedDistrictName 
    ? `${selectedCityName}, ${selectedDistrictName}`
    : selectedCityName;

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-prayer-cream to-prayer-sand/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-prayer-teal mb-2 font-['Amiri']">Namaz Vakitleri</h1>
          <p className="text-prayer-teal/70">Günlük namaz vakitlerini takip edin</p>
        </div>

        <div className="mb-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CitySelector onCitySelect={handleCitySelect} selectedCity={selectedCityName} />
            <DistrictSelector 
              onDistrictSelect={handleDistrictSelect} 
              selectedDistrict={selectedDistrictName}
              cityId={selectedCityId}
              disabled={!selectedCityId}
            />
          </div>
          
          <Button 
            onClick={handleRefresh}
            variant="outline" 
            className="w-full sm:w-auto sm:self-end bg-white/80 border-prayer-sand hover:bg-white/95"
          >
            <RefreshCw size={16} className="mr-2" />
            Vakitleri Yenile
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <DateDisplay 
            hijriDate={prayerTimes?.date.hijri} 
            gregorianDate={prayerTimes?.date.gregorian}
            cityName={locationName}
          />
          <CurrentTime />
        </div>

        {isLoading ? (
          <Card className="p-8 text-center bg-white/90 border-prayer-sand">
            <p>Namaz vakitleri yükleniyor...</p>
          </Card>
        ) : isError ? (
          <Card className="p-8 text-center bg-white/90 border-prayer-sand">
            <p className="text-red-500">Namaz vakitleri yüklenirken bir hata oluştu.</p>
            <Button onClick={handleRefresh} variant="outline" className="mt-4">
              <RefreshCw size={16} className="mr-2" />
              Tekrar Dene
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {PrayerOrder.map((prayerName) => (
              <PrayerTimeCard
                key={prayerName}
                name={prayerName}
                time={prayerTimes?.times[prayerName] || ""}
                isActive={prayerName === current}
                isNext={prayerName === next}
              />
            ))}
          </div>
        )}

        {next && (
          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              className="bg-prayer-teal/10 border-prayer-teal/30 hover:bg-prayer-teal/20"
            >
              <Bell size={16} className="mr-2 text-prayer-teal" />
              Hatırlatıcı Ekle
            </Button>
          </div>
        )}

        <footer className="mt-12 text-center text-sm text-prayer-teal/60">
          <p>Veriler abdus.dev Prayer Times API aracılığıyla sağlanmaktadır.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
