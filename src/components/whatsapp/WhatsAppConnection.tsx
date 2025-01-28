import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const WhatsAppConnection = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to connect WhatsApp");
        return;
      }

      // Call Unipile to initiate WhatsApp connection
      const response = await fetch('/api/unipile/whatsapp/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const data = await response.json();
      
      if (data.qrCode) {
        // Show QR code to user
        // The QR code URL will be in data.qrCode
        window.open(data.qrCode, '_blank');
        toast.success("Please scan the QR code with WhatsApp to connect your account");
      } else {
        toast.error("Failed to generate WhatsApp QR code");
      }
    } catch (error) {
      console.error("WhatsApp connection error:", error);
      toast.error("Failed to connect WhatsApp");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="flex flex-col items-center justify-center p-8 space-y-4">
      <QrCode className="w-16 h-16 text-gray-400" />
      <h2 className="text-2xl font-semibold">Connect WhatsApp</h2>
      <p className="text-center text-gray-500 max-w-md">
        To use WhatsApp in this app, you'll need to connect your account. Click below to get a QR code, then scan it with your WhatsApp mobile app.
      </p>
      <Button 
        onClick={handleConnect} 
        disabled={isConnecting}
        className="flex items-center gap-2"
      >
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Connecting...
          </>
        ) : (
          <>
            <QrCode className="w-4 h-4" />
            Connect WhatsApp
          </>
        )}
      </Button>
    </Card>
  );
};