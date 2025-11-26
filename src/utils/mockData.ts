import { CategorySpending, MonthlySpending } from '@/types';

export const MOCK_CATEGORY_SPENDING: CategorySpending[] = [
  { name: 'Dining', value: 450.75 },
  { name: 'Groceries', value: 620.50 },
  { name: 'Shopping', value: 310.20 },
  { name: 'Transport', value: 150.00 },
  { name: 'Utilities', value: 210.80 },
  { name: 'Entertainment', value: 180.40 },
  { name: 'Health', value: 95.00 },
];

export const MOCK_MONTHLY_SPENDING: MonthlySpending[] = [
  { name: 'Jan', spending: 1800 },
  { name: 'Feb', spending: 1650 },
  { name: 'Mar', spending: 2100 },
  { name: 'Apr', spending: 1950 },
  { name: 'May', spending: 2200 },
  { name: 'Jun', spending: 2050 },
];

export const MOCK_TOTAL_SPENDING = MOCK_CATEGORY_SPENDING.reduce((acc, item) => acc + item.value, 0);
export const MOCK_TRANSACTION_COUNT = 83;
