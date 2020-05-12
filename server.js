'use strict';

// define the packages
//require loads the package into this file as a variable we can use
const express = require('express'); // run servers - server code
const cors = require('cors'); // cross origin resource sharing - prevents the firewall from blocking your local server
require('dotenv').config(); //is to configure the local environment

// App setup (define global variables and configure the server)
// Global variables
const PORT = process.env.PORT || 3000; // look to a env variable called PORT, or default to 3000
const app = express('.'); // app is our entire server

//configs
app.use(cors()); // configure the app to talk to other local websites without blocking them

// DONE: respond to the http://localhost:3000/location route `/location`
// DONE: send the json data (send meaningful data)

app.get('/location', (request, response) => {
  console.log('hey from the server');
  const dataFromlocationJson = require('./app/data/location.json');
  response.send(dataFromlocationJson);
});

app.get('/weather', (r, res) => {
  const dataFromWeatherJson = require('./app/data/weather.json');
  res.send(dataFromWeatherJson);
});

// DONE: respond to the other request
// asks at  http://localhost:3000/restaruants?${location.latitude}x${location.longitude}
// ignore everything after and including the question mark

// app.get('/we', (req, res) => {
//   const restData = require('./data/restaurants.json');

//   // DONE: target useful data (lives here at restData.nearby_restaurants)
//   const nearby_restaurants = restData.nearby_restaurants;
//   console.log(nearby_restaurants);
//   // TODO: pass each thing in that array through a constructor
//   const newRests = [];
//   // nearby_restaurants.forEach(restObj => { // restObj is an object from the nearblyRestaurants array
//   //   newRests.push( new Restaurant(restObj) );
//   // });

//   for(let i = 0; i < nearby_restaurants.length; i++){
//     newRests.push( new Restaurant(nearby_restaurants[i]) );
//   }



//   // TODO: send the resulting array to the front end

//   res.send(newRests);
// });


// only need restaurant, cuisines, locality
// restaurant is nearby[0].restaurant.name
// cuisines is nearby[0].restaurant.cuisines
// locality is nearby[0].restaurant.location.locality
function Restaurant(dataFromJson){
  this.restaurant = dataFromJson.restaurant.name;
  this.cuisines = dataFromJson.restaurant.cuisines;
  this.locality = dataFromJson.restaurant.location.locality;
}




// We run the server
app.listen(PORT, console.log(`we are up on ${PORT}`));