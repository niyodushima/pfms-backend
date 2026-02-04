const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
};

exports.addTransaction = async (req, res) => {
  const transaction = new Transaction(req.body);
  await transaction.save();
  res.status(201).json(transaction);
};

exports.getSummary = async (req, res) => {
  const transactions = await Transaction.find();
  const summary = {};
  transactions.forEach(t => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' });
    if (!summary[month]) summary[month] = { income: 0, expense: 0 };
    summary[month][t.type] += t.amount;
  });
  res.json(summary);
};
