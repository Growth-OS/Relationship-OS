import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionsList } from "@/components/finances/TransactionsList";
import { CreateTransactionButton } from "@/components/finances/CreateTransactionButton";
import { FinancialOverview } from "@/components/finances/FinancialOverview";
import { ExportTransactions } from "@/components/finances/ExportTransactions";
import { MonthlyReport } from "@/components/finances/MonthlyReport";
import { TooltipProvider } from "@/components/ui/tooltip";

const Finances = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-primary mb-1">Finances</h1>
          <p className="text-sm text-muted-foreground">Manage your income and expenses</p>
        </div>
        <div className="flex gap-2">
          <MonthlyReport />
          <ExportTransactions />
          <CreateTransactionButton />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <FinancialOverview />

        <Card className="mt-6">
          <TooltipProvider>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <TransactionsList />
              </TabsContent>
              <TabsContent value="income" className="mt-0">
                <TransactionsList type="income" />
              </TabsContent>
              <TabsContent value="expenses" className="mt-0">
                <TransactionsList type="expense" />
              </TabsContent>
            </Tabs>
          </TooltipProvider>
        </Card>
      </div>
    </div>
  );
};

export default Finances;