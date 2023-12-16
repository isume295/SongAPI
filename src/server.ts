import express, { json } from 'express';
import http from 'http';
import mongoose, { mongo } from 'mongoose';
import cors from 'cors';
import { config } from './config/config';
import { corsOptions } from './config/corsOptions';
import songRouter from './routes/songRouter';

const app = express();
// connect to Mongo
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    console.log('Connected to Mongo database!');
    startServer();
  })
  .catch((err) => {
    console.log(err);
  });

// start the server only if connected to Mongo
const startServer = () => {
  app.use((req, res, next) => {
    // log the request
    console.log(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
      // log the response
      console.log(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]}]`);
    });

    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(json());
  app.use(cors(corsOptions));

  // Routes
  app.use('/songs', songRouter);
  //Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is up and running!' });
  });

  // error handling
  app.use((req, res, next) => {
    const error = new Error('Not found');
    console.log(error);
    return res.status(404).json({ message: error.message });
  });

  // start the server
  http.createServer(app).listen(config.server.port, () => {
    console.log(`Server is running at port ${config.server.port}`);
  });
};
