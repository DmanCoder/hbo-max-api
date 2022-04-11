const isEmpty = require('../utils/isEmpty');

const validateImagesTv = (data) => {
  const errors = {};

  // Check if expected params has been passed in
  data.movie_id = !isEmpty(data.movie_id) ? data.movie_id : '';
  data.language = !isEmpty(data.language) ? data.language : '';
  data.page = !isEmpty(data.page) ? data.page : '';

  // Feedback accumulator
  if (isEmpty(data.movie_id)) {
    errors.movie_id =
      '`movie_id` is empty or has not been passed in as a query param';
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
