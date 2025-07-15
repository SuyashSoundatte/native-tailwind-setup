import React, {useState} from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {Alert} from 'react-native';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({navigation}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        'http://10.49.246.3:3000/login',
        {email, password},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(res.data);

      Alert.alert('Success', 'Registration successful');
      navigation.navigate('Home');
    } catch (err: any) {
      console.log(err);
      if (err.response?.data?.msg) {
        Alert.alert('Registration Failed', err.response.data.msg);
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-zinc-900 px-6">
      <Text className="text-white text-3xl font-bold mb-6">Login</Text>

      <TextInput
        className="w-full bg-zinc-800 text-white px-4 py-3 rounded mb-4"
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="w-full bg-zinc-800 text-white px-4 py-3 rounded mb-6"
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        className="bg-indigo-600 px-6 py-3 rounded w-full mb-3"
        onPress={handleLogin}>
        <Text className="text-white text-center font-medium">Login</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text className="text-indigo-400 text-center mt-2">
          Don't have an account? Register
        </Text>
      </Pressable>
    </View>
  );
}
