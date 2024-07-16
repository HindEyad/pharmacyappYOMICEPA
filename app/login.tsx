import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Link, useRouter } from 'expo-router';
import axiosInstance from '../axiosConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [secureText, setSecureText] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  const handleLogin = async () => {
    try {
      if(username == "" || password == ""){
        setErrorMessage("fields can't be empty");
        return;
      }
      const response = await axiosInstance.post('/auth', { username, password });
      const { token } = response.data;
      await SecureStore.setItemAsync('userToken', token);

      const storedToken = await SecureStore.getItemAsync('userToken');
      if (storedToken) {
        // Navigate to HomeScreen after token is confirmed to be stored
        router.replace('/home');
      } else {
        console.error('Token not stored.');
      }
    } catch (error) {
        // console.error(error);
        if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
            if (data && error.response.data === "Password doesn't match the user.") {
              setErrorMessage('Password is wrong');
            } else if (!data) {
              setErrorMessage('Username is wrong');
            } else {
              setErrorMessage('Username and/or password are wrong');
            }
          } else {
            setErrorMessage('An error occurred. Please try again.');
          }
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
      }
    };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        //PINK TO ORANGE 
        // colors={['#FF69B4', '#FF7043']}

        // ORANGES
        colors={['pink', '#FF7043']}
        
        // ORANGE TO BLUE
        // colors={[ '#FF7043', '#FFDAB9', '#89CFF0', '#4682B4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Left Arrow Button */}
      <TouchableOpacity style={styles.arrowButton} onPress={() => router.replace('/')}>
        <Text style={styles.arrowText}>←</Text>
      </TouchableOpacity>
        <FontAwesome name="user-circle" size={70} color="white" style={styles.center}/>
        <Text style={styles.title}>Log In</Text>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        
        <Text style={styles.text}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder='Enter Username'
        />
       
        <Text style={styles.text}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            placeholder='Enter Password'
          />
          <TouchableOpacity onPress={toggleSecureText} style={styles.icon}>
            <Icon name={secureText ? 'eye-off' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.centers}>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.textbutton}>Log In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
  centers: {
    alignItems: 'center'
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: "white",
    marginBottom: 30,
    marginTop: 15,
    textAlign: 'center'
  },
  text: {
    color: 'white',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    marginTop: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
  },
  icon: {
    position: 'absolute',
    right: 10,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: "center"
  },
  button: {
    padding: 15,
    marginTop: 10,
    backgroundColor: 'pink',
    width: 130,
    alignItems: 'center',
    borderRadius: 50,    
  },
  textbutton: {
    fontSize: 18,
  },
  arrowButton: {
    position: 'absolute',
    top: 5,
    left: 20,
    padding: 10,
    zIndex: 1
  },
  arrowText: {
    fontSize: 24,
    color: 'black',
  },
});
