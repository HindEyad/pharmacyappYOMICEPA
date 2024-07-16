import React, { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function Page() {
  const router = useRouter();
  const heartAnimation = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(heartAnimation, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(heartAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, [heartAnimation]);

  return (
    <View style={styles.container}>
      

      <View style={styles.main}>
        {/* TITLES */}
        <Text style={styles.title}>Pharmacy</Text>
        <Text style={styles.subtitle}>easily request returns to companies</Text>

        {/* ANIMATION */}
        <View style={styles.animationContainer}>
          <Animated.View style={{ transform: [{ scale: heartAnimation }] }}>
            <Icon name="heartbeat" size={80} color="#FFC6BD" />
          </Animated.View>
        </View>

        {/* LOGIN BUTTON */}
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={() => { router.replace('/login'); }}>
          <LinearGradient
            colors={['lightblue', '#0096FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainbtn}
          >
              <Text style={{ color: 'white', fontSize: 20 }}>Log In</Text>
          </LinearGradient>
            </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 960,
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#0096FF',
  },
  subtitle: {
    fontSize: 25,
    color: '#FFC6BD',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mainbtn: {
    borderRadius: 20,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    width: 200,
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
 
});
