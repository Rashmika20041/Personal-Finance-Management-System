export interface Expense {
  id: number;
  date: string;
  category: string;
  amount: number;
  paymentMethod: string;
  notes: string;
}

export interface Budget {
  id: number;
  name: string;
  category: string;
  amount: number;
  spent: number;
  duration: string;
  threshold?: number; // Optional: percentage for alert
}

export interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentContribution: number;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Income {
  id: number;
  date: string;
  source: string;
  amount: number;
  type: 'Salary' | 'Freelance' | 'Investment' | 'Business' | 'Other';
  notes: string;
}

export const mockExpenses: Expense[] = [
    { id: 1, date: "2025-09-28", category: "Groceries", amount: 75.50, paymentMethod: "Credit Card", notes: "Weekly shopping" },
    { id: 2, date: "2025-09-27", category: "Utilities", amount: 150.00, paymentMethod: "Bank Transfer", notes: "Electricity bill" },
    { id: 3, date: "2025-09-26", category: "Transport", amount: 30.00, paymentMethod: "Debit Card", notes: "Metro pass" },
    { id: 4, date: "2025-09-25", category: "Entertainment", amount: 50.00, paymentMethod: "Credit Card", notes: "Movie night" },
    { id: 5, date: "2025-09-24", category: "Groceries", amount: 45.20, paymentMethod: "Debit Card", notes: "Milk and bread" },
    { id: 6, date: "2025-09-23", category: "Dining Out", amount: 65.00, paymentMethod: "Credit Card", notes: "Dinner with friends" },
    { id: 7, date: "2025-09-22", category: "Health", amount: 25.00, paymentMethod: "Cash", notes: "Pharmacy" },
];

export const mockBudgets: Budget[] = [
    { id: 1, name: "Monthly Groceries", category: "Groceries", amount: 400, spent: 120.70, duration: "Monthly", threshold: 80 },
    { id: 2, name: "Entertainment Fund", category: "Entertainment", amount: 150, spent: 50.00, duration: "Monthly", threshold: 75 },
    { id: 3, name: "Transport Budget", category: "Transport", amount: 100, spent: 30.00, duration: "Monthly", threshold: 90 },
];

export const mockSavingsGoals: SavingsGoal[] = [
    { id: 1, name: "New Laptop", targetAmount: 1500, currentContribution: 750, deadline: "2026-06-30", priority: "High" },
    { id: 2, name: "Vacation Fund", targetAmount: 2000, currentContribution: 1500, deadline: "2026-12-31", priority: "Medium" },
];

export const mockIncome: Income[] = [
    { id: 1, date: "2025-09-30", source: "Software Engineer Salary", amount: 5000.00, type: "Salary", notes: "Monthly salary payment" },
    { id: 2, date: "2025-09-15", source: "Freelance Web Development", amount: 800.00, type: "Freelance", notes: "Client project payment" },
    { id: 3, date: "2025-09-10", source: "Stock Dividends", amount: 150.00, type: "Investment", notes: "Quarterly dividend payment" },
    { id: 4, date: "2025-09-01", source: "Software Engineer Salary", amount: 5000.00, type: "Salary", notes: "Monthly salary payment" },
    { id: 5, date: "2025-08-30", source: "Software Engineer Salary", amount: 5000.00, type: "Salary", notes: "Monthly salary payment" },
];

export const savingsTrendData = [
    { name: 'Jan', savings: 100 },
    { name: 'Feb', savings: 150 },
    { name: 'Mar', savings: 200 },
    { name: 'Apr', savings: 220 },
    { name: 'May', savings: 300 },
    { name: 'Jun', savings: 350 },
    { name: 'Jul', savings: 400 },
    { name: 'Aug', savings: 410 },
    { name: 'Sep', savings: 500 },
];