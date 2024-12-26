import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionsList } from "@/components/finances/TransactionsList";
import { CreateTransactionButton } from "@/components/finances/CreateTransactionButton";
import { FinancialOverview } from "@/components/finances/FinancialOverview";

const Finances = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Finances</h1>
          <p className="text-sm text-gray-600">Manage your income and expenses</p>
        </div>
        <CreateTransactionButton />
      </div>

      <FinancialOverview />

      <Card className="p-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="all">
              <TransactionsList />
            </TabsContent>
            <TabsContent value="income">
              <TransactionsList type="income" />
            </TabsContent>
            <TabsContent value="expenses">
              <TransactionsList type="expense" />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default Finances;