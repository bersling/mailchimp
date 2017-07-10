import * as request from 'request';

const options = {
  url: `http://localhost:46254/subscribe`,
  json: true,
  body: {
    mail: 'blaa@blubb.ch'
  },
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  }
};

request(options, function (err, res, body) {
  if (err) {
    console.error('error posting json: ', err);
    throw err
  }
  const headers = res.headers;
  const statusCode = res.statusCode;
  console.log('headers: ', headers);
  console.log('statusCode: ', statusCode);
  console.log('body: ', body);
});
