const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const savedMovies = [];

app.post('/api/saveMovie', (req, res) => {
  const { movie } = req.body;
  savedMovies.push(movie);
  res.json({ success: true });
});

app.get('/api/getSavedMovies', (req, res) => {
  res.json(savedMovies);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});