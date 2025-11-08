DC = docker compose
APP = docker-compose.yaml
ENV = --env-file .env

.PHONY: app
app-dev:
	${DC} -f ${APP} ${ENV} up --build -d

.PHONY: down
down:
	${DC} -f ${APP} ${ENV} down

.PHONY: app-logs
app-dev-logs:
	${DC} -f ${APP} ${ENV} logs -f

