require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Validate required environment variables
if (!process.env.ONE_SIGNAL_APP_ID || !process.env.ONE_SIGNAL_API_KEY) {
  console.error(
    'Missing required environment variables: ONE_SIGNAL_APP_ID and ONE_SIGNAL_API_KEY must be set',
  );
  process.exit(1);
}

// In-memory storage (replace with database in production)
const users = {};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Notification service is running',
    timestamp: new Date().toISOString(),
  });
});

// Endpoint to store player ID and external ID
app.post('/api/register', async (req, res) => {
  try {
    const {playerId, externalId} = req.body;

    if (!playerId || !externalId) {
      return res.status(400).json({
        error: 'Both playerId and externalId are required',
      });
    }

    // Store the user (in production, use a database)
    users[externalId] = {playerId, externalId};

    console.log(`Registered user: ${externalId} with player ID: ${playerId}`);

    return res.status(200).json({
      success: true,
      message: 'User registered successfully',
      data: {
        externalId,
        playerId,
        registeredAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
});

// Endpoint to list all registered users (for debugging)
app.get('/api/users', (req, res) => {
  res.json({
    count: Object.keys(users).length,
    users,
  });
});

// Endpoint to send notification
app.post('/api/send-notification', async (req, res) => {
  try {
    const {externalId, message, title = 'New Notification'} = req.body;

    if (!externalId || !message) {
      return res.status(400).json({
        error: 'externalId and message are required',
      });
    }

    const user = users[externalId];
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        suggestion: 'Make sure the user is registered first',
      });
    }

    // Prepare notification payload
    const notificationPayload = {
      app_id: process.env.ONE_SIGNAL_APP_ID,
      include_player_ids: [user.playerId],
      headings: {en: title},
      contents: {en: message},
      data: {
        // Custom additional data
        sentFrom: 'React Native App',
        timestamp: new Date().toISOString(),
      },
    };

    console.log('Sending notification with payload:', notificationPayload);

    // Send notification via OneSignal API
    const response = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      notificationPayload,
      {
        headers: {
          Authorization: `Basic ${process.env.ONE_SIGNAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      data: response.data,
      user: {
        externalId: user.externalId,
        notificationCount: (user.notificationCount || 0) + 1,
      },
    });
  } catch (error) {
    console.error('Notification error:', error.response?.data || error.message);
    return res.status(500).json({
      error: 'Failed to send notification',
      details: error.response?.data || error.message,
    });
  }
});

app.post('/api/send-notification-test', async (req, res) => {
  const url = 'https://api.onesignal.com/notifications?c=push';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: 'Key ' + process.env.ONE_SIGNAL_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      app_id: process.env.ONE_SIGNAL_APP_ID,
      contents: {en: 'Your message body here.'},
      included_segments: ['Test Users'],
    }),
  };

  fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`OneSignal App ID: ${process.env.ONE_SIGNAL_APP_ID}`);
});
