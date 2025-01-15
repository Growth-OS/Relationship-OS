export const FormatGuidelines = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium mb-2">CSV Format Guidelines</h4>
      <p className="text-sm text-gray-600">
        Your CSV should include these columns:
      </p>
      <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
        <li>Email (required)</li>
        <li>First Name (required)</li>
        <li>Company Name</li>
        <li>Website</li>
        <li>LinkedIn Profile</li>
        <li>Job Title</li>
        <li>Notes</li>
        <li>Source</li>
      </ul>
    </div>
  );
};