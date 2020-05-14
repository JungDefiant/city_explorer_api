'use strict';

// Import packages
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

// Set configs
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
      const location = new Location(request.query.city, result.body[0].display_name, result.body[0].lat, result.body[0].lon);
      response.send(location).status(200);
    })
    .catch(error => {
      catchError(response, error);
    });
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
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';

  // Set query parameters for Weather API
  const queryParams = {
    key: process.env.WEATHER_API_KEY,
    lat: request.query.latitude,
    lon: request.query.longitude,
    format: 'json'
  }

  // Get data from Weather API and send array of weather data as response
  superagent.get(url)
    .query(queryParams)
    .then(result => {
      const weatherArr = result.body.data.map(val => { return new Weather(val.weather.description, new Date(val.datetime).toDateString()); });
      console.log(weatherArr);
      response.send(weatherArr).status(200);
    })
    .catch(error => {
      catchError(response, error);
    });
});

// Constructs a Weather object to be displayed
function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}

function catchError(response, error) {
  console.log(error);
  response.send(error).status(500);
}

// Runs the server
app.listen(PORT, console.log(`we are up on ${PORT}`));