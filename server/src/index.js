import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

import express from 'express';
const app = express();

app.use(express.json());

app.post('/send-notification', async (req, res) => {
  const {playerId} = req.body;

  if (!playerId) return res.status(400).json({error: 'playerId is required'});

  try {
    const response = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: process.env.ONE_SIGNAL_APP_ID,
        include_external_user_ids: [playerId],
        headings: {en: 'Hello Chacha'},
        contents: {en: 'BSDK Chacha!'},
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${process.env.ONE_SIGNAL_API_KEY}`,
        },
      },
    );

    return res.status(200).json({success: true, response: response.data});
  } catch (err) {
    console.error(
      'Error sending notification:',
      err.response?.data || err.message,
    );
    return res.status(500).json({error: 'Failed to send notification'});
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
