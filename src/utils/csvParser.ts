/**
 * CSV Parser for bank statements
 * Extracts transaction dates and amounts to calculate monthly spending
 */

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
}

export interface MonthlySpending {
  name: string; // Month name (e.g., "January", "February")
  spending: number;
}

export interface DailySpending {
  name: string; // Date (e.g., "Jan 1", "Jan 2")
  spending: number;
}

export interface WeeklySpending {
  name: string; // Week label (e.g., "Week 1", "Week 2")
  spending: number;
}

export interface CSVParseResult {
  transactions: ParsedTransaction[];
  monthlySpending: MonthlySpending[];
  dailySpending: DailySpending[];
  weeklySpending: WeeklySpending[];
  totalSpending: number;
  transactionCount: number;
}

/**
 * Find the index of a column by looking for common header names
 */
function findColumnIndex(headers: string[], patterns: string[]): number {
  for (const header of headers) {
    const normalized = header.toLowerCase().trim();
    for (const pattern of patterns) {
      if (normalized.includes(pattern.toLowerCase())) {
        return headers.indexOf(header);
      }
    }
  }
  return -1;
}

/**
 * Get ISO week number for a date
 */
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Get the start date of the week (Monday)
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Parse CSV content and extract monthly spending
 */
export function parseCSV(csvContent: string): CSVParseResult {
  const lines = csvContent.split('\n').filter(line => line.trim());

  if (lines.length < 2) {
    return {
      transactions: [],
      monthlySpending: [],
      dailySpending: [],
      weeklySpending: [],
      totalSpending: 0,
      transactionCount: 0,
    };
  }

  // Parse headers
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine);

  // Find column indices - support various bank formats
  const dateColIndex = findColumnIndex(headers, [
    'date',
    'transaction date',
    'posted',
    'posted date',
  ]);

  const amountColIndex = findColumnIndex(headers, [
    'amount',
  ]);

  const descColIndex = findColumnIndex(headers, [
    'description',
    'name',
    'merchant',
    'payee',
    'details',
  ]);

  // Look for transaction type column (debit/credit indicator)
  // Be specific - look for exact match or columns that indicate type, not date
  const typeColIndex = findColumnIndex(headers, [
    'type of transaction',
    'trans type',
    'transaction type',
    'type',
    'debit/credit',
    'dr/cr',
  ]);
  
  // If not found, check if there's a column called exactly "Transaction" (case-insensitive)
  let actualTypeColIndex = typeColIndex;
  if (actualTypeColIndex === -1) {
    actualTypeColIndex = headers.findIndex(h => h.toLowerCase().trim() === 'transaction');
  }
  
  console.log('📊 CSV Parser - Column indices:', {
    date: dateColIndex,
    amount: amountColIndex,
    desc: descColIndex,
    type: actualTypeColIndex,
    headers: headers
  });

  if (dateColIndex === -1 || amountColIndex === -1) {
    console.warn('⚠️  Could not find required columns. Headers:', headers);
    return {
      transactions: [],
      monthlySpending: [],
      dailySpending: [],
      weeklySpending: [],
      totalSpending: 0,
      transactionCount: 0,
    };
  }

  // Parse transactions
  const transactions: ParsedTransaction[] = [];
  const monthlyMap = new Map<string, number>();
  const dailyMap = new Map<string, number>();
  const weeklyMap = new Map<string, { spending: number; startDate: Date }>();
  let totalSpending = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCSVLine(line);

    if (fields.length <= Math.max(dateColIndex, amountColIndex)) {
      continue; // Skip malformed rows
    }

    const dateStr = fields[dateColIndex]?.trim() || '';
    const amountStr = fields[amountColIndex]?.trim() || '';
    const desc = descColIndex >= 0 ? fields[descColIndex]?.trim() || '' : '';
    const typeStr = actualTypeColIndex >= 0 ? fields[actualTypeColIndex]?.trim().toLowerCase() || '' : '';

    // Parse amount (remove $ and commas)
    let amount = 0;
    try {
      const cleanAmount = amountStr.replace(/[$,]/g, '').trim();
      amount = parseFloat(cleanAmount);
    } catch {
      continue; // Skip if amount can't be parsed
    }

    if (isNaN(amount)) {
      continue;
    }

    // If there's a type column, only include 'debit' transactions
    // If no type column exists, include all transactions
    if (actualTypeColIndex >= 0 && typeStr !== 'debit') {
      continue;
    }

    // Use absolute value for spending
    const spendingAmount = Math.abs(amount);

    // Parse date
    let date = new Date();
    if (dateStr) {
      date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        continue; // Skip if date is invalid
      }
    }

    // Store transaction
    transactions.push({
      date: date.toISOString().split('T')[0],
      description: desc,
      amount: spendingAmount,
    });

    // Aggregate monthly spending
    const monthKey = date.toLocaleString('en-US', { year: 'numeric', month: 'long' });
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + spendingAmount);

    // Aggregate daily spending - use timezone-safe date formatting
    // Get UTC date components to avoid timezone shifts
    const utcYear = date.getUTCFullYear();
    const utcMonth = date.getUTCMonth();
    const utcDate = date.getUTCDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayKey = `${monthNames[utcMonth]} ${utcDate}`;
    dailyMap.set(dayKey, (dailyMap.get(dayKey) || 0) + spendingAmount);

    // Aggregate weekly spending (Monday-Sunday weeks)
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split('T')[0]; // Use actual week start date as key
    if (!weeklyMap.has(weekKey)) {
      weeklyMap.set(weekKey, { spending: 0, startDate: weekStart });
    }
    const weekData = weeklyMap.get(weekKey)!;
    weekData.spending += spendingAmount;

    totalSpending += spendingAmount;
  }

  // Convert monthly map to array, sorted by date
  const monthlySpending: MonthlySpending[] = Array.from(monthlyMap.entries())
    .map(([name, spending]) => ({ name, spending }))
    .sort((a, b) => {
      // Sort by month chronologically
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
      return dateA.getTime() - dateB.getTime();
    });

  // Convert daily map to array
  const dailySpending: DailySpending[] = Array.from(dailyMap.entries())
    .map(([name, spending]) => ({ name, spending }))
    .sort((a, b) => {
      // Sort chronologically by parsing date
      const months: { [key: string]: number } = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
      };
      const parts_a = a.name.trim().split(/\s+/);
      const parts_b = b.name.trim().split(/\s+/);
      const monthA = parts_a[0];
      const dayA = parseInt(parts_a[1]);
      const monthB = parts_b[0];
      const dayB = parseInt(parts_b[1]);
      // Create dates with proper day-of-month (not month index)
      const dateA = new Date(new Date().getFullYear(), months[monthA] - 1, dayA);
      const dateB = new Date(new Date().getFullYear(), months[monthB] - 1, dayB);
      return dateA.getTime() - dateB.getTime();
    });

  // Convert weekly map to array
  const weeklySpending: WeeklySpending[] = Array.from(weeklyMap.entries())
    .map(([_, weekData]) => {
      const weekEnd = new Date(weekData.startDate);
      weekEnd.setDate(weekEnd.getDate() + 6); // Sunday of the week
      const startDate = weekData.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endDay = weekEnd.getDate(); // Just the day number
      return {
        name: `${startDate} - ${endDay}`,
        spending: weekData.spending,
        startDate: weekData.startDate
      };
    })
    .sort((a, b) => (a.startDate as any).getTime() - (b.startDate as any).getTime())
    .map(({ name, spending }) => ({ name, spending }));

  return {
    transactions,
    monthlySpending,
    dailySpending,
    weeklySpending,
    totalSpending: Math.round(totalSpending * 100) / 100,
    transactionCount: transactions.length,
  };
}
