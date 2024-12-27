import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
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
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {getHeader('From')}
          </p>
          <p className="text-sm font-medium text-gray-700 truncate">
            {getHeader('Subject')}
          </p>
          <p className="text-sm text-gray-500 line-clamp-1">
            {message.snippet}
          </p>
          {isSelected && (
            <div className="mt-4 text-sm text-gray-600">
              {message.snippet}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {new Date(getHeader('Date')).toLocaleString()}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
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