**Requirements**

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)

Clone the repository and install dependencies:

```
$ git clone https://github.com/zoomment/zoomment-server.git
$ cd zoomment-server
$ npm install
```

Copy and edit the `env` file:

```
$ cp .env.example .env
$ vim .env
```

Run development:

```
$ npm run dev
```

Run production:

```
$ npm start
```

Stop production:

```
$ npm run kill
```

## Docker

modify `.env.docker` to run with docker.

### run mongo with docker

```
make dev
```

### build the docker image

```
make build
```

### start/stop system

To start

```
make up
```

To stop

```
make down
```
