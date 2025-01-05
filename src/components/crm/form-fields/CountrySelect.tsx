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
  { id: 'us', name: 'United States', flag: '🇺🇸' },
  { id: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { id: 'fr', name: 'France', flag: '🇫🇷' },
  { id: 'de', name: 'Germany', flag: '🇩🇪' },
  { id: 'es', name: 'Spain', flag: '🇪🇸' },
  { id: 'it', name: 'Italy', flag: '🇮🇹' },
  { id: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  { id: 'be', name: 'Belgium', flag: '🇧🇪' },
  { id: 'ch', name: 'Switzerland', flag: '🇨🇭' },
  { id: 'se', name: 'Sweden', flag: '🇸🇪' },
  { id: 'no', name: 'Norway', flag: '🇳🇴' },
  { id: 'dk', name: 'Denmark', flag: '🇩🇰' },
  { id: 'fi', name: 'Finland', flag: '🇫🇮' },
  { id: 'pt', name: 'Portugal', flag: '🇵🇹' },
  { id: 'ie', name: 'Ireland', flag: '🇮🇪' },
  { id: 'at', name: 'Austria', flag: '🇦🇹' },
  { id: 'lt', name: 'Lithuania', flag: '🇱🇹' },
];

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