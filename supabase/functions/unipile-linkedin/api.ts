import { UnipileHeaders } from './types.ts';

export const createUnipileHeaders = (apiKey: string): UnipileHeaders => ({
  'X-API-KEY': apiKey,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': 'Supabase Edge Function'
});

export const fetchChats = async (headers: UnipileHeaders) => {
  console.log('Fetching chats from Unipile API...');
  const response = await fetch('https://api.unipile.com/v1/chats', {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to fetch chats:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    });
    throw new Error(`Failed to fetch chats: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log(`Successfully fetched ${data.data?.length || 0} chats`);
  return data;
};

export const fetchMessagesForChat = async (chatId: string, headers: UnipileHeaders) => {
  console.log(`Fetching messages for chat ${chatId}...`);
  const response = await fetch(`https://api.unipile.com/v1/chats/${chatId}/messages`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to fetch messages for chat ${chatId}:`, errorText);
    throw new Error(`Failed to fetch messages: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log(`Successfully fetched ${data.data?.length || 0} messages for chat ${chatId}`);
  return data;
};

export const sendMessage = async (chatId: string, content: string, headers: UnipileHeaders) => {
  console.log('Sending message to chat:', chatId);
  const response = await fetch(`https://api.unipile.com/v1/chats/${chatId}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to send message:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    });
    throw new Error(`Failed to send message: ${response.status} ${errorText}`);
  }

  return await response.json();
};