// src/screens/auth/AdminLoginScreen.js

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, StatusBar,
  TouchableOpacity, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Mail01Icon,
  LockPasswordIcon,
  ViewIcon,
  ViewOffIcon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  Dumbbell01Icon,
} from '@hugeicons/core-free-icons';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const s = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const AdminLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isValid = validateEmail(email) && password.length >= 6;

  const handleLogin = () => {
    if (!isValid) {
      Alert.alert('Error', 'Please enter valid email and password');
      return;
    }

    setLoading(true);

    // TODO: Replace with actual API call
    setTimeout(() => {
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminDashboard' }],
      });
    }, 1500);
  };

  return (
    <LinearGradient colors={['#000000', '#0A0A0A', '#000000']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={ms(18)} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Icon */}
            <View style={styles.iconCircle}>
              <HugeiconsIcon icon={Dumbbell01Icon} size={ms(28)} color="#FFF" strokeWidth={2} />
            </View>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your admin account</Text>

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View
              style={[
                styles.inputContainer,
                emailFocused && styles.inputFocused,
                email.length > 0 && validateEmail(email) && styles.inputValid,
              ]}
            >
              <View style={styles.inputIconBox}>
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={ms(16)}
                  color={emailFocused ? '#C5A059' : '#52525B'}
                />
              </View>
              <TextInput
                placeholder="admin@yourgym.com"
                placeholderTextColor="#3F3F46"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                textContentType="none"
                importantForAutofill="no"
                style={styles.input}
                selectionColor="#C5A059"
                cursorColor="#C5A059"
              />
              {email.length > 0 && validateEmail(email) && (
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={ms(16)} color="#22C55E" />
              )}
            </View>

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputContainer,
                passFocused && styles.inputFocused,
              ]}
            >
              <View style={styles.inputIconBox}>
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  size={ms(16)}
                  color={passFocused ? '#C5A059' : '#52525B'}
                />
              </View>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#3F3F46"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
                secureTextEntry={!showPass}
                autoComplete="off"
                textContentType="none"
                importantForAutofill="no"
                style={styles.input}
                selectionColor="#C5A059"
                cursorColor="#C5A059"
              />
              <TouchableOpacity
                onPress={() => setShowPass(!showPass)}
                style={styles.eyeBtn}
                activeOpacity={0.7}
              >
                <HugeiconsIcon
                  icon={showPass ? ViewOffIcon : ViewIcon}
                  size={ms(16)}
                  color="#52525B"
                />
              </TouchableOpacity>
            </View>

            {/* Password strength hint */}
            {password.length > 0 && password.length < 6 && (
              <Text style={styles.hintText}>Minimum 6 characters required</Text>
            )}

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => navigation.navigate('ForgotPassword')}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Login Button */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={[styles.loginBtn, !isValid && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={!isValid || loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <>
                  <Text
                    style={[
                      styles.loginBtnText,
                      !isValid && styles.loginBtnTextDisabled,
                    ]}
                  >
                    Sign In
                  </Text>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={ms(16)}
                    color={isValid ? '#000' : '#52525B'}
                  />
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              Account create karne ke liye web app use karein
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: s(20),
    paddingTop: vs(10),
    paddingBottom: vs(10),
  },
  backBtn: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: s(24),
    paddingTop: vs(20),
    alignItems: 'center',
    flexGrow: 1,
  },
  iconCircle: {
    width: ms(72),
    height: ms(72),
    borderRadius: ms(36),
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(24),
  },
  title: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(20),
    color: '#FFF',
    marginBottom: vs(8),
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(10),
    color: '#71717A',
    marginBottom: vs(32),
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    color: '#A1A1AA',
    fontSize: rf(9),
    letterSpacing: 1,
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
    marginBottom: vs(8),
    marginTop: vs(16),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(56),
    borderRadius: ms(16),
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: s(14),
    width: '100%',
  },
  inputFocused: {
    borderColor: 'rgba(197,160,89,0.35)',
    backgroundColor: '#000000',
  },
  inputValid: {
    borderColor: 'rgba(34,197,94,0.25)',
  },
  inputIconBox: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(11),
    letterSpacing: 0.3,
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  eyeBtn: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7.5),
    color: '#EF4444',
    alignSelf: 'flex-start',
    marginTop: vs(6),
    letterSpacing: 0.3,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: vs(14),
    marginBottom: vs(20),
    paddingVertical: vs(4),
    paddingHorizontal: s(4),
  },
  forgotText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    color: '#C5A059',
    fontSize: rf(9),
    letterSpacing: 0.5,
  },
  bottomSection: {
    paddingHorizontal: s(24),
    paddingBottom: vs(24),
  },
  loginBtn: {
    height: ms(56),
    borderRadius: ms(16),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: s(8),
  },
  loginBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  loginBtnText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    color: '#000',
    fontSize: rf(10),
    letterSpacing: 1.5,
  },
  loginBtnTextDisabled: {
    color: '#52525B',
  },
  footerNote: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    textAlign: 'center',
    color: '#3F3F46',
    fontSize: rf(8),
    marginTop: vs(16),
    letterSpacing: 0.5,
  },
});

export default AdminLoginScreen;