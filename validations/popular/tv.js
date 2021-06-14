const isEmpty = require('../../utils/isEmpty');

const validatePopularTv = (data) => {
  const errors = {};

  // Check if expected params has been passed in
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

  // return errors
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validatePopularTv;
