var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var config = require('./config/database');
mongoose.connect(config.database);
var db = mongoose.connection;

//Check for db error
db.on('error', function(err){
	console.log("Error: " + err);
});

//Check for connection
db.once('open', function(){
	console.log("Connected to db");
})
var app = express();
var Article = require('./models/article.js');
var User = require('./models/user.js');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

// express session
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

// flash
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// express validator error formatter
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
//Passport config
require('./config/passport.js')(passport);
app.use(passport.initialize());
app.use(passport.session());



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//route - article
var article = require('./routes/article.js');
app.use('/article', article);

//route - user
var user = require('./routes/user.js');
app.use('/user', user);


app.get('*', function (req, res, next){
  res.locals.user = req.user || null;
  next();
});


app.get('/', function (req, res){
	Article.find({}, function (err, articles){
		if(err){
			console.log(err);
			return;
		}
    console.log(req.user);
		res.render('index', {articles: articles});
	})
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Listening on port 3000");
});
