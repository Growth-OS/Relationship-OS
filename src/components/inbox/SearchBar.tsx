import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
      <Search className="w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full bg-transparent border-none focus:outline-none text-sm placeholder:text-gray-400"
      />
    </div>
  );
};