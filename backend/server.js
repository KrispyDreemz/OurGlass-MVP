const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('OurGlass API is running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', require('./routes/auth'));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
