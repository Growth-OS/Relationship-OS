import { Button } from "@/components/ui/button";
import { Archive, Star, Reply } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailMessage {
  id: string;
  snippet: string;
  payload: {
    headers: {
      name: string;
      value: string;
    }[];
  };
  labelIds: string[];
}

interface EmailItemProps {
  message: EmailMessage;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const EmailItem = ({ message, isSelected, onSelect }: EmailItemProps) => {
  const queryClient = useQueryClient();

  const getHeader = (headerName: string) => {
    return message.payload.headers.find(h => h.name.toLowerCase() === headerName.toLowerCase())?.value;
  };

  const archiveMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const webhookUrl = localStorage.getItem('make_webhook_url_archive');
      if (!webhookUrl) {
        toast.error('Make.com archive webhook URL not configured');
        throw new Error('Make.com archive webhook URL not configured');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      });

      if (!response.ok) throw new Error('Failed to archive message');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast.success('Message archived');
    },
    onError: () => {
      toast.error('Failed to archive message');
    },
  });

  return (
    <div 
      className={`p-4 hover:bg-gray-50 cursor-pointer relative group transition-colors ${
        isSelected ? 'bg-gray-50' : ''
      }`}
      onClick={() => onSelect(message.id)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-gray-900">
              {getHeader('From')}
            </p>
            <span className="text-xs text-gray-400">
              {new Date(getHeader('Date')).toLocaleString()}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            {getHeader('Subject')}
          </p>
          <p className="text-sm text-gray-500 line-clamp-1">
            {message.snippet}
          </p>
          {isSelected && (
            <div className="mt-4 space-y-4">
              <div className="text-sm text-gray-600 whitespace-pre-wrap">
                {message.snippet}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                >
                  <Star className="w-4 h-4" />
                  Star
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    archiveMutation.mutate(message.id);
                  }}
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              archiveMutation.mutate(message.id);
            }}
          >
            <Archive className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};