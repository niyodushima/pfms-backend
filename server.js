const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Transaction model
const Transaction = mongoose.model('Transaction', new mongoose.Schema({
  type: String,
  category: String,
  amount: Number,
  note: String,
  date: { type: Date, default: Date.now }
}));

// Routes
app.get('/api/transactions', async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.post('/api/transactions', async (req, res) => {
  const transaction = new Transaction(req.body);
  await transaction.save();
  res.json(transaction);
});

app.get('/api/summary', async (req, res) => {
  const transactions = await Transaction.find();
  const summary = {};
  transactions.forEach(t => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' });
    if (!summary[month]) summary[month] = { income: 0, expense: 0 };
    if (t.type === 'income') summary[month].income += t.amount;
    else summary[month].expense += t.amount;
  });
  res.json(summary);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

