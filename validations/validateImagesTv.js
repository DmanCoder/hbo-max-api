const isEmpty = require('../utils/isEmpty');

const validateImagesTv = (data) => {
  const errors = {};

  // Check if expected params has been passed in
  data.tv_id = !isEmpty(data.tv_id) ? data.tv_id : '';
  data.number_of_seasons = !isEmpty(data.number_of_seasons) ? data.number_of_seasons : '';
  data.last_episode_to_air = !isEmpty(data.last_episode_to_air) ? data.last_episode_to_air : '';
  data.language = !isEmpty(data.language) ? data.language : '';
  data.page = !isEmpty(data.page) ? data.page : '';

  // Feedback accumulator
  if (isEmpty(data.tv_id)) {
    errors.tv_id =
      '`tv_id` is empty or has not been passed in as a query param';
  }
  if (isEmpty(data.language)) {
    errors.language =
      '`language` is empty or has not been passed in as a query param';
  }
  if (isEmpty(data.page)) {
    errors.page = '`page` is empty or has not been passed in as a query param';
  }

  // return errors
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateImagesTv;
