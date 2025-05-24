import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {OneSignal, LogLevel} from 'react-native-onesignal';

const ONESIGNAL_APP_ID = '44f8a2e9-1940-4169-a69e-593935b9cab9';

const App = () => {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [externalId, setExternalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeOneSignal = async () => {
      try {
        // 1. Initialize
        OneSignal.Debug.setLogLevel(LogLevel.Verbose);
        OneSignal.initialize(ONESIGNAL_APP_ID);

        // 2. Request permissions (important!)
        const permission = await OneSignal.Notifications.requestPermission(
          true,
        );
        console.log('Permission status:', permission);

        if (!permission) {
          throw new Error('Notification permission denied');
        }

        // 3. Get Player ID
        const id = await OneSignal.User.pushSubscription.getIdAsync();
        if (!id) {
          throw new Error('Player ID not available');
        }
        setPlayerId(id);

        // 4. Set External ID (can be any string - use your user system ID)
        const demoExternalId =
          'user_' + Math.random().toString(36).substring(7);
        await OneSignal.login(demoExternalId);
        setExternalId(demoExternalId);
      } catch (err:any) {
        console.error('Initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeOneSignal();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Initializing OneSignal...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.helpText}>
          Please check:{'\n'}
          1. Internet connection{'\n'}
          2. Notification permissions{'\n'}
          3. OneSignal App ID
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OneSignal Status</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Player ID:</Text>
        <Text style={styles.value}>{playerId || 'Not available'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>External ID:</Text>
        <Text style={styles.value}>{externalId || 'Not set'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  label: {
    color: '#64748b',
    fontSize: 16,
  },
  value: {
    color: '#0f172a',
    fontSize: 16,
    marginTop: 5,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 20,
    color: '#64748b',
    textAlign: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  helpText: {
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default App;
