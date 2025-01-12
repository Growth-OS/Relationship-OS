import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Filter {
  field: string;
  value: string;
}

interface ProjectsSearchProps {
  filters: Filter[];
  onFilterChange: (filters: Filter[]) => void;
  acceleratorOptions: string[];
}

export const ProjectsSearch = ({ filters, onFilterChange, acceleratorOptions }: ProjectsSearchProps) => {
  const updateFilter = (field: string, value: string) => {
    const newFilters = filters.filter(f => f.field !== field);
    if (value) {
      newFilters.push({ field, value });
    }
    onFilterChange(newFilters);
  };

  const removeFilter = (field: string) => {
    onFilterChange(filters.filter(f => f.field !== field));
  };

  const clearAllFilters = () => {
    onFilterChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by company name..."
            value={filters.find(f => f.field === 'company_name')?.value || ''}
            onChange={(e) => updateFilter('company_name', e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Input
            placeholder="Search by email..."
            value={filters.find(f => f.field === 'contact_email')?.value || ''}
            onChange={(e) => updateFilter('contact_email', e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Input
            placeholder="Search by website..."
            value={filters.find(f => f.field === 'company_website')?.value || ''}
            onChange={(e) => updateFilter('company_website', e.target.value)}
            className="bg-background"
          />
        </div>

        <Select 
          value={filters.find(f => f.field === 'training_event')?.value || ''}
          onValueChange={(value) => updateFilter('training_event', value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select program" />
          </SelectTrigger>
          <SelectContent>
            {acceleratorOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filters.length > 0 && (
          <Button 
            variant="outline" 
            onClick={clearAllFilters}
            className="whitespace-nowrap"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Badge 
              key={filter.field} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter.field}: {filter.value}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter(filter.field)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};