import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const unipileDsn = Deno.env.get('UNIPILE_DSN');
    const unipileApiKey = Deno.env.get('UNIPILE_API_KEY');

    if (!unipileDsn || !unipileApiKey) {
      throw new Error('Missing Unipile configuration');
    }

    console.log("Testing Unipile connection...");
    console.log("Unipile DSN:", unipileDsn);
    
    // First, let's try to get the accounts
    const accountsResponse = await fetch(`${unipileDsn}/api/v1/accounts`, {
      headers: {
        'X-API-KEY': unipileApiKey,
        'Accept': 'application/json'
      }
    });

    const accountsData = await accountsResponse.json();
    console.log("Accounts response:", JSON.stringify(accountsData, null, 2));

    if (!accountsResponse.ok) {
      throw new Error(`Failed to fetch accounts: ${JSON.stringify(accountsData)}`);
    }

    // If we have accounts, try to fetch emails from the first account
    if (accountsData.length > 0) {
      const accountId = accountsData[0].id;
      console.log("Testing with account ID:", accountId);

      const emailsResponse = await fetch(
        `${unipileDsn}/api/v1/emails?account_id=${accountId}&limit=10`, 
        {
          headers: {
            'X-API-KEY': unipileApiKey,
            'Accept': 'application/json'
          }
        }
      );

      const emailsData = await emailsResponse.json();
      console.log("Emails response:", JSON.stringify(emailsData, null, 2));

      return new Response(
        JSON.stringify({
          success: true,
          accounts: accountsData,
          emails: emailsData
        }),
        { headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: "No accounts found",
        accounts: accountsData
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error testing Unipile:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
});