// const https = require('https');
// const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
// const fileUpload = require('express-fileupload');

const app = express(); // ⚠️ AVVAL app ni yaratamiz

// const options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/api.drkodirov.uz/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/api.drkodirov.uz/fullchain.pem')
// };

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
// app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRouter = require('./src/routes/index');
const calendarRouter = require('./src/routes/calendar');

app.use('/api/v1', indexRouter);
app.use('/api/v1/calendar', calendarRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.get('/', (req, res) => {
  res.send('Server ishlayapti!');
});

// HTTPS serverni **eng oxirida** ishga tushuramiz
// https.createServer(options, app).listen(3000, () => {
//   console.log("✅ HTTPS server running on port 3000");
// });
//ulashish
module.exports = app