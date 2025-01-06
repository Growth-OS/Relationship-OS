import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { DealFormData } from "../types";
import { Flag } from "lucide-react";

interface CountrySelectProps {
  register: UseFormRegister<DealFormData>;
  setValue: UseFormSetValue<DealFormData>;
}

const countries = [
  { id: 'at', name: 'Austria', flag: '🇦🇹' },
  { id: 'be', name: 'Belgium', flag: '🇧🇪' },
  { id: 'ba', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { id: 'bg', name: 'Bulgaria', flag: '🇧🇬' },
  { id: 'hr', name: 'Croatia', flag: '🇭🇷' },
  { id: 'cz', name: 'Czech Republic', flag: '🇨🇿' },
  { id: 'dk', name: 'Denmark', flag: '🇩🇰' },
  { id: 'ee', name: 'Estonia', flag: '🇪🇪' },
  { id: 'fi', name: 'Finland', flag: '🇫🇮' },
  { id: 'fr', name: 'France', flag: '🇫🇷' },
  { id: 'de', name: 'Germany', flag: '🇩🇪' },
  { id: 'gr', name: 'Greece', flag: '🇬🇷' },
  { id: 'hu', name: 'Hungary', flag: '🇭🇺' },
  { id: 'ie', name: 'Ireland', flag: '🇮🇪' },
  { id: 'it', name: 'Italy', flag: '🇮🇹' },
  { id: 'lv', name: 'Latvia', flag: '🇱🇻' },
  { id: 'lt', name: 'Lithuania', flag: '🇱🇹' },
  { id: 'lu', name: 'Luxembourg', flag: '🇱🇺' },
  { id: 'mt', name: 'Malta', flag: '🇲🇹' },
  { id: 'md', name: 'Moldova', flag: '🇲🇩' },
  { id: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  { id: 'mk', name: 'North Macedonia', flag: '🇲🇰' },
  { id: 'no', name: 'Norway', flag: '🇳🇴' },
  { id: 'pl', name: 'Poland', flag: '🇵🇱' },
  { id: 'pt', name: 'Portugal', flag: '🇵🇹' },
  { id: 'ro', name: 'Romania', flag: '🇷🇴' },
  { id: 'rs', name: 'Serbia', flag: '🇷🇸' },
  { id: 'sk', name: 'Slovakia', flag: '🇸🇰' },
  { id: 'si', name: 'Slovenia', flag: '🇸🇮' },
  { id: 'es', name: 'Spain', flag: '🇪🇸' },
  { id: 'se', name: 'Sweden', flag: '🇸🇪' },
  { id: 'ch', name: 'Switzerland', flag: '🇨🇭' },
  { id: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { id: 'ua', name: 'Ukraine', flag: '🇺🇦' }
].sort((a, b) => a.name.localeCompare(b.name)); // Sort countries alphabetically

export const CountrySelect = ({ register, setValue }: CountrySelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="country">Country</Label>
      <Select onValueChange={(value) => {
        const country = countries.find(c => c.id === value);
        setValue('country', country?.name || '');
        setValue('country_flag', country?.flag || '');
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.id} value={country.id}>
              <div className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" {...register('country')} />
      <input type="hidden" {...register('country_flag')} />
    </div>
  );
};