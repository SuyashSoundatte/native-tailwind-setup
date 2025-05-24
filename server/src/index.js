const dotenv = require('dotenv');
dotenv.config();

// const url = 'https://api.onesignal.com/notifications?c=push';
// const options = {
//   method: 'POST',
//   headers: {
//     accept: 'application/json',
//     Authorization: `Key ${process.env.ONE_SIGNAL_API_KEY}`,
//     'content-type': 'application/json',
//   },
//   body: JSON.stringify({
//     app_id: process.env.ONE_SIGNAL_APP_ID,
//     contents: {en: 'Your message body here.'},
//     included_segments: ['3f7490f9-8479-4f8a-b021-8e5735ff24c9'],
//   }),
// };

// fetch(url, options)
//   .then(res => res.json(console.log(res.status)))
//   .then(json => console.log(json))
//   .catch(err => console.error(err));

const createTemplate = () => {
  const url = 'https://api.onesignal.com/templates';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: 'Key ' + process.env.ONE_SIGNAL_API_KEY,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: '{"name":"Hello chacha","contents":{"en":"bsdk chacha!!"},"email_subject":"chacha email"}',
  };

  fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err));
};

createTemplate();
