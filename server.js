const { json } = require('express');
const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.port || 3001;

const app = express();

app.use(express.static("public"));
app.use(express.json());

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

/*FS Functions*/
const readFromFile = (destination) => 
  fs.readFile(destination, 'utf8', (err, data) => {
    if (err) {
      console.error("Reading " + err);
    } else {
      return JSON.stringify(data);
    }
  });

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
  err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (destination, content) => {
  fs.readFile(destination, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content.req.body);
      writeToFile(destination, parsedData);
    }
  });
};


/*Functions in index.js*/
//GET Route for notes data
app.get('/api/notes', (req, res) => {
  let notesFile = readFromFile(".\\db\\db.json");
  console.log("no: "+ notesFile);
  res.send(notesFile);
});

// POST Route for notes data
app.post('/api/notes', (req, res) => {
  readAndAppend('.\\db\\db.json', res);
});

app.delete('/api/notes', (req, res) => {
  res.json(`${req.method} request received to delete from notes`);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);