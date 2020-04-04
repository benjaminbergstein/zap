db-init:
	${DOCKER_RUN} server prisma init

db-migrate:
	${DOCKER_RUN} server prisma migrate save --name ${MIGRATION} --experimental

db-up:
	${DOCKER_RUN} server prisma migrate up --experimental

db-client-generate:
	${DOCKER_RUN} server prisma generate
