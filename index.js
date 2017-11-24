// Richard Wen
// rrwen.dev@gmail.com

var fs = require('fs');
var path = require('path');
var twitter2pg = require('twitter2pg');

var defaultPath = path.join(__dirname, 'config/default.json');
var defaultJSON = require(defaultPath);

// (cli) Command line config
var argv = require('yargs')
	.usage('\nCommand line tool for extracting Twitter data to PostgreSQL databases.\n\nUsage: \n  twitter2pg <command> <options>\n  twitter2pg <options>')
	.command('doc', 'Open documentation in web browser')
	.command('query', 'Run a PostgreSQL query')
	.command('template', 'Create options file template if not exist')
	.command('file', 'Set or view default options file path')
	.alias('f', 'file')
	.describe('file', 'Path to options file')
	.describe('twitter.method', 'get/post/delete/stream')
	.describe('twitter.path', 'API path')
	.describe('twitter.params', 'API request parameters')
	.describe('pg.table', 'Table name')
	.describe('pg.column', 'Column name of pg.table')
	.describe('pg.query', 'Insert query for Twitter data $1')
	.describe('jsonata', 'JSON filter before pg.query')
	.describe('twitter.connection', 'Twitter API keys')
	.describe('twitter.connection.consumer_key', '')
	.describe('twitter.connection.consumer_secret', '')
	.describe('twitter.connection.access_token_key', '')
	.describe('twitter.connection.access_token_secret', '')
	.describe('pg.connection', 'PostgreSQL connection details')
	.describe('pg.connection.host', '')
	.describe('pg.connection.port', '')
	.describe('pg.connection.database', '')
	.describe('pg.connection.user', '')
	.describe('pg.connection.password', '')
	.alias('v', 'version')
	.alias('h', 'help')
	.help('h')
	.example('twitter2pg doc', 'Open twitter2pg doc')
	.example('twitter2pg doc twitter', 'Open Twitter API doc')
	.example('twitter2pg doc pg', 'Open PostgreSQL doc')
	.example('\ntwitter2pg template path/to/.env', '\nCreate options file template')
	.example('\ntwitter2pg file', '\nView default path for options file')
	.example('twitter2pg file path/to/.env', 'Set default path for options file')
	.example('\ntwitter2pg query "CREATE TABLE twitter_data(tweets jsonb);"', '\nCreate a table to store tweets')
	.example('\ntwitter2pg', '\nExtract twitter data to table')
	.example('twitter2pg -f path/to/.env', 'Extract twitter data to table using options file')
	.argv;
argv.file = argv.file || defaultJSON.file;
var cmd = argv._[0];

// (options_file) Load options file
if (argv.file != undefined) {
	require('dotenv').config({path: argv.file});
}

// (command_docs) Open docs in browser
if (cmd == 'doc') {
	var opn = require('opn');
	if (argv._.length < 2) {
		opn('https://www.github.com/rrwen/twitter2pg-cli');
	} else if (argv._[1].toLowerCase() == 'twitter') {
		opn('https://developer.twitter.com/en/docs');
	} else if (argv._[1].toLowerCase() == 'pg') {
		opn('https://www.postgresql.org/docs/current');
	}
}

// (command_query) Run query in PostgreSQL
if (cmd == 'query') {
	const {Client} = require('pg');
	argv.pg = argv.pg || {};
	argv.pg.connection = argv.pg.connection || {};
	const client = new Client(argv.pg.connection);
	client.connect()
		.then(() => {
			return client.query(argv._[1])
				.then(res => {
					console.log(res.rows);
				});
		})
		.then(() => {
			client.end();
		})
		.catch(err => {
			console.log('\nError:\n', err.message);
		});
}

// (command_template) Create template .env file
if (cmd == 'template') {
	var templatePath = path.join(__dirname, 'config/template.env');
	var read = fs.createReadStream(templatePath);
	var write = fs.createWriteStream(argv._[1]);
	read.pipe(write);
}

// (command_file) Set default options file path
if (cmd == 'file') {
	if (argv._.length > 1) {
		defaultJSON.file = argv._[1];
		fs.writeFileSync(defaultPath, JSON.stringify(defaultJSON));
	} else {
		console.log('\nDefault --file:\n', defaultJSON.file);
	}
}

// (command_run) Run twitter2pg
if (cmd == 'run') {
	twitter2pg(argv);
}
