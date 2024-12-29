import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Loader2 } from "lucide-react";
import { EmailMessage } from "@/components/dashboard/types";

const SpamPage = () => {
  const { data: spamEmails, isLoading } = useQuery({
    queryKey: ["spamEmails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .eq("folder", "spam")
        .order("received_at", { ascending: false });

      if (error) throw error;
      return data as EmailMessage[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!spamEmails?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-gray-500">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <p>No spam emails found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Spam</h1>
      <div className="space-y-2">
        {spamEmails.map((email) => (
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
    </div>
  );
};

export default SpamPage;