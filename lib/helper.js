'use strict';

var fs = require('fs'),
  path = require('path'),
  pug = require('pug'),
  gulp = require('gulp'),
  gs = require('gulp-selectors'),
  minify = require('gulp-minifier'),
  isURL = require('validator').isURL,
  isEmail = require('validator').isEmail;

const compiledFunction = pug.compileFile(__dirname +
  '/../routes/template.jade');

function minifier(saveDir) {
  gulp.src([__dirname + '/../src/css/styles.css', __dirname +
      '/../src/css/carousel.css', saveDir + '/index.html'
    ])
    .pipe(gs.run({
      'css': ['css'],
      'html': ['html']
    }, {
      ids: '*', // ignore all IDs,
      classes: ['c_*']
    }))
    .pipe(minify({
      minify: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: true,
      minifyCSS: true,
      getKeptComment: function(content, filePath) {
        var m = content.match(/\/\*![\s\S]*?\*\//img);
        return m && m.join('\n') + '\n' || '';
      }
    }))
    .pipe(gulp.dest(saveDir));
}

function randomString(len) {
  var str = "",
    i = 0,
    min = 0,
    max = 62;
  for (; i++ < len;) {
    var r = Math.random() * (max - min) + min << 0;
    str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
  }
  return str;
}

function assignPath(req, res) {
  req.model.location = randomString(10) + (req.model.title && ('-' + req.model.title
    .replace(/[^a-z0-9]/gi, '_').toLowerCase()));
  req.model.path = '/landing/' + req.model.location + '/';
  req.model.absolutePath = req.protocol + '://' + req.get('host') + req.model.path;
}

module.exports = {
  validateEmail: function(email) {
    return isEmail(email);
  },
  validateURL: function(url) {
    const MAIL_PRTOCOL = 'mailto:';
    if (url.indexOf(MAIL_PRTOCOL) === 0) {
      return isEmail(url.substr(MAIL_PRTOCOL.length));
    }
    return isURL(url, {
      protocols: ['http', 'https']
    });
  },
  setInitialModel: function(req, res, next) {
    req.model = Object.assign({}, req.model);

    // Mixin image url and label for rendering.
    req.body.i10 = (Array.isArray(req.body.i10) && req.body.i10) || [];
    req.body.i11 = (Array.isArray(req.body.i11) && req.body.i11) || [];
    var images = [];
    req.body.i10.forEach(function(url, index) {
      images.push({
        src: url || '',
        title: req.body.i11[index] || ''
      });
    });
    if (images.length === 0) {
      images.push({
        src: '',
        title: ''
      });
    }
    req.model.i10 = images;

    if (typeof next === 'function') {
      next();
    }
  },

  mixBodyInModel: function(req, res, next) {
    req.model.title = req.body.i1;
    req.model.about = req.body.i2;
    req.model.description = req.body.i3;
    req.model.witty_note = req.body.i12;
    req.model.footer = req.body.i13;
    req.model.ideas = req.body.i4.split(/\s*[\n]\s*/);
    req.model.highlights = [];
    if (req.body.i5 === 'true' && Array.isArray(req.body.i5a) && Array.isArray(
        req.body.i5b)) {
      req.body.i5a.forEach(function(title, index) {
        req.model.highlights.push({
          title: title,
          description: req.body.i5b[index]
        });
      });
    }

    [
      ['a', 'website.title'],
      ['b', 'website.url'],
      ['c', 'buy.email'],
      ['d', 'buy.cost'],
      ['e', 'donate.email']
    ].forEach(function(val) {
      if (req.body.hasOwnProperty('i7' + val[0])) {
        var path = val[1].split('.'),
          leaf = path.pop(),

          preFinal = path.reduce(function(o, i) {
            o[i] = o[i] || {};
            return o[i];
          }, req.model);
        preFinal[leaf] = req.body['i7' + val[0]];
      }
    });

    if (req.body.hasOwnProperty('i8')) {
      req.model.sharing = true;
    }
    if (req.body.hasOwnProperty('i9a')) {
      req.model.subscribe = {
        email: req.body.i9a
      };
    }
    req.model.images = req.model.i10
    delete req.model.i10;

    assignPath(req, res);
    console.log(JSON.stringify(req.model, null,
      2));

    if (typeof next === 'function') {
      return this.saveModelOnDisk(req, res, next);
    }
    this.saveModelOnDisk(req, res);
  },
  saveModelOnDisk: function(req, res, next) {
    var persistDir = process.env.PERSIST_DIR || 'landingPages',
      saveDir = '';
    persistDir = path.join(__dirname, '..', persistDir);
    if (!fs.existsSync(persistDir)) {
      fs.mkdirSync(persistDir);
    }
    saveDir = path.join(persistDir, req.model.location);
    while (fs.existsSync(saveDir)) { // Deadlock???
      console.log('assigning again!!!');
      assignPath(req, res);
      saveDir = path.join(persistDir, req.model.location);
    }
    fs.mkdirSync(saveDir);
    console.log('saving at...', saveDir);
    if (typeof next === 'function') {
      fs.writeFile(path.join(saveDir, 'index.json'), JSON.stringify(
        req.model, null, 4), function(err) {
        if (err) {
          return next(err);
        }
        fs.writeFile(path.join(saveDir, 'index.html'),
          compiledFunction(req.model),
          function(err) {
            minifier(saveDir);
            return next(err, saveDir);
          });
      });
    } else {
      fs.writeFileSync(path.join(saveDir, 'index.json'), JSON.stringify(
        req.model, null, 4));
      fs.writeFileSync(path.join(saveDir, 'index.html'),
        compiledFunction(req.model));
      minifier(saveDir);
    }
  },

  createModel: function (req, res, next) {
    var persistDir = process.env.PERSIST_DIR || 'landingPages';
    persistDir = path.join(__dirname, '..', persistDir);
    var fromDir = path.join(persistDir, req.params.path),
      fromFile = path.join(fromDir, 'index.json');
    fs.readFile(fromFile, function(err, data) {
      if(err) {
        return next(err);
      }
      var model;
      try {
        model = JSON.parse(data);
      } catch(e) {
        return 'invalid json';
      }
      req.model = req.model || {};

      req.model.i1 = model.title;
      req.model.i2 = model.about;
      req.model.i3 = model.description;
      req.model.i12 = model.witty_note;
      req.model.i13 = model.footer;
      req.model.i4 = model.ideas.join('\n');

      if(model.highlights.length > 0) {
        req.model.i5 = "true";
        req.model.i5a = [];
        req.model.i5b = [];
        model.highlights.forEach(function(highlight) {
          req.model.i5a.push(highlight.title);
          req.model.i5b.push(highlight.description);
        });
      }
      req.model.i7 = '';
      if(model.website) {
        req.model.i7a = model.website.title;
        req.model.i7b = model.website.url;
        req.model.i7 += 'website,';
      }
      if(model.buy) {
        req.model.i7c = model.buy.email;
        req.model.i7d = model.buy.cost;
        req.model.i7 += 'buy,';
      }
      if(model.donate) {
        req.model.i7e = model.donate.email;
        req.model.i7 += 'donate,';
      }

      if(req.model.i7.length > 0) {
        req.model.i7 = req.model.i7.substring(0, req.model.i7.length - 1);
      }
      req.model.i6 = req.model.i7;

      if (model.subscribe && model.subscribe.email) {
        req.model.i9 = 'true';
        req.model.i9a = model.subscribe.email
      }

      req.model.i8 = !!model.sharing;
      req.model.i10 = model.images || [];
      next(null);
    });
  }
};
