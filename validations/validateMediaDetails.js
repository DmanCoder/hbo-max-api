const isEmpty = require('../utils/isEmpty');

const validateMediaDetails = (data) => {
  const errors = {};

  // Check if expected params has been passed in
  data.appended_media_type = !isEmpty(data.appended_media_type) ? data.appended_media_type : '';
  data.media_id = !isEmpty(data.media_id) ? data.media_id : '';
  data.language = !isEmpty(data.language) ? data.language : '';
  data.page = !isEmpty(data.page) ? data.page : '';

  // Feedback accumulator
  if (isEmpty(data.appended_media_type)) {
    errors.appended_media_type =
      '`appended_media_type` is empty or has not been passed in as a query param';
  }
  if (isEmpty(data.media_id)) {
    errors.media_id =
      '`media_id` is empty or has not been passed in as a query param';
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

module.exports = validateMediaDetails;
