const isEmpty = require('../../utils/isEmpty');

const validatePopularStreams = (data) => {
  const errors = {};

  // Check if expected params has been passed in
  data.network_id = !isEmpty(data.network_id) ? data.network_id : '';
  data.language = !isEmpty(data.language) ? data.language : '';
  data.page = !isEmpty(data.page) ? data.page : '';

  // Feedback accumulator
  if (isEmpty(data.language)) {
    errors.language =
      '`language` is empty or has not been passed in as a query param';
  }

  if (isEmpty(data.page)) {
    errors.page = '`page` is empty or has not been passed in as a query param';
  }

  if (isEmpty(data.network_id)) {
    errors.network_id = '`network_id` is empty or has not been passed in as a query param';
  }

  // return errors
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validatePopularStreams;
