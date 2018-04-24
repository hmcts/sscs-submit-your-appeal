# SSCS - Submit your  appeal

## Background
Someone who receives a decision about their entitlement to benefits has the right to appeal against that decision,
if they disagree with it. The first step is asking the Department for Work and Pensions to look at the decision again.
This is known as requesting ‘Mandatory Reconsideration’. If they still disagree, they can appeal to the Social Security
and Child Support tribunal.

Should an appellant wish to appeal online this node.js web application allows them to do so. The application takes the
appellant on a journey, presenting a single question per page (GDS guidelines), at the end of their journey we present 
an appeal summary page. Should the user wish to edit any part of their appeal they can jump back to their answer, 
edit it, then jump forward to the summary missing out intermediate pages saving considerable time.

## Dependencies
 - [Docker](https://www.docker.com/)
 - [Redis](https://redis.io/)

## Development

Install Redis: download, extract, build and start 
    
    http://download.redis.io/redis-stable.tar.gz
    tar xvzf redis-stable.tar.gz
    cd redis-stable
    make

Sanity check

    make test 

Add this to your path

    /usr/local/bin 
    
Copy over both the Redis server and the command line interface

    sudo cp src/redis-server /usr/local/bin/
    sudo cp src/redis-cli /usr/local/bin/

Start redis

    redis-server
    
Bring up SYA in a new terminal window

    yarn dev
    
View the application

    http://localhost:3000

## Docker

We use the [Dockerfile] and [docker-compose.yml] to create a development container to bring up the app which includes 
Redis.

Build the node.js Dockerfile containing SYA into a local image

    docker build -t hmcts/submit-your-appeal:latest .

Bring up the container

    docker-compose up sya

View the application

    http://localhost:3000
    
## End-to-end testing

Ensure both SYA (from one of the methods above) and the [API](https://github.com/hmcts/tribunals-case-api/) are up. At 
present these tests do not run within Docker, therefore, open a new terminal window

Functional tests 

    yarn test:functional
    
Smoke tests

    yarn test:smoke

## Unit tests
    yarn test
    
## Code coverage
    yarn test:coverage
    
## Node Security Platform (NSP)
    yarn test:nsp

[Dockerfile]:Dockerfile
[docker-compose.yml]:docker-compose.yml

## Useful docker commands

List images

    docker images          

List containers

    docker ps

Execute an interactive bash shell on the container

    docker exec -it <container id> sh
