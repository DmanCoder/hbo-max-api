const { dbAPI, axios } = require('../../api/init');
const express = require('express');
const url = require('url');

const router = express.Router();

const validateEpisodeTvImages = require('../../validations/validateEpisodeTvImages');
const isEmpty = require('../../utils/isEmpty');

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume.
 * @route     GET /api/tv/${tv_id}/season/${season_number}/episode/${index}/images
 * @param     {req, res} - Request & Response
 * @returns   {boolean}
 * @access    Public
 */
router.get('/tv/seasons/episode_images', (req, res) => {
  const queryObject = url.parse(req.url, true).query;

  const { tv_id, season_number, number_of_episodes, language, page } = queryObject;

  const { TMDb_API } = process.env;

  const { errors, isValid } = validateEpisodeTvImages(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  const epTv = `/tv/${tv_id}/season/${season_number}?api_key=${TMDb_API}&watch_region=US`;
  const seasonRating = [];

  dbAPI
    .get(epTv)
    .then((response) => {
      const { data } = response;
      // data.episodes.forEach((episode, index) => {
      //   tvSeasonEpisodeImages[index].appended_episode_name = episode.name;
      //   tvSeasonEpisodeImages[index].appended_vote_average = episode.vote_average;

      //   if (!isEmpty(tvSeasonEpisodeImages[index])) seasonRating.push(episode.vote_average);
      // });

      const sum = seasonRating.reduce((a, b) => a + b, 0);
      const voteAverage = sum / seasonRating.length || 0;
      const currentSeasonNumberOfEpisodes = data.episodes.length - 1;

      // res.send({
      //   appended_vote_average: voteAverage?.toFixed(2),
      //   appended_overview: data.overview,
      //   appended_name: data.name,
      //   results: data,
      // });

      const multiReq = [];

      for (let index = 1; index <= number_of_episodes; index++) {
        const epTv = `/tv/${tv_id}/season/${season_number}/episode/${index}/images?api_key=${TMDb_API}`;
        multiReq.push(dbAPI.get(epTv));
      }

      axios
        .all(multiReq)
        .then(
          axios.spread((...tvRes) => {
            console.log(tvRes, 'tvRestvRestvRes');
            const tvSeasonEpisodeImages = [];

            tvRes.forEach((tvEpImg) => {
              if (!isEmpty(tvEpImg?.data?.stills)) {
                const lengthOfAvailableImagesForCurrentEpisode = tvEpImg?.data?.stills?.length;
                const randomeNumber = Math.floor(Math.random() * lengthOfAvailableImagesForCurrentEpisode);
                const selectedShuffle = tvEpImg.data.stills[randomeNumber];
                // TODO: HERER
                // selectedShuffle.appended_episode_name = episode.name;
                // selectedShuffle.appended_vote_average = episode.vote_average;
                // if (!isEmpty(selectedShuffle)) seasonRating.push(episode.vote_average);
                tvSeasonEpisodeImages.push(selectedShuffle);
              } else {
                tvSeasonEpisodeImages.push({});
              }
            });

            res.send({
              appended_vote_average: voteAverage?.toFixed(2),
              appended_overview: data.overview,
              appended_name: data.name,
              results: tvSeasonEpisodeImages,
            });
          })
        )
        .catch((error) => {
          res.send({ errors: { message: 'Issues Fetching results', error } });
        });
    })
    .catch((error) => {
      res.send({ errors: { message: 'Issues Fetching results', error } });
    });

  // ---------

  // const multiReq = [];

  // for (let index = 1; index <= number_of_episodes; index++) {
  //   const epTv = `/tv/${tv_id}/season/${season_number}/episode/${index}/images?api_key=${TMDb_API}`;
  //   multiReq.push(dbAPI.get(epTv));
  // }

  // axios
  //   .all(multiReq)
  //   .then(
  //     axios.spread((...tvRes) => {
  // const tvSeasonEpisodeImages = [];

  // tvRes.forEach((tvEpImg) => {
  //   if (!isEmpty(tvEpImg?.data?.stills)) {
  //     const lengthOfAvailableImagesForCurrentEpisode = tvEpImg?.data?.stills?.length;
  //     const randomeNumber = Math.floor(Math.random() * lengthOfAvailableImagesForCurrentEpisode);
  //     const selectedShuffle = tvEpImg.data.stills[randomeNumber];
  //     tvSeasonEpisodeImages.push(selectedShuffle);
  //   } else {
  //     tvSeasonEpisodeImages.push({});
  //   }
  // });

  //       const epTv = `/tv/${tv_id}/season/${season_number}?api_key=${TMDb_API}&watch_region=US`;
  //       const seasonRating = [];

  //       dbAPI
  //         .get(epTv)
  //         .then((response) => {
  //           const { data } = response;
  //           data.episodes.forEach((episode, index) => {
  //             tvSeasonEpisodeImages[index].appended_episode_name = episode.name;
  //             tvSeasonEpisodeImages[index].appended_vote_average = episode.vote_average;

  //             if (!isEmpty(tvSeasonEpisodeImages[index])) seasonRating.push(episode.vote_average);
  //           });

  //           const sum = seasonRating.reduce((a, b) => a + b, 0);
  //           const vote_average = sum / seasonRating.length || 0;

  //           res.send({
  //             appended_vote_average: vote_average?.toFixed(2),
  //             appended_overview: data.overview,
  //             appended_name: data.name,
  //             results: tvSeasonEpisodeImages,
  //           });
  //         })
  //         .catch((error) => {
  //           res.send({ errors: { message: 'Issues Fetching results', error } });
  //         });
  //     })
  //   )
  //   .catch((error) => {
  //     res.send({ errors: { message: 'Issues Fetching results', error } });
  //   });
});

module.exports = router;
