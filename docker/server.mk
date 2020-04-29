db-init:
	${DOCKER_RUN} server prisma init

db-migrate:
	${DOCKER_RUN} server prisma migrate save --name ${MIGRATION} --experimental

db-up:
	${DOCKER_RUN} server prisma migrate up --experimental

db-client-generate:
	${DOCKER_RUN} server prisma generate

types.d.ts:
	docker cp zap_development_server_1:/app/node_modules/@prisma/client/index.d.ts ../types.d.ts
