// Richard Wen
// rrwen.dev@gmail.com

// (packages) Package dependencies
var fs = require('fs');
var moment = require('moment');
var pgtools = require('pgtools');
var test = require('tape');

const {spawn} = require('child_process');
require('dotenv').config();

// (test_info) Get package metadata
var json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var testedPackages = [];
for (var k in json.dependencies) {
  testedPackages.push(k + ' (' + json.dependencies[k] + ')');
}
var devPackages = [];
for (var k in json.devDependencies) {
  devPackages.push(k + ' (' + json.devDependencies[k] + ')');
}

// (test_log) Pipe tests to file and output
if (!fs.existsSync('./tests/log')){
    fs.mkdirSync('./tests/log');
}
if (!fs.existsSync('./tests/out')){
    fs.mkdirSync('./tests/out');
}
var testFile = './tests/log/test_' + json.version.split('.').join('_') + '.txt';
test.createStream().pipe(fs.createWriteStream(testFile));
test.createStream().pipe(process.stdout);

// (test) Run tests
test('Tests for ' + json.name + ' (' + json.version + ')', t => {
    t.comment('Node.js (' + process.version + ')');
    t.comment('Description: ' + json.description);
    t.comment('Date: ' + moment().format('YYYY-MM-DD hh:mm:ss'));
    t.comment('Dependencies: ' + testedPackages.join(', '));
    t.comment('Developer: ' + devPackages.join(', '));
	
	// (test_help) Test show help
	var child = spawn('node', ['./bin/twitter2pg', '-h']);
	child.stderr.on('data', data => {
		t.fail('(MAIN) help: ' + data.toString('utf8'));
	});
	child.on('close', code => {
		t.equals(code, 0, '(MAIN) help');
	});
	
	// (test_doc_twitter2pg) Test show doc twitter2pg
	var child = spawn('node', ['./bin/twitter2pg', 'doc', 'twitter2pg']);
	child.stderr.on('data', data => {
		t.fail('(MAIN) doc twitter2pg: ' + data.toString('utf8'));
	});
	child.on('close', code => {
		t.equals(code, 0, '(MAIN) doc twitter2pg');
	});
	
	// (test_doc_twitter) Test show doc twitter
	var child = spawn('node', ['./bin/twitter2pg', 'doc', 'twitter']);
	child.stderr.on('data', data => {
		t.fail('(MAIN) doc twitter: ' + data.toString('utf8'));
	});
	child.on('close', code => {
		t.equals(code, 0, '(MAIN) doc twitter');
	});
	
	// (test_doc_pg) Test show doc pg
	var child = spawn('node', ['./bin/twitter2pg', 'doc', 'pg']);
	child.stderr.on('data', data => {
		t.fail('(MAIN) doc pg: ' + data.toString('utf8'));
	});
	child.on('close', code => {
		t.equals(code, 0, '(MAIN) doc pg');
	});
	
	// (test_file) Test create env file
	var child = spawn('node', ['./bin/twitter2pg', 'file', './tests/out/.env']);
	child.stderr.on('data', data => {
		t.fail('(MAIN) env: ' + data.toString('utf8'));
	});
	child.on('close', code => {
		t.equals(code, 0, '(MAIN) env');
	});
	
	// (test_set) Test set default
	var child = spawn('node', ['./bin/twitter2pg', 'set', 'file', './tests/out/.env']);
	child.stderr.on('data', data => {
		t.fail('(MAIN) set: ' + data.toString('utf8'));
	});
	child.on('close', code => {
		t.equals(code, 0, '(MAIN) set');
		
		// (test_delete) Test delete default
		var child = spawn('node', ['./bin/twitter2pg', 'delete', 'file']);
		child.stderr.on('data', data => {
			t.fail('(MAIN) delete: ' + data.toString('utf8'));
		});
		child.on('close', code => {
			t.equals(code, 0, '(MAIN) delete');
		});
	});
	
	// (test_db_create) Create test database
	var config = {
		user: process.env.PGUSER,
		password: process.env.PGPASSWORD,
		port: process.env.PGPORT,
		host: process.env.PGHOST
	};
	pgtools.createdb(config, process.env.PGTESTDATABASE, function (err, res) {
		if (err) {
			t.fail( '(MAIN) CREATE test database: '+ err);
			process.exit(-1);
		}
		process.env.PGDATABASE = process.env.PGTESTDATABASE;
		t.pass('(MAIN) CREATE test database');
		
		// (test_query_create) Test query CREATE
		var child = spawn('node', ['./bin/twitter2pg', 'query', 'CREATE TABLE IF NOT EXISTS twitter_data(tweets jsonb);']);
		child.stderr.on('data', data => {
			t.fail('(MAIN) query CREATE: ' + data.toString('utf8'));
		});
		child.on('close', code => {
			t.equals(code, 0, '(MAIN) query CREATE');
			
			// (test_twitter2pg_get) Test twitter2pg GET
			var child = spawn('node', ['./bin/twitter2pg']);
			child.stderr.on('data', data => {
				t.fail('(MAIN) twitter2pg GET: ' + data.toString('utf8'));
			});
			child.on('close', code => {
				t.equals(code, 0, '(MAIN) twitter2pg GET');
				
				// (test_twitter2pg_stream) Test twitter2pg STREAM
				var child = spawn('node', ['./bin/twitter2pg', '--twitter.method stream', '--twitter.path statuses/filter', '--twitter.params "{\"track\": \"twitter\"}"']);
				child.stderr.on('data', data => {
					t.fail('(MAIN) twitter2pg STREAM: ' + data.toString('utf8'));
				});
				child.stdout.on('data', data => {
					t.pass('(MAIN) twitter2pg STREAM');
					
					// (test_db_drop) Drop test database
					pgtools.dropdb(config, process.env.PGTESTDATABASE, function (err, res) {
						if (err) {
							t.fail( '(MAIN) DROP test database: '+ err);
							process.exit(-1);
						}
						t.pass('(MAIN) DROP test database');
						process.exit(0);
					});
				});
			});
		});
	});
	t.end();
});
