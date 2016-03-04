'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Store = mongoose.model("Store");

// get all stores
router.get('/', function (req, res, next) {
    Store.find({})
    .then(function(info){
        res.json(info);
    })
    .then(null,next);

});

// add a store
// req needs the _id of seller (user), [products], [questions]
// needs to ensure the id of seller is currently logged user OR admin
router.post('/', function (req, res, next) {
	if(!(req.body.sellerId===req.user._id || req.user.isAdmin))
		next({status:401})
	
	Store.create(req.body)
    .then(function(info){
        res.json(info);
    }).then(null,next); 
});

router.param("url", function(req, res, next, id){
	Store.findOne({url:req.params.url})
	.populate("products seller questions")
	.then(function(store){
		if(!store) throw Error("no such store");
		req.store = store;
		next();
	})
	.catch(function(err){
		err.status = 404;
		next(err);
	})
});

//get specfic store
router.get("/:url",function(req, res, next){
	res.json(req.store);
});

//not neccessary since the get by id returns all of this
router.get("/:url/products", function(req, res, next){
	res.json(req.store.products);
});
router.get("/:url/questions", function(req, res, next){
	res.json(req.store.questions);
});



router.get("/:url/seller", function(req, res, next){
	res.json(req.store.seller);
});



module.exports = router;
