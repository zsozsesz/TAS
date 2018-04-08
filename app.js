var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');


var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: '237rh27fuhsihf2uf2', saveUninitialized: false, resave: false}));
var hour = 3600000;

app.use(function (req,res,next) {
    if(!req.session.login)
    {
        req.session.login=false;
        req.session.level=1;
    }
    req.session.cookie.maxAge = hour/2;
    next();
});

app.use('/', indexRouter);
app.use('/api/profile', loginRouter);
app.use('/api/admin',function (req,res,next) {
  if(req.session.level!== 3){
    res.json({
        success: false,
        error: 1,
        data: ''
    });
  }else{
    next();
  }
});
app.use('/api/admin', adminRouter);



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

module.exports = app;
