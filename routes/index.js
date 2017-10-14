var express = require('express');
var router = express.Router();

var model = require('../dao/model.js')


var query = model.queryCollection;


/* GET home page. */
router.get('/', function(req, res, next) {
    query().then(function(items){
        res.render('index', { title: 'My Dashboard', structeredData: items});
        console.log(items)
    });
});


router.get('/tables.html', function(req, res, next) {
    query().then(function(items){
        res.render('tables', { structeredData: items});
    });

});


router.get('/charts.html', function(req, res, next) {
    res.render('charts');
});

router.get('/data.html', function (req, res, next) {
    model.queryCollection().then(function(items){
        res.setHeader('Content-Type', 'application/json');
        res.send(items);
    });
})




module.exports = router;
