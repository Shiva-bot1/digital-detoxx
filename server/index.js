const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ message: 'Digital Detox API running' }));

// Routes
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/usage', require('./routes/usage'));
app.use('/api/goals', require('./routes/goals'));

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);