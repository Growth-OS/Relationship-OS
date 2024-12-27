import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const now = new Date().toISOString();

    // Get all snoozed emails that should be unsnoozed
    const { data: emailsToUnsnooze, error: fetchError } = await supabase
      .from('emails')
      .select('*')
      .not('snoozed_until', 'is', null)
      .lte('snoozed_until', now);

    if (fetchError) throw fetchError;

    if (emailsToUnsnooze && emailsToUnsnooze.length > 0) {
      // Update the emails to remove their snooze time
      const { error: updateError } = await supabase
        .from('emails')
        .update({ snoozed_until: null })
        .in('id', emailsToUnsnooze.map(email => email.id));

      if (updateError) throw updateError;

      console.log(`Unsnoozed ${emailsToUnsnooze.length} emails`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${emailsToUnsnooze?.length || 0} emails` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error checking snoozed emails:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});