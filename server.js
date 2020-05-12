'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express('.');
app.use(cors());

// Returns HTML GET /location with contents of location.json
app.get('/location', (request, response) => {
  const dataFromJson = require('./data/location.json');
  response.send(new Location(dataFromJson[0].display_name, dataFromJson[0].display_name, dataFromJson[0].lat, dataFromJson[0].lon));
});

// Returns a location object to be displayed
function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}

// Returns HTML GET /weather with contents of weather.json
app.get('/weather', (r, res) => {
  const dataFromJson = require('./data/weather.json');
  const weatherArr = [];
  dataFromJson.data.forEach(val => weatherArr.push(new Weather(val.weather.description, new Date(val.datetime).toDateString())) );
  res.send(weatherArr);
});

// Constructs a Weather object to be displayed
function Weather(forecast, timestamp) {
  this.forecast = forecast;
  this.timestamp = timestamp;
}

// Constructs a Restaurant object to be displayed
function Restaurant(dataFromJson) {
  this.restaurant = data.restaurant.name;
  this.cuisines = dataFromJson.restaurant.cuisines;
  this.locality = dataFromJson.restaurant.location.locality;
}

// Runs the server
app.listen(PORT, console.log(`we are up on ${PORT}`));