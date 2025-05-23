import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert} from 'react-native';
import {OneSignal, LogLevel} from 'react-native-onesignal';
import Config from 'react-native-config';
import './global.css';

const ONESIGNAL_APP_ID = Config.ONESIGNAL_APP_ID;

const App = () => {
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    OneSignal.initialize(ONESIGNAL_APP_ID);

    // Add subscription observer
    OneSignal.User.pushSubscription.addEventListener('change', subscription => {
      console.log('Subscription changed:', subscription.current.id);
    });

    // Get current ID
    OneSignal.User.pushSubscription.getIdAsync().then(id => {
      console.log('Current push subscription id: ', id);
      setPlayerId(id);
    });
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-gray-900 px-4">
      <Text className="text-white text-2xl font-bold mb-2 text-center">
        Notification Demo
      </Text>
      <Text className="text-gray-300 text-lg mb-6 text-center">
        Hello Suyash Soundatte
      </Text>

      {playerId && (
        <Text className="text-green-400 mb-4 text-sm text-center">
          Registered with OneSignal: {'\n'}
          {playerId}
        </Text>
      )}

      <Button
        title="Show Player ID"
        onPress={() =>
          Alert.alert('OneSignal Player ID', playerId ?? 'Not registered yet')
        }
        color="#22c55e"
      />
    </View>
  );
};

export default App;
