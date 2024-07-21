var express = require('express');
var LocalStorage = require('node-localstorage').LocalStorage;
var celcoin = require('@api/celcoin');
const axios = require('axios');
var router = express.Router();

const localStorage = new LocalStorage('./scratch');

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const updateToken = async () => {
  const response = await fetch("https://sandbox.openfinance.celcoin.dev/v5/token", {
    "headers": {
      "accept": "application/json",
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryfJBO4h5FTVBQZPAa",
      "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "x-readme-api-explorer": "5.122.0",
      "Referer": "https://developers.celcoin.com.br/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": "------WebKitFormBoundaryfJBO4h5FTVBQZPAa\r\nContent-Disposition: form-data; name=\"client_id\"\r\n\r\n41b44ab9a56440.teste.celcoinapi.v5\r\n------WebKitFormBoundaryfJBO4h5FTVBQZPAa\r\nContent-Disposition: form-data; name=\"grant_type\"\r\n\r\nclient_credentials\r\n------WebKitFormBoundaryfJBO4h5FTVBQZPAa\r\nContent-Disposition: form-data; name=\"client_secret\"\r\n\r\ne9d15cde33024c1494de7480e69b7a18c09d7cd25a8446839b3be82a56a044a3\r\n------WebKitFormBoundaryfJBO4h5FTVBQZPAa--\r\n",
    "method": "POST"
  });

  const data = await response.json();
  // console.log(data);
  localStorage.setItem('token', data.access_token);

  return;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Express' });
});

router.post('/celcoin', async function(req, res, next) {
  const { url, method, payload } = req.body;
  try {
    const response = await axios({
      url,
      method: method
    });
  
    res.send(response.data);
  } catch(e) {
    if (e.response.status === 401) {
      await updateToken();
      return res.sendStatus(401);
      // redo requrest
    }
    
    console.log('err /new: ', e.response)
    return res.status(500).send({ error: 'Something failed!' });
  }
});

module.exports = router;

