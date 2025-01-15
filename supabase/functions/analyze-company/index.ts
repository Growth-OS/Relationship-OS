import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { leadId, websiteUrl } = await req.json();
    
    if (!leadId || !websiteUrl) {
      throw new Error('Lead ID and website URL are required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update scraping status
    await supabase
      .from('leads')
      .update({ 
        scraping_status: 'in_progress',
        last_scrape_attempt: new Date().toISOString()
      })
      .eq('id', leadId);

    // Scrape website using Firecrawl
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    const firecrawlResponse = await fetch('https://api.firecrawl.io/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: websiteUrl,
        limit: 5, // Limit to 5 pages for efficiency
        scrapeOptions: {
          formats: ['markdown'],
        }
      }),
    });

    if (!firecrawlResponse.ok) {
      throw new Error('Failed to scrape website');
    }

    const scrapedData = await firecrawlResponse.json();
    const websiteContent = scrapedData.data.join('\n\n');

    // Generate summary using Perplexity
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
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
      throw new Error('Failed to generate summary');
    }

    const aiResponse = await perplexityResponse.json();
    const summary = aiResponse.choices[0].message.content;

    // Update lead with scraped content and summary
    await supabase
      .from('leads')
      .update({
        website_content: websiteContent,
        ai_summary: summary,
        scraping_status: 'completed',
        last_scrape_attempt: new Date().toISOString()
      })
      .eq('id', leadId);

    return new Response(
      JSON.stringify({ success: true, summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-company function:', error);
    
    // Update lead with error status
    if (req.json) {
      const { leadId } = await req.json();
      if (leadId) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase
          .from('leads')
          .update({
            scraping_status: 'failed',
            scraping_error: error.message,
            last_scrape_attempt: new Date().toISOString()
          })
          .eq('id', leadId);
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});