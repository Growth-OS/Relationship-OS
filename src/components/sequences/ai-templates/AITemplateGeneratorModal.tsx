import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { useGenerateTemplate } from "./hooks/useGenerateTemplate";

interface AITemplateGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateSelect: (template: string) => void;
  stepType: string;
  stepNumber: number;
}

interface TemplateFormValues {
  industry: string;
  tone: string;
  valueProposition: string;
  targetRole: string;
  painPoints: string;
}

export const AITemplateGeneratorModal = ({
  open,
  onOpenChange,
  onTemplateSelect,
  stepType,
  stepNumber,
}: AITemplateGeneratorModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const { generateTemplate, isGenerating } = useGenerateTemplate();

  const form = useForm<TemplateFormValues>({
    defaultValues: {
      industry: "",
      tone: "professional",
      valueProposition: "",
      targetRole: "",
      painPoints: "",
    },
  });

  const handleSubmit = async (values: TemplateFormValues) => {
    try {
      const template = await generateTemplate({
        ...values,
        stepType,
        stepNumber,
      });
      
      if (template) {
        setSelectedTemplate(template);
      }
    } catch (error) {
      console.error("Error generating template:", error);
      toast.error("Failed to generate template. Please try again.");
    }
  };

  const handleUseTemplate = () => {
    onTemplateSelect(selectedTemplate);
    onOpenChange(false);
    form.reset();
    setSelectedTemplate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Message Template Generator</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry/Vertical</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. SaaS, Healthcare, Finance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Tone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Role/Position</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CTO, Marketing Director" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valueProposition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value Proposition</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What unique value do you offer?"
                      className="h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="painPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Pain Points</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What problems does your target audience face?"
                      className="h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Template
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        {selectedTemplate && (
          <div className="mt-6 space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Generated Template</h3>
              <p className="whitespace-pre-wrap text-sm">{selectedTemplate}</p>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleUseTemplate}>Use This Template</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};