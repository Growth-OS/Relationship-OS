export type TransactionType = 'income' | 'expense';

export interface FinancialTransaction {
  id: string;
  created_at: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  date: string;
  category: string | null;
  notes: string | null;
}

export interface TransactionAttachment {
  id: string;
  created_at: string;
  transaction_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
}

export interface AffiliatePartner {
  id: string;
  created_at: string;
  name: string;
  program: string;
  commission_rate: string | null;
  login_email: string | null;
  login_password: string | null;
  dashboard_url: string | null;
  user_id: string;
}

export interface AffiliateEarning {
  id: string;
  created_at: string;
  partner_id: string;
  amount: number;
  date: string;
  notes: string | null;
  user_id: string;
}