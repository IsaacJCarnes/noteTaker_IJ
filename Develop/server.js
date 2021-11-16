const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.port || 3001;

const app = express();

app.use(express.static("public"));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) => {
  res.status(200).json(`${req.method} request received to get notes page`);
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

/*Functions in index.js*/
//GET Route for notes data
app.get('/notes', (req, res) => {
  res.status(200).json(`${req.method} request received to get notes`);
  res.send(JSON.parse(fs.readFile(".\db\db.json")));
});

// POST Route for notes data
app.post('/api/notes', (req, res) => {
  res.json(`${req.method} request received to post to notes`);
});

app.delete('/api/notes', (req, res) => {
  res.json(`${req.method} request received to delete from notes`);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);