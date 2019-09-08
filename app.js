var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/upload');
var mongoose = require('mongoose');
var multer = require("multer");

mongoose.connect('mongodb://localhost/miaszep', {useNewUrlParser: true});

var answerSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  sender: Number,
  answer: String,
  group: String,
  kuestion: Number,
  timestamp: Date,
});
Answer = mongoose.model('Answer', answerSchema);

var kuestionSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.ObjectId, auto: true },
  id: Number,
  type: String,
  text: String,
  choice1: String,
  choice2: String,
  images: [String],
});
Kuestion = mongoose.model('Kuestion', kuestionSchema);

var unsureSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.ObjectId, auto: true },
  id: Number,
  unsures: [Boolean],
});
Unsure = mongoose.model('Unsure', unsureSchema);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
var storage = multer.diskStorage({
	destination: "./public/images",
	filename: function(reku, file, cb) {
	cb(null, file.originalname);
}	
})
app.use(multer({storage: storage}).single("photo"));

app.use('/', indexRouter);
app.use('/upload', usersRouter);

module.exports = app;
