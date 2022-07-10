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
        combinedMediasShuffled = shuffle({ array: combinedMedias });

        const multiReq = [];

        combinedMediasShuffled.map((item) => {
          const detailsEndPoint = `/${item.appended_media_type}/${item.id}?api_key=${process.env.THE_MOVIE_DATABASE_API}&languages=${language}&pages=${page}`;
          multiReq.push(axios.all([dbAPI.get(detailsEndPoint)]));
        });

        axios
          .all(multiReq)
          .then(
            axios.spread((...allRes) => {
              allRes.map((item, index) => {
                const detailsResults = item[0].data;

                // TODO: THERE ARE TOO MANY REQUESTS REMOVE THIS...
                combinedMediasShuffled[index].media_details = detailsResults;
              });

              res.send({ results: combinedMediasShuffled });
            })
          )
          .catch((err) => {
            res.status(500);
            console.log(err, '2');
            res.send({ errors: { message: 'Issues Fetching results 2' }, err });
          });
      })
    )
    .catch((err) => {
      res.status(500);
      console.log(err, '4');
      res.send({ errors: { message: 'Issues Fetching results 4' }, err });
    });
});

module.exports = router;
