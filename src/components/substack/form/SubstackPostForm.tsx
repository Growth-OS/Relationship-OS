import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubstackPostStatus } from "../types";

interface SubstackPostFormProps {
  title: string;
  setTitle: (value: string) => void;
  url: string;
  setUrl: (value: string) => void;
  status: SubstackPostStatus;
  setStatus: (value: SubstackPostStatus) => void;
  publishDate: string;
  setPublishDate: (value: string) => void;
}

export const SubstackPostForm = ({
  title,
  setTitle,
  url,
  setUrl,
  status,
  setStatus,
  publishDate,
  setPublishDate,
}: SubstackPostFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="status"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Status
          </label>
          <Select value={status} onValueChange={(value: SubstackPostStatus) => setStatus(value)}>
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
          <label
            htmlFor="publishDate"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Publish Date
          </label>
          <Input
            id="publishDate"
            type="date"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="url"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Google Doc URL
        </label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste your Google Doc URL here..."
          required
        />
      </div>
    </div>
  );
};