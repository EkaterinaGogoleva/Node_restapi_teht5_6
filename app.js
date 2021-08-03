/* eslint-disable no-unused-vars */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
//reittiystietoston määrittely
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const studentsRouter = require('./routes/students');
const app = express();

//cors avaa yhteyden palvelinsovelluksen ja asiakas sovelluksen välille
//jos nämä sijaitsevat eri palvelimilla
const corsOptions = {
  origin: 'http://localhost:4200', //frontin osoite mihin saadaan olla yhdeydessä
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//соединение с монго осуществляется здесь
mongoose.set('useUnifiedTopology', true); // määritys jota käytetään tietokantapalvelimen etsinnässä

mongoose
  .connect(
    process.env.MONGODB_URL,

    /*
    'mongodb://' +
      process.env.DB_USER +
      ':' +
      process.env.DB_PW +
      '@localhost:27017/studentdb'*/
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error');
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//reittien käyttönotto
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/students', studentsRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
