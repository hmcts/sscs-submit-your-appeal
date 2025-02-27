# SSCS - Submit Your Appeal

## Background:
Anyone who disagrees with a decision about their entitlement to benefits has the right to appeal against that decision.
The first step is asking the Department for Work and Pensions to look at the decision again.
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


Redis is required to run the application. You can either install it or use a docker image (See docker section below for instructions).

### If Redis is already installed on your system
You can simply start the application with `yarn start:dev` (`yarn iba:start:dev` for IBA appeals.)

### Install Redis: 
download, extract and build:

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

For an IBA appeal, use:

    yarn iba:dev


View the application:

    https://localhost:3000

## Docker

If you would like to view the application without having to setup Redis you can do so via Docker.

We use the [Dockerfile] and [docker-compose.yml] to create a container to bring up the app which includes Redis.

Build the node.js Dockerfile containing SYA into a local image:

    docker build -t hmcts/submit-your-appeal:latest .

Bring up the container:

    docker-compose up sya

View the application:

    https://localhost:3000

If you prefer to run the application natively but still use docker for Redis you can do so by running:
    docker-compose up redis

You would then start the application by running yarn dev (yarn iba:dev for IBA appeal) as above

## End-to-end testing

Ensure both SYA (from one of the methods above) and the [API](https://github.com/hmcts/tribunals-case-api/) are up (including docker dependencies run through CFTLib). At
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
yarn test:functional:batches
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

## Security Scan: Run yarn audit locally

You need `jq` installed

Download `yarn-audit-with-suppressions.sh` and `prettyPrintAudit.sh` from https://github.com/hmcts/cnp-jenkins-library
to project root folder

```bash
curl -OL https://raw.githubusercontent.com/hmcts/cnp-jenkins-library/master/resources/uk/gov/hmcts/pipeline/yarn/yarn-audit-with-suppressions.sh
curl -OL https://raw.githubusercontent.com/hmcts/cnp-jenkins-library/master/resources/uk/gov/hmcts/pipeline/yarn/prettyPrintAudit.sh
curl -OL https://raw.githubusercontent.com/hmcts/cnp-jenkins-library/master/resources/uk/gov/hmcts/pipeline/yarn/format-v4-audit.cjs
```

Make the scripts executable

```bash
chmod +x ./yarn-audit-with-suppressions.sh
chmod +x ./prettyPrintAudit.sh
```

Set the environment variable of yarn version

```bash
export YARN_VERSION=$(yarn --version | cut -d. -f1)
```

Run `yarn-audit-with-suppressions.sh`

```bash
./yarn-audit-with-suppressions.sh
```

[Dockerfile]:Dockerfile
[docker-compose.yml]:docker-compose.yml

## Useful docker commands

List images

    docker images

List containers

    docker ps

Execute an interactive bash shell on the container

    docker exec -it <container id> sh
