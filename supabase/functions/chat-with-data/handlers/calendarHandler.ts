import { SupabaseClient } from '@supabase/supabase-js';

export const handleCalendarData = async (supabase: SupabaseClient, userId: string, contextData: Record<string, any>) => {
  try {
    // Get user's Google Calendar connection
    const { data: connection, error: connectionError } = await supabase
      .from('oauth_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single();

    if (connectionError || !connection) {
      console.log('No Google Calendar connection found');
      return;
    }

    // Fetch calendar events using the calendar edge function
    const { data: calendarData, error } = await supabase.functions.invoke('calendar', {
      body: { userId },
    });

    if (error) {
      console.error('Error fetching calendar data:', error);
      return;
    }

    // Add calendar events to context data
    contextData.calendar = {
      events: calendarData.items || [],
      total: calendarData.items?.length || 0,
    };

  } catch (error) {
    console.error('Error in handleCalendarData:', error);
  }
};