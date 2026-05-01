const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

 app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.CLIENT_URL,
      'http://localhost:3000'
    ];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
   }));
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