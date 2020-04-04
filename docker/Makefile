export PROJECT=zap
export ENVIRONMENT ?= development
export SERVICE ?= server
export PORT ?= 11000

export POSTGRES_USER=zap
export POSTGRES_PASSWORD=l@s3r
export POSTGRES_DB=zap_${ENVIRONMENT}

export DOCKER_BASE=benbergstein/${PROJECT}
SERVICE_IMAGE=${DOCKER_BASE}-${SERVICE}
DOCKER_TAG ?= latest

define DOCKER_COMPOSE
docker-compose --project-directory ../server -p zap_${ENVIRONMENT}
endef

define DOCKER_RUN
${DOCKER_COMPOSE} run --rm
endef

include ${SERVICE}.mk

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

package.json:
	${DOCKER_RUN} --entrypoint cat ${SERVICE} package.json > ../${SERVICE}/package.json
