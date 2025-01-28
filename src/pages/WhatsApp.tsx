import { useState, useEffect } from "react";
import { WhatsAppChat } from "@/components/whatsapp/WhatsAppChat";
import { WhatsAppConnection } from "@/components/whatsapp/WhatsAppConnection";
import { supabase } from "@/integrations/supabase/client";

const WhatsApp = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .from("whatsapp_contacts")
          .select("id")
          .limit(1);

        if (error) throw error;
        setIsConnected(!!data?.length);
      } catch (error) {
        console.error("Error checking WhatsApp connection:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">WhatsApp Messages</h1>
        <p className="text-muted-foreground">Manage your WhatsApp conversations</p>
      </div>
      {isConnected ? <WhatsAppChat /> : <WhatsAppConnection />}
    </div>
  );
};

export default WhatsApp;