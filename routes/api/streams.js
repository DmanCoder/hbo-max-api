const express = require('express');
const url = require('url');

const router = express.Router();

const { dbAPI, axios } = require('../../api/init');
const shuffle = require('../../utils/shuffle');
const validatePopularStreams = require('../../validations/popular/streams');

router.get('/', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const { network_id, language, page } = queryObject;

  const { errors, isValid } = validatePopularStreams(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  const moviesEndpoint = `/discover/movie?api_key=${process.env.THE_MOVIE_DATABASE_API}&watch_region=US&with_watch_monetization_types=flatrate&with_origin_country=US&& with_networks=&language=${language}&page=${page}`;
  const tvShowsEndpoint = `/discover/tv?api_key=${process.env.THE_MOVIE_DATABASE_API}&watch_region=US&with_origin_country=US&with_watch_monetization_types=flatrate&with_networks=${network_id}&language=${language}&page=${page}`;

  const moviesApiRequest = dbAPI.get(moviesEndpoint);
  const tvShowsRequest = dbAPI.get(tvShowsEndpoint);

  axios
    .all([moviesApiRequest, tvShowsRequest])
    .then(
      axios.spread((...responses) => {
        const [movieStreams, tvShowStreams] = responses;

        const moviesWithAddedMediaType = movieStreams.data.results.map((movie) => ({
          ...movie,
          appended_media_type: 'movie',
        }));

        const tvShowsWithAddedMediaType = tvShowStreams.data.results.map((tv) => ({
          ...tv,
          appended_media_type: 'tv',
        }));

        const combinedMedias = [...tvShowsWithAddedMediaType, ...moviesWithAddedMediaType];
        const combinedMediasShuffled = shuffle({ array: combinedMedias });

        return res.send({ results: combinedMediasShuffled });
      })
    )
    .catch((errors) => {
      res.send({ errors: { message: 'Issues Fetching results', errors, env: process.env } });
    });
});

module.exports = router;
