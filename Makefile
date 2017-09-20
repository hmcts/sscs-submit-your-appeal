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
