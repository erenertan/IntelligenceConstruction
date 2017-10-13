"use strict";
var model = {};
var express = require('express');

var documentClient = require("documentdb").DocumentClient;
var config = require("./config");
var url = require('url');

var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });

var HttpStatusCodes = { NOTFOUND: 404 };
var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;

console.log("hi...")

/**
 * Get the database by ID, or create if it doesn't exist.
 * @param {string} database - The database to get or create
 */
function getDatabase() {
    console.log(`Getting database:\n${config.database.id}\n`);

    return new Promise((resolve, reject) => {
        client.readDatabase(databaseUrl, (err, result) => {
        if (err) {
            if (err.code == HttpStatusCodes.NOTFOUND) {
                client.createDatabase(config.database, (err, created) => {
                    if (err) reject(err)
                    else resolve(created);
            });
            } else {
                reject(err);
            }
        } else {
            resolve(result);
}
});
});
}


/**
 * Get the collection by ID, or create if it doesn't exist.
 */
function getCollection() {
    console.log(`Getting collection:\n${config.collection.id}\n`);

    return new Promise((resolve, reject) => {
        client.readCollection(collectionUrl, (err, result) => {
        if (err) {
            if (err.code == HttpStatusCodes.NOTFOUND) {
                client.createCollection(databaseUrl, config.collection, { offerThroughput: 400 }, (err, created) => {
                    if (err) reject(err)
                    else resolve(created);
            });
            } else {
                reject(err);
            }
        } else {
            resolve(result);
}
});
});
}

/**
 * Query the collection using SQL
 */
function queryCollection() {
    console.log(`Querying collection through index:\n${config.collection.id}`);

    return new Promise((resolve, reject) => {
        client.queryDocuments(
        collectionUrl,
        'SELECT * FROM root'
    ).toArray((err, results) => {
        if (err) reject(err)
        else {

            var items = [];

            var itemObjectModel = function (agirlik, lat, lon) {
                this.agirlik = agirlik;
                this.lat = lat;
                this.lon = lon;

            }

        for (var  i = 0; i < results.length; i+=3){
                var moduleOfIndex = i%3;

                // console.log(results[i].params.Agirlik)
            if  (moduleOfIndex == 0) {
                items.push(new itemObjectModel(results[i].params.Agirlik, results[i+1].params.GPS_LAT, results[i+2].params.GPS_LON))
            }
        }

        // console.log(items)
    resolve(items);
}
    resolve(results);
});
});
};



getDatabase()
    .then(() => getCollection())
// .then(() => queryCollection())
.catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });

model.queryCollection = queryCollection;
model.getCollection = getCollection;

module.exports = model;


