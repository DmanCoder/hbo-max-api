const { dbAPI, axios } = require('../../api/init');
const express = require('express');
const url = require('url');
// TODO: https://www.themoviedb.org/talk/6002a239223e20003fb6e10b
/*
 * A query looking for popular streaming titles: https://api.themoviedb.org/3/discover/movie?api_key=###&watch_region=US&with_watch_monetization_types=flatrate
 * A query looking for popular titles available for rent:https://api.themoviedb.org/3/discover/movie?api_key=###&watch_region=US&with_watch_monetization_types=rent
 * A query looking for movies in the theatres: https://api.themoviedb.org/3/discover/movie?api_key=###&region=US&with_release_type=3|2
 */

const router = express.Router();

// Validators
const validateMediaDetails = require('../../validations/validateMediaDetails');

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume.
 * @route     GET /api/media/details/${media_id}
 * @param     {req, res} - Request & Response
 * @returns   {boolean}
 * @access    Public
 */
router.get('/', (req, res) => {
  // Expected params
  const queryObject = url.parse(req.url, true).query;
  const { language, page, media_id, appended_media_type } = queryObject;

  // Reject if expected params are not present
  const { errors, isValid } = validateMediaDetails(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  // Get popular tv shows
  const mediaDetailsEndpoint = `/${appended_media_type}/${media_id}?api_key=${process.env.THE_MOVIE_DATABASE_API}&languages=${language}&pages=${page}`;
  dbAPI
    .get(mediaDetailsEndpoint)
    .then((response) => {
      const { data } = response;
      res.send({ results: data });
    })
    .catch((errors) => {
      res.send({ errors: { message: 'Issues Fetching results' } });
    });
});

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume.
 * @route     GET /api/media/details/${media_id}
 * @param     {req, res} - Request & Response
 * @returns   {boolean}
 * @access    Public
 */
router.get('/media_ratings', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const { appended_media_type, media_id, language, page } = queryObject;

  // /tv/{tv_id}/content_ratings
  // Reject if expected params are not present
  // const { errors, isValid } = validateMediaDetails(queryObject);
  // if (!isValid) {
  //   res.status(400);
  //   return res.send({ errors });
  // }

  const mediaDetailsEndpoint = `/${appended_media_type}/${media_id}/content_ratings?api_key=${process.env.THE_MOVIE_DATABASE_API}&languages=${language}&pages=${page}`;
  dbAPI
    .get(mediaDetailsEndpoint)
    .then((response) => {
      const { data } = response;
      res.send({ results: data });
    })
    .catch((errors) => {
      res.send({ errors: { message: 'Issues Fetching results', errors } });
    });
});

module.exports = router;
