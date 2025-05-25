import './global.css';
import React, {useEffect} from 'react';
import {View, Text, Alert, TouchableOpacity} from 'react-native';
import Config from 'react-native-config';
import {OneSignal, LogLevel} from 'react-native-onesignal';
import uuid from 'react-native-uuid';

// https://chatgpt.com/share/68337d2b-b6a0-8004-a1fb-3d514eb7265c

if (!Config.ONESIGNAL_APP_ID) {
  throw new Error('OneSignal App ID is not set in react-native-config.js');
}

const ONE_SIGNAL_APP_ID: string = Config.ONESIGNAL_APP_ID;

const getUuid = () => {
  return uuid.v4() as string;
};

export default function App() {
  const [subscriptionId, setSubscriptionId] = React.useState<string | null>(
    null,
  );
  const [externalId, setExternalId] = React.useState<string | null>(null);

  const checkSubscription = async () => {
    const isSubscribed = await OneSignal.User.pushSubscription.getPushSubscriptionState();
    console.log('Push Subscription State:', isSubscribed);

    const subscriptionId = await OneSignal.User.pushSubscription.getIdAsync();
    console.log('Subscription ID:', subscriptionId);
  };

  const getOneSignalId = async () => {
    try {
      const id = await OneSignal.User.getOnesignalId();
      console.log('OneSignal ID:', id);
      Alert.alert('OneSignal ID', id || 'No ID available');
    } catch (error) {
      console.error('Error getting OneSignal ID:', error);
      Alert.alert('Error', 'Failed to get OneSignal ID');
    }
  };

  const oneSignalInit = async () => {
    try {
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);
      OneSignal.initialize(ONE_SIGNAL_APP_ID);

      const permission = await OneSignal.Notifications.requestPermission(true);
      if (!permission) {
        console.log('Permission not granted', permission);
      }

      console.log('Permission Granted:', permission);

      await OneSignal.Notifications.getPermissionAsync();

      const onesignalId = await OneSignal.User.getOnesignalId();
      console.log('OneSignal ID:', onesignalId);

      const subscription_id =
        await OneSignal.User.pushSubscription.getIdAsync();
      if (!subscription_id) {
        console.log('Subscription ID not found', subscription_id);
      }
      setSubscriptionId(subscription_id);
      console.log('Subscription ID', subscription_id);

      const external_id = getUuid();
      console.log('external_id', external_id);
      await OneSignal.login(external_id);
      setExternalId(external_id);
    } catch (error) {
      console.error('Error initializing OneSignal:', error);
    }
  };

  const sendNotification = async () => {
    try {
      const res = await fetch(
        'http://192.168.1.8:3000/send-notification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playerId: externalId, // or OneSignal Player ID if you use that
          }),
        },
      );

      const data = await res.json();
      console.log(data);
      // Alert.alert('Notification Sent!');
    } catch (err) {
      console.error(err);
      // Alert.alert('Failed to send notification');
    }
  };

  useEffect(() => {
    checkSubscription();
    oneSignalInit();
    // getOneSignalId();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-[#121212] px-6">
      <View className="bg-[#1e1e1e] p-6 rounded-2xl w-full shadow-lg mb-4">
        <Text className="text-gray-400 text-sm mb-1">External ID</Text>
        <Text className="text-white font-semibold text-base break-all">
          {externalId || 'Loading...'}
        </Text>
      </View>

      <View className="bg-[#1e1e1e] p-6 rounded-2xl w-full shadow-lg">
        <Text className="text-gray-400 text-sm mb-1">Subscription ID</Text>
        <Text className="text-white font-semibold text-base break-all">
          {subscriptionId || 'Loading...'}
        </Text>
      </View>

      <TouchableOpacity
        onPress={sendNotification}
        className="bg-blue-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-white text-center text-base font-semibold">Send Push Notification</Text>
      </TouchableOpacity>
    </View>
  );
}
