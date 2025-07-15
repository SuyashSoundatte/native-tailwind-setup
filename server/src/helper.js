import axios from 'axios';

export const sendNotification = async (req, res) => {
  console.log('hello');
  const {playerId} = req.body;
  console.log(playerId);

  if (!playerId) {
    return res.status(400).json({error: 'playerId is required'});
  }

  try {
    const response = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: process.env.ONE_SIGNAL_APP_ID,
        include_external_user_ids: [playerId],
        headings: {en: 'Hello from MyApp'},
        contents: {en: 'Idali Sambar Dosa chutteny chuttney!!'},
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
};
