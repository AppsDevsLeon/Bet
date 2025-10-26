require('dotenv').config();

const express = require('express');
const axios = require('axios');

const gamesData = require('./routes/matches');

const app = express();
const apiKey = process.env.ALL_SPORTS_KEY;

console.log('Servidor arriba')

app.use(express.json());

app.use('/games',gamesData);

app.listen(3000);