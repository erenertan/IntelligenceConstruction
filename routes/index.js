var express = require('express');
var router = express.Router();

var model = require('../dao/model.js')

//Gets items array from model file.
var query = model.queryCollection;


/* GET home page. */
router.get('/', function(req, res, next) {
    //Return index page with items array.
    query().then(function(items){
        res.render('index', { title: 'My Dashboard', structeredData: items});
        console.log(items)
    });
});


router.get('/tables.html', function(req, res, next) {
    //Returns tables page with items.
    query().then(function(items){
        res.render('tables', { structeredData: items});
    });

});


router.get('/charts.html', function(req, res, next) {
    res.render('charts');
});

//Data page to make dynamic webpage in index page. Getting data regularly with data page.
router.get('/data.html', function (req, res, next) {
    model.queryCollection().then(function(items){
        //Add json header to specify its type.
        res.setHeader('Content-Type', 'application/json');
        res.send(items);
    });
})


module.exports = router;
