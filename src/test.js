"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var options = {
    url: "http://localhost:46254/subscribe?listid=71797e4531",
    json: true,
    body: {
        EMAIL: 'bersling@gmail.com',
        FNAME: 'da blab',
        DESCR: 'Ich finde das voll spannend und so.'
    },
    method: 'POST',
    headers: {
        'content-type': 'application/json'
    }
};
request(options, function (err, res, body) {
    if (err) {
        console.error('error posting json: ', err);
        throw err;
    }
    var headers = res.headers;
    var statusCode = res.statusCode;
    console.log('headers: ', headers);
    console.log('statusCode: ', statusCode);
    console.log('body: ', body);
});
