const isEmpty = require('../utils/isEmpty');

const validateEpisodeTvImages = (data) => {
  const errors = {};

  // Check if expected params has been passed in
  data.tv_id = !isEmpty(data.tv_id) ? data.tv_id : '';
  data.latest_season_number = !isEmpty(data.latest_season_number) ? data.latest_season_number : '';
  data.number_of_episodes = !isEmpty(data.number_of_episodes) ? data.number_of_episodes : '';
  data.language = !isEmpty(data.language) ? data.language : '';
  data.page = !isEmpty(data.page) ? data.page : '';

  // Feedback accumulator
  if (isEmpty(data.tv_id)) {
    errors.tv_id = '`tv_id` is empty or has not been passed in as a query param';
  }
  if (isEmpty(data.season_number)) {
    errors.season_number = '`season_number` is empty or has not been passed in as a query param';
  }
  if (isEmpty(data.number_of_episodes)) {
    errors.number_of_episodes = '`number_of_episodes` is empty or has not been passed in as a query param';
  }
  // if (isEmpty(data.language)) {
  //   errors.language =
  //     '`language` is empty or has not been passed in as a query param';
  // }
  // if (isEmpty(data.page)) {
  //   errors.page = '`page` is empty or has not been passed in as a query param';
  // }

  // return errors
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateEpisodeTvImages;
