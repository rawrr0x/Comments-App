<p align="center">Comments App Documentation</p>

# Before first start of project you need:
- install dependencies
- create and fill out .env files ( described in .env.sample )
- run all migrations

## Install dependencies

```bash
$ npm install
```

## Compile and run the project for local deployment

```bash
# run backend and db
$ docker-compose up

# stop backend and db
$ docker-compose down

# build
$ docker-compose build

# run all migrations
$ docker exec -it comment-backend npm run migration:run

# generate a migration
$ docker exec -it comment-backend npm run migration:genarate

```

## Run tests ( No tests in this project )

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```