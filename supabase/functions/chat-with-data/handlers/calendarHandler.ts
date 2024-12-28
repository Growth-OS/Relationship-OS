import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

export const handleCalendarData = async (supabase: SupabaseClient, userId: string, contextData: Record<string, any>) => {
  try {
    // Check if user has Google Calendar connected
    const { data: connection, error: connectionError } = await supabase
      .from('oauth_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single();

    if (connectionError || !connection) {
      contextData.calendar = {
        error: 'No Google Calendar connection found. Please connect your Google Calendar first.',
        isConnected: false
      };
      return;
    }

    // Check if token needs refresh
    if (new Date(connection.expires_at) < new Date()) {
      console.log("Token expired, refreshing...");
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: Deno.env.get("GOOGLE_CLIENT_ID") ?? "",
          client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET") ?? "",
          refresh_token: connection.refresh_token,
          grant_type: "refresh_token",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      
      // Update the token in the database
      await supabase
        .from("oauth_connections")
        .update({
          access_token: data.access_token,
          expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
        })
        .eq("id", connection.id);

      connection.access_token = data.access_token;
    }

    // Fetch calendar events
    const timeMin = new Date();
    timeMin.setDate(timeMin.getDate() - 7); // Last 7 days
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 30); // Next 30 days

    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${connection.access_token}`,
        },
      }
    );

    if (!calendarResponse.ok) {
      const errorText = await calendarResponse.text();
      console.error("Calendar API error:", errorText);
      throw new Error(`Calendar API error: ${errorText}`);
    }

    const calendarData = await calendarResponse.json();
    console.log(`Fetched ${calendarData.items?.length ?? 0} calendar events`);

    // Process events to make them more AI-friendly
    const processedEvents = calendarData.items?.map(event => ({
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      description: event.description,
      attendees: event.attendees?.length || 0,
      isAllDay: !event.start.dateTime,
    })) || [];

    // Add calendar data to context
    contextData.calendar = {
      events: processedEvents,
      isConnected: true,
      total: processedEvents.length,
      upcomingEvents: processedEvents.slice(0, 5),
      timeRange: {
        from: timeMin.toISOString(),
        to: timeMax.toISOString()
      }
    };

  } catch (error) {
    console.error('Error in handleCalendarData:', error);
    contextData.calendar = {
      error: error instanceof Error ? error.message : 'An error occurred',
      isConnected: false
    };
  }
};