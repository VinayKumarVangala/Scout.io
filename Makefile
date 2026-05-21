.PHONY: dev-up dev-down dev-logs dev-reset

dev-up:
	docker compose -f infrastructure/docker/docker-compose.yml up -d

dev-down:
	docker compose -f infrastructure/docker/docker-compose.yml down

dev-logs:
	docker compose -f infrastructure/docker/docker-compose.yml logs -f

dev-reset:
	docker compose -f infrastructure/docker/docker-compose.yml down -v
