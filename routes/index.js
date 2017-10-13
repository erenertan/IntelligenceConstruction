var express = require('express');
var router = express.Router();

var model = require('../dao/model.js')



var structeredData;

model.queryCollection().then(function (items) {
    structeredData = items   //Enable this to take data from azure db
    structeredData = [{ agirlik: -0.0373, lat: 311.0831, lon: 28.98233 },
        { agirlik: -0.04851, lat: 82.0831, lon: 28.98233 },
        { agirlik: -0.05574, lat: 45.0831, lon: 28.98233 },
        { agirlik: -0.05674, lat: 0.0831, lon: 28.98233 },
        { agirlik: -0.05234, lat: 45.0831, lon: 28.98233 },
        { agirlik: -0.05702, lat: 412.0831, lon: 28.98233 },
        { agirlik: -0.05674, lat: 44.0831, lon: 28.98233 }]
    // console.log(structeredData)
}, setInterval(model.queryCollection, 6000)).catch(function(e){
})



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'My Dashboard', structeredData: structeredData});
});


router.get('/tables.html', function(req, res, next) {
    res.render('tables', { structeredData: structeredData});
});


router.get('/charts.html', function(req, res, next) {
    res.render('charts');
});

router.get('/data.html', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send(structeredData);
})




module.exports = router;
