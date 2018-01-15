.PHONY: build test

define compose
	docker-compose $(1)
endef

define yarn
	$(call compose, run dev yarn $1)
endef

all: build bash

build:
	$(call compose, build --pull)

bash:
	$(call compose, run --service-ports dev bash)

test lint:
	$(call yarn, $@)

build-tactical: install-tactical test-unit-tactical test-pa11y-tactical

install-tactical:
	yarn install

test-all:
	yarn test-all

test:
	yarn test

test-coverage-tactical:
	yarn test:coverage

test-nsp-tactical:
	yarn test:nsp

test-a11y-tactical:
ifdef JUNIT_REPORT_PATH
	yarn test:a11y -- --reporter mocha-jenkins-reporter --reporter-options junit_report_packages=true
else
	yarn test:a11y
endif

test-e2e-tactical:
ifdef E2E_OUTPUT_DIR
	yarn test-e2e -- --reporter mochawesome
else
	yarn test-e2e
endif

sonarscan-tactical:
	yarn sonar-scan

health-check-tactical:
	yarn health-check
