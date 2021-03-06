const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');
const cors = require('cors');
const path = require('path');
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config');
const seedDB = require('./data/seedDB');
const mattressRouter = require('./routes/mattresses');
const bedBaseRouter = require('./routes/bedBases');
const homeRouter = require('./routes/index');
const loginRouter = require('./routes/login');

const app = express();

/**
 * Database connection
 */
mongoose.connect(config.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message);
  });
seedDB(); // seeds the database if it is empty or lacking data

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}
app.use('/colchones', mattressRouter);
app.use('/somieres', bedBaseRouter);
app.use('/', homeRouter);
app.use('/login', loginRouter);

app.use(errorHandler.unknownEndpoint);
app.use(errorHandler.errorHandler);

module.exports = app;
