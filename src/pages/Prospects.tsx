import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { ProjectsSearch } from "@/components/projects/ProjectsSearch";
import { ProjectsList } from "@/components/projects/ProjectsList";

const Prospects = () => {
  const [filters, setFilters] = useState<Array<{ field: string; value: string }>>([]);

  const { data: prospects, isLoading } = useQuery({
    queryKey: ['prospects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const acceleratorOptions = useMemo(() => {
    if (!prospects) return [];
    const uniquePrograms = new Set(
      prospects
        .map(p => p.training_event)
        .filter(Boolean)
    );
    return Array.from(uniquePrograms);
  }, [prospects]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <ProjectsSearch
          filters={filters}
          onFilterChange={setFilters}
          acceleratorOptions={acceleratorOptions}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <ProjectsList
          projects={prospects || []}
          isLoading={isLoading}
          filters={filters}
        />
      </div>
    </div>
  );
};

export default Prospects;