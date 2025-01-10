import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Quote {
  content: string;
  author: string;
}

const Quotes = () => {
  const today = new Date().toDateString();
  const [storedQuote, setStoredQuote] = useLocalStorage<Quote | null>(`daily-quote-${today}`, null);

  const { data: quote, isLoading, isError, refetch } = useQuery({
    queryKey: ["dailyQuote", today],
    queryFn: async () => {
      const response = await fetch("https://api.quotable.io/random?tags=inspirational,motivational");
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      const data = await response.json();
      const newQuote = { content: data.content, author: data.author };
      setStoredQuote(newQuote);
      return newQuote;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    initialData: storedQuote,
    retry: 2
  });

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Daily Inspiration</h1>
        <Card className="p-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <p className="text-red-500">Failed to load quote. Please try again.</p>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daily Inspiration</h1>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          New Quote
        </Button>
      </div>
      <Card className="p-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : quote ? (
          <div className="space-y-4">
            <p className="text-2xl text-gray-700 dark:text-gray-300 italic">"{quote.content}"</p>
            <p className="text-gray-500 dark:text-gray-400">— {quote.author}</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export default Quotes;