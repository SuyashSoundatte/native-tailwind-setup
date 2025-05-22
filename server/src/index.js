const dotenv = require('dotenv');
dotenv.config();

// const url = 'https://api.onesignal.com/notifications?c=push';
const url = `https://api.onesignal.com/apps/${process.env.ONE_SIGNAL_APP_ID}/users/by/external_id/alias_id/subscriptions`;
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    Authorization: `Key ${process.env.ONE_SIGNAL_API_KEY}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    subscription: {type: 'Email', token: 'email@example.com'},
  }),
};

fetch(url, options)
  .then(res => res.json(console.log(res.status)))
  .then(json => console.log(json))
  .catch(err => console.error(err));
