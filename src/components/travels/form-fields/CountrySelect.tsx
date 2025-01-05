import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface CountrySelectProps {
  label: string;
  countryFieldName: string;
  flagFieldName: string;
  form: UseFormReturn<any>;
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
];

export const CountrySelect = ({ label, countryFieldName, flagFieldName, form }: CountrySelectProps) => {
  return (
    <FormField
      control={form.control}
      name={countryFieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => {
              const country = countries.find(c => c.id === value);
              form.setValue(countryFieldName, country?.name || '');
              form.setValue(flagFieldName, country?.flag || '');
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
            </FormControl>
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
        </FormItem>
      )}
    />
  );
};