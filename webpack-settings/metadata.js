/* eslint-disable */
const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || 'development';

module.exports = {
  port: process.env.WEBPACK_PORT || 3001,
  host: process.env.WEBPACK_HOST || 'localhost',
  ENV: ENV,
  HMR: process.argv.join('').indexOf('hot') >= 0 || !!process.env.WEBPACK_HMR,
  DESIGN: process.env.ARCHTYPE && process.env.ARCHTYPE.toLowerCase() || false,
  DEBUG: ENV !== 'production',
  devtool: ENV === 'development' ? 'eval-source-map' : '' ,
};
