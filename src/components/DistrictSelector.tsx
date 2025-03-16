
import { useState } from "react";
import { useSearchDistricts } from "../services/prayerApi";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface DistrictSelectorProps {
  onDistrictSelect: (districtId: string, districtName: string) => void;
  selectedDistrict?: string;
  cityId?: string;
  disabled?: boolean;
}

const DistrictSelector = ({ onDistrictSelect, selectedDistrict, cityId, disabled }: DistrictSelectorProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: districts, isLoading, error } = useSearchDistricts(cityId);
  
  const handleSelect = (districtId: string, districtName: string) => {
    onDistrictSelect(districtId, districtName);
    setOpen(false);
    
    toast({
      title: "İlçe Seçildi",
      description: `${districtName} ilçesi seçildi.`,
      variant: "default"
    });
  };
  
  const filteredDistricts = districts?.filter(district => 
    district.text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex flex-col space-y-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled || !cityId}
            className="w-full justify-between bg-white/80 border-prayer-sand hover:bg-white/95 disabled:opacity-50"
          >
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-prayer-teal/70" />
              {selectedDistrict || "İlçe Seçin"}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder="İlçe arayın..." 
              className="h-9"
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  İlçeler yükleniyor...
                </div>
              ) : error ? (
                <div className="p-2">
                  <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle className="text-xs">
                      API bağlantı sorunu nedeniyle yerel veri kullanılıyor.
                    </AlertTitle>
                  </Alert>
                </div>
              ) : null}
              
              <CommandEmpty>İlçe bulunamadı</CommandEmpty>
              <CommandGroup heading="İlçeler">
                {filteredDistricts && filteredDistricts.map((district) => (
                  <CommandItem
                    key={district.id}
                    value={district.text}
                    onSelect={() => handleSelect(district.id, district.text)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedDistrict === district.text ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {district.text}
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

export default DistrictSelector;
