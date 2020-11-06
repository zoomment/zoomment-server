require('babel-core/register');
require('dotenv-safe').config({ allowEmptyValues: true });
exports = module.exports = require('./src/app.js');
