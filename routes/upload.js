var express = require('express');
var router = express.Router();

var types = ["image", "choice", "text", "6choice"];

router.get("/", function(req, res, next) {
  if(req.query.jelszo != 'bumburnyak') {
    return res.sendStatus(403);
  };
  Kuestion.find({}).sort("id").exec(function(err, doc) {
    res.render("upload", { kuestions: doc, types: types });
  });
});

router.get("/delete/:_id", function(req, res, next) {
  Kuestion.deleteOne({_id: req.params._id}, function(err, doc) {
    res.redirect("/upload");
  });
});

router.get("/update", function(req, res, next) {
  console.log(req.query);
  if(req.query.type == "6choice") {
    req.query.choices = [];
    for(var i = 0; i < +req.query.choiceCount; i++) {
      req.query.choices.push(req.query['choice' + i] || '');
    }
  }
  console.log(req.query.choices);
  Kuestion.updateOne({_id: req.query._id}, req.query, function(err, doc) {
    res.redirect("/upload");
  });
});

router.get("/new", function(req, res, next) {
  var newku = new Kuestion({type: "image"});
  newku.save(function(err, doc) {
    console.log(err);
    res.redirect("/upload");
  });
});

router.post("/upload", function(req, res, next) {
  console.dir(req.files);
  res.redirect("/upload");
});

module.exports = router;
