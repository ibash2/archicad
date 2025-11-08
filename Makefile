DC = docker compose
APP = docker-compose.yaml
ENV = --env-file .env

.PHONY: app
app:
	${DC} -f ${APP} ${ENV} up --build -d

.PHONY: down
down:
	${DC} -f ${APP} ${ENV} down

.PHONY: app-logs
app-logs:
	${DC} -f ${APP} ${ENV} logs -f

