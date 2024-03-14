import mongoose from './services/mongoose';
import { auth } from './services/express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import express, { ErrorRequestHandler } from 'express';
import http from 'http';
import cors from 'cors';
import api from './api';
import { migrate } from './migrations';

const app = express();

mongoose.connect(process.env.MONGODB_URI || '');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true
  })
);
app.use(auth());

app.use('/api', api);

// eslint-disable-next-line no-unused-vars
app.use(<ErrorRequestHandler>function (err, req, res, next) {
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

if (process.env.MIGRATION) {
  migrate()
    .then(() => {
      throw new Error('Migration complied');
    })
    .catch(e => {
      throw new Error(e);
    });
}

export default app;
