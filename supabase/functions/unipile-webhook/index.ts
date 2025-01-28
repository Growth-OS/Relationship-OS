import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('WEBHOOK_SECRET not found')
    }

    // Verify webhook signature
    const signature = req.headers.get('x-unipile-signature')
    if (!signature || signature !== webhookSecret) {
      throw new Error('Invalid webhook signature')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const payload = await req.json()
    console.log('Received webhook payload:', payload)

    // Handle different event types
    switch (payload.event) {
      case 'message.created':
        await handleNewMessage(supabase, payload.data)
        break
      case 'message.updated':
        await handleMessageUpdate(supabase, payload.data)
        break
      default:
        console.log('Unhandled event type:', payload.event)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function handleNewMessage(supabase: any, data: any) {
  const {
    user_id,
    chat_id,
    message_id,
    content,
    message_type,
    media_url,
    media_type,
    is_outbound,
    created_at,
  } = data

  try {
    // First, ensure we have the contact
    const { data: contact, error: contactError } = await supabase
      .from('whatsapp_contacts')
      .upsert({
        user_id,
        phone_number: data.sender_phone || data.recipient_phone,
        name: data.sender_name || data.recipient_name,
      })
      .select()
      .single()

    if (contactError) throw contactError

    // Then ensure we have the chat
    const { data: chat, error: chatError } = await supabase
      .from('whatsapp_chats')
      .upsert({
        user_id,
        contact_id: contact.id,
        last_message_at: created_at,
      })
      .select()
      .single()

    if (chatError) throw chatError

    // Finally insert the message
    const { error: messageError } = await supabase
      .from('whatsapp_messages')
      .insert({
        chat_id: chat.id,
        user_id,
        content,
        message_type,
        media_url,
        media_type,
        is_outbound,
        created_at,
      })

    if (messageError) throw messageError

  } catch (error) {
    console.error('Error handling new message:', error)
    throw error
  }
}

async function handleMessageUpdate(supabase: any, data: any) {
  const { message_id, status, delivered_at, read_at } = data

  try {
    const { error } = await supabase
      .from('whatsapp_messages')
      .update({
        status,
        delivered_at,
        read_at,
      })
      .eq('id', message_id)

    if (error) throw error

  } catch (error) {
    console.error('Error handling message update:', error)
    throw error
  }
}