import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

const UNIPILE_API_KEY = Deno.env.get('UNIPILE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, messageId, content } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify the user's JWT
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid user token');
    }

    switch (action) {
      case 'getMessages': {
        console.log('Fetching messages from Unipile...');
        
        try {
          // First get all chats
          const chatsResponse = await fetch('https://api.unipile.com/v1/chats', {
            method: 'GET',
            headers: {
              'X-API-KEY': UNIPILE_API_KEY!,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          if (!chatsResponse.ok) {
            console.error('Failed to fetch chats:', await chatsResponse.text());
            throw new Error(`Failed to fetch chats: ${chatsResponse.statusText}`);
          }

          const chats = await chatsResponse.json();
          console.log('Fetched chats:', chats);

          // For each chat, get messages
          const allMessages = [];
          for (const chat of chats.data) {
            try {
              const messagesResponse = await fetch(`https://api.unipile.com/v1/chats/${chat.id}/messages`, {
                method: 'GET',
                headers: {
                  'X-API-KEY': UNIPILE_API_KEY!,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              });

              if (!messagesResponse.ok) {
                console.error(`Failed to fetch messages for chat ${chat.id}:`, await messagesResponse.text());
                continue;
              }

              const messages = await messagesResponse.json();
              allMessages.push(...messages.data);
            } catch (error) {
              console.error(`Error fetching messages for chat ${chat.id}:`, error);
              continue;
            }
          }

          console.log('Total messages fetched:', allMessages.length);

          // Store messages in Supabase
          for (const msg of allMessages) {
            await supabaseAdmin
              .from('linkedin_messages')
              .upsert({
                user_id: user.id,
                unipile_message_id: msg.id,
                sender_name: msg.sender?.name || 'Unknown',
                sender_profile_url: msg.sender?.profile_url,
                sender_avatar_url: msg.sender?.avatar_url,
                content: msg.content,
                thread_id: msg.chat_id,
                received_at: msg.created_at,
                is_outbound: msg.direction === 'outbound'
              }, {
                onConflict: 'unipile_message_id'
              });
          }

          return new Response(JSON.stringify({ success: true, count: allMessages.length }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Error in getMessages:', error);
          throw error;
        }
      }

      case 'sendMessage': {
        if (!messageId || !content) {
          throw new Error('Missing messageId or content');
        }

        const response = await fetch(`https://api.unipile.com/v1/chats/${messageId}/messages`, {
          method: 'POST',
          headers: {
            'X-API-KEY': UNIPILE_API_KEY!,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) {
          console.error('Failed to send message:', await response.text());
          throw new Error(`Failed to send message: ${response.statusText}`);
        }

        const result = await response.json();
        
        // Store the sent message in Supabase
        await supabaseAdmin
          .from('linkedin_messages')
          .insert({
            user_id: user.id,
            unipile_message_id: result.data.id,
            sender_name: 'You',
            content: content,
            thread_id: messageId,
            received_at: new Date().toISOString(),
            is_outbound: true,
          });

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});