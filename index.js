// Richard Wen
// rrwen.dev@gmail.com

var twitter2pg = require('twitter2pg');

module.exports = function(argv) {
	
	// (options_file) Load options file
	if (argv.file != undefined) {
		require('dotenv').config({path: argv.file});
	}
	
	// (command_run_options) Default run options
	argv.twitter = argv.twitter || {};
	argv.twitter.method = argv.twitter.method || process.env.TWITTER_METHOD || 'get';
	argv.twitter.path =argv.twitter.path || process.env.TWITTER_PATH || 'search/tweets';
	argv.twitter.params = argv.twitter.params || process.env.TWITTER_PARAMS || {q:'twitter'};
	argv.pg.table = argv.pg.table || process.env.PGTABLE || 'twitter2pg_table';
	argv.pg.column = argv.pg.column || process.env.PGCOLUMN || 'tweets';
	argv.pg.query = argv.pg.query || process.env.PGQUERY || 'INSERT INTO $options.pg.table ($options.pg.column) VALUES ($1);';
	
	// (command_run_info) Information JSON
	var quote = '"';
	var delim = ",";
	var info = {
		twitter: {
			method: argv.twitter.method,
			path: argv.twitter.path,
			params: argv.twitter.params
		},
		pg: {
			table: argv.pg.table,
			column: argv.pg.column,
			query: argv.pg.query
		}
	}
	info = quote + new Date().toISOString() + quote + delim + quote + 'start' + quote + delim  + quote + 'Options' + quote + delim + quote + JSON.stringify(info).replace(/"/g, '""') + quote;
	console.log(info);
	
	// (command_stream) Twitter stream API
	if (argv.twitter.method == 'stream') {
		
		// (command_stream_verbose) Success log messages for streams
		if (argv.verbose) {
			argv.twitter.stream = function(err, data) {
				console.log(quote + new Date().toISOString() + quote + delim + quote + 'success' + quote + delim + delim);
			};
		}
		
		// (command_stream_run) Start streaming process and log errors
		var stream = twitter2pg(argv);
		stream.on('error', function(err) {
			console.error(quote + new Date().toISOString() + quote + delim + quote + 'error' + quote + delim + quote + err.message + quote + delim + quote + JSON.stringify(err) + quote + delim);
		});
	} else {
		
		// (command_rest) Twitter REST API
		twitter2pg(argv)
			.then(data => {
				if (argv.verbose) {
					console.log(quote + new Date().toISOString() + quote + delim + quote + 'success' + quote + delim + delim);
				}
				data.pg.client.end();
				process.exit(0);
			})
			.catch(err => {
				console.error(quote + new Date().toISOString() + quote + delim + quote + 'error' + quote + delim + quote + '' + quote + delim + quote + JSON.stringify(err).replace(/"/g, '""') + quote + delim);
				process.exit(1);
			});
	}
};
