export const TableEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-muted-foreground">No prospects found</p>
      <p className="text-sm text-muted-foreground">
        Add prospects to get started
      </p>
    </div>
  );
};