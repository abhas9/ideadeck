'use strict';

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

	mixBodyinModel: function(req, res, next) {
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
		console.log(JSON.stringify(req.model));

	}
};
