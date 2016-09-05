var express = require('express');
var router = express.Router();
const pug = require('pug');
const compiledFunction = pug.compileFile(__dirname + '/template.pug');


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

router.get('/test', function(req, res, next) {
  /* Decide redirect based on stored configuration */
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  var a = compiledFunction({
    productName: 'IdeaDeck',
    productTitle: 'Lightweight web-app to generate idea deck with call to action buttons',
    productAim: 'Helping innovators, entrepreneurs, and non-profits clearly and concisely explain their idea and product.',
    productSlogan: 'There\'s beauty in Simplicity',
    facebook: 'https://facebook.com/', //optional
    twitter: 'https://twitter.com/abhas9', //optional
    github: 'https://github.com/abhas9', //optional
    aboutProduct: ['foo', 'foo'],
    buzzwords: ['Foo1', 'Foo2', 'Foo3', 'Foo4'], // exactly 4 - no more, no less
    actionsCount: 4,
    subscribe: {
      email: 'email@gmail.com'
    },
    link: {
      href: 'foo',
      title: 'foofoo',
      color: 'green'
    }, // color can be green or blue only
    donate: {
      id: 'id',
      color: 'blue'
    },
    buy: {
      id: 'id',
      title: 'Buy now @ 5$',
      color: 'blue'
    },
    forceImage: false,
    image: {
      title: 'There\'s beauty in Simplicity',
      src: 'light-bulb.png',
    },
    footer: 'Test test'
  });
  console.log(a);
  res.write(a);
  res.end();
});

module.exports = router;
