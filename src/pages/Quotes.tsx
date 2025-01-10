import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Quote {
  content: string;
  author: string;
}

const Quotes = () => {
  const today = new Date().toDateString();
  const [storedQuote, setStoredQuote] = useLocalStorage<Quote | null>(`daily-quote-${today}`, null);

  const { data: quote, refetch } = useQuery({
    queryKey: ["dailyQuote", today],
    queryFn: async () => {
      const response = await fetch("https://api.quotable.io/random?tags=inspirational,motivational");
      const data = await response.json();
      const newQuote = { content: data.content, author: data.author };
      setStoredQuote(newQuote);
      return newQuote;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    initialData: storedQuote,
  });

  if (!quote) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daily Inspiration</h1>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          New Quote
        </Button>
      </div>
      <Card className="p-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <p className="text-2xl text-gray-700 dark:text-gray-300 italic">"{quote.content}"</p>
          <p className="text-gray-500 dark:text-gray-400">— {quote.author}</p>
        </div>
      </Card>
    </div>
  );
};

export default Quotes;