# twitter2pg-cli

Richard Wen  
rrwen.dev@gmail.com  
  
Command line tool for extracting Twitter data to PostgreSQL databases

[![npm version](https://badge.fury.io/js/twitter2pg-cli.svg)](https://badge.fury.io/js/twitter2pg-cli)
[![Build Status](https://travis-ci.org/rrwen/twitter2pg-cli.svg?branch=master)](https://travis-ci.org/rrwen/twitter2pg-cli)
[![npm](https://img.shields.io/npm/dt/twitter2pg-cli.svg)](https://www.npmjs.com/package/twitter2pg-cli)
[![GitHub license](https://img.shields.io/github/license/rrwen/twitter2pg-cli.svg)](https://github.com/rrwen/twitter2pg-cli/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/rrwen/twitter2pg-cli.svg?style=social)](https://twitter.com/intent/tweet?text=Command%20line%20tool%20for%20extracting%20Twitter%20data%20to%20PostgreSQL%20databases:%20https%3A%2F%2Fgithub.com%2Frrwen%2Ftwitter2pg-cli%20%23nodejs%20%23npm)

## Test Environment

To connect to Twiter and PostgreSQL, a `.env` file is required:

1. Create a `.env` file in the root directory
2. Use the template below to provide Twitter credentials and PostgreSQL connection details inside the `.env` file

```
TWITTER_CONSUMER_KEY=***
TWITTER_CONSUMER_SECRET=***
TWITTER_ACCESS_TOKEN_KEY=***
TWITTER_ACCESS_TOKEN_SECRET=***
PGHOST=localhost
PGPORT=5432
PGDATABASE=twitter2pg_database
PGUSER=super_user
PGPASSWORD=***
```

The [Tests](../README.md#tests) can then be run with the following command:

```
npm test
```
