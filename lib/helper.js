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
				url: url||'',
				label: req.body.i11[index]||''
			});
		});
		if(images.length === 0) {
			images.push({url:'',label:''});
		}
		req.model.i10 = images;

		if(typeof next === 'function') {
			next();
		}
	}
};