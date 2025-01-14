import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateLeadFormProps {
  onSuccess: () => void;
}

export const CreateLeadForm = ({ onSuccess }: CreateLeadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    first_name: "",
    contact_email: "",
    contact_job_title: "",
    contact_linkedin: "",
    company_website: "",
    source: "other",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('leads')
        .insert([formData]);

      if (error) throw error;

      toast.success("Lead created successfully");
      onSuccess();
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error("Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSourceChange = (value: string) => {
    setFormData(prev => ({ ...prev, source: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company_name">Company Name *</Label>
        <Input
          id="company_name"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="first_name">Contact First Name</Label>
        <Input
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_email">Contact Email</Label>
        <Input
          id="contact_email"
          name="contact_email"
          type="email"
          value={formData.contact_email}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_job_title">Job Title</Label>
        <Input
          id="contact_job_title"
          name="contact_job_title"
          value={formData.contact_job_title}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_linkedin">LinkedIn Profile</Label>
        <Input
          id="contact_linkedin"
          name="contact_linkedin"
          value={formData.contact_linkedin}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_website">Company Website</Label>
        <Input
          id="company_website"
          name="company_website"
          value={formData.company_website}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="source">Source</Label>
        <Select
          value={formData.source}
          onValueChange={handleSourceChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
            <SelectItem value="conference">Conference</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Lead"}
      </Button>
    </form>
  );
};