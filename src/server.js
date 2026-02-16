const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const transactionRoutes = require('./routes/transactions'); // must match filename

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes with /api prefix
app.use('/api', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
