const dotenv = require('dotenv');
dotenv.config();

const url = 'https://api.onesignal.com/notifications?c=push';
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    Authorization: `Key ${process.env.ONE_SIGNAL_API_KEY}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    app_id: process.env.ONE_SIGNAL_APP_ID,
    contents: {en: 'Your message body here.'},
    included_segments: ['Test Users'],
  }),
};

fetch(url, options)
  .then(res => res.json(console.log(res.status)))
  .then(json => console.log(json))
  .catch(err => console.error(err));
