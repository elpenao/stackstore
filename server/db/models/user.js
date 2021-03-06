'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');
var CartSchema = mongoose.model('Cart').schema;
var Store = mongoose.model('Store');
var Cart = mongoose.model('Cart');

var UserSchema = new mongoose.Schema({
    email: {
        type: String
    },
    profile: {
        firstName: String,
        lastName: String,
        address: {
            street: String,
            apt: String,
            city: String,
            state: String,
            zip: Number
        }
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    twitter: {
        id: String,
        username: String,
        token: String,
        tokenSecret: String
    },
    facebook: {
        id: String
    },
    google: {
        id: String
    },
    isAdmin: {type: Boolean, default: false},
    isSeller: {type: Boolean, default: false},
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    cart: CartSchema,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});


UserSchema.methods.addCart = function() {
    var theUser = this;
    return Cart.create({isGuest:false})
        .then(function(createdCart) {
            theUser.cart = createdCart;
            return theUser.save();
        });
};

UserSchema.methods.addStore = function() {
    var theUser = this;
    return Store.create({name:'Test Store '+Math.floor(Math.random() * 6000) + 1 })
        .then(function(createdStore) {
            theUser.store = createdStore._id;
            return theUser.save();
        });
};


UserSchema.methods.addStore = function() {
    console.log('addddding a storeee')
    var theUser = this;
    return Store.create({name:'Test Store '+Math.floor(Math.random() * 6000) + 1 })
        .then(function(createdStore) {
            theUser.store = createdStore._id;
            return theUser.save();
        });
};




// method to remove sensitive information from user objects before sending them out
UserSchema.methods.sanitize = function() {
    return _.omit(this.toJSON(), ['password', 'salt']);
};

//virtual to get Full Name

UserSchema.virtual('profile.fullName').get(function() {
    return this.profile.firstName + " " + this.profile.lastName;
});

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function() {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function(plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

UserSchema.pre('save', function(next) {
    console.log("pre user save")
    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

UserSchema.statics.generateSalt = generateSalt;
UserSchema.statics.encryptPassword = encryptPassword;

UserSchema.method('correctPassword', function(candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', UserSchema);
