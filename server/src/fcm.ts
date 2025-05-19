import axios, {AxiosError, AxiosResponse} from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface NotificationResponse {
  success: boolean;
  id?: string;
  errors?: string[];
  error?: string;
}

interface SMSResponse {
  success: boolean;
  error?: string;
}

const ONE_SIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY;

if (!ONE_SIGNAL_APP_ID || !ONE_SIGNAL_API_KEY) {
  throw new Error(
    'OneSignal environment variables are not properly configured',
  );
}

const oneSignalClient = axios.create({
  baseURL: 'https://onesignal.com/api/v1',
  headers: {
    Authorization: `Basic ${ONE_SIGNAL_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const sendPushNotification = async (
  playerId: string,
  title: string,
  message: string,
): Promise<NotificationResponse> => {
  try {
    const payload = {
      app_id: ONE_SIGNAL_APP_ID,
      include_player_ids: [playerId],
      headings: {en: title},
      contents: {en: message},
    };

    const response: AxiosResponse = await oneSignalClient.post(
      '/notifications',
      payload,
    );

    if (response.data.errors) {
      console.error('OneSignal Error:', response.data.errors);
      return {
        success: false,
        errors: response.data.errors,
      };
    }

    console.log('Notification sent:', response.data);
    return {
      success: true,
      id: response.data.id,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = axiosError.response?.data || axiosError.message;
    console.error('Error sending push notification:', errorMessage);

    return {
      success: false,
      error: JSON.stringify(errorMessage),
    };
  }
};

export const sendSMS = async (
  phoneNumber: string,
  message: string,
): Promise<SMSResponse> => {
  try {
    const payload = {
      app_id: ONE_SIGNAL_APP_ID,
      include_phone_numbers: [phoneNumber],
      contents: {en: message},
    };

    const response = await oneSignalClient.post('/notifications', payload);
    console.log('SMS sent:', response.data);

    return {success: true};
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = axiosError.response?.data || axiosError.message;
    console.error('Error sending SMS:', errorMessage);

    return {
      success: false,
      error: JSON.stringify(errorMessage),
    };
  }
};
