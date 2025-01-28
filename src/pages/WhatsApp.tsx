import { WhatsAppChat } from "@/components/whatsapp/WhatsAppChat";

const WhatsApp = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">WhatsApp Messages</h1>
        <p className="text-muted-foreground">Manage your WhatsApp conversations</p>
      </div>
      <WhatsAppChat />
    </div>
  );
};

export default WhatsApp;