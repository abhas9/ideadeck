'use strict';

var fs = require('fs'),
	path = require('path');

function randomString(len){
	var str="", i=0, min=0, max=62;
	for(;i++<len;){
		var r = Math.random()*(max-min)+min <<0;
		str += String.fromCharCode(r+=r>9?r<36?55:61:48);
	}
	return str;
}

function assignPath(req, res) {
	req.model.location = randomString(10) + (req.model.title && ('-' + req.model.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()));
	req.model.path = '/landing/' + req.model.location +'/';
	req.model.absolutePath = req.protocol + '://' + req.get('host') + req.model.path;
}

module.exports =  {
	setInitialModel: function(req, res, next) {
		req.model = Object.assign({}, req.model);

		// Mixin image url and label for rendering.
		req.body.i10 = (Array.isArray(req.body.i10) && req.body.i10) || [];
		req.body.i11 = (Array.isArray(req.body.i11) && req.body.i11) || [];
		var images = [];
		req.body.i10.forEach(function(url, index){
			images.push({
				src: url||'',
				title: req.body.i11[index]||''
			});
		});
		if(images.length === 0) {
			images.push({src:'',title:''});
		}
		req.model.i10 = images;

		if(typeof next === 'function') {
			next();
		}
	},

	mixBodyInModel: function(req, res, next) {
		req.model.title = req.body.i1;
		req.model.about = req.body.i2;
		req.model.description = req.body.i3;
		req.model.ideas = req.body.i4.split(/\s*[\n]\s*/);
		if(req.body.i5 === 'true' && Array.isArray(req.body.i5a) && Array.isArray(req.body.i5b)) {
			req.model.highlights = [];
			req.body.i5a.forEach(function(title, index) {
				req.model.highlights.push({
					title: title,
					description: req.body.i5b[index]
				});
			});
		}

		[
		 ['a', 'website.title'], ['b', 'website.url'], 
		 ['c', 'buy.email'], ['d', 'buy.cost'], 
		 ['e', 'donate.email']
		].forEach(function(val, index) {
			if(req.body.hasOwnProperty('i7' + val[0])) {
				var path = val[1].split('.'),
					leaf = path.pop(),

					preFinal = path.reduce(function(o, i) {
						o[i] = o[i] || {};
						return o[i];
					}, req.model);
				preFinal[leaf] = req.body['i7' + val[0]];
			} 
		});
		if(req.body.hasOwnProperty('i8')) {
			req.model.sharing = true;
		}
		if(req.body.hasOwnProperty('i9a')) {
			req.model.subscribe = {email: req.body.i9a};
		}
		req.model.images = req.model.i10
		// delete req.model.i10; //enable later.

		assignPath(req, res);
		console.log(JSON.stringify(req.model, null, 2));

		if(typeof next === 'function') {
			return this.saveModelOnDisk(req, res, next);
		}
		saveModelOnDisk(req, res);
	},
	saveModelOnDisk: function (req, res, next) {
		var persistDir = process.env.PERSIST_DIR || 'landingPages',
			saveDir = '';
		persistDir = path.join(__dirname, '..', persistDir);
		if(!fs.existsSync(persistDir)) {
			fs.mkdirSync(persistDir);
		}
		saveDir = path.join(persistDir, req.model.location);
		while(fs.existsSync(saveDir)) { // Deadlock??? 
			console.log('assigning again!!!');
			assignPath(req, res);
			saveDir = path.join(persistDir, req.model.location);
		}
		fs.mkdirSync(saveDir);
		console.log('saving at...', saveDir);
		if(typeof next === 'function') {
			fs.writeFile(path.join(saveDir, 'index.json'), JSON.stringify(req.model, null, 4), function(err) {
				next(err); //
			});
		} else {
			fs.writeFileSync(path.join(saveDir, 'index.json'), JSON.stringify(req.model, null, 4));
		}
	}
};
