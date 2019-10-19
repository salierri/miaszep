module.exports = function(req, res, next) {
  if(req.query.jelszo != 'bumburnyak') {
    res.sendStatus(403);
  } else {
    next();
  }
}
