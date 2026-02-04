const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, getSummary } = require('../controllers/transactionController');

router.get('/transactions', getTransactions);
router.post('/transactions', addTransaction);
router.get('/summary', getSummary);

module.exports = router;
