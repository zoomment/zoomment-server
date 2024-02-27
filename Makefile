build:
	docker build -t zoomment-server .

up:
	docker-compose up -d


down:
	docker-compose down

dev:
	docker-compose -f docker-compose.dev.yml up
