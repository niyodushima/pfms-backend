const form = document.getElementById('transaction-form');
const ctx = document.getElementById('summaryChart').getContext('2d');

// Use your live backend URL
const API_URL = "https://pfms-backend1.onrender.com/api";

// Fetch summary data
async function loadSummary() {
  try {
    const res = await fetch(`${API_URL}/summary`);
    if (!res.ok) throw new Error("Failed to fetch summary");
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

// Handle form submit
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

  await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  form.reset();
  loadSummary();
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
