import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinancialSummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expenses' | 'net';
}

export const FinancialSummaryCard = ({ title, amount, type }: FinancialSummaryCardProps) => {
  const gradients = {
    income: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
    expenses: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
    net: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
  };

  const textColors = {
    income: 'text-green-600 dark:text-green-400',
    expenses: 'text-red-600 dark:text-red-400',
    net: amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  };

  return (
    <Card className={`bg-gradient-to-br ${gradients[type]}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${textColors[type]}`}>
          €{amount.toFixed(2)}
        </div>
      </CardContent>
    </Card>
  );
};