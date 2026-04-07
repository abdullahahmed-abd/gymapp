import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/shared/Header';
import OTPInput from '../auth/OTPInput';
import GlassButton from '../../components/shared/GlassButton';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const LoginOTPScreen = ({ navigation }) => {
  const handleOTPComplete = (code) => {
    console.log('OTP Entered:', code);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={styles.background}
      blurRadius={10}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)', '#000000']}
        style={styles.gradient}
      >
        <Header showMenu={false} />
        
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>VERIFICATION</Text>
            <Text style={styles.subtitle}>
              Transmission sent.{'\n'}Enter the 6-digit code.
            </Text>

            <OTPInput length={6} onComplete={handleOTPComplete} />

            <Text style={styles.resendText}>Resend code in 0:45</Text>
          </View>

          <View style={styles.buttonContainer}>
            <GlassButton 
              variant="primary"
              onPress={() => navigation.navigate('LoginPassword')}
            >
              Verify Protocol
            </GlassButton>
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
    justifyContent: 'space-between',
  },
  content: {
    paddingTop: 40,
  },
  title: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: 24,
    color: Colors.white,
    letterSpacing: 4.8,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.montserrat.regular,
    fontSize: 10,
    color: Colors.zinc[400],
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 32,
    lineHeight: 18,
  },
  resendText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: 10,
    color: Colors.zinc[500],
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 24,
  },
  buttonContainer: {
    paddingBottom: 48,
  }
});

export default LoginOTPScreen;