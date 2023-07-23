build:
	docker build -t foo-comments-server .

up:
	docker-compose up -d


down:
	docker-compose down

dev:
	docker-compose -f docker-compose.dev.yml up
