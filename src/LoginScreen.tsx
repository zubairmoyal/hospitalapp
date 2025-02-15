import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const LoginScreen = ({navigation}) => {
  const signInWithGoogle = async () => {
    try {
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error);
    }
  };
  const dummySignIn = async () => {
    try {
      signInWithGoogle();
      navigation.replace('Map');
    } catch (error) {
      console.error('Anonymous login failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.googleButton} onPress={dummySignIn}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
