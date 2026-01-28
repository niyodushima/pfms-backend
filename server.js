const form = document.getElementById('transaction-form');
const ctx = document.getElementById('summaryChart').getContext('2d');

// Use your live backend URL
const API_URL = "https://pfms-backend1.onrender.com/api";

// Fetch summary data from backend
async function loadSummary() {
  const res = await fetch(`${API_URL}/summary`);
  const data = await res.json();

  const months = Object.keys(data);
  const income = months.map(m => data[m].income);
  const expense = months.map(m => data[m].expense);

  chart.data.labels = months;
  chart.data.datasets[0].data = income;
  chart.data.datasets[1].data = expense;
  chart.update();
}

// Handle form submit
form.addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    type: document.getElementById('type').value,
    category: document.getElementById('category').value,
    amount: Number(document.getElementById('amount').value),
    note: document.getElementById('note').value
  };

  await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  form.reset();
  loadSummary(); // refresh chart with backend data
});

// Chart setup
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

// Initial load
loadSummary();

