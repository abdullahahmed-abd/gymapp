// src/screens/auth/AdminSignupOTPScreen.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, StatusBar,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const OTP_LENGTH = 6;

const AdminSignupOTPScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];

    if (text.length > 1) {
      // Paste handling
      const chars = text.split('').slice(0, OTP_LENGTH);
      chars.forEach((c, i) => {
        if (i + index < OTP_LENGTH) newOtp[i + index] = c;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(index + chars.length, OTP_LENGTH - 1);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const otpString = otp.join('');

  const handleVerify = () => {
    if (otpString.length < OTP_LENGTH) {
      Alert.alert('Error', 'Please enter complete OTP');
      return;
    }

    setLoading(true);

    // TODO: API se OTP verify karo
    // Abhi simulate kar rahe hain
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('AdminSignupPassword', { email });
    }, 1500);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(60);
    setOtp(Array(OTP_LENGTH).fill(''));
    // TODO: API call to resend OTP
    Alert.alert('Success', 'New OTP sent to ' + email);
  };

  return (
    <LinearGradient colors={['#000000', '#0A0A0A', '#000000']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.stepText}>STEP 2 OF 4</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon name="shield-checkmark-outline" size={32} color="#FFF" />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We sent a {OTP_LENGTH}-digit code to{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        {/* OTP Inputs */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={index === 0 ? OTP_LENGTH : 1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Resend */}
        <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
          <Text style={styles.resendText}>
            {timer > 0
              ? `Resend code in ${timer}s`
              : 'Resend Code'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.verifyBtn, otpString.length < OTP_LENGTH && styles.verifyBtnDisabled]}
          onPress={handleVerify}
          disabled={otpString.length < OTP_LENGTH || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.verifyBtnText}>Verify & Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    paddingTop: 60, paddingBottom: 16,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center',
  },
  stepText: { color: '#71717A', fontSize: 11, letterSpacing: 2, marginLeft: 16 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 30, alignItems: 'center' },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center',
    justifyContent: 'center', marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: '700', color: '#FFF', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#A1A1AA', lineHeight: 22, textAlign: 'center', marginBottom: 32 },
  emailText: { color: '#FFF', fontWeight: '600' },
  otpRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 24,
  },
  otpBox: {
    width: 48, height: 56, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)', textAlign: 'center',
    color: '#FFF', fontSize: 22, fontWeight: '700',
  },
  otpBoxFilled: {
    borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.12)',
  },
  resendText: { color: '#71717A', fontSize: 13, textDecorationLine: 'underline' },
  bottomSection: { paddingHorizontal: 24, paddingBottom: 40 },
  verifyBtn: {
    height: 56, borderRadius: 16, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  verifyBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.15)' },
  verifyBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
});

export default AdminSignupOTPScreen;