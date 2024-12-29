import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const SendEmailForm = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          from,
          to: to.split(",").map(email => email.trim()),
          subject,
          html: content,
        },
      });

      if (error) throw error;

      toast.success("Email sent successfully!");
      setFrom("");
      setTo("");
      setSubject("");
      setContent("");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="from" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          From
        </label>
        <Input
          id="from"
          type="email"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          To (comma-separated emails)
        </label>
        <Input
          id="to"
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="email@example.com, another@example.com"
          required
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Subject
        </label>
        <Input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Email subject"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Content
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your email content here..."
          className="h-32"
          required
        />
      </div>

      <Button type="submit" disabled={isSending}>
        {isSending ? "Sending..." : "Send Email"}
      </Button>
    </form>
  );
};