var express = require('express');
var router = express.Router();

var kuestions = [
  { type: "image", images: ["kacsa.png", "kacsa.png", "dog.jpg", "cat.jpg"]},
  { type: "image", images: ["haz.jpg", "auto.jpg"]},
  { type: "image", images: ["kacsa.png", "dog.jpg", "cat.jpg"]},
  { type: "image", images: ["ajto.png", "ablak.png"]},
  { type: "choice", text: "Mi a nemed?", choice1: "Igen", choice2: "Talán"},
  { type: "text", text: "Mit gondolsz a szép házakról?"},
]

router.post('/answer', function(req, res, next) {
  let newAnswer = new Answer({ sender: req.body.sender,
                               answer: req.body.answer,
                               kuestion: req.body.kuestion,
                               group: req.body.group,
                               timestamp: new Date()
                            });
  newAnswer.save();
  res.end();
});

router.post("/kuestion", function(req, res, next) {
  console.log(req.body.lastKvestion);
  Kuestion.findOne({id: +req.body.lastKvestion + 1}, function(err, doc) {
    if(doc == null) {
      res.json({ended: true});
    } else {
      res.json(doc);
    }
  });
});

router.get("/admin", function(req, res, next) {
  Kuestion.count(function(err, kuestionCount) {
   Answer.find({}, function (err, doc) {
    allAnswers = {};
    doc.forEach(function (element) {
      if(!allAnswers[element.sender]) {
        allAnswers[element.sender] = {};
      }
      allAnswers[element.sender][element.kuestion] = element;
    });
    res.render("admin", { allAnswers: allAnswers, kuestionCount: kuestionCount });
   })
  });
});
module.exports = router;
