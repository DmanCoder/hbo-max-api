const { dbAPI, axios } = require('../../api/init');
const express = require('express');
const url = require('url');

const router = express.Router();

const validateEpisodeTvImages = require('../../validations/validateEpisodeTvImages');
const isEmpty = require('../../utils/isEmpty');

router.get('/tv/seasons/episode_images', (req, res) => {
  const queryObject = url.parse(req.url, true).query;

  const { tv_id, season_number, language, page } = queryObject;

  const { errors, isValid } = validateEpisodeTvImages(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  const epTv = `/tv/${tv_id}/season/${season_number}?api_key=${process.env.THE_MOVIE_DATABASE_API}&watch_region=US`;
  const seasonRating = [];

  dbAPI
    .get(epTv)
    .then((response) => {
      const { data } = response;

      const sum = seasonRating.reduce((a, b) => a + b, 0);
      const voteAverage = sum / seasonRating.length || 0;
      const currentSeasonNumberOfEpisodes = data.episodes.length;

      const multiReq = [];

      for (let index = 1; index <= currentSeasonNumberOfEpisodes; index++) {
        const epTv = `/tv/${tv_id}/season/${season_number}/episode/${index}/images?api_key=${process.env.THE_MOVIE_DATABASE_API}`;
        multiReq.push(dbAPI.get(epTv));
      }

      axios
        .all(multiReq)
        .then(
          axios.spread((...seasonEpisodesResponse) => {
            const seasonImages = [];

            seasonEpisodesResponse?.forEach((episode, index) => {
              if (!isEmpty(episode?.data?.stills)) {
                const lengthOfAvailableImagesForCurrentEpisode = episode?.data?.stills?.length;
                const randomeNumber = Math.floor(Math.random() * lengthOfAvailableImagesForCurrentEpisode);
                const selectedShuffle = episode.data.stills[randomeNumber];

                selectedShuffle.appended_episode_name = data.episodes[index]?.name;
                selectedShuffle.appended_vote_average = data.episodes[index]?.vote_average;
                if (!isEmpty(selectedShuffle)) seasonRating.push(data.episodes[index]?.vote_average);

                seasonImages.push(selectedShuffle);
              } else {
                const noImagesFoundForCurrentSeasonEpisode = {};
                noImagesFoundForCurrentSeasonEpisode.appended_episode_name = data.episodes[index]?.name;
                noImagesFoundForCurrentSeasonEpisode.appended_vote_average = data.episodes[index]?.vote_average;
                seasonImages.push(noImagesFoundForCurrentSeasonEpisode);
              }
            });

            res.send({
              appended_vote_average: voteAverage?.toFixed(2),
              appended_overview: data.overview,
              appended_name: data.name,
              results: seasonImages,
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
});

module.exports = router;
