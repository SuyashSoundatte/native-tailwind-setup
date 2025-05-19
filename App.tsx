import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {OneSignal, LogLevel} from 'react-native-onesignal';
import Config from 'react-native-config';
import './global.css';

export default function App() {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<string>(
    'Setting up notifications...',
  );

  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    const appId = Config.ONESIGNAL_APP_ID;
    if (!appId) {
      console.error('OneSignal app ID is not set');
      setNotificationStatus('Error: OneSignal app ID not configured');
      return;
    }

    OneSignal.initialize(appId);
    OneSignal.Notifications.requestPermission(true);
    const getSubscription = async () => {
      try {
        const subscription = OneSignal.User.pushSubscription;

        if (subscription) {
          const subScriptionId = await subscription.getIdAsync();
          setPlayerId(subScriptionId);
          await sendPlayerIdToBackend(subScriptionId);
          setNotificationStatus('Notifications enabled!');
        } else {
          setNotificationStatus('Waiting for player ID...');
        }
      } catch (error) {
        console.error('Error getting push subscription:', error);
        setNotificationStatus('Failed to get player ID');
      }
    };

    getSubscription();
  }, []);

  const sendPlayerIdToBackend = async (id: string | null) => {
    try {
      const res = await fetch('http://localhost:3000/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: id,
          title: 'Welcome!',
          message: 'You have successfully subscribed to notifications!',
        }),
      });

      const data = await res.json();
      console.log('Backend response:', data);
    } catch (error: any) {
      console.error('Failed to send player ID to backend:', error.message);
    }
  };

  const sendTestNotification = async () => {
    if (!playerId) {
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId,
          title: 'Test Notification',
          message: 'This is a test notification from your app!',
        }),
      });

      const data = await res.json();
      console.log('Test notification response:', data);
      setNotificationStatus('Test notification sent!');
    } catch (error) {
      console.error('Failed to send test notification:', error);
      setNotificationStatus('Failed to send test notification');
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-900 p-6">
      <View className="w-full max-w-md bg-gray-800 rounded-xl p-6 shadow-lg">
        <Text className="text-white text-2xl font-bold mb-2 text-center">
          Notification Demo
        </Text>
        <Text className="text-gray-300 text-lg mb-6 text-center">
          Hello Suyash Soundatte
        </Text>

        <View className="bg-gray-700 rounded-lg p-4 mb-6">
          <Text className="text-gray-400 text-sm mb-1">
            Notification Status
          </Text>
          <Text className="text-white text-lg font-medium">
            {notificationStatus}
          </Text>
        </View>

        {playerId && (
          <View className="bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-800">
            <Text className="text-gray-400 text-sm mb-1">Your Player ID</Text>
            <Text
              className="text-blue-300 text-xs font-mono"
              numberOfLines={1}
              ellipsizeMode="middle">
              {playerId}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={sendTestNotification}
          disabled={!playerId}
          className={`py-3 px-6 rounded-lg ${
            playerId ? 'bg-blue-600' : 'bg-gray-600'
          }`}>
          <Text className="text-white text-center font-medium">
            {playerId ? 'Send Test Notification' : 'Setting up...'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
