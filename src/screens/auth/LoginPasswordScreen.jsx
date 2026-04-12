import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { EyeIcon, ViewOffSlashIcon } from '@hugeicons/core-free-icons';
import Header from '../../components/shared/Header';
import GlassInput from '../../components/shared/GlassInput';
import GlassButton from '../../components/shared/GlassButton';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const { width, height } = Dimensions.get('window');

const LoginPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ─────────────────────────────────────────
  // EYE TOGGLE STATES
  // ─────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInitialize = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'UserDashboard' }],
    });
  };

  // ─────────────────────────────────────────
  // EYE ICON COMPONENT
  // ─────────────────────────────────────────
  const EyeToggle = ({ visible, onToggle }) => (
    <TouchableOpacity
      onPress={onToggle}
      style={styles.eyeButton}
      activeOpacity={0.7}
      hitSlop={{
        top: moderateScale(10),
        bottom: moderateScale(10),
        left: moderateScale(10),
        right: moderateScale(10),
      }}
    >
      <HugeiconsIcon
        icon={visible ? EyeIcon : ViewOffSlashIcon}
        size={moderateScale(18)}
        color={visible ? Colors.white : Colors.zinc[500]}
        strokeWidth={1.5}
      />
    </TouchableOpacity>
  );

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

            <Text style={styles.title}>SECURITY</Text>
            <Text style={styles.subtitle}>Establish your access key</Text>

            <View style={styles.form}>

              {/* ── Password Input ── */}
              <View style={styles.inputWrapper}>
                <GlassInput
                  label="Access Key (Password)"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                {/* Eye Icon - Input ke upar absolute */}
                <EyeToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
              </View>

              {/* ── Confirm Password Input ── */}
              <View style={styles.inputWrapper}>
                <GlassInput
                  label="Confirm Access Key"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                {/* Eye Icon - Input ke upar absolute */}
                <EyeToggle
                  visible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </View>

            </View>

            {/* ── Password Match Indicator ── */}
            {confirmPassword.length > 0 && (
              <View style={styles.matchIndicator}>
                <View style={[
                  styles.matchDot,
                  {
                    backgroundColor:
                      password === confirmPassword
                        ? '#22C55E'
                        : '#EF4444',
                  },
                ]} />
                <Text style={[
                  styles.matchText,
                  {
                    color:
                      password === confirmPassword
                        ? '#22C55E'
                        : '#EF4444',
                  },
                ]}>
                  {password === confirmPassword
                    ? 'Keys Match'
                    : 'Keys Do Not Match'}
                </Text>
              </View>
            )}

          </View>

          <View style={styles.buttonContainer}>
            <GlassButton
              variant="primary"
              onPress={handleInitialize}
            >
              Initialize Account
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
    marginBottom: verticalScale(40),
  },

  // ─────────────────────────────────────────
  // FORM
  // ─────────────────────────────────────────
  form: {
    gap: verticalScale(8),
  },

  // ─────────────────────────────────────────
  // INPUT WRAPPER (Eye Icon ke liye)
  // ─────────────────────────────────────────
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: scale(14),
    bottom: verticalScale(14),   // GlassInput ki height ke hisaab se adjust karo
    zIndex: 10,
    width: moderateScale(30),
    height: moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─────────────────────────────────────────
  // PASSWORD MATCH INDICATOR
  // ─────────────────────────────────────────
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginTop: verticalScale(10),
    paddingHorizontal: scale(4),
  },
  matchDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(3),
  },
  matchText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(7.5),
    letterSpacing: scale(1.2),
    textTransform: 'uppercase',
  },

  // ─────────────────────────────────────────
  // BUTTON
  // ─────────────────────────────────────────
  buttonContainer: {
    paddingBottom: verticalScale(48),
  },
});

export default LoginPasswordScreen;