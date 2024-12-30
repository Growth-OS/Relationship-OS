import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";

export const useTransactionsFetch = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchTransactions = async (selectedDate: Date) => {
    const startDate = startOfMonth(selectedDate);
    const endDate = endOfMonth(selectedDate);

    const { data: transactions, error } = await supabase
      .from('financial_transactions')
      .select(`
        *,
        transaction_attachments (
          id,
          file_name,
          file_path
        )
      `)
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString())
      .order('date', { ascending: true });

    if (error) throw error;
    return transactions;
  };

  return {
    isGenerating,
    setIsGenerating,
    fetchTransactions,
  };
};