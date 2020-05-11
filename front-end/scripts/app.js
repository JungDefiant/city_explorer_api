'use strict';

let __API_URL__;
let GEOCODE_API_KEY;

let page = 1;
let lastLocation = {};

function setEventListeners() {
  $('#url-form').on('submit', handleURL);
  $('#geocode-form').on('submit', handleKey);
  $('#getMoreYelps').on('click', getMoreYelps);
  $('#search-form').on('submit', fetchCityData);
}

function handleURL(event) {
  event.preventDefault();
  __API_URL__ = $('#back-end-url').val();
  $('#url-form').hide();
  manageForms();
}

function handleKey(event) {
  event.preventDefault();
  GEOCODE_API_KEY = $('#api-key').val();
  storeKey(GEOCODE_API_KEY);
  $('#geocode-form').hide();
  manageForms();
}

function getKey() {
  if (localStorage.getItem('geocode')) return JSON.parse(localStorage.getItem('geocode'));
}

function storeKey(key) {
  localStorage.setItem('geocode', JSON.stringify(key));
}

function manageForms() {
  if (__API_URL__ && GEOCODE_API_KEY) { $('#search-form').show(); }
}

function getMoreYelps() {
  ++lastLocation.page;
  getResource( 'yelp', lastLocation);
}

function fetchCityData(event) {

  event.preventDefault();

  // start off by clearing everything
  clearScreen();

  let searchQuery = $('#input-search').val().toLowerCase();

  const ajaxSettings = {
    method: 'GET',
    data: { city: searchQuery },
  };

  $.ajax(`${__API_URL__}/location`, ajaxSettings)
    .then(location => {
      // Set the page number to start the requests
      location.page = page;
      // Cache the location for subsequent (pagination) request
      lastLocation = location;
      showTitle(location);
      displayMap(location);
      getResource('weather', location);
      getResource('movies', location);
      getResource('yelp', location);
      getResource('trails', location);
    })
    .catch(error => {
      showError(error);

    });
}

function showTitle(location) {
  $('.query-placeholder').text(`Here are the results for ${location.formatted_query}`);
}

function displayMap(location) {

  let mapData = {
    key: GEOCODE_API_KEY,
    lat: location.latitude,
    lon: location.longitude,
    width: 800,
    height: 400,
  };

  render( [mapData], '#map', '#map-template');

  $('#map').show();
}

function getResource(resource, location) {
  const ajaxSettings = {
    method: 'get',
    dataType: 'json',
    data: location,
  };

  $.ajax(`${__API_URL__}/${resource}`, ajaxSettings)
    .then(result => {
      render(result, `.${resource}-results`, `#${resource}-results-template`);
    })
    .catch(error => {
      showError(error);
    });
}

function showError(error) {
  render([error], '.error-container', '#error-template');
}

function clearScreen() {
  $('section ul').empty();
  $('section').hide();
  $('#map').hide();
}

function render(data, target, templateId) {

  // Only clear it out if we're on the first set of results for a column.
  // Otherwise, it's being paginated and should append to the bottom.
  if(lastLocation.page === 1) { $(target).empty(); }

  const template = $(templateId).text();

  data.forEach(obj => {
    let html = Mustache.render(template, obj);
    console.log('render', target, templateId, html);
    $(target).append(html);
  });

  $(target).closest('section').show();
}

$(() => {
  clearScreen();
  setEventListeners();
  GEOCODE_API_KEY = getKey();
  if (GEOCODE_API_KEY) { $('#geocode-form').addClass('hide'); }
});
