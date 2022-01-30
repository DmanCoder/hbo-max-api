const { dbAPI, axios } = require('../../../api/init');
const express = require('express');
const url = require('url');
TODO: https://www.themoviedb.org/talk/6002a239223e20003fb6e10b
/*
 * A query looking for popular streaming titles: https://api.themoviedb.org/3/discover/movie?api_key=###&watch_region=US&with_watch_monetization_types=flatrate
 * A query looking for popular titles available for rent:https://api.themoviedb.org/3/discover/movie?api_key=###&watch_region=US&with_watch_monetization_types=rent
 * A query looking for movies in the theatres: https://api.themoviedb.org/3/discover/movie?api_key=###&region=US&with_release_type=3|2
 */

const router = express.Router();

// Validators
const validatePopularTv = require('../../../validations/popular/tv');

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume.
 * @route     GET /api/tv/popular
 * @route     GET /api/tv/{tv_id} - Get details of selected media
 * @route     GET /api/tv/{tv_id}/videos - Get trailers
 * @param     {req, res} - Request & Response
 * @returns   {boolean}
 * @access    Public
 */
router.get('/', (req, res) => {
  // Expected params
  const queryObject = url.parse(req.url, true).query;
  const { language, page } = queryObject;

  // API access key
  const { TMDb_API } = process.env;

  // Reject if expected params are not present
  const { errors, isValid } = validatePopularTv(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  // Get popular tv shows
  dbAPI
    .get(`/tv/popular?api_key=${TMDb_API}&language=${language}&page=${page}`)
    .then((response) => {
      const { data } = response;
      const { page, results } = data;
      const multiReq = []; // [[request], [request], [request]] Store array of axios instances

      /*
       * Loop through each item in `results` and
       * store axios
       */
      results.map((item, index) => {
        // Endpoints
        const epDetails = `/tv/${item.id}?api_key=${TMDb_API}&languages=${language}&pages=${page}`;
        const epVideos = `/tv/${item.id}/videos?api_key=${TMDb_API}&languages=${language}&pages=${page}`;
        const epRecommendations = `/tv/${item.id}/recommendations?api_key=${TMDb_API}&languages=${language}&pages=${page}`;

        multiReq.push(
          axios.all([
            dbAPI.get(epDetails),
            dbAPI.get(epVideos),
            dbAPI.get(epRecommendations),
          ])
        );
      });

      axios.all(multiReq).then(
        axios.spread((...allRes) => {
          /* `allRes` contains array inside an array that contains object
              The Objects are as follows in line 51 as above ^^ 
            [
              [
                {
                  status: 200,
                  statusText: 'OK',
                  headers: [Object],
                  config: [Object],
                  request: [ClientRequest],
                  data: [Object],
                },
                {
                  status: 200,
                  statusText: 'OK',
                  headers: [Object],
                  config: [Object],
                  request: [ClientRequest],
                  data: [Object],
                },
              ],
            ]
          */

          // Extracting data and insert to `results`
          allRes.map((item, index) => {
            const detailsResults = item[0].data;
            const videosResults = item[1].data;
            const recommendationsResults = item[2].data;

            // Insert fetched data to `results`
            results[index].media_details = detailsResults;
            results[index].media_videos = videosResults;
            results[index].media_recommendations =
              recommendationsResults.results;
          });

          res.send({ ...data, results });
        })
      );
    })
    .catch((errors) => {
      // console.log(errors)
      const { data } = errors.response;
      console.log(errors);
      res.send({ errors: { ...data, message: 'Issues Fetching results' } });
    });
});

module.exports = router;
