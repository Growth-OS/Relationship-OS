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

    // Invoke the calendar function to get events
    const { data: calendarData, error } = await supabase.functions.invoke('calendar', {
      body: { userId }
    });

    if (error) {
      console.error('Error fetching calendar data:', error);
      contextData.calendar = {
        error: 'Failed to fetch calendar events',
        isConnected: true
      };
      return;
    }

    // Add calendar data to context
    contextData.calendar = {
      events: calendarData.items || [],
      isConnected: true,
      total: calendarData.items?.length || 0,
      upcomingEvents: calendarData.items?.slice(0, 5) || []
    };

  } catch (error) {
    console.error('Error in handleCalendarData:', error);
    contextData.calendar = {
      error: error instanceof Error ? error.message : 'An error occurred',
      isConnected: false
    };
  }
};