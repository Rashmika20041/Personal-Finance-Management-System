const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:5000/api';

async function testBudgetExpenseIntegration() {
  console.log('🧪 Testing Budget-Expense Integration...\n');

  try {
    // Register/Login
    console.log('📝 Registering test user...');
    const registerRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const loginData = await loginRes.json();
    const token = loginData.token;

    console.log('✅ Login successful\n');

    // Create a budget
    console.log('➕ Creating budget for Groceries...');
    const budgetRes = await fetch(`${API_BASE}/budgets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Monthly Groceries',
        category: 'Groceries',
        amount: 500,
        duration: 'Monthly'
      })
    });

    const budget = await budgetRes.json();
    console.log(`✅ Budget created with spent: $${budget.spent}\n`);

    // Add expenses
    console.log('🛒 Adding grocery expenses...');
    const expense1 = await fetch(`${API_BASE}/expense`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: 50,
        category: 'Groceries',
        date: '2025-11-03',
        paymentMethod: 'Credit Card'
      })
    });

    const expense2 = await fetch(`${API_BASE}/expense`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: 75,
        category: 'Groceries',
        date: '2025-11-03',
        paymentMethod: 'Debit Card'
      })
    });

    console.log('✅ Expenses added\n');

    // Check if budget spent was updated
    console.log('📊 Checking if budget spent was updated...');
    const updatedBudgetRes = await fetch(`${API_BASE}/budgets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const budgets = await updatedBudgetRes.json();
    const updatedBudget = budgets.find(b => b._id === budget._id);

    console.log(`📈 Budget spent amount: $${updatedBudget.spent} (expected: $125)`);

    if (updatedBudget.spent === 125) {
      console.log('✅ SUCCESS: Budget spent amount updated correctly!\n');
    } else {
      console.log('❌ FAILED: Budget spent amount not updated correctly\n');
    }

    // Clean up
    console.log('🧹 Cleaning up test data...');
    await fetch(`${API_BASE}/expense/${JSON.parse(await expense1.text())._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    await fetch(`${API_BASE}/expense/${JSON.parse(await expense2.text())._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    await fetch(`${API_BASE}/budgets/${budget._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('✅ Cleanup completed\n');
    console.log('🎉 Budget-Expense Integration Test Completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBudgetExpenseIntegration();