import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...data } = await req.json();

    switch (action) {
      case 'analyze_company':
        return await handleCompanyAnalysis(data);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in chat-with-data function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function handleCompanyAnalysis({ leadId, websiteUrl }: { leadId: string; websiteUrl: string }) {
  if (!leadId || !websiteUrl) {
    throw new Error('Lead ID and website URL are required');
  }

  // Initialize Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log(`Starting analysis for lead ${leadId} with URL ${websiteUrl}`);

    // Update scraping status to in_progress
    await supabase
      .from('leads')
      .update({ 
        scraping_status: 'in_progress',
        last_scrape_attempt: new Date().toISOString()
      })
      .eq('id', leadId);

    // Validate Firecrawl API key
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      throw new Error('FIRECRAWL_API_KEY is not configured');
    }

    console.log('Making request to Firecrawl API');
    const firecrawlResponse = await fetch('https://api.firecrawl.io/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: websiteUrl,
        limit: 5,
        scrapeOptions: {
          formats: ['markdown'],
          timeout: 60000, // Increased timeout to 60 seconds
          waitUntil: 'networkidle0',
          maxConcurrency: 1, // Limit concurrent requests
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' // Add user agent
        }
      }),
    });

    if (!firecrawlResponse.ok) {
      const errorText = await firecrawlResponse.text();
      const errorDetails = {
        status: firecrawlResponse.status,
        statusText: firecrawlResponse.statusText,
        body: errorText,
        headers: Object.fromEntries(firecrawlResponse.headers.entries())
      };
      console.error('Firecrawl API error:', errorDetails);
      
      // Update lead with error status
      await supabase
        .from('leads')
        .update({
          scraping_status: 'failed',
          scraping_error: `Firecrawl API error: ${firecrawlResponse.status} - ${errorText}`,
          last_scrape_attempt: new Date().toISOString()
        })
        .eq('id', leadId);
        
      throw new Error(`Failed to scrape website: ${errorText}`);
    }

    const scrapedData = await firecrawlResponse.json();
    console.log('Firecrawl response:', scrapedData);

    if (!scrapedData.data || !Array.isArray(scrapedData.data)) {
      throw new Error('Invalid response format from Firecrawl API');
    }

    const websiteContent = scrapedData.data.join('\n\n');
    console.log('Successfully scraped website content');

    // Validate Perplexity API key
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityKey) {
      throw new Error('PERPLEXITY_API_KEY is not configured');
    }

    console.log('Making request to Perplexity API');
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a business analyst. Create a concise summary of this company based on their website content. Focus on their main business, products/services, and any notable achievements or unique selling points.'
          },
          {
            role: 'user',
            content: websiteContent
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!perplexityResponse.ok) {
      const errorText = await perplexityResponse.text();
      console.error('Perplexity API error:', {
        status: perplexityResponse.status,
        statusText: perplexityResponse.statusText,
        body: errorText,
        headers: Object.fromEntries(perplexityResponse.headers.entries())
      });
      throw new Error(`Failed to generate summary: ${errorText}`);
    }

    const aiResponse = await perplexityResponse.json();
    const summary = aiResponse.choices[0].message.content;
    console.log('Successfully generated AI summary');

    // Update lead with scraped content and summary
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        website_content: websiteContent,
        ai_summary: summary,
        scraping_status: 'completed',
        last_scrape_attempt: new Date().toISOString(),
        last_ai_analysis_date: new Date().toISOString(),
        scraping_error: null // Clear any previous errors
      })
      .eq('id', leadId);

    if (updateError) {
      throw updateError;
    }

    console.log('Successfully updated lead with analysis results');

    return new Response(
      JSON.stringify({ success: true, summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-company:', error);
    
    // Update lead with error status
    await supabase
      .from('leads')
      .update({
        scraping_status: 'failed',
        scraping_error: error.message,
        last_scrape_attempt: new Date().toISOString()
      })
      .eq('id', leadId);

    throw error;
  }
}