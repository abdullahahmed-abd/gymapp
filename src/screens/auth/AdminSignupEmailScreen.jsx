// src/screens/auth/AdminSignupEmailScreen.js

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, StatusBar,
  TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const AdminSignupEmailScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter email address');
      return;
    }
    if (!validateEmail(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setLoading(true);

    // TODO: Yahan API call karke OTP bhejo email par
    // Abhi ke liye simulate kar rahe hain
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('AdminSignupOTP', { email: email.trim() });
    }, 1500);
  };

  return (
    <LinearGradient colors={['#000000', '#0A0A0A', '#000000']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.stepText}>STEP 1 OF 4</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>What's your email?</Text>
          <Text style={styles.subtitle}>
            We'll send a verification code to confirm your identity
          </Text>

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
            {email.length > 0 && validateEmail(email) && (
              <Icon name="checkmark-circle" size={20} color="#22C55E" />
            )}
          </View>
        </View>

        {/* Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[styles.continueBtn, !validateEmail(email) && styles.continueBtnDisabled]}
            onPress={handleSendOTP}
            disabled={!validateEmail(email) || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.continueBtnText}>Send Verification Code</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    paddingTop: 60, paddingBottom: 16,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center',
  },
  stepText: { color: '#71717A', fontSize: 11, letterSpacing: 2, marginLeft: 16 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFF', marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#A1A1AA', lineHeight: 22, marginBottom: 32 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)', paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  bottomSection: { paddingHorizontal: 24, paddingBottom: 40 },
  continueBtn: {
    height: 56, borderRadius: 16, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  continueBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.15)' },
  continueBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
});

export default AdminSignupEmailScreen;