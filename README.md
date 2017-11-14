# SSCS - Submit your  appeal

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7cfcc31911754eb88285c2e57556c0a6)](https://www.codacy.com/app/iguannago/submit-your-appeal?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=hmcts/submit-your-appeal&amp;utm_campaign=Badge_Grade)


## Background
Someone who receives a decision about their entitlement to benefits has the right to appeal against that decision,
if they disagree with it. The first step is asking the Department for Work and Pensions to look at the decision again.
This is known as requesting ‘Mandatory Reconsideration’. If they still disagree, they can appeal to the Social Security
and Child Support tribunal.

Should an appellant wish to appeal online this web application will allow them to do so. The application takes the
appellant on a journey, presenting a single question per page, at the end of the journey we present all questions and
corresponding answers to them (i.e. their appeal), they may also go back to modify an answer, once complete
they may downloaded a PDF for reference.

## Dependencies
 - [Docker](https://www.docker.com/)

## Development

We use the [Dockerfile] and [docker-compose.yml] to create a development container used for running tests, etc.

To start the container run:

    $> make

Once complete you will be dropped into a shell:

    root@23a45b67c89:/usr/src/sya#

Now install application dependencies leveraging yarn:

    yarn install

Run the application for development:

    yarn start-dev

* If you have problems to view the app properly because assets are not being displayed correctly, then run it this way:

      ENV=dev yarn start-dev


View the application

    http://localhost:3000

[Dockerfile]:Dockerfile
[docker-compose.yml]:docker-compose.yml
