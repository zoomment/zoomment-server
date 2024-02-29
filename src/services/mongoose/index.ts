import mongoose from 'mongoose';

mongoose.Promise = Promise;

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

mongoose.connection.on('connected', err => {
  console.log('MongoDB connected');
});

export default mongoose;
