const { dbAPI, axios } = require('../../api/init');
const express = require('express');
const url = require('url');

const router = express.Router();

const validateEpisodeTvImages = require('../../validations/validateEpisodeTvImages');

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume.
 * @route     GET /api/tv/${tv_id}/season/${latest_season_number}/episode/${index}/images
 * @param     {req, res} - Request & Response
 * @returns   {boolean}
 * @access    Public
 */
router.get('/tv/seasons/episode_images', (req, res) => {
  const queryObject = url.parse(req.url, true).query;

  const { tv_id, latest_season_number, number_of_episodes } = queryObject;

  const { TMDb_API } = process.env;

  const { errors, isValid } = validateEpisodeTvImages(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  const multiReq = [];

  for (let index = 1; index <= number_of_episodes; index++) {
    const epTv = `/tv/${tv_id}/season/${latest_season_number}/episode/${index}/images?api_key=${TMDb_API}`;
    multiReq.push(dbAPI.get(epTv));
  }

  axios.all(multiReq).then(
    axios.spread((...tvRes) => {
      const tvSeasonEpisodeImages = []

      tvRes.forEach((tvEpImg) => {
        tvSeasonEpisodeImages.push(tvEpImg.data)
      })

      res.send({ results: tvSeasonEpisodeImages });
    })
  );
});

module.exports = router;