var express = require('express');
var router = express.Router();

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
