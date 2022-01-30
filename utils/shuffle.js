/**
 * Shuffle array
 * @param {array} value - []
 * @returns {Array}
 */
const shuffleArray = ({ array }) => array.sort(() => Math.random() - 0.5);

module.exports = shuffleArray;
