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
            }
            else {
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
        //Getting all entries
        'SELECT * FROM root'
        ).toArray((err, results) => {
            if (err) reject(err)
                else {

                    //Array to push all values from db and use in view of model.
                    var items = [];

                    //Values from db are coming separated in order Agirlik, GPS_LAT, GPS_LON.
                    //To make them these together object model created.
                    var itemObjectModel = function (agirlik, lat, lon) {
                        var self = this;
                        self.agirlik = agirlik;
                        self.lat = lat;
                        self.lon = lon;
                        //if object model valid return it.
                        self.isValid = function(){
                            return self.agirlik && self.lat && self.lon;
                        };
                        return self;
                    };

                    var tempModel = new itemObjectModel();

                    //Pusing values from db params. If valid push to items array.
                    for (var  i = 0; i < results.length; i++){
                        var params = results[i].params;
                        if(params.Agirlik)
                            tempModel.agirlik = params.Agirlik;
                        if(params.GPS_LAT)
                            tempModel.lat = params.GPS_LAT;
                        if(params.GPS_LON)
                            tempModel.lon = params.GPS_LON;
                        if(tempModel.isValid())
                        {
                            delete tempModel.isValid;
                            items.push(tempModel);
                            tempModel = new itemObjectModel();
                        }

                    }

                    // console.log(items)
                    console.log('Length of items: ', items.length)
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

//Returning with model to use in index.js
model.queryCollection = queryCollection;
model.getCollection = getCollection;

module.exports = model;


