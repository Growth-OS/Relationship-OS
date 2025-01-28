import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WhatsAppMessage {
  id: string;
  content: string;
  is_outbound: boolean;
  created_at: string;
  status: 'sent' | 'delivered' | 'read';
}

export const WhatsAppChat = () => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("whatsapp_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel("whatsapp_messages_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "whatsapp_messages",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new as WhatsAppMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from("whatsapp_messages").insert([
      {
        content: newMessage,
        is_outbound: true,
        status: "sent",
      },
    ]);

    if (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
  };

  return (
    <Card className="flex flex-col h-[600px] max-w-2xl mx-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">WhatsApp Messages</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.is_outbound ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.is_outbound
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p>{message.content}</p>
                <span className="text-xs opacity-70">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button onClick={handleSendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};