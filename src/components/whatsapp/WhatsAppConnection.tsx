import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Check, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import QRCode from "qrcode";

export const WhatsAppConnection = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Poll connection status when we have a session ID
  useEffect(() => {
    if (!sessionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Please sign in to connect WhatsApp");
          return;
        }

        const response = await fetch('/api/unipile/whatsapp/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ sessionId })
        });

        const data = await response.json();
        
        if (data.status === 'connected') {
          clearInterval(pollInterval);
          toast.success("WhatsApp connected successfully!");
          window.location.reload(); // Refresh to show chat interface
        }
      } catch (error) {
        console.error("Error checking connection status:", error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [sessionId]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to connect WhatsApp");
        return;
      }

      console.log('Requesting WhatsApp QR code...');
      const { data, error } = await supabase.functions.invoke('unipile-whatsapp-connect', {
        method: 'POST'
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to connect to WhatsApp');
      }

      if (data?.qrCode) {
        console.log('QR code received, generating display...');
        const qrDataUrl = await QRCode.toDataURL(data.qrCode);
        setQrCodeDataUrl(qrDataUrl);
        setSessionId(data.sessionId);
        toast.success("Please scan the QR code with WhatsApp to connect your account");
      } else {
        throw new Error("No QR code received from server");
      }
    } catch (error) {
      console.error("WhatsApp connection error:", error);
      toast.error(error.message || "Failed to connect WhatsApp");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="flex flex-col items-center justify-center p-8 space-y-4">
      {qrCodeDataUrl ? (
        <img 
          src={qrCodeDataUrl} 
          alt="WhatsApp QR Code" 
          className="w-64 h-64"
        />
      ) : (
        <QrCode className="w-16 h-16 text-gray-400" />
      )}
      
      <h2 className="text-2xl font-semibold">Connect WhatsApp</h2>
      
      <p className="text-center text-gray-500 max-w-md">
        {qrCodeDataUrl 
          ? "Open WhatsApp on your phone, tap Menu or Settings and select WhatsApp Web. Point your phone to this screen to capture the QR code."
          : "To use WhatsApp in this app, you'll need to connect your account. Click below to get a QR code, then scan it with your WhatsApp mobile app."
        }
      </p>

      {!qrCodeDataUrl && (
        <Button 
          onClick={handleConnect} 
          disabled={isConnecting}
          className="flex items-center gap-2"
        >
          {isConnecting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Generating QR Code...
            </>
          ) : (
            <>
              <QrCode className="w-4 h-4" />
              Connect WhatsApp
            </>
          )}
        </Button>
      )}

      {qrCodeDataUrl && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader className="w-4 h-4 animate-spin" />
          Waiting for scan...
        </div>
      )}
    </Card>
  );
};