export const SearchBar = () => {
  return (
    <div className="p-4 border-b">
      <input
        type="text"
        placeholder="Search emails..."
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};