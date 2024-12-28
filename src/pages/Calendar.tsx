import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Calendar = () => {
  const { data: calendarData, isLoading } = useGoogleCalendar();

  const handleConnect = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.modify',
        redirectTo: `${window.location.origin}/dashboard/calendar`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) {
      console.error("OAuth error:", error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-2rem)]">Loading...</div>;
  }

  if (!calendarData?.isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-2rem)] space-y-4">
        <p className="text-gray-600">Connect your Google Calendar to view your schedule</p>
        <Button onClick={handleConnect} className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          Connect Google Calendar
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-2rem)] w-full bg-white rounded-lg shadow">
      <iframe
        src={`https://calendar.google.com/calendar/embed?src=primary&ctz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`}
        className="w-full h-full rounded-lg"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
};

export default Calendar;