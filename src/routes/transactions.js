const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, getSummary } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// ✅ Protected routes
router.get('/transactions', protect, getTransactions);
router.post('/transactions', protect, addTransaction);
router.get('/summary', protect, getSummary);

module.exports = router;
