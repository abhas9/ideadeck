var express = require('express');
var router = express.Router();
var ajaxRender = require('../controllers/partial-form-renderer');
var helper = require('../lib/helper');

const pug = require('pug');
const compiledFunction = pug.compileFile(__dirname + '/template.jade');

/* Try now */
router.get('/try', function(req, res, next) {
  helper.setInitialModel(req, res);
  res.render('try', req.model);
});

/* Gallery */
router.get('/gallery', function(req, res, next) {
  res.render('gallery');
});

router.post('/try', function(req, res, next) {
  helper.setInitialModel(req, res);
  if (req.headers['content-type'] === 'application/json') {
    return ajaxRender(req, res, next);
  }

  console.log(req.body);
  if (req.body.hasOwnProperty('generate')) {
    var error = {};
    if (req.body.i1 === '') {
      error = Object.assign({}, error, {
        i1: 'required'
      });
    }
    if (req.body.i2 === '') {
      error = Object.assign({}, error, {
        i2: 'required'
      });
    }
    if (req.body.i3 === '') {
      error = Object.assign({}, error, {
        i3: 'required'
      });
    }

    if (req.body.i4 === '') {
      error = Object.assign({}, error, {
        i4: 'required'
      });
    }

    if (req.body.i5 && req.body.i5 === 'true') {
      if (req.body.i5a && req.body.i5a[0] === '') {
        error = Object.assign({}, error, {
          i5a_0: 'required'
        });
      }
      if (req.body.i5a && req.body.i5b[0] === '') {
        error = Object.assign({}, error, {
          i5b_0: 'required'
        });
      }
      if (req.body.i5a && req.body.i5a[1] === '') {
        error = Object.assign({}, error, {
          i5a_1: 'required'
        });
      }
      if (req.body.i5b && req.body.i5b[1] === '') {
        error = Object.assign({}, error, {
          i5b_1: 'required'
        });
      }
      if (req.body.i5a && req.body.i5a[2] === '') {
        error = Object.assign({}, error, {
          i5a_2: 'required'
        });
      }
      if (req.body.i5b && req.body.i5b[2] === '') {
        error = Object.assign({}, error, {
          i5b_2: 'required'
        });
      }
    }

    if (!req.body.hasOwnProperty('i6') || req.body.i6.length === 0) {
      error = Object.assign({}, error, {
        i6: 'Select atleast one call to action button'
      });
    }

    if (req.body.i6 && Array.isArray(req.body.i6) && req.body.i6.length > 2) {
      error = Object.assign({}, error, {
        i6: 'You can have max 2 call to action buttons'
      });
    }

    if (req.body.i7 && req.body.i7.split(',').indexOf('website') >= 0 &&
      req.body
      .i7a === '') {
      error = Object.assign({}, error, {
        i7a: 'required'
      });
    }

    if (req.body.i7 && req.body.i7.split(',').indexOf('website') >= 0 &&
      req.body
      .i7b === '') {
      error = Object.assign({}, error, {
        i7b: 'required'
      });
    }

    if (req.body.i7 && req.body.i7.split(',').indexOf('buy') >= 0 && req.body
      .i7c === '') {
      error = Object.assign({}, error, {
        i7c: 'required'
      });
    }

    if (req.body.i7 && req.body.i7.split(',').indexOf('buy') >= 0 && req.body
      .i7d === '') {
      error = Object.assign({}, error, {
        i7d: 'required'
      });
    }

    if (req.body.i7 && req.body.i7.split(',').indexOf('donate') >= 0 && req
      .body
      .i7e === '') {
      error = Object.assign({}, error, {
        i7e: 'required'
      });
    }

    if (req.body.i9 && req.body.i9 === 'true' && req.body.i9a === '') {
      error = Object.assign({}, error, {
        i9a: 'required'
      });
    }

    if (Array.isArray(req.body.i10)) {
      req.body.i10.forEach(function(val, index) {
        if (val === '') {
          req.model.i10[index].urlError = error['i10_' + index] =
            'required';
        }
      });
    }
    if (Array.isArray(req.body.i11)) {
      req.body.i11.forEach(function(val, index) {
        if (val === '') {
          req.model.i10[index].titleError = error['i11_' + index] =
            'required';
        }
      });
    }

    //*********************//
    if (Object.keys(error).length !== 0) {
      console.log('***** form had errors: ', error);
      res.render('try', Object.assign({}, {
        error: error
      }, req.body, req.model));
    } else { // generate
      helper.mixBodyInModel(req, res, function(err) {
        if (err) {
          console.log('errrr', err);
          res.render('try', req.body); // @TODO: Indicate error.
        } else {
          console.log(req.model);
          res.render('success', req.model);
        }
      });
    }
    //*********************//
  } else if (req.body.hasOwnProperty('add_buzzwords')) {
    res.render('try', Object.assign({}, req.body, {
      i5: 'true'
    }));
  } else if (req.body.hasOwnProperty('add_subscribe')) {
    res.render('try', Object.assign({}, req.body, {
      i9: 'true'
    }));
  } else if (req.body.hasOwnProperty('add_call_to_action')) {
    if (req.body.i6 && Array.isArray(req.body.i6) && req.body.i6.length > 2) {
      res.render('try', Object.assign({}, {
          error: {
            i6: 'You can have max 2 call to action buttons'
          }
        },
        req.body));
    } else if (typeof req.body.i6 === 'undefined' || req.body.i6.length ===
      0) {
      res.render('try', Object.assign({}, {
          error: {
            i6: 'Select atleast one call to action button'
          }
        },
        req.body));
    } else {
      res.render('try', Object.assign({}, req.body, {
        i7: (Array.isArray(req.body.i6)) ? req.body.i6.join(',') : req
          .body.i6
      }));
    }
  } else if (req.body.hasOwnProperty('add_image')) {
    req.model.i10.push({
      src: '',
      title: ''
    });
    res.render('try', req.model);
  }
});

