var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      title: 'Welcome Page',
      style: 'index.css',
      isLoggedin: false
  });
});

module.exports = router;
