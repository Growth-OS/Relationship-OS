import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Calendar = () => {
  const navigate = useNavigate();
  const { data: calendarData, isLoading, error } = useGoogleCalendar();

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Calendar</h1>
          <p className="text-gray-600">Connect your Google Calendar to view your schedule</p>
        </div>
        <Card className="p-6">
          <p className="text-red-500 mb-4">Failed to load calendar events. Please connect your Google Calendar.</p>
          <Button onClick={() => navigate('/dashboard/inbox')}>
            Connect Google Calendar
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const events = calendarData?.items || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Calendar</h1>
        <p className="text-gray-600">View and manage your schedule</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-8 p-6">
          <CalendarComponent
            mode="single"
            className="rounded-md border"
          />
        </Card>

        <Card className="col-span-4 p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-gray-500">No upcoming events</p>
              ) : (
                events.map((event: any) => (
                  <Card key={event.id} className="p-4">
                    <h3 className="font-medium">{event.summary}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.start.dateTime || event.start.date), 'PPP')}
                    </p>
                    {event.description && (
                      <p className="text-sm mt-2 text-gray-600">{event.description}</p>
                    )}
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;