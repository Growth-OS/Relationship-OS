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
    
    // First try to validate the website URL
    try {
      new URL(websiteUrl);
    } catch (e) {
      throw new Error(`Invalid website URL: ${websiteUrl}`);
    }

    // Define company information schema
    const extractionSchema = {
      type: "object",
      properties: {
        company_name: { type: "string" },
        company_description: { type: "string" },
        main_products_or_services: { type: "array", items: { type: "string" } },
        company_size: { type: "string" },
        industry: { type: "string" },
        technologies_used: { type: "array", items: { type: "string" } },
        contact_information: {
          type: "object",
          properties: {
            email: { type: "string" },
            phone: { type: "string" },
            address: { type: "string" }
          }
        }
      }
    };

    const firecrawlResponse = await fetch('https://api.firecrawl.io/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      body: JSON.stringify({
        url: websiteUrl,
        formats: ['markdown', 'extract'],
        extract: {
          schema: extractionSchema
        },
        scrapeOptions: {
          formats: ['markdown'],
          timeout: 60000,
          waitUntil: 'networkidle0',
          maxConcurrency: 1
        }
      }),
    });

    if (!firecrawlResponse.ok) {
      const errorText = await firecrawlResponse.text();
      console.error('Firecrawl API error response:', errorText);
      throw new Error(`Firecrawl API error: ${firecrawlResponse.status} - ${errorText}`);
    }

    const scrapedData = await firecrawlResponse.json();
    console.log('Firecrawl response:', scrapedData);

    if (!scrapedData.success) {
      throw new Error('Failed to scrape website: Invalid response format');
    }

    // Extract the relevant data
    const websiteContent = scrapedData.data.markdown || '';
    const extractedInfo = scrapedData.data.extract || {};
    
    // Create a summary combining extracted information
    const summary = `
Company Analysis Summary:
${extractedInfo.company_name ? `Company Name: ${extractedInfo.company_name}\n` : ''}
${extractedInfo.company_description ? `Description: ${extractedInfo.company_description}\n` : ''}
${extractedInfo.industry ? `Industry: ${extractedInfo.industry}\n` : ''}
${extractedInfo.company_size ? `Company Size: ${extractedInfo.company_size}\n` : ''}
${extractedInfo.main_products_or_services ? `Products/Services: ${extractedInfo.main_products_or_services.join(', ')}\n` : ''}
${extractedInfo.technologies_used ? `Technologies: ${extractedInfo.technologies_used.join(', ')}\n` : ''}
    `.trim();

    // Update lead with scraped content and summary
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        website_content: websiteContent,
        ai_summary: summary,
        scraping_status: 'completed',
        last_scrape_attempt: new Date().toISOString(),
        last_ai_analysis_date: new Date().toISOString(),
        scraping_error: null
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