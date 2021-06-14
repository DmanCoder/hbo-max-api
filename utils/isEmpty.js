/**
 * Check passed in parameter if value is empty and returns a boolean
 * @param {any} value - string, object, array, number, anything
 * @returns {boolean}
 */
const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (Object.entries(value).length === 0 && value.constructor === Object);

module.exports = isEmpty;
