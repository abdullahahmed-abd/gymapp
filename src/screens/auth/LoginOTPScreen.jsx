import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Header from '../../components/shared/Header';
import OTPInput from '../auth/OTPInput';
import GlassButton from '../../components/shared/GlassButton';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const { width, height } = Dimensions.get('window');

const LoginOTPScreen = ({ navigation }) => {
  const handleOTPComplete = (code) => {
    console.log('OTP Entered:', code);
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      }}
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
  // ─────────────────────────────────────────
  // BACKGROUND & GRADIENT
  // ─────────────────────────────────────────
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
  },

  // ─────────────────────────────────────────
  // LAYOUT
  // ─────────────────────────────────────────
  container: {
    flex: 1,
    paddingHorizontal: scale(24),
    justifyContent: 'space-between',
  },
  content: {
    paddingTop: verticalScale(40),
  },

  // ─────────────────────────────────────────
  // TEXT
  // ─────────────────────────────────────────
  title: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(20),
    color: Colors.white,
    letterSpacing: scale(4),
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontFamily: Fonts.montserrat.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[400],
    letterSpacing: scale(1.8),
    textTransform: 'uppercase',
    marginBottom: verticalScale(32),
    lineHeight: RFValue(16),
  },
  resendText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[500],
    letterSpacing: scale(1.8),
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: verticalScale(24),
  },

  // ─────────────────────────────────────────
  // BUTTON
  // ─────────────────────────────────────────
  buttonContainer: {
    paddingBottom: verticalScale(48),
  },
});

export default LoginOTPScreen;