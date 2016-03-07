'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Store = mongoose.model("Store");
var Question = mongoose.model('Question');
var Product = mongoose.model('Product');

// get all stores
router.get('/', function (req, res, next) {
    Store.find({})
    .populate('products orders')
    .then(function(info){
        res.json(info);
    })
    .then(null,next);

});

// get all active stores
router.get('/active', function (req, res, next) {
    Store.find({active:true})
    .populate('products orders')
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



router.param("url", function(req, res, next){
	Store.findOne({url:req.params.url})
	.populate("products seller questions orders")
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

//add a question to a store
router.post('/:url/question', function (req, res, next) {
	req.store.addQuestion(req.body)
	.then(function(store){
		res.send(store);
	})
	.catch(function(err){
		err.status = 404;
		next(err);
	})
});

//delete a question from a store
router.delete('/:url/question/:questId', function (req, res, next) {
	Question.findById(req.params.questId)
	.then(function(question){
		return req.store.removeQuestion(question);
	})
	.then(function(store){
		res.send(store);
	})
	.catch(function(err){
		err.status = 404;
		next(err);
	})
});

//add a product to a store
router.post('/:url/product', function (req, res, next) {
	req.store.addProduct(req.body)
	.then(function(store){
		res.send(store);
	})
	.catch(function(err){
		err.status = 404;
		next(err);
	})
});

//delete a product from a store
router.delete('/:url/product/:prodId', function (req, res, next) {
	Product.findById(req.params.prodId)
	.then(function(product){
		return req.store.removeProduct(product);
	})
	.then(function(store){
		res.send(store);
	})
	.catch(function(err){
		err.status = 404;
		next(err);
	})
});

//get specfic store
router.get("/:url",function(req, res, next){
	res.json(req.store)
	.catch(function(err){
		err.status = 404;
		next(err);
	})
});

//save store
router.put("/:url", function(req, res, next){
	Store.findByIdAndUpdate(req.body._id,req.body, {new:true})
	.then(function(data){
<<<<<<< HEAD
		console.log(data);
=======
>>>>>>> 02ec70101612ffbfaca8a243ea0f4bdeba93cdda
		res.send(data);
	}).catch(next);
});

//save store alternate
router.put("/", function(req, res, next){
	Store.findByIdAndUpdate(req.body._id,{active:req.body.active},{new:true})
	.then(function (newStore) {
		res.json(newStore);
	});
});

//not neccessary since the get by id returns all of this
router.get("/:url/products", function(req, res, next){
	res.json(req.store.products)
	.catch(function(err){
		err.status = 404;
		next(err);
	})
});

router.get("/:url/questions", function(req, res, next){
	res.json(req.store.questions)
	.catch(function(err){
		err.status = 404;
		next(err);
	})
});

router.get("/:url/orders", function(req, res, next){
	res.json(req.store.orders)
	.catch(function(err){
		err.status = 404;
		next(err);
	})
});

router.get("/:url/seller", function(req, res, next){
	res.json(req.store.seller)
	.catch(function(err){
		err.status = 404;
		next(err);
	})
});



module.exports = router;
