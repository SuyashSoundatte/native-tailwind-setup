import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// OneSignal configuration
const ONESIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY;
// console.log(ONESIGNAL_APP_ID, ONESIGNAL_API_KEY);

// Simple endpoint to send notification
app.post('/send-notification', async (req, res) => {
  try {
    console.log(req.body);
    const {playerIds, title, message, data} = req.body;

    if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      res.status(400).json({ success: false, error: 'Player IDs are required' });
    }

    const notification = {
      app_id: ONESIGNAL_APP_ID,
      include_player_ids: playerIds,
      headings: {en: title},
      contents: {en: message},
      data: data || {},
    };

    const response = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      notification,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
      },
    );

    res.status(200).json({
      success: true,
      notificationId: response.data.id,
    });
  } catch (error: any) {
    console.error('Full error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
    });
    res.status(error.response?.status || 500).json({
        success: false,
        error: error.response?.data?.errors || 'Failed to send notification',
        details: error.response?.data,
    });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
