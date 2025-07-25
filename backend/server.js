const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('OurGlass API is running');
});

app.listen(PORT, () => {
  console.log(Server running on port );
});
