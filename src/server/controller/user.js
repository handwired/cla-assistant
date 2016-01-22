var passport = require('passport');
var express = require('express');

//////////////////////////////////////////////////////////////////////////////////////////////
// User controller
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();
var scope;

function checkReturnTo(req, res, next) {
    scope = req.query.admin === 'true' ? config.server.github.admin_scope : config.server.github.public_scope;
    var returnTo = req.query.admin === 'true' ? '/' : req.session.next;
    if (returnTo) {
        if (!req.session) {
            req.session = {};
        }
        req.session.returnTo = returnTo;
    }
    passport.authenticate('github', {scope: scope})(req, res, next);
}

router.get('/auth/github', checkReturnTo);

router.get('/auth/github/callback', passport.authenticate('github', { successReturnToOrRedirect: '/' }));

router.post('/profile',
    function(req, res, next) {
        models.User.update({
            uuid: req.body.id 
        }, {
            name: req.body.fullname,
            email: req.body.email,
            address: req.body.address
        }, {
            upsert: false
        }, function(err, result) {
            if (result) {
                res.status(200).send(true);
            }
            else {
                res.status(500).send(false);
            }
        });
    }
);

router.get('/logout',
    function(req, res, next) {
        req.logout();
        if (!req.query.noredirect) {
            res.redirect('/');
        } else {
            next();
        }
    }
);

module.exports = router;
