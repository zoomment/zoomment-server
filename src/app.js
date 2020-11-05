import mongoose from './services/mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import http from 'http';
import cors from 'cors';
import api from './api';

const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', api);

app.use(function (err, req, res, next) {
  console.log(err);
  const errorMessage = err.message || 'Something is wrong!';
  const errorStatue = err.status || 400;
  res.status(errorStatue).send(errorMessage);
});

const server = http.createServer(app);
setImmediate(() => {
  server.listen(process.env.PORT, () => {
    console.log('Express server listening on http://localhost:%s/', process.env.PORT);
  });
});

export default app;
