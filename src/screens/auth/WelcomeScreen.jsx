// src/screens/auth/WelcomeScreen.js

import React from 'react';
// import gym from "../auth/gym.jpg"

import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GlassButton from '../../components/shared/GlassButton';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      // source={gym}

      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)', '#000000']}
        style={styles.gradient}
      >
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <View style={styles.logoInner} />
            </View>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>BUILT,{'\n'}NOT BORN.</Text>
            <Text style={styles.heroSubtitle}>DISCIPLINE IS THE ONLY METRIC.</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonSection}>
            <GlassButton 
              variant="primary"
              onPress={() => navigation.navigate('LoginStep1')}
            >
              Sign In
            </GlassButton>
            
            <View style={{ height: 16 }} />
            
            <GlassButton 
              variant="glass"
              onPress={() => navigation.navigate('LoginStep1')}
            >
              Create Account
            </GlassButton>

            {/* ⬇️⬇️⬇️ ADMIN BUTTON - BOTTOM PE HIDDEN ⬇️⬇️⬇️ */}
            <TouchableOpacity 
              style={styles.adminPreviewButton}
              onPress={() => navigation.navigate('AdminDashboard')}
            >
              <Text style={styles.adminPreviewText}>Preview Admin UI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: 16,
    height: 16,
    backgroundColor: Colors.white,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -80,
  },
  heroTitle: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 36,
    color: Colors.white,
    letterSpacing: 5.4,
    lineHeight: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 12,
    color: Colors.zinc[300],
    letterSpacing: 3.6,
  },
  buttonSection: {
    width: '100%',
    position: 'relative',
  },
  
  // ⬇️ ADMIN BUTTON STYLES ⬇️
  adminPreviewButton: {
    position: 'absolute',
    bottom: -32,  // Buttons ke neeche
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  adminPreviewText: {
    fontSize: 10,
    color: Colors.zinc[600],
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;