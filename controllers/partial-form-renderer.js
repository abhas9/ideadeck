'use strict';

module.exports = function(req, res, next) {
	var contentType = 'text/html',
		content = '';
	console.log(req.body);
	if (req.body.hasOwnProperty('add_buzzwords')) {
		res.render('buzzwords', {'i5':'true'});
	} 
	else if (req.body.hasOwnProperty('add_subscribe')) {
		res.render('subscribe', {i9: 'true'});
	} 
	else if (req.body.hasOwnProperty('add_call_to_action')) {
		if (req.body.i6 && Array.isArray(req.body.i6) && req.body.i6.length > 2) {
			res.json({
				error: {
					i6: 'You can have max 2 call to action buttons'
				}
			});
		} 
		else if (typeof req.body.i6 === 'undefined' || req.body.i6.length === 0) {
			res.json(Object.assign({
				error: {
					i6: 'Select atleast one call to action button'
				}
			}));
		} 
		else {
			res.render('callForAction', Object.assign({}, req.body, {
				i7: (Array.isArray(req.body.i6)) ? req.body.i6.join(',') : req.body.i6
			}));
		}
	} else if (req.body.hasOwnProperty('add_image')) {
		if(isNaN(req.body.i10_l)) {
			return res.json({
				error: {
					imgs: 'Cannot add image'
				}
			});
		}
		res.render('photos', {index: req.body.i10_l, img: {src:'', title:''}});
	} else {
		res.end(); // Shouldn't happen.
	}
};