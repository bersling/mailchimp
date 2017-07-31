import * as request from 'request';
import * as express from 'express';
const cors = require('cors'); // can't use typings because RegExp not working in typings...
import * as bodyParser from 'body-parser';
import {Config} from './config.model';
import * as multer from 'multer';
import { CoreUtils } from '@tsmean/utils';
const multipart = multer();

const server = express();
server.use(cors({origin: [
  "http://localhost:8082",
  /\.tsmean\.com$/
], credentials: true}));

const config: Config = require('../config');

const jsonForMailchimp = function(mergeFields) {
  return {
    "email_address": mergeFields.EMAIL,
    "status": "pending",
    "merge_fields": mergeFields
  }
};

const options = {
  url: undefined, //added dynamically
  body: undefined, //added dynamically
  json: true,
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

  if (req.query && req.query.listid) {
    const optionsCopy = CoreUtils.deepCopy(options);

    // set correct headers for amp
    res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
    res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

    optionsCopy.url = `${config.url}/lists/${req.query.listid}/members/`;

    console.log(optionsCopy);

    if (req.body && req.body.EMAIL) {

      optionsCopy.body = jsonForMailchimp(req.body);

      request(optionsCopy, function (err, mailchimpResponse) {

        if (err) {
          console.error('error posting json: ', err);
          throw err
        }

        const headers = mailchimpResponse.headers;
        const statusCode = mailchimpResponse.statusCode;

        res.status(statusCode).send(mailchimpResponse);
      });
    } else {
      res.status(400).send('You need a payload with an "EMAIL" property');
    }

  } else {
    res.status(400).send('You need to have the listid query parameter');
  }

});

const port = process.argv[2] || 46254;
server.listen(port, function() {
  console.log(`server started on ${port}`);
});
