var express = require('express');
var LocalStorage = require('node-localstorage').LocalStorage;
const axios = require('axios');
var router = express.Router();

const localStorage = new LocalStorage('./scratch');

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const updateToken = async () => {
  const form = new FormData();
  form.append('grant_type', 'client_credentials');
  form.append('client_secret', 'a576059add104a8e8bdb7b5a0206f30f913c7220cfcb4e949e153d19e80bc25c');
  form.append('client_id', '4b1d496707.scaleup.celcoinapi.v5');

  const options = {method: 'POST', headers: {accept: 'application/json'}};

  options.body = form;

  await fetch('https://sandbox.openfinance.celcoin.dev/v5/token', options)
    .then(response => response.json())
    .then(response => {
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.access_token}`;
      localStorage.setItem('token', response.access_token);
    })
    .catch(err => console.error(err));






  await setTimeout(()=>{}, 1000)

  return;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Express' });
});

router.post('/celcoin', async function(req, res, next) {
  const token = localStorage.getItem('token');
  console.log(token)
  if (!token) {
    await updateToken();
  }

  if (!token) {
    return res.sendStatus(401);
  }
  const { url, method, payload } = req.body;
  try {
    const response = await axios({
      url,
      method: method,
      data: payload
    });
  
    res.send(response.data);
  } catch(e) {
    if (e.response.status === 401) {
      await updateToken();
      return res.sendStatus(401);
      // redo requrest
    }

    if (e.response.status === 404) {
      // await updateToken();
      return res.sendStatus(404);
      // redo requrest
    }
    
    console.log('err /new: ', e.response)
    return res.status(500).send({ error: 'Something failed!' });
  }
});


router.post("/hook-celcoin", (req, res) => {
  console.log(req.body) // Call your action on the request here
  res.status(200).end() // Responding is important
})

module.exports = router;

