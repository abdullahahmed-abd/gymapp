// src/screens/auth/WelcomeScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import GlassButton from '../../components/shared/GlassButton';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Video
        source={require('../../utils/videos/gym-background.mp4')}
        style={styles.backgroundVideo}
        resizeMode="cover"
        repeat={true}
        muted={true}
        playInBackground={false}
        playWhenInactive={false}
        rate={1}
        onLoad={() => setVideoLoaded(true)}
        onError={(error) => console.log('Video Error:', error)}
      />

      {!videoLoaded && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )}

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

          {/* Hero */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>GYM{'\n'}MANAGER</Text>
            <Text style={styles.heroSubtitle}>
              MANAGE YOUR GYM LIKE A PRO
            </Text>
          </View>

          {/* Single Login Button */}
          <View style={styles.buttonSection}>
            <GlassButton
              variant="primary"
              onPress={() => navigation.navigate('AdminLogin')}
            >
              Admin Login
            </GlassButton>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#000' },
  backgroundVideo: {
    position: 'absolute', top: 0, left: 0, bottom: 0, right: 0,
    width, height,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', zIndex: 1,
  },
  gradient: { ...StyleSheet.absoluteFillObject, zIndex: 2 },
  container: {
    flex: 1, paddingHorizontal: 24, paddingTop: 80, paddingBottom: 48,
    justifyContent: 'space-between',
  },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoBox: {
    width: 48, height: 48, borderWidth: 2, borderColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
  },
  logoInner: { width: 16, height: 16, backgroundColor: '#FFF' },
  heroSection: {
    flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -80,
  },
  heroTitle: {
    fontFamily: 'Orbitron-Bold', fontSize: 36, color: '#FFF',
    letterSpacing: 5.4, lineHeight: 48, textAlign: 'center', marginBottom: 16,
  },
  heroSubtitle: { fontSize: 12, color: '#A1A1AA', letterSpacing: 2, textAlign: 'center' },
  buttonSection: { width: '100%' },
});

export default WelcomeScreen;