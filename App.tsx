import React from 'react';
import {View, Text} from 'react-native';
import './global.css';
import {OneSignal, LogLevel} from 'react-native-onesignal';

export default function App() {
  // Enable verbose logging for debugging (remove in production)
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  // Initialize with your OneSignal App ID
  OneSignal.initialize('07851838-e972-4533-9ff1-4048626844bf');
  // Use this method to prompt for push notifications.
  // We recommend removing this method after testing and instead use In-App Messages to prompt for notification permission.
  OneSignal.Notifications.requestPermission(false);

  return (
    <View className="flex-1 items-center justify-center bg-[#212121]">
      <Text className="text-white text-xl">Hello TailwindCSS 👋</Text>
    </View>
  );
}
