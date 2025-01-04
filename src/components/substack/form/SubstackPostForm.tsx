import React from "react";
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
import { SubstackPostFormData, SubstackPostStatus } from "@/components/substack/types";

interface SubstackPostFormProps {
  initialData?: {
    title: string;
    content: string;
    status: SubstackPostStatus;
    publish_date: string;
  };
  onSubmit: (data: SubstackPostFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export const SubstackPostForm: React.FC<SubstackPostFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit,
}) => {
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [content, setContent] = React.useState(initialData?.content || "");
  const [status, setStatus] = React.useState<SubstackPostStatus>(
    initialData?.status || "idea"
  );
  const [publishDate, setPublishDate] = React.useState(
    initialData?.publish_date || new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      status,
      publish_date: publishDate,
      user_id: "", // This will be set in the mutation
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Google Doc URL</Label>
        <Input
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your Google Doc URL here"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={status}
          onValueChange={(value: SubstackPostStatus) => setStatus(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="idea">Idea</SelectItem>
            <SelectItem value="writing">Writing</SelectItem>
            <SelectItem value="passed_to_fausta">Passed to Fausta</SelectItem>
            <SelectItem value="schedule">Schedule</SelectItem>
            <SelectItem value="live">Live</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="publishDate">Publish Date</Label>
        <Input
          id="publishDate"
          type="date"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
};