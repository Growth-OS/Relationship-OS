import { LucideIcon, FileText, Briefcase, BookOpen, Lightbulb, Users } from "lucide-react";
import { TaskSource } from "./types";

export const getSourceIcon = (source: TaskSource): LucideIcon => {
  switch (source) {
    case "content":
      return FileText;
    case "deals":
      return Briefcase;
    case "substack":
      return BookOpen;
    case "ideas":
      return Lightbulb;
    case "outreach":
      return Users;
    default:
      return FileText;
  }
};