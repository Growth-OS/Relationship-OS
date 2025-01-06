import { 
  Briefcase, 
  Building2, 
  FileText, 
  Lightbulb, 
  ListTodo, 
  LucideIcon, 
  Newspaper 
} from "lucide-react";

export const getSourceIcon = (source: string): LucideIcon => {
  switch (source.toLowerCase()) {
    case 'projects':
      return Briefcase;
    case 'deals':
      return Building2;
    case 'sequences':
      return ListTodo;
    case 'substack':
      return Newspaper;
    case 'ideas':
      return Lightbulb;
    default:
      return FileText;
  }
};