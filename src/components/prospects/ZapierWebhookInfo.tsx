import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { CopyIcon, CheckIcon } from "lucide-react";

export const ZapierWebhookInfo = () => {
  const [copied, setCopied] = useState(false);
  const webhookUrl = "https://steunfbcpofecftasvin.supabase.co/functions/v1/webhooks";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      toast.success("Webhook URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy webhook URL");
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Zapier Webhook Integration</h3>
      <p className="text-sm text-gray-600">
        Use this webhook URL in your Zapier workflow to automatically create prospects in Growth OS.
      </p>
      
      <div className="flex gap-2">
        <Input 
          value={webhookUrl}
          readOnly
          className="font-mono text-sm"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          className="shrink-0"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Required Payload Format:</h4>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  "type": "prospect",
  "userId": "your-user-id",
  "data": {
    "company_name": "Company Name",
    "contact_email": "email@example.com",
    "contact_job_title": "Job Title",
    "source": "website",
    "notes": "Additional notes"
  }
}`}
        </pre>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Required Headers:</h4>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  "x-webhook-secret": "your-webhook-secret",
  "Content-Type": "application/json"
}`}
        </pre>
      </div>

      <div className="text-sm text-gray-600">
        <p>To set up with Zapier:</p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>Create a new Zap</li>
          <li>Choose your trigger (when something happens)</li>
          <li>For the action, choose "Webhooks by Zapier" and select "POST"</li>
          <li>Use the webhook URL above</li>
          <li>Add the required headers</li>
          <li>Format your data according to the payload format</li>
        </ol>
      </div>
    </div>
  );
};