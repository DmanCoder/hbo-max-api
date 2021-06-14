const { dbAPI } = require('../../../api/init');
const express = require('express');
const url = require('url');

const router = express.Router();

// Validators
const validateFreeTv = require('../../../validations/free/tv');

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume
 * @route     GET /api/tv/on_the_air
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
  const { errors, isValid } = validateFreeTv(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  // Get popular movies
  axios
    .dbAPI(
      `/tv/on_the_air?api_key=${TMDb_API}&language=${language}&page=${page}`
    )
    .then((response) => {
      const { data } = response;
      res.send(data);
    })
    .catch((errors) => {
      const { data } = errors.response;
      res.send({ errors: { ...data, message: 'Issues Fetching results' } });
    });
});

module.exports = router;
