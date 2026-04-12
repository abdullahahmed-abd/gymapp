import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Header from '../../components/shared/Header';
import GlassInput from '../../components/shared/GlassInput';
import GlassButton from '../../components/shared/GlassButton';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const { width, height } = Dimensions.get('window');

const LoginStep1Screen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

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

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>

            <Text style={styles.title}>INITIALIZE</Text>
            <Text style={styles.subtitle}>
              Enter your credentials to proceed
            </Text>

            <View style={styles.form}>
              <GlassInput
                label="Full Name"
                placeholder="e.g. John Doe"
                value={name}
                onChangeText={setName}
              />
              <GlassInput
                label="Email Address"
                placeholder="john@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <GlassInput
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <GlassButton
            variant="primary"
            onPress={() => navigation.navigate('LoginOTP')}
          >
            Continue →
          </GlassButton>
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
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
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
    marginBottom: verticalScale(40),
  },

  // ─────────────────────────────────────────
  // FORM
  // ─────────────────────────────────────────
  form: {
    gap: verticalScale(8),
  },

  // ─────────────────────────────────────────
  // BUTTON
  // ─────────────────────────────────────────
  buttonContainer: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(48),
    paddingTop: verticalScale(12),
  },
});

export default LoginStep1Screen;