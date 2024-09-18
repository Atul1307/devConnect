const express = require('express');
const app = express();

app.use('/routes', (req, res) => {
  res.send(`Hello from routes`);
});
app.use('/', (req, res) => {
  res.send(`Hello from server`);
});

app.listen(3000, () => {});
