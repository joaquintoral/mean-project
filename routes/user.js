var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = required('jsonwebtoken');

var User = require('../models/user');

router.post('/', function (req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        // Salting is the strength of salting done. This is a one way encryption
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email
    });
    user.save(function(err, result) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        res.status(201).json({
            message: 'User created',
            obj: result
        })
    });
});

router.post('/signin', function(req, res, next) {
   // Finds all fitting entry and returns the first one
    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if(!user) {
            // 401 unauthorized
            return res.status(401).json({
                title: 'No user found',
                error: {
                    message: 'User could not be found'
                }
            });
        }

        if(!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed 2',
                error: {message: 'Invalid login credentials'}
            });
        }

        //JSON Web Tokens
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
        res.status(200).json({
            message: 'Successfully logged in',
            token: token,
            userId: user._id
        });
    });

});

module.exports = router;
