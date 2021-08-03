# SSCS - Submit your  appeal

## Background
Someone who receives a decision about their entitlement to benefits has the right to appeal against that decision,
if they disagree with it. The first step is asking the Department for Work and Pensions to look at the decision again.
This is known as requesting ‘Mandatory Reconsideration’. If they still disagree, they can appeal to the Social Security
and Child Support tribunal.

Should an appellant wish to appeal online this node.js web application allows them to do so. The application takes the
appellant on a journey, presenting a single question per page (GDS guidelines), at the end of their journey we present
an appeal summary page, allowing the user to edit their answers or sign and submit.

## Dependencies
 - [Docker](https://www.docker.com/)
 - [Redis](https://redis.io/)

## Development

**Config**

Install Redis: download, extract and build:

    http://download.redis.io/redis-stable.tar.gz
    tar xvzf redis-stable.tar.gz
    cd redis-stable
    make

Sanity check:

    make test

Add this to your path:

    /usr/local/bin

Copy over both the Redis server and the command line interface:

    sudo cp src/redis-server /usr/local/bin/
    sudo cp src/redis-cli /usr/local/bin/

Start redis:

    redis-server

Install npm dependencies:

    yarn install
    
Generate cookie banner content:

    ./node_modules/gulp/bin/gulp.js default

Bring up SYA in a new terminal window:

    yarn dev

View the application:

    https://localhost:3000

## Docker

If you would like to view the application without having to setup Redis you can via Docker.

We use the [Dockerfile] and [docker-compose.yml] to create a container to bring up the app which includes Redis.

Build the node.js Dockerfile containing SYA into a local image:

    docker build -t hmcts/submit-your-appeal:latest .

Bring up the container:

    docker-compose up sya

View the application:

    https://localhost:3000

## End-to-end testing

Ensure both SYA (from one of the methods above) and the [API](https://github.com/hmcts/tribunals-case-api/) are up. At
present these tests do not run within Docker, therefore, open a new terminal window.

Functional tests:
We have split our functional tests into two.
Firstly we have tests for entire journeys through the form:

    yarn test:functional

However, in order to get this command to run properly you currently have to remove ``` --grep @functional ``` tag from
the ```test:functional``` script in package.json.

Secondly, we have tests for various pages in the form:

    yarn test:e2e-pages

Functional test batches:

To improve reliability running the functional tests locally you can run them in batches using the following command

```bash
yarn test:functional:all-batches
```

If you wish to increase the speed of the tests, you can decrease the wait time between each action, the default is set
to 500ms. Override this by setting the env var `E2E_WAIT_FOR_ACTION_VALUE`, I find 50ms works fine.
Use this together with batching like so:

```bash
E2E_WAIT_FOR_ACTION_VALUE=50 yarn test:functional:batches
```

Smoke tests:

    yarn test:smoke

## Unit tests
    yarn test

## Code coverage
    yarn test:coverage

## Security scan of installed packages
    yarn test:audit

[Dockerfile]:Dockerfile
[docker-compose.yml]:docker-compose.yml

## Useful docker commands

List images

    docker images

List containers

    docker ps

Execute an interactive bash shell on the container

    docker exec -it <container id> sh


