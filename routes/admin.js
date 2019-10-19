var adminPass = require('../middlewares/adminPass');
var express = require('express');
var router = express.Router();

router.get("/", adminPass, function(req, res, next) {
  Kuestion.count(function(err, kuestionCount) {
   Answer.find({}, function (err, doc) {
    let allAnswers = {};
    doc.forEach(function (element) {
      if(!allAnswers[element.sender]) {
        allAnswers[element.sender] = {};
      }
      allAnswers[element.sender][element.kuestion] = element;
    });
    let answerArray = [];
    for(var answer in allAnswers) {
      answerArray.push([answer, allAnswers[answer]]);
    }
    answerArray.sort(function(a, b) {
      if(a[1][0] && b[1][0]) {
        return a[1][0].timestamp - b[1][0].timestamp;
      } else {
        return false;
      }
    });
    res.render("admin", { allAnswers: answerArray, kuestionCount: kuestionCount });
   }).sort('timestamp');
  });
});

router.get('/unsure', adminPass, function(req, res, next) {
  Unsure.find(function(err, doc) {
    res.render('unsureadmin', { unsures: doc });
  });
});

router.get('/timings', adminPass, function(req, res, next) {
  Kuestion.count(function(err, kuestionCount) {
   Answer.find({}, function (err, doc) {
    let allAnswers = {};
    doc.forEach(function (element) {
      if(!allAnswers[element.sender]) {
        allAnswers[element.sender] = {};
      }
      allAnswers[element.sender][element.kuestion] = element;
    });
    let answerArray = [];
    for(var answer in allAnswers) {
      answerArray.push([answer, allAnswers[answer]]);
    }
    answerArray.sort(function(a, b) {
      if(a[1][0] && b[1][0]) {
        return a[1][0].timestamp - b[1][0].timestamp;
      } else {
        return false;
      }
    });
    res.render("timingadmin", { allAnswers: answerArray, kuestionCount: kuestionCount });
   }).sort('timestamp');
  });
});

router.get('/stats', adminPass, async function(req, res, next) {
  let statNames = {
    answerCount: "Elkezdték kitölteni",
    finishedCount: "Befejezték"
  }
  let stats = {};
  stats.answerCount = await Answer.distinct('sender');
  stats.answerCount = stats.answerCount.length;
  stats.finishedCount = await Answer.find({ kuestion: 54 });
  stats.finishedCount = stats.finishedCount.length;
  let firstAndLast = await Answer.find({$or: [{kuestion: 1},{kuestion: 2}]});
  res.render('statsadmin', { stats: stats, statNames: statNames });
});

module.exports = router;
