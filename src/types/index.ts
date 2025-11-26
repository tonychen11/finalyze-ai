export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  merchant: string;
  category: string;
  amount: number;
}

export interface CategorySpending {
  name: string;
  value: number;
}

export interface MonthlySpending {
  name: string; // e.g., "Jan", "Feb"
  spending: number;
}

export interface DailySpending {
  name: string; // e.g., "Jan 1"
  spending: number;
}

export interface WeeklySpending {
  name: string; // e.g., "Week of Jan 1"
  spending: number;
}

export interface AISummary {
  summary: string;
  insights: string[];
  recommendations: string[];
}

export interface AnalysisResult {
  categorySpending: CategorySpending[];
  monthlySpending: MonthlySpending[];
  dailySpending: DailySpending[];
  weeklySpending: WeeklySpending[];
  aiSummary: AISummary;
  totalSpending: number;
  transactionCount: number;
  topCategory: CategorySpending | null;
}
