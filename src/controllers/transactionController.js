const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({ ...req.body, user: req.user.id });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    const summary = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      if (!summary[month]) summary[month] = { income: 0, expense: 0 };
      summary[month][t.type] += t.amount;
    });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
