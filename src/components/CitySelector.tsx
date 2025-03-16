
import { useState } from "react";
import { useSearchCity } from "../services/prayerApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface CitySelectorProps {
  onCitySelect: (cityId: string, cityName: string) => void;
  selectedCity?: string;
}

const CitySelector = ({ onCitySelect, selectedCity }: CitySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(selectedCity || "");
  
  const { data: cities, isLoading, error } = useSearchCity(searchTerm);
  
  const handleSelect = (cityId: string, cityName: string) => {
    onCitySelect(cityId, cityName);
    setSearchTerm(cityName);
    setOpen(false);
  };
  
  return (
    <div className="flex flex-col space-y-2 w-full max-w-sm">
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
              <CommandEmpty>Şehir bulunamadı</CommandEmpty>
              <CommandGroup heading="Şehirler">
                {cities && cities.map((city) => (
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
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CitySelector;
