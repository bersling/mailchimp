import * as request from 'request';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import {Config} from './config.model';
import * as multer from 'multer';
const multipart = multer();

const server = express();
server.use(cors({origin: ["http://localhost:8082", "http://www.tsmean.com"], credentials: true}));

const config: Config = require('../config');

const jsonForMailchimp = function(email) {
  return {"members": [{"email_address": email, "status": "subscribed"}], "update_existing": true}
};

const options = {
  url: `${config.url}/lists/40dfd5e481`,
  json: true,
  body: undefined,
  auth: {
    user: config.user,
    pass: config.key
  },
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  }
};

// parse application/json
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.get('/', function(req, res) {
  res.status(200).send('Welcome!');
});

server.post('/subscribe', multipart.fields([]), function (req, res) {

  // set correct headers
  if (req.query) {
    res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
  }
  res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

  if (req.body && req.body.email) {

    options.body = jsonForMailchimp(req.body.email);

    request(options, function (err, mailchimpResponse, body) {

      if (err) {
        console.error('error posting json: ', err);
        throw err
      }

      const headers = mailchimpResponse.headers;
      const statusCode = mailchimpResponse.statusCode;

      res.status(statusCode).send(mailchimpResponse);
    });
  } else {
    res.status(400).send('You need a payload with a "email" property');
  }

});

const port = process.argv[2] || 46254;
server.listen(port, function() {});
