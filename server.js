const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || 'dev';

app.get('/', (req, res) => {
  res.send(`Hello SAP BTP 🚀 - Version ${VERSION}`);
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});