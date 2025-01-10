import { Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface DashboardHeaderProps {
  firstName: string;
}

interface Quote {
  content: string;
  author: string;
}

export const DashboardHeader = ({ firstName }: DashboardHeaderProps) => {
  const today = new Date().toDateString();
  const [storedQuote, setStoredQuote] = useLocalStorage<Quote | null>(`daily-quote-${today}`, null);

  const { data: quote } = useQuery({
    queryKey: ["dailyQuote", today],
    queryFn: async () => {
      if (storedQuote) return storedQuote;
      
      const response = await fetch("https://api.quotable.io/random?tags=inspirational,motivational");
      const data = await response.json();
      const newQuote = { content: data.content, author: data.author };
      setStoredQuote(newQuote);
      return newQuote;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    initialData: storedQuote,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Welcome back, {firstName}!
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Here's an overview of your business activities and upcoming tasks.
      </p>
      {quote && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 italic">"{quote.content}"</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">— {quote.author}</p>
        </div>
      )}
    </div>
  );
};