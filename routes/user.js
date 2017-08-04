var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();

var User =  require('../models/user.js');

router.get('/register', function (req,res){
	var errors = [];
	res.render('register', {errors: errors});
});

router.post('/register', function (req, res){
	var name = req.body.name;
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.checkBody('name', 'Name cannot be empty').notEmpty();
	req.checkBody('username', 'Username cannot be empty').notEmpty();
	req.checkBody('email', 'Email cannot be empty').notEmpty();
	req.checkBody('email', 'Email must be email type').isEmail();
	req.checkBody('password', 'password cannot be empty').notEmpty();
	req.checkBody('password', '6 to 20 charaters required').len(6,20);
	req.checkBody('password2','Re-type password does not match').equals(req.body.password);

	var errors = req.validationErrors();
	if(errors){
		res.render('register', {errors: errors});
	} else {
		var newUser = new User ({
			name: name,
			username: username,
			email: email,
			password: password
		});
		bcrypt.genSalt(10, function (err, salt){
			bcrypt.hash(newUser.password, salt, function (err, hash){
				newUser.password = hash;
				newUser.save(function (err){
					if(err){
						console.log(err);
					} else {
						console.log('You have been registered');
						res.redirect('/user/login');
					}
				})
			});
		});
	}

});

router.get('/login', function (req,res){
	res.render('login');
});

module.exports = router;