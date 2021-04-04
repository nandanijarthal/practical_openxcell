const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user");
db.topic = require("./topic");
db.post = require("./post");
db.comment = require("./comment");

module.exports = db;