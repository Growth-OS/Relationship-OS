import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Quote {
  content: string;
  author: string;
}

const fallbackQuote: Quote = {
  content: "The way to get started is to quit talking and begin doing.",
  author: "Walt Disney"
};

export const DashboardQuote = () => {
  const { toast } = useToast();
  const today = new Date().toDateString();
  const [storedQuote, setStoredQuote] = useLocalStorage<Quote | null>(`daily-quote-${today}`, null);

  const { data: quote, isError } = useQuery({
    queryKey: ["dailyQuote", today],
    queryFn: async () => {
      if (storedQuote) {
        const storedDate = localStorage.getItem('quote-date');
        if (storedDate === today) {
          return storedQuote;
        }
      }
      
      try {
        const response = await fetch("https://api.quotable.io/random?tags=business,success");
        if (!response.ok) {
          throw new Error("Failed to fetch quote");
        }
        const data = await response.json();
        const newQuote = { content: data.content, author: data.author };
        setStoredQuote(newQuote);
        localStorage.setItem('quote-date', today);
        return newQuote;
      } catch (error) {
        console.error("Error fetching quote:", error);
        return fallbackQuote;
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  if (isError) {
    toast({
      title: "Error loading quote",
      description: "Using fallback quote instead",
      variant: "destructive",
    });
  }

  return (
    <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
      <div className="p-6">
        <div className="space-y-3">
          <p className="text-xl text-gray-700 dark:text-gray-300 italic leading-relaxed">"{quote?.content || fallbackQuote.content}"</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">— {quote?.author || fallbackQuote.author}</p>
        </div>
      </div>
    </Card>
  );
};