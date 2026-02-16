import Chart from 'chart.js/auto';

const form = document.getElementById('transaction-form');
const ctx = document.getElementById('summaryChart').getContext('2d');

// ✅ Use the correct live backend URL
const API_URL = "https://pfms-backend-1.onrender.com/api";

// --- Helper: Get token from localStorage ---
function getToken() {
  return localStorage.getItem('token');
}

// --- Login flow ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) throw new Error(`Login failed: ${res.status}`);
      const data = await res.json();

      // Save token + role
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      alert("Login successful!");
      loadSummary(); // load reports after login
    } catch (err) {
      console.error(err);
      alert("Error logging in");
    }
  });
}

// --- Fetch summary data ---
async function loadSummary() {
  try {
    const res = await fetch(`${API_URL}/summary`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch summary: ${res.status}`);
    const data = await res.json();
    updateChart(data);
  } catch (err) {
    console.error(err);
    alert("Error loading summary data");
  }
}

function updateChart(data) {
  const months = Object.keys(data);
  chart.data.labels = months;
  chart.data.datasets[0].data = months.map(m => data[m].income);
  chart.data.datasets[1].data = months.map(m => data[m].expense);
  chart.update();
}

// --- Handle transaction form submit ---
form.addEventListener('submit', async e => {
  e.preventDefault();
  const amount = Number(document.getElementById('amount').value);
  if (amount <= 0) {
    alert("Amount must be greater than 0");
    return;
  }
  const payload = {
    type: document.getElementById('type').value,
    category: document.getElementById('category').value,
    amount,
    note: document.getElementById('note').value
  };

  try {
    const res = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Failed to add transaction: ${res.status}`);
    form.reset();
    loadSummary();
  } catch (err) {
    console.error(err);
    alert("Error saving transaction");
  }
});

// --- Chart setup ---
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      { label:'Income', data:[], backgroundColor:'#2c7a7b' },
      { label:'Expense', data:[], backgroundColor:'#e53e3e' }
    ]
  },
  options: { responsive:true, plugins:{ legend:{ position:'bottom' } } }
});

// --- Initial load (only if logged in) ---
if (getToken()) {
  loadSummary();
}
