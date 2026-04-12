// src/screens/auth/WelcomeScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import GlassButton from '../../components/shared/GlassButton';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* ========== BACKGROUND VIDEO ========== */}
      <Video
        // ---------- LOCAL VIDEO FILE ----------
        source={require('../../utils/videos/gym-background.mp4')}

        // ---------- YA ONLINE URL USE KARO ----------
        // source={{ uri: 'https://your-video-url.com/gym.mp4' }}

        style={styles.backgroundVideo}
        resizeMode="cover"
        repeat={true}           // Loop me chalega
        muted={true}            // Awaaz band
        playInBackground={false}
        playWhenInactive={false}
        rate={1}              // Normal speed (0.8 for slow motion)
        onLoad={() => setVideoLoaded(true)}
        onError={(error) => console.log('Video Error:', error)}
      />

      {/* ========== LOADING STATE (jab tak video load ho) ========== */}
      {!videoLoaded && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )}

      {/* ========== GRADIENT OVERLAY ========== */}
      <LinearGradient
        colors={[
          'rgba(0,0,0,0.90)',
          'rgba(0,0,0,0.5)',
          'rgba(0,0,0,0.90)',
          '#000000',
        ]}
        locations={[0, 0.3, 0.7, 1]}
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
            <Text style={styles.heroSubtitle}>
              DISCIPLINE IS THE ONLY METRIC.
            </Text>
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

            {/* Admin Button */}
            <TouchableOpacity
              style={styles.adminPreviewButton}
              onPress={() => navigation.navigate('AdminDashboard')}
            >
              <Text style={styles.adminPreviewText}>Preview Admin UI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  // ===== MAIN CONTAINER =====
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',  // Fallback color
  },

  // ===== VIDEO STYLES =====
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: width,
    height: height,
  },

  // ===== LOADING =====
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  // ===== GRADIENT OVERLAY =====
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },

  // ===== CONTENT =====
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

  // ===== ADMIN BUTTON =====
  adminPreviewButton: {
    position: 'absolute',
    bottom: -32,
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