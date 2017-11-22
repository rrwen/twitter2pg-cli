// Richard Wen
// rrwen.dev@gmail.com

var argv = require('yargs').argv;
var twitter2pg = require('twitter2pg');

/**
 * Description.
 *
 * @module twitter2pg-cli
 * @param {Object} [options={}] parameter description.
 * @returns {Object} return description.
 *
 * @example
 * var twitter2pgcli = require('../index.js');
 */
twitter2pg(argv);
