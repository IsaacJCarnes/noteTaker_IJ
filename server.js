const { json } = require('express');
const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.port || 3001;

const app = express();

let lastIndex = null;

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
      console.error(err);
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
      lastIndex++;
      console.log(lastIndex);
      let parsedData = JSON.parse(data);
      let dataId = lastIndex + "+" + Math.floor(Math.random() * 999);
      let newData = {
        id: dataId,
      };
      Object.assign(newData, content.req.body);
      parsedData.push(newData);
      writeToFile(destination, parsedData);
    }
  });
};

/*Functions in index.js*/
//GET Route for notes data
app.get('/api/notes', (req, res) => {
  fs.readFile(".\\db\\db.json", 'utf8', (err, data) => {
    if (err) {
      console.error("Reading " + err);
    } else {
      res.send(data);
    }
  });  
});

// POST Route for notes data
app.post('/api/notes', (req, res) => {
  readAndAppend('.\\db\\db.json', res);
  res.json(`${req.method} request received to post to notes`);
});

app.delete('/api/notes/:id', (req, res) => {
  console.log(req.params.id);
  res.json(`${req.method} request received to delete from notes`);
});

app.listen(PORT, () => {
  fs.readFile(".\\db\\db.json", 'utf8', (err, data) => { //Read to get last note id
    if (err) {
      console.error(err);
    } else {
      let parsedData = JSON.parse(data);
      lastIndex = Number(parsedData[parsedData.length-1].id.split('+',1)[0]);
    }
  });
  console.log(`App listening at http://localhost:${PORT} 🚀`)
});