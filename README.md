**Requirements**
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)


Clone the repository and install dependencies:

```
$ git clone https://github.com/FooComments/foo-comments-server.git
$ cd foo-comments-server
$ npm install
```

Copy and edit the `env` file:

```
$ cp .env.example .env
$ vim .env
```

Run the server:

```
$ npm run server
```

If you want to stop the server:

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
