var express = require('express');
var router = express.Router();

/* GET users listing. */
//DASHBOARD
router.get('/', function(req, res, next) {
  return res.render('index')
});

//THONG TIN CHI TIET
router.get('/', function(req, res, next) {
  return res.render('index')
});

//Nap & Rut TIEN
router.get('/', function(req, res, next) {
  return res.render('index')
});

//Mua the dt
router.get('/', function(req, res, next) {
  return res.render('index')
});

//Chuyen tien`
router.get('/', function(req, res, next) {
  return res.render('index')
});
module.exports = router;
