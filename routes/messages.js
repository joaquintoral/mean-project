var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('../models/user');

var Message = require('../models/message');

router.get('/', function(req, res, next) {
    Message.find()
    // name of the field(user), 2nd is the data i want to have (firstname)
        .populate('user', 'firstName')
        .exec(function(err, messages) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});

// Make sure that you are authenticated to reach these routes
// Use express router's use
// For Each request, this method is reached
router.use('/', function(req, res, next) {
    // This uses the query parameters of the url
    jwt.verify(req.query.token, 'secret', function(err, decode) {
        if(err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            })
        }

        next();
    });
})

router.post('/', function (req, res, next) {
    // retrieve user from token
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function(err, user) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        var message = new Message({
            content: req.body.content,
            user: user
        });

        message.save(function(err, result){
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            user.messages.push(result.toObject());
            user.save();

            res.status(201).json({
                message: 'Saved message',
                obj: result
            });
        });
    });
});

// HTTP word, used to change existing data. Put to override existing data
router.patch('/:id', function(req, res, next) {
    // retrieve user from token
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, function(err, message) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if(!message) {
            return res.status(500).json({
                title: 'No message found!',
                error: {
                    message: 'Message not found'
                }
            });
        }
        if(message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not authenticated',
                error: {message: 'Users do not match'}
            })
        }

        message.content = req.body.content;

        message.save(function(err, result) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            res.status(200).json({
                message: 'Updated message',
                obj: result
            });
        });
    })
});

router.delete('/:id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, function(err, message) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        if(!message) {
            return res.status(500).json({
                title: 'No message found!',
                error: {
                    message: 'Message not found'
                }
            });
        }

        if(message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not authenticated',
                error: {message: 'Users do not match'}
            })
        }

        message.remove(function(err, result) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            res.status(200).json({
                message: 'Deleted message',
                obj: result
            });
        });
    })
});

module.exports = router;