router.get('/landing/:path/edit', function(req, res) {
  res.end('this will let you edit later');
});

/* Donation */
router.get('/donate/', function(req, res, next) {
  /* Decide redirect based on stored configuration */
  res.redirect(
    'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=abhastandon007@gmail.com&item_name=Support+IdeaDeck'
  );
});

/* POST subscribe form */
router.post('/subscribe/:id?', function(req, res, next) {
  /* Decide redirect based on stored configuration */
  var id = (req.params.id) ? req.params.id : 'abhastandon007@gmail.com';
  res.redirect(307,
    'http://formspree.io/' + id
  );
});

router.get('/test', function(req, res, next) {
  /* Decide redirect based on stored configuration */
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  // make this as single call later
  var a = compiledFunction({
    absolutePath: "https://github.com/IdeaDeck/#",
    about: "Lightweight web-app to generate idea deck with call to action buttons",
    description: 'Helping innovators, entrepreneurs, and non-profits clearly and concisely explain their idea and product.',
    ideas: ['Over 100 million businesses are launched annually.',
      'Innovators need ways to convey their idea clearly to their audience.',
      'IdeaDeck: Easily create, host and share your ideas with call to action buttons.',
      "Works on all devices, ultra-light weight (~ 4 KB) and doesn't require any javascript."
    ], // exactly 4 - no more, no less
    highlights: [{
      "title": "Highlight 1",
      "description": " Some stuff to boost here"
    }, {
      "title": "Highlight 2",
      "description": " Some stuff to boost here"
    }, {
      "title": "Highlight 3",
      "description": " Some stuff to boost here"
    }],
    website: { // can be undefined
      'title': 'try',
      'url': 'http://foo.com'
    },
    donate: { // can be undefined
      'email': 'abhastandon007@gmail.com'
    },
    subscribe: {
      "email": 'email@gmail.com'
    },
    images: [{
      "title": "mario",
      "src": "mario.png"
    }],
    footer: 'Test test',
    witty_note: "Try IdeaDeck For Free, Or Buy Us A Coffee :)",
    sharing: true,
    title: "IdeaDeck"
  });
  console.log(a);
  res.write(a);
  res.end();
});

module.exports = router;
