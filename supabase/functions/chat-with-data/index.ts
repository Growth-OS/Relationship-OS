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

    await supabase
      .from('leads')
      .update({ 
        scraping_status: 'in_progress',
        last_scrape_attempt: new Date().toISOString()
      })
      .eq('id', leadId);

    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      throw new Error('FIRECRAWL_API_KEY is not configured');
    }

    console.log('Making request to Firecrawl API');

    const extractSchema = {
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

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: websiteUrl,
        formats: ['markdown', 'extract'],
        extract: {
          schema: extractSchema
        },
        preferred_language: "en" // Using correct parameter name with underscore
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Firecrawl API error response:', errorText);
      throw new Error(`Firecrawl API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Firecrawl response:', result);

    if (!result.success) {
      throw new Error('Failed to analyze website: Invalid response format');
    }

    const extractedInfo = result.data?.extract || {};
    const websiteContent = result.data?.markdown || '';
    
    // Format the summary in the new standardized structure
    const summary = `${extractedInfo.company_name || 'Company'} Overview
${extractedInfo.company_description || 'A company'} operating in the ${extractedInfo.industry || 'technology'} sector.

Industry: ${extractedInfo.industry || 'Not specified'}

Key Offerings:${extractedInfo.main_products_or_services ? 
  '\n' + extractedInfo.main_products_or_services.map(service => `• ${service}`).join('\n')
  : '\nNo specific offerings listed'}

${extractedInfo.technologies_used?.length ? 
  `Technology Stack: ${extractedInfo.technologies_used.join(', ')}.`
  : 'Technology Stack: Not specified'}

Company Size: ${extractedInfo.company_size || 'Not specified'}`;

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