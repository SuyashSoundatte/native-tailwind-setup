import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert, StyleSheet, Platform} from 'react-native';
import {OneSignal, LogLevel} from 'react-native-onesignal';

const ONESIGNAL_APP_ID = '44f8a2e9-1940-4169-a69e-593935b9cab9';

const App = () => {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [externalId, setExternalId] = useState<string | null>(null);
  const [isReadyForBackend, setIsReadyForBackend] = useState(false);

  useEffect(() => {
    // Initialize OneSignal
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(ONESIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(true);

    // Set up listeners
    const pushSubscriptionListener =
      OneSignal.User.pushSubscription.addEventListener(
        'change',
        subscription => {
          console.log('Push Subscription Changed:', subscription);
          setPlayerId(subscription.id || null);
          checkIfReadyForBackend(subscription.id, externalId);
        },
      );

    const userChangeListener = OneSignal.User.addEventListener(
      'change',
      user => {
        console.log('User Changed:', user);
        const currentExternalId = user.externalId;
        setExternalId(currentExternalId || null);
        checkIfReadyForBackend(playerId, currentExternalId);
      },
    );

    // Set a demo external ID after initialization
    const timer = setTimeout(() => {
      const demoExternalId = 'user123'; // Replace with your actual user ID
      OneSignal.login(demoExternalId)
        .then(() => console.log('Demo external ID set:', demoExternalId))
        .catch(error => console.error('Error setting external ID:', error));
    }, 3000);

    // Get initial state
    const getInitialState = async () => {
      try {
        const id = await OneSignal.User.pushSubscription.getIdAsync();
        console.log('Initial Push Subscription ID:', id);
        setPlayerId(id);

        const currentExternalId = await OneSignal.User.getExternalId();
        if (currentExternalId) {
          setExternalId(currentExternalId);
          checkIfReadyForBackend(id, currentExternalId);
        }
      } catch (error) {
        console.error('Error getting initial state:', error);
      }
    };

    getInitialState();

    // Clean up
    return () => {
      if (
        pushSubscriptionListener &&
        typeof pushSubscriptionListener.remove === 'function'
      ) {
        pushSubscriptionListener.remove();
      }
      if (
        userChangeListener &&
        typeof userChangeListener.remove === 'function'
      ) {
        userChangeListener.remove();
      }
      clearTimeout(timer);
    };
  }, []);

  const checkIfReadyForBackend = (
    currentPlayerId: string | null,
    currentExternalId: string | null,
  ) => {
    if (currentPlayerId && currentExternalId) {
      setIsReadyForBackend(true);
      logDataForBackend(currentPlayerId, currentExternalId);
    }
  };

  const logDataForBackend = (playerId: string, externalId: string) => {
    console.log('--- DATA READY FOR BACKEND ---');
    console.log('Player ID (OneSignal User ID):', playerId);
    console.log('External ID (Your User ID):', externalId);
    console.log('Platform:', Platform.OS);
    console.log('------------------------------');
  };

  const handleSendToBackendPress = () => {
    if (playerId && externalId) {
      Alert.alert(
        'Data for Backend',
        `This is what you'll send to your backend:\n\n` +
          `Player ID: ${playerId}\n` +
          `External ID: ${externalId}\n` +
          `Platform: ${Platform.OS}`,
        [{text: 'OK', onPress: () => console.log('User acknowledged')}],
      );
    } else {
      Alert.alert('Not Ready', 'Waiting for OneSignal data to be ready...', [
        {text: 'OK', onPress: () => console.log('User acknowledged')},
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OneSignal Integration</Text>

      <View style={styles.dataContainer}>
        <Text style={styles.label}>Player ID:</Text>
        <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
          {playerId || 'Waiting...'}
        </Text>

        <Text style={styles.label}>External ID:</Text>
        <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
          {externalId || 'Waiting...'}
        </Text>

        <Text style={styles.label}>Platform:</Text>
        <Text style={styles.value}>{Platform.OS}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.value,
            isReadyForBackend ? styles.ready : styles.waiting,
          ]}>
          {isReadyForBackend ? 'Ready for backend' : 'Waiting for data...'}
        </Text>
      </View>

      <Button
        title="Show Backend Data"
        onPress={handleSendToBackendPress}
        color="#22c55e"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  dataContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  label: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
  },
  ready: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  waiting: {
    color: '#f59e0b',
    fontWeight: 'bold',
  },
});

export default App;
