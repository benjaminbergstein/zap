export PROJECT=zap
export ENVIRONMENT ?= development
export SERVICE ?= server
export PORT ?= 11000
export CLIENT_PORT ?= 11001

export POSTGRES_USER=zap
export POSTGRES_PASSWORD=l@s3r
export POSTGRES_DB=zap_${ENVIRONMENT}

export HOST ?= dev-3.wips.link
export SERVER_URL ?= http://server:3000
export CLIENT_URL ?= http://${HOST}:${PORT}

export DOCKER_BASE=benbergstein/${PROJECT}
SERVICE_IMAGE=${DOCKER_BASE}-${SERVICE}
DOCKER_TAG ?= latest

define DOCKER_COMPOSE
docker-compose -f ./docker-compose.${ENVIRONMENT}.yml --project-directory .. -p zap_${ENVIRONMENT}
endef

define DOCKER_RUN
${DOCKER_COMPOSE} run --rm
endef

include ${SERVICE}.mk

release: ENVIRONMENT=production
release: all stop start

all:
	SERVICE=server make build
	SERVICE=clueboys-client make build

build:
	docker build ../${SERVICE} \
		-f ./Dockerfile.${SERVICE} \
		-t ${SERVICE_IMAGE}:${DOCKER_TAG}

start:
	${DOCKER_COMPOSE} up -d

logs:
	${DOCKER_COMPOSE} logs -f ${SERVICE}

stop:
	${DOCKER_COMPOSE} down --remove-orphans

console:
	${DOCKER_RUN} --entrypoint /bin/bash ${SERVICE}

attach:
	${DOCKER_COMPOSE} exec ${SERVICE} /bin/bash

psql:
	psql -h localhost -U ${POSTGRES_USER} ${POSTGRES_DB}

package.json:
	${DOCKER_RUN} --entrypoint cat ${SERVICE} package.json > ../${SERVICE}/package.json
