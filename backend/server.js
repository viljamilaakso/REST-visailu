// Tuodaan tarvittavat kirjastot
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

// Luodaan Express-sovellus
const app = express();

// Käytetään middleware-kirjastoja
app.use(bodyParser.json()); // Parsii JSON-pyynnöt
app.use(cors()); // Käsittelee CORS-ongelmat

// Luodaan tietokantayhteys
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'verkkokauppa',
});

// Määritellään reitti POST-pyynnölle uuden kysymyksen lisäämiseksi
app.post('/questions', (req, res) => {
  const { question, answer, isCorrect } = req.body;

  // Tarkistetaan, että tarvittavat tiedot ovat saatavilla
  if (!question || !answer || isCorrect === undefined) {
    return res.status(400).json({ error: 'Kysymys, vastaus ja isCorrect ovat pakollisia' });
  }

  // SQL-kysely uuden kysymyksen lisäämiseksi
  const query = 'INSERT INTO questions (question, answer, isCorrect) VALUES (?, ?, ?)';
  const values = [question, answer, isCorrect];

  // Suoritetaan kysely
  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Virhe lisätessä uutta kysymystä:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Palautetaan vastaus onnistuneesta lisäyksestä
    res.status(201).json({ id: results.insertId, question, answer, isCorrect });
  });
});

// Määritellään reitti GET-pyynnölle kysymysten hakemiseksi
app.get('/questions', (req, res) => {
  // SQL-kysely kaikkien kysymysten hakemiseksi
  const query = 'SELECT * FROM questions';

  // Suoritetaan kysely
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Virhe haettaessa kysymyksiä:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Palautetaan kysymykset JSON-muodossa
    res.json(results);
  });
});

// Määritellään sovelluksen kuuntelema portti
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Palvelin käynnistetty portissa ${PORT}`);
});
