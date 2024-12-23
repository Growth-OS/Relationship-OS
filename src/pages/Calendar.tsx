import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const mockEvents = [
  {
    id: '1',
    summary: 'Team Strategy Meeting',
    description: 'Quarterly planning and goal setting session',
    start: { dateTime: new Date(2024, 2, 20, 10, 0).toISOString() }
  },
  {
    id: '2',
    summary: 'Client Presentation',
    description: 'Present new marketing campaign proposals',
    start: { dateTime: new Date(2024, 2, 21, 14, 30).toISOString() }
  },
  {
    id: '3',
    summary: 'Product Launch Review',
    description: 'Review launch metrics and next steps',
    start: { dateTime: new Date(2024, 2, 22, 11, 0).toISOString() }
  },
  {
    id: '4',
    summary: 'Content Planning Session',
    description: 'Plan next month\'s content calendar',
    start: { dateTime: new Date(2024, 2, 23, 15, 0).toISOString() }
  }
];

const CalendarPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Calendar</h1>
        <p className="text-gray-600">View and manage your schedule</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-8 p-6">
          <Calendar
            mode="single"
            className="rounded-md border"
          />
        </Card>

        <Card className="col-span-4 p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {mockEvents.map((event) => (
                <Card key={event.id} className="p-4">
                  <h3 className="font-medium">{event.summary}</h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(event.start.dateTime), 'PPP p')}
                  </p>
                  {event.description && (
                    <p className="text-sm mt-2 text-gray-600">{event.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;