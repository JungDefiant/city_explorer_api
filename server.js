'use strict';

// Import packages
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

// Set configs
const PORT = process.env.PORT || 3000;
const app = express('.');
app.use(cors());
// const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', console.error);
// client.connect();

// EXAMPLE SQL SELECTION
// app.get('/', (request, response) => {
//   const sqlQuery = 'SELECT * FROM locations'
//   client.query(sqlQuery)
//     .then(results => {
//       response.send(results.rows);
//     })
//     .catch(console.error);
// });

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
      const weatherArr = result.body.data.map(val => {
        return new Weather(val.weather.description, new Date(val.datetime).toDateString());
      });
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

// Returns HTML GET /trails
app.get('/trails', (request, response) => {
  const url = 'https://www.hikingproject.com/data/get-trails';

  // Set query parameters for Trails API
  const queryParams = {
    key: process.env.TRAIL_API_KEY,
    lat: request.query.latitude,
    lon: request.query.longitude,
    format: 'json'
  }

  // Get data from Trails API and send array of trails data as response
  superagent.get(url)
    .query(queryParams)
    .then(result => {
      const trailArr = result.body.trails.map((val, ind) => {
        if (ind < 10) return new Trail(val);
      });
      response.send(trailArr).status(200);
    })
    .catch(error => {
      catchError(response, error);
    });
});

// Constructs a Trails object to be displayed
function Trail(trailData) {
  this.name = trailData.name;
  this.location = trailData.location;
  this.length = trailData.length;
  this.stars = trailData.stars;
  this.star_votes = trailData.star_votes;
  this.summary = trailData.summary;
  this.trail_url = trailData.trail_url;
  this.conditions = trailData.conditions;
  this.condition_date = trailData.condition_date;
  this.condition_time = trailData.condition_time;
}

// Returns HTML GET /movies
app.get('/movies', (request, response) => {
  const url = 'https://api.themoviedb.org/3/search/movie';

  // Set query parameters for Movies API
  const queryParams = {
    api_key: process.env.MOVIE_API_KEY,
    query: request.query.search_query
  }

  // Get data from Movies API and send array of movies data as response
  superagent.get(url)
    .query(queryParams)
    .then(result => {
      console.log(Object.keys(result.body.results).toString());
      const movieArr = result.body.results.map((val, ind) => {
        if (ind < 20) {
          return new Movie(val);
        }
      });
      response.send(movieArr).status(200);
    })
    .catch(error => {
      catchError(response, error);
    });
});

// Constructs a Movie object to be displayed
function Movie(movieData) {
  this.title = movieData.title;
  this.overview = movieData.overview;
  this.average_votes = movieData.average_votes;
  this.total_votes = movieData.total_votes;
  this.image_url = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' + movieData.poster_path;
  this.popularity = movieData.popularity;
  this.released_on = movieData.release_date;
}

function catchError(response, error) {
  console.log(error);
  response.send(error).status(500);
}

// Runs the server
app.listen(PORT, console.log(`we are up on ${PORT}`));