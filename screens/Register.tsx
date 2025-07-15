import React, {useState} from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {Alert} from 'react-native';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function Register({navigation}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      console.log(name, email, number, password);
      const res = await axios.post('http://10.49.246.3:3000/register', {
        name,
        email,
        number,
        password,
      });
      console.log(res.data);

      Alert.alert('Success', 'Registration successful');
      navigation.navigate('Login');
    } catch (err: any) {
      if (err.response?.data?.msg) {
        Alert.alert('Registration Failed', err.response.data.msg);
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-zinc-900 px-6">
      <Text className="text-white text-3xl font-bold mb-6">Register</Text>

      <TextInput
        className="w-full bg-zinc-800 text-white px-4 py-3 rounded mb-4"
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
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
        className="w-full bg-zinc-800 text-white px-4 py-3 rounded mb-4"
        placeholder="Phone Number"
        placeholderTextColor="#aaa"
        value={number}
        onChangeText={setNumber}
        keyboardType="phone-pad"
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
        className="bg-indigo-600 px-6 py-3 rounded w-full"
        onPress={handleRegister}>
        <Text className="text-white text-center font-medium">Register</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text className="text-indigo-400 text-center mt-2">
          Already Registered? Login
        </Text>
      </Pressable>
    </View>
  );
}
