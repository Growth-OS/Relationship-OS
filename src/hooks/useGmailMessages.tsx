import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  body?: string;
}

export const useGmailMessages = () => {
  return useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // For development/testing, return mock data
      const mockEmails: EmailMessage[] = [
        {
          id: '1',
          from: 'John Doe <john@example.com>',
          subject: 'Welcome to GrowthOS',
          snippet: 'Thank you for joining GrowthOS. Here are some tips to get started...',
          date: new Date().toISOString(),
          body: 'Thank you for joining GrowthOS. Here are some tips to get started with our platform...'
        },
        {
          id: '2',
          from: 'Sarah Smith <sarah@example.com>',
          subject: 'Product Update',
          snippet: 'We have some exciting new features to share with you...',
          date: new Date(Date.now() - 86400000).toISOString(),
          body: 'We have some exciting new features to share with you. Check out our latest release...'
        }
      ];

      return mockEmails;
    },
    meta: {
      onError: (error: Error) => {
        console.error('Email fetch error:', error);
        toast.error('Failed to fetch emails: ' + error.message);
      }
    }
  });
};