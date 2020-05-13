'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express('.');
app.use(cors());




// Returns HTML GET /location with contents of location.json
app.get('/location', (request, response) => {
  const url = 'https://us1.locationiq.com/v1/search.php';

  const queryParams = {
    key: process.env.GEOCODE_API_KEY,
    q: request.query.city,
    format: 'json'
  };

  superagent.get(url)
    .query(queryParams)
    .then(result => {
      console.log(result.toString());
      const location = new Location(request.query.city, result.body[0].display_name, result.body[0].lat, result.body[0].lon);
      response.send(location).status(200);
    })
    .catch(error => {
      console.log(error);
      response.send(error).status(500);
    })
});

// Returns a location object to be displayed
function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}

// Returns HTML GET /weather with contents of weather.json
app.get('/weather', (request, response) => {
  const dataFromJson = require('./data/weather.json');
  const weatherArr = [];
  response.send(dataFromJson.data.map(val => {
    return new Weather(val.weather.description, new Date(val.datetime).toDateString());
  }));
});

// Constructs a Weather object to be displayed
function Weather(forecast, timestamp) {
  this.forecast = forecast;
  this.timestamp = timestamp;
}

function catchError(response, error) {
  console.log(error);
  response.send(error).status(500);
}

// Runs the server
app.listen(PORT, console.log(`we are up on ${PORT}`));