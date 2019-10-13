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
      res.json({ended: true, url: req.url.replace('kuestion', 'unsure')});
    } else {
      res.json(doc);
    }
  });
});

router.get("/admin", function(req, res, next) {
  if(req.query.jelszo != 'bumburnyak') {
    return res.sendStatus(403);
  };
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
      return a[1][0].timestamp - b[1][0].timestamp;
    })
    res.render("admin", { allAnswers: answerArray, kuestionCount: kuestionCount });
   }).sort('timestamp');
  });
});

router.get('/admin/unsure', function(req, res, next) {
  if(req.query.jelszo != 'bumburnyak') {
    return res.sendStatus(403);
  };
  Unsure.find(function(err, doc) {
    res.render('unsureadmin', { unsures: doc });
  });
});

router.get('/admin/timings', function(req, res, next) {
  if(req.query.jelszo != 'bumburnyak') {
    return res.sendStatus(403);
  };
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
    })
    res.render("timingadmin", { allAnswers: answerArray, kuestionCount: kuestionCount });
   }).sort('timestamp');
  });
});

router.get("/unsure", function(req, res, next) {
  Kuestion.find({type: 'image'}, function(err, doc) {
    res.render('unsure', { allKuestions: doc });
  }).sort('id');
});

router.post('/unsure', async function(req, res, next) {
  let kuestionCount = await Kuestion.count({});
  let unsureArray = [];
  for (var i = 0; i < kuestionCount; i++) {
    unsureArray.push(req.body[i] == "on");
  }
  await (new Unsure({id: req.body.id, unsures: unsureArray})).save();
  res.redirect('/thanks');
});

router.get('/thanks', function(req, res, next) {
  res.render('welldone');
});

router.get('/evfolyam', function(req, res, next) {
  res.render('evfolyam');
});

router.post('/evfolyam', async function(req, res, next) {
  console.log('ujlink');
  console.log(req.body);
  let oldAnswer = await Answer.findOne({sender: +req.body.id, kuestion: 55});
  if(oldAnswer) {
    oldAnswer.answer = req.body.choice;
    oldAnswer.save();
  }
  res.render('singlewelldone');
});

module.exports = router;
