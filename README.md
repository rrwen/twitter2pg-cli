# twitter2pg-cli

Richard Wen  
rrwen.dev@gmail.com  
  
Command line tool for extracting Twitter data to PostgreSQL databases

[![npm version](https://badge.fury.io/js/twitter2pg-cli.svg)](https://badge.fury.io/js/twitter2pg-cli)
[![Build Status](https://travis-ci.org/rrwen/twitter2pg-cli.svg?branch=master)](https://travis-ci.org/rrwen/twitter2pg-cli)
[![npm](https://img.shields.io/npm/dt/twitter2pg-cli.svg)](https://www.npmjs.com/package/twitter2pg-cli)
[![GitHub license](https://img.shields.io/github/license/rrwen/twitter2pg-cli.svg)](https://github.com/rrwen/twitter2pg-cli/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/rrwen/twitter2pg-cli.svg?style=social)](https://twitter.com/intent/tweet?text=Command%20line%20tool%20for%20extracting%20Twitter%20data%20to%20PostgreSQL%20databases:%20https%3A%2F%2Fgithub.com%2Frrwen%2Ftwitter2pg-cli%20%23nodejs%20%23npm)

## Install

1. Install [Node.js](https://nodejs.org/en/)
2. Install [twitter2pg-cli](https://www.npmjs.com/package/twitter2pg-cli) via `npm`

```
npm install -g twitter2pg-cli
```

For the latest developer version, see [Developer Install](#developer-install).

## Usage

Get help:

```
twitter2pg --help
```

Open documentation in web browser:

```
twitter2pg doc twitter2pg
twitter2pg doc twitter
twitter2pg doc pg
```

See [twitter2pg](https://www.npmjs.com/package/twitter2pg) for programmatic usage.

### Environment File

Create a template `.env` file for Twitter and PostgreSQL details:

* Edit this file with your [Twitter API credentials](https://apps.twitter.com/) and [PostgreSQL details](https://www.postgresql.org/docs/current/static/auth-pg-hba-conf.html)

```
twitter2pg file path/to/.env
```

Set default for the `.env` file:

* Every `twitter2pg` command will now use the designated `.env` file

```
twitter2pg set file path/to/.env
```

### PostgreSQL Query

Send a query to a PostgreSQL database after defining and setting the default [Environment File](#environment-file).  
  
The usage examples require a table named `twitter_data` which can be created with the command below:

```
twitter2pg query "CREATE TABLE twitter_data(tweets jsonb);"
```

row | tweets
--- | ---
1 | {...}
2 | {...}
3 | {...}
... | ...

### REST API

Setup default twitter options:

1. Set Twitter REST method (one of `get`, `post`, `delete` or `stream`)
2. Set [Twitter path](https://developer.twitter.com/en/docs/api-reference-index)
3. Set Twitter parameters for path

```
twitter2pg set twitter.method get
twitter2pg set twitter.path search/tweets
twitter2pg set twitter.params "{\"q\":\"twitter\"}"
```

Setup default PostgreSQL options:

1. Set table to store received Twitter data
2. Set column to store received Twitter data
3. Set [insert query](https://www.postgresql.org/docs/current/static/sql-insert.html) for received Twitter data
4. Set [jsonata](https://www.npmjs.com/package/jsonata) filter before inserting

```
twitter2pg set pg.table twitter_data
twitter2pg set pg.column tweets
twitter2pg set pg.query "INSERT INTO $options.pg.table($options.pg.column) SELECT * FROM json_array_elements($1);"
twitter2pg set jsonata statuses
```

Extract Twitter data into PostgreSQL table given setup options:

```
twitter2pg > log.csv
```

### Stream API

Setup default twitter options:

1. Set Twitter stream method
2. Set Twitter path
3. Set [Twitter stream parameters](https://developer.twitter.com/en/docs/tweets/filter-realtime/api-reference/post-statuses-filter.html)

```
twitter2pg set twitter.method stream
twitter2pg set twitter.path statuses/filter
twitter2pg set twitter.params "{\"track\":\"twitter\"}"
```

Setup default PostgreSQL options:

1. Set table to store streamed Twitter data
2. Set column to store streamed Twitter data
3. Set [insert query](https://www.postgresql.org/docs/current/static/sql-insert.html) for streamed Twitter data
4. Set [jsonata](https://www.npmjs.com/package/jsonata) filter before inserting

```
twitter2pg set pg.table twitter_data
twitter2pg set pg.column tweets
twitter2pg set pg.query "INSERT INTO $options.pg.table($options.pg.column) VALUES($1);"
twitter2pg set jsonata statuses
```

Stream Twitter data into PostgreSQL table given setup options:

```
twitter2pg > log.csv
```

Stream Twitter data into a PostgreSQL table as a service:

1. Save a [node](https://nodejs.org/api/cli.html) runnable script of the current options
2. Install [pm2](https://www.npmjs.com/package/pm2) (`npm install pm2 -g`)
2. Use `pm2`  to run the saved script as a service

```
twitter2pg save path/to/script.js
pm2 start path/to/script.js
pm2 save
```

### Logs

The logs are in the following format:

* `time_iso8601`: Time and date in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format
* `status`: Status of the log
* `message`: Relevant messages
* `json`: [JSON](https://www.json.org/) object containing relevant debugging information

time_iso8601 | status | message | json
--- | --- | --- | ---
... | ... | ... | ...

## Contributions

### Report Contributions

Reports for issues and suggestions can be made using the [issue submission](https://github.com/rrwen/twitter2pg-cli/issues) interface.

When possible, ensure that your submission is:

* **Descriptive**: has informative title, explanations, and screenshots
* **Specific**: has details of environment (such as operating system and hardware) and software used
* **Reproducible**: has steps, code, and examples to reproduce the issue

### Code Contributions

Code contributions are submitted via [pull requests](https://help.github.com/articles/about-pull-requests/):

1. Ensure that you pass the [Tests](#tests)
2. Create a new [pull request](https://github.com/rrwen/twitter2pg-cli/pulls)
3. Provide an explanation of the changes

A template of the code contribution explanation is provided below:

```
## Purpose

The purpose can mention goals that include fixes to bugs, addition of features, and other improvements, etc.

## Description

The description is a short summary of the changes made such as improved speeds or features, and implementation details.

## Changes

The changes are a list of general edits made to the files and their respective components.
* `file_path1`:
    * `function_module_etc`: changed loop to map
    * `function_module_etc`: changed variable value
* `file_path2`:
    * `function_module_etc`: changed loop to map
    * `function_module_etc`: changed variable value

## Notes

The notes provide any additional text that do not fit into the above sections.
```

For more information, see [Developer Install](#developer-install) and [Implementation](#implementation).

## Developer Notes

### Developer Install

Install the latest developer version with `npm` from github:

```
npm install -g git+https://github.com/rrwen/twitter2pg-cli
```
  
Install from `git` cloned source:

1. Ensure [git](https://git-scm.com/) is installed
2. Clone into current path
3. Install via `npm`

```
git clone https://github.com/rrwen/twitter2pg-cli
cd twitter2pg-cli
npm -g install
```

### Tests

1. Clone into current path `git clone https://github.com/rrwen/twitter2pg-cli`
2. Enter into folder `cd twitter2pg-cli`
3. Ensure [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies) are installed and available
4. Run tests with a `.env` file (see [tests/README.md](tests/README.md))
5. Results are saved to [tests/log](tests/log) with each file corresponding to a version tested

```
npm install
npm test
```

### Upload to Github

1. Ensure [git](https://git-scm.com/) is installed
2. Inside the `twitter2pg-cli` folder, add all files and commit changes
3. Push to github

```
git add .
git commit -a -m "Generic update"
git push
```

### Upload to npm

1. Update the version in `package.json`
2. Run tests and check for OK status
3. Login to npm
4. Publish to npm

```
npm test
npm login
npm publish
```

### Implementation

The module [twitter2pg](https://www.npmjs.com/package/twitter2pg) uses the following [npm](https://www.npmjs.com/) packages for its implementation:

npm | Purpose
--- | ---
[yargs](https://www.npmjs.com/package/yargs) | Command line builder and parser
[twitter2pg](https://www.npmjs.com/package/twitter2pg) | Extracts Twitter data to PostgreSQL
[dotenv](https://www.npmjs.com/package/dotenv) | Load environmental variables from a file
[opn](https://www.npmjs.com/package/opn) | Open online browser documentation
[pg](https://www.npmjs.com/package/pg) | Send queries to PostgreSQL database

```
yargs
   |--- twitter2pg   <-- default command
   |--- dotenv       <-- file
   |--- opn          <-- doc
   |--- pg           <-- query
```
