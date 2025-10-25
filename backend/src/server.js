require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Jale Backend Running' });
});

// TODO: Add route imports here
// app.use('/api/jobs', require('./routes/jobs'));
// app.use('/api/candidates', require('./routes/candidates'));
// app.use('/api/interviews', require('./routes/interviews'));
// app.use('/api/chat', require('./routes/chat'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
