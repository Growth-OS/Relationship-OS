import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card } from "@/components/ui/card";

interface Quote {
  content: string;
  author: string;
}

// Fallback quote in case the API fails
const fallbackQuote: Quote = {
  content: "The way to get started is to quit talking and begin doing.",
  author: "Walt Disney"
};

export const DashboardQuote = () => {
  const today = new Date().toDateString();
  const [storedQuote, setStoredQuote] = useLocalStorage<Quote | null>(`daily-quote-${today}`, null);

  const { data: quote } = useQuery({
    queryKey: ["dailyQuote", today],
    queryFn: async () => {
      try {
        if (storedQuote) return storedQuote;
        
        const response = await fetch("https://api.quotable.io/random?tags=business,success");
        if (!response.ok) {
          console.error("Quote API error:", response.statusText);
          return fallbackQuote;
        }
        const data = await response.json();
        const newQuote = { content: data.content, author: data.author };
        setStoredQuote(newQuote);
        return newQuote;
      } catch (error) {
        console.error("Error fetching quote:", error);
        return fallbackQuote;
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    initialData: storedQuote,
  });

  if (!quote) return null;

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Daily Inspiration</h2>
      <div className="space-y-2">
        <p className="text-gray-700 dark:text-gray-300 italic">"{quote.content}"</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">— {quote.author}</p>
      </div>
    </Card>
  );
};