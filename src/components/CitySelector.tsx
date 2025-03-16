
import { useState, useEffect } from "react";
import { useSearchCity, turkishCities } from "../services/prayerApi";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";

interface CitySelectorProps {
  onCitySelect: (cityId: string, cityName: string) => void;
  selectedCity?: string;
}

const CitySelector = ({ onCitySelect, selectedCity }: CitySelectorProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(selectedCity || "");
  
  const { data: cities, isLoading, error } = useSearchCity(searchTerm);
  
  // If API fails, use only the Turkish cities without IDs
  const handleLocalCitySelect = (cityName: string) => {
    if (cities && cities.length > 0) {
      // Try to find the city in the API results
      const cityFromApi = cities.find(city => 
        city.text.toLowerCase() === cityName.toLowerCase()
      );
      
      if (cityFromApi) {
        onCitySelect(cityFromApi.id, cityFromApi.text);
        setOpen(false);
        return;
      }
    }
    
    // Fallback: use the city name as both ID and name
    // This won't work perfectly but gives user feedback
    onCitySelect(cityName, cityName);
    setOpen(false);
    
    toast({
      title: "API Bağlantı Sorunu",
      description: "Şehir seçildi, ancak ID bilgisi alınamadı. Namaz vakitleri gösterilmeyebilir.",
      variant: "destructive"
    });
  };
  
  // Filter cities to Türkiye's 81 cities first
  const filteredCities = cities?.filter(city => 
    turkishCities.some(turkishCity => 
      city.text.toLowerCase().includes(turkishCity.toLowerCase())
    )
  );
  
  const handleSelect = (cityId: string, cityName: string) => {
    onCitySelect(cityId, cityName);
    setSearchTerm(cityName);
    setOpen(false);
  };
  
  return (
    <div className="flex flex-col space-y-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white/80 border-prayer-sand hover:bg-white/95"
          >
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-prayer-teal/70" />
              {selectedCity || "Şehir Seçin"}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder="Şehir arayın..." 
              className="h-9"
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {error ? (
                <div className="py-6 text-center text-sm text-red-500">
                  API'ye bağlanılamadı. Lütfen şehrinizi seçmeye devam edin.
                </div>
              ) : null}
              
              <CommandEmpty>Şehir bulunamadı</CommandEmpty>
              <CommandGroup heading="Türkiye'nin 81 İli">
                {filteredCities && filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={city.text}
                      onSelect={() => handleSelect(city.id, city.text)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCity === city.text ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {city.text}
                    </CommandItem>
                  ))
                ) : (
                  turkishCities
                    .filter(city => city.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((city, index) => (
                      <CommandItem
                        key={index}
                        value={city}
                        onSelect={() => handleLocalCitySelect(city)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCity === city ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {city}
                      </CommandItem>
                    ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CitySelector;
