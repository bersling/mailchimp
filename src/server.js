"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var express = require("express");
var cors = require('cors'); // can't use typings because RegExp not working in typings...
var bodyParser = require("body-parser");
var multer = require("multer");
var utils_1 = require("@tsmean/utils");
var multipart = multer();
var server = express();
server.use(cors({ origin: [
        "http://localhost:8082",
        /\.tsmean\.com$/
    ], credentials: true }));
var jsonForMailchimp = function (mergeFields) {
    return {
        "email_address": mergeFields.EMAIL,
        "status": "pending",
        "merge_fields": mergeFields
    };
};
var options = {
    url: undefined,
    body: undefined,
    json: true,
    auth: {
        user: process.env.USER,
        pass: process.env.KEY
    },
    method: 'POST',
    headers: {
        'content-type': 'application/json'
    }
};
// parse application/json
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.get('/', function (req, res) {
    res.status(200).send('Welcome!');
});
server.post('/subscribe', multipart.fields([]), function (req, res) {
    if (req.query && req.query.listid) {
        var optionsCopy = utils_1.CoreUtils.deepCopy(options);
        // set correct headers for amp
        res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
        res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');
        optionsCopy.url = process.env.URL + "/lists/" + req.query.listid + "/members/";
        if (req.body && req.body.EMAIL) {
            optionsCopy.body = jsonForMailchimp(req.body);
            request(optionsCopy, function (err, mailchimpResponse) {
                if (err) {
                    console.error('error posting json: ', err);
                    throw err;
                }
                var headers = mailchimpResponse.headers;
                var statusCode = mailchimpResponse.statusCode;
                res.status(statusCode).send(mailchimpResponse);
            });
        }
        else {
            res.status(400).send('You need a payload with an "EMAIL" property');
        }
    }
    else {
        res.status(400).send('You need to have the listid query parameter');
    }
});
var port = process.env.PORT || 52502;
server.listen(port, function () {
    console.log("server started on " + port);
});
