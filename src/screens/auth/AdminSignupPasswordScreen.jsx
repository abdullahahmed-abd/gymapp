// src/screens/auth/AdminSignupPasswordScreen.js

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, StatusBar,
  TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const AdminSignupPasswordScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const allValid = hasMinLength && hasUppercase && hasNumber && passwordsMatch;

  const PasswordRule = ({ met, label }) => (
    <View style={styles.ruleRow}>
      <Icon
        name={met ? 'checkmark-circle' : 'ellipse-outline'}
        size={16}
        color={met ? '#22C55E' : '#52525B'}
      />
      <Text style={[styles.ruleText, met && styles.ruleTextMet]}>{label}</Text>
    </View>
  );

  const handleContinue = () => {
    if (!allValid) {
      Alert.alert('Error', 'Please fill all requirements');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('AdminSignupProfile', { email, password });
    }, 1000);
  };

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
          <Text style={styles.stepText}>STEP 3 OF 4</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Create Password</Text>
          <Text style={styles.subtitle}>Set a strong password for your admin account</Text>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color="#8E8E93" style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Enter password"
              placeholderTextColor="#52525B"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Icon name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color="#8E8E93" style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Confirm password"
              placeholderTextColor="#52525B"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Icon name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Rules */}
          <View style={styles.rulesBox}>
            <PasswordRule met={hasMinLength} label="At least 8 characters" />
            <PasswordRule met={hasUppercase} label="One uppercase letter" />
            <PasswordRule met={hasNumber} label="One number" />
            <PasswordRule met={passwordsMatch} label="Passwords match" />
          </View>
        </View>

        {/* Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[styles.continueBtn, !allValid && styles.continueBtnDisabled]}
            onPress={handleContinue}
            disabled={!allValid || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.continueBtnText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 30 },
  title: { fontSize: 26, fontWeight: '700', color: '#FFF', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#A1A1AA', marginBottom: 28 },
  label: { color: '#FFF', fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)', paddingHorizontal: 16,
  },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  rulesBox: {
    marginTop: 20, padding: 16, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  ruleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ruleText: { color: '#71717A', fontSize: 13, marginLeft: 8 },
  ruleTextMet: { color: '#22C55E' },
  bottomSection: { paddingHorizontal: 24, paddingBottom: 40 },
  continueBtn: {
    height: 56, borderRadius: 16, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  continueBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.15)' },
  continueBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
});

export default AdminSignupPasswordScreen;