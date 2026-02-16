import Chart from 'chart.js/auto';

const form = document.getElementById('transaction-form');
const ctx = document.getElementById('summaryChart').getContext('2d');

const API_URL = "https://pfms-backend-1.onrender.com/api";

function getToken() {
  return localStorage.getItem('token');
}

// --- Registration flow ---
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role })
      });
      if (!res.ok) throw new Error(`Registration failed: ${res.status}`);
      alert("Registration successful! You can now log in.");
      registerForm.reset();
    } catch (err) {
      console.error(err);
      alert("Error registering user");
    }
  });
}

// --- Login flow ---
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');

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

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      alert("Login successful!");
      logoutBtn.style.display = "block";
      loadSummary();
    } catch (err) {
      console.error(err);
      alert("Error logging in");
    }
  });
}

// --- Logout flow ---
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    alert("Logged out successfully");
    logoutBtn.style.display = "none";
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
  logoutBtn.style.display = "block";
  loadSummary();
}
