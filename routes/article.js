var express = require('express');
var router = express.Router();
var Article = require('../models/article.js');

router.get('*', function (req, res, next){
  res.locals.user = req.user || null;
  next();
});

router.get('/add', function (req, res){
	var errors = [];
	res.render('add_article', {errors: errors});
});

router.post('/add', function (req, res){
	req.checkBody('title', 'Title cannot be empty').notEmpty();
	req.checkBody('author', 'Author cannot be empty').notEmpty();
	req.checkBody('body', 'Body cannot be empty').notEmpty();

	var errors = req.validationErrors();
	if(!errors) {

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
			req.flash('success', 'A new article is saved to collection');
			res.redirect('/');
		})
	} else {
		console.log(errors);
		res.render('add_article', {errors: errors});
	}
	
});

router.get('/:id', function (req, res){
	var searchId = req.params.id;
	Article.findById(searchId, function (err, article){
		if(err){
			console.log(err);
			return;
		} else {
			//console.log(article.title);
			res.render('article', {article: article});
		}
	});
});

router.get('/edit/:id', function (req, res){
	var editId = req.params.id;
	var errors = []
	Article.findById(editId, function (err, article){
		if(err){
			console.log(err);
			return;
		} else {
			res.render('edit_article', {article: article, errors: errors});
		}
	});
});

router.post('/edit/:id', function (req,res){
	var editId = req.params.id;
	Article.findById(editId, function (err, article){
		if(err){
			console.log(err);
			return;
		} else {
			req.checkBody('title', 'Title cannot be empty').notEmpty();
			req.checkBody('author', 'Author cannot be empty').notEmpty();
			req.checkBody('body', 'Body cannot be empty').notEmpty();

			var errors = req.validationErrors();
			if(!errors){
				article.title = req.body.title;
				article.author = req.body.author;
				article.body = req.body.body;
				article.save(function(err){
					if(err){
						console.log(err);
						return;
					} else {
						console.log("Article id: "+ article._id + " has been updated");
						req.flash('info', "Article id: "+ article._id + " has been updated");
						res.redirect('/');
					}
				});
			} else {
				res.render('edit_article', {article: article, errors: errors});
			}
			
		}
	});
});

router.get('/delete/:id', function (req,res){
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
					console.log('Article with id: ' + article.id + ' has been removed');
					req.flash('danger', 'Article with id: ' + article.id + ' has been removed');
					res.redirect('/');
				}
			})
		}
	});
});

module.exports = router;

