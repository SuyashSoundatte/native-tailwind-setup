import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendPushNotification, sendSMS } from './fcm';

dotenv.config();

interface NotificationRequestBody {
  playerId?: string;
  phoneNumber?: string;
  title: string;
  message: string;
}

interface ApiResponse {
  success: boolean;
  notificationId?: string;
  error?: string;
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Notification Service is running');
});

// Properly typed route handler
const notifyHandler = async (
  req: Request<{}, {}, NotificationRequestBody>,
  res: Response<ApiResponse>,
) => {
  const { playerId, phoneNumber, title, message } = req.body;

  if (!playerId && !phoneNumber) {
    res.status(400).json({
      success: false,
      error: 'Either playerId or phoneNumber must be provided',
    });
  }

  try {
    let response: ApiResponse;

    if (playerId) {
      const result = await sendPushNotification(playerId, title, message);
      response = {
        success: result.success,
        notificationId: result.id,
        error: result.error,
      };
    } else {
      const result = await sendSMS(phoneNumber!, message);
      response = {
        success: result.success,
        error: result.error,
      };
    }

    if (!response.success) {
      res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in notification service:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

app.post('/notify', notifyHandler);

// Server startup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
