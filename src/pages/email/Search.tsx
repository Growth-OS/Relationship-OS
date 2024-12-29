import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, Search as SearchIcon } from "lucide-react";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["emailSearch", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .or(`subject.ilike.%${searchQuery}%,body.ilike.%${searchQuery}%`)
        .order("received_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Search Emails</h1>
      
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <Input
          type="search"
          placeholder="Search emails..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : !searchResults?.length ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <Mail className="w-12 h-12 mb-4" />
          <p>{searchQuery ? "No results found" : "Start typing to search emails"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {searchResults.map((email) => (
            <div
              key={email.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{email.from_name || email.from_email}</p>
                  <p className="text-sm text-gray-600">{email.subject}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(email.received_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700 line-clamp-2">{email.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;