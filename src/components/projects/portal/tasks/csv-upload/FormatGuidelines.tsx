export const FormatGuidelines = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium mb-2">CSV Format Guidelines</h4>
      <p className="text-sm text-gray-600">
        Your CSV should include these columns:
      </p>
      <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
        <li>Title (required)</li>
        <li>Description (optional)</li>
        <li>Due Date (optional, format: YYYY-MM-DD)</li>
        <li>Priority (optional, values: high, medium, low)</li>
      </ul>
    </div>
  );
};