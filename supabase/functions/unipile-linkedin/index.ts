import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";
import { createUnipileHeaders, fetchChats, fetchMessagesForChat, sendMessage } from './api.ts';
import { handleWebhookMessage, storeMessage } from './database.ts';
import { UnipileWebhookEvent } from './types.ts';

const UNIPILE_API_KEY = Deno.env.get('UNIPILE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = req.headers.get('x-webhook-secret');
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Handle webhook requests
    if (webhookSecret === WEBHOOK_SECRET) {
      console.log('Received webhook request with valid secret');
      const webhookData = await req.json() as UnipileWebhookEvent;
      console.log('Webhook payload:', JSON.stringify(webhookData, null, 2));
      
      if (webhookData.event === 'message_received') {
        console.log('Processing message_received event');
        try {
          await handleWebhookMessage(supabaseAdmin, webhookData);
          console.log('Successfully processed webhook message');
          return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('Error processing webhook message:', error);
          throw error;
        }
      }
    }

    // Handle manual requests
    const { action, messageId, content } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    if (!UNIPILE_API_KEY) {
      console.error('UNIPILE_API_KEY is not set');
      throw new Error('UNIPILE_API_KEY is not set');
    }

    // Verify the user's JWT
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Invalid user token');
    }

    const unipileHeaders = createUnipileHeaders(UNIPILE_API_KEY);

    switch (action) {
      case 'getMessages': {
        console.log('Fetching messages from Unipile...');
        
        try {
          const chats = await fetchChats(unipileHeaders);
          const allMessages = [];

          for (const chat of (chats.data || [])) {
            try {
              const messages = await fetchMessagesForChat(chat.id, unipileHeaders);
              if (messages.data) {
                allMessages.push(...messages.data);
              }
            } catch (error) {
              console.error(`Error fetching messages for chat ${chat.id}:`, error);
              continue;
            }
          }

          console.log(`Successfully fetched ${allMessages.length} total messages`);

          // Store messages in Supabase
          for (const msg of allMessages) {
            await storeMessage(supabaseAdmin, user.id, msg);
          }

          return new Response(
            JSON.stringify({ success: true, count: allMessages.length }), 
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('Error in getMessages:', error);
          throw error;
        }
      }

      case 'sendMessage': {
        if (!messageId || !content) {
          throw new Error('Missing messageId or content');
        }

        const result = await sendMessage(messageId, content, unipileHeaders);
        
        // Store the sent message
        await storeMessage(supabaseAdmin, user.id, {
          id: result.data.id,
          sender: { name: 'You' },
          content,
          chat_id: messageId,
          created_at: new Date().toISOString(),
          direction: 'outbound'
        });

        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }), 
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});