const axios = require('axios');

// Base URL
const dbURL = 'https://api.themoviedb.org/3'; // TMDb API version 3

// AXIOS INSTANCE: BASE URL FOR THE MOVIE DATA BASE
const dbAPI = axios.create({
  baseURL: dbURL,
});

module.exports = { dbAPI, dbURL, axios };
