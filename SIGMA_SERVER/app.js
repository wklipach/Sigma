var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var forgotPassword = require('./routes/forgotpassword');
var summary = require('./routes/summary');
var protected_objects = require('./routes/protected_objects');
var avatar = require('./routes/avatar');
var mtr = require('./routes/mtr');
var guide = require('./routes/guide');
var staff = require('./routes/staff');
var filters = require('./routes/filters.js');
var task = require('./routes/task.js');
var settings = require('./routes/settings.js');
var ollr = require('./routes/ollr.js');
var tabel = require('./routes/tabel.js');
var checklist = require('./routes/checklist.js');
var posts = require('./routes/posts.js');
var chalk = require ('chalk');
var pooling_chat = require('./routes/pooling_chat.js');


var app = express();
app.use(express.json({ limit: '50mb' }));




console.log( chalk.bgRed.white(' start '), new Date().toLocaleString() );  



app.use(express.json({ limit: '50mb' }));

// process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
// Add headers


app.use(function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "http://localhost:4200" ); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/forgotpassword', forgotPassword);
app.use('/summary', summary);
app.use('/protected_objects', protected_objects);
app.use('/avatar', avatar);
app.use('/mtr', mtr);
app.use('/guide',guide);
app.use('/staff', staff);
app.use('/filters', filters);
app.use('/task', task);
app.use('/settings', settings);
app.use('/ollr', ollr);
app.use('/tabel', tabel);
app.use('/checklist', checklist);
app.use('/posts', posts);
app.use('/pooling_chat', pooling_chat);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





global.appRoot = path.resolve(__dirname);
module.exports = app;
