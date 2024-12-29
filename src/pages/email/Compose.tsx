import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ComposeEmailForm {
  to: string;
  subject: string;
  body: string;
}

const ComposePage = () => {
  const [isSending, setIsSending] = useState(false);
  const { register, handleSubmit, reset } = useForm<ComposeEmailForm>();

  const onSubmit = async (data: ComposeEmailForm) => {
    setIsSending(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send email");

      toast.success("Email sent successfully");
      reset();
    } catch (error) {
      toast.error("Failed to send email");
      console.error("Error sending email:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Compose Email</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            placeholder="To"
            {...register("to", { required: true })}
            className="w-full"
          />
        </div>
        <div>
          <Input
            placeholder="Subject"
            {...register("subject", { required: true })}
            className="w-full"
          />
        </div>
        <div>
          <Textarea
            placeholder="Write your message..."
            {...register("body", { required: true })}
            className="w-full min-h-[200px]"
          />
        </div>
        <Button type="submit" disabled={isSending}>
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Send"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ComposePage;