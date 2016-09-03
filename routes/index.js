var express = require('express');
var router = express.Router();

/* Donation */
router.get('/donate/:id', function(req, res, next) {
  /* Decide redirect based on stored configuration */
  res.redirect(
    'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=foo@gmail.com&item_name=Support+IdeaDeck'
  );
});

/* Buy now */
router.get('/buy/:id', function(req, res, next) {
  /* Decide redirect based on stored configuration */
  res.redirect(
    'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=foo@gmail.com&item_name=Support+IdeaDeck&amount=5&currency_code=USD'
  );
});

/* POST subscribe form */
router.post('/subscribe/:id', function(req, res, next) {
  /* Decide redirect based on stored configuration */
  var id = req.params.id;
  res.redirect(307,
    'http://formspree.io/' + id
  );
});

module.exports = router;
