var express = require('express');
var bodyParser = require('body-parser');
expressValidator = require('express-validator');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/article');
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

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//route
var article = require('./routes/article.js');
app.use('/article', article);

app.listen(process.env.PORT || 3000, function(){
	console.log("Listening on port 3000");
});

app.get('/', function (req, res){
	Article.find({}, function (err, articles){
		if(err){
			console.log(err);
			return;
		}
		res.render('index', {articles: articles});
	})
});

/*
// Add article form
app.get('/article/add', function (req, res){
	res.render('add_article');
});

// Add a new article to database
app.post('/article/add', function (req, res){
	var newArticle = new Article({
		title: req.body.title,
		author: req.body.author,
		body: req.body.body
	});
	newArticle.save(function (err){
		if (err) {
			console.log(err);
			return;
		}
		console.log("A new article is saved to collection");
		res.redirect('/');
	})
});

//Get single article
app.get('/article/:id', function (req, res){
	var searchId = req.params.id;
	Article.findById(searchId, function (err, article){
		if(err){
			console.log(err);
			return;
		} else {
			//console.log(article.title);
			res.render('article', {article: article});
		}
	})
});

// edit article form
app.get('/article/edit/:id', function (req, res){
	var editId = req.params.id;
	Article.findById(editId, function (err, article){
		if(err){
			console.log(err);
			return;
		} else {
			res.render('edit_article', {article: article});
		}
	})
});

// edit article
app.post('/article/edit/:id', function (req, res){
	var editId = req.params.id;
	Article.findById(editId, function (err, article){
		if(err){
			console.log(err);
			return;
		} else {
			article.title = req.body.title;
			article.author = req.body.author;
			article.body = req.body.body;
			article.save(function(err){
				if(err){
					console.log(err);
					return;
				} else {
					console.log("Article id: "+ article._id + " has been updated");
					res.redirect('/');
				}
			})
		}
	});
});

app.get('/article/delete/:id', function (req, res){
	var deleteId = req.params.id;
	Article.findById(deleteId, function (err, article){
		if(err) {
			console.log(err);
			return;
		} else {
			Article.remove(article, function (err){
				if(err) {
					console.log(err);
					return;
				} else {
					console.log('Article with id: ' + article.id + " has been removed");
					res.redirect('/');
				}
			})
		}
	});
});

*/