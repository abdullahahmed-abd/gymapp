// src/screens/auth/ForgotPasswordScreen.js

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, StatusBar,
  TouchableOpacity, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleReset = () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setLoading(true);

    // TODO: API call to send reset link
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  // ===== SUCCESS STATE =====
  if (sent) {
    return (
      <LinearGradient colors={['#000000', '#0A0A0A', '#000000']} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Icon name="checkmark-circle" size={64} color="#22C55E" />
          </View>

          <Text style={styles.successTitle}>Email Sent!</Text>
          <Text style={styles.successSubtitle}>
            Password reset link bhej diya gaya hai{'\n'}
            <Text style={{ color: '#FFF', fontWeight: '600' }}>{email}</Text>
            {'\n\n'}Apna email check karein aur link se{'\n'}password reset karein.
          </Text>

          <TouchableOpacity
            style={styles.backToLoginBtn}
            onPress={() => navigation.navigate('AdminLogin')}
            activeOpacity={0.8}
          >
            <Icon name="arrow-back" size={18} color="#000" />
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendBtn}
            onPress={() => {
              setSent(false);
              setEmail('');
            }}
          >
            <Text style={styles.resendText}>Try different email</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // ===== FORM STATE =====
  return (
    <LinearGradient colors={['#000000', '#0A0A0A', '#000000']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Icon name="key-outline" size={32} color="#FFF" />
          </View>

          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Apna registered email enter karein,{'\n'}hum password reset link bhejenge
          </Text>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              placeholder="admin@yourgym.com"
              placeholderTextColor="#52525B"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>
        </View>

        {/* Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[styles.resetBtn, !validateEmail(email) && styles.resetBtnDisabled]}
            onPress={handleReset}
            disabled={!validateEmail(email) || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.resetBtnText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.loginLinkText}>
              Remember password? <Text style={{ color: '#FFF', fontWeight: '700' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 10 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Content
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20, alignItems: 'center' },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: '700', color: '#FFF', marginBottom: 10 },
  subtitle: {
    fontSize: 14, color: '#A1A1AA', lineHeight: 22,
    textAlign: 'center', marginBottom: 32,
  },
  label: {
    color: '#FFF', fontSize: 13, fontWeight: '600',
    alignSelf: 'flex-start', marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)', paddingHorizontal: 16, width: '100%',
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },

  // Bottom
  bottomSection: { paddingHorizontal: 24, paddingBottom: 40 },
  resetBtn: {
    height: 56, borderRadius: 16, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  resetBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.15)' },
  resetBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
  loginLink: { alignItems: 'center', marginTop: 16 },
  loginLinkText: { color: '#71717A', fontSize: 14 },

  // Success State
  successContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32,
  },
  successIcon: { marginBottom: 24 },
  successTitle: { fontSize: 28, fontWeight: '700', color: '#FFF', marginBottom: 12 },
  successSubtitle: {
    fontSize: 14, color: '#A1A1AA', lineHeight: 22,
    textAlign: 'center', marginBottom: 32,
  },
  backToLoginBtn: {
    height: 56, borderRadius: 16, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', width: '100%',
    flexDirection: 'row', gap: 8,
  },
  backToLoginText: { color: '#000', fontSize: 16, fontWeight: '700' },
  resendBtn: { marginTop: 16 },
  resendText: { color: '#71717A', fontSize: 13, textDecorationLine: 'underline' },
});

export default ForgotPasswordScreen;