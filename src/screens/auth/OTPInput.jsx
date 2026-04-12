import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const { width, height } = Dimensions.get('window');

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Agla box pe focus
    if (text && index < length - 1) {
      inputs.current[index + 1].focus();
    }

    // Sab fill ho gaye
    if (newOtp.every(digit => digit !== '')) {
      onComplete?.(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    // Backspace pe pichle box pe jao
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <View style={styles.container}>
        {Array(length).fill(0).map((_, index) => (
          <TextInput
            key={index}
            ref={ref => (inputs.current[index] = ref)}
            style={[
              styles.input,
              // Active box highlight
              otp[index]
                ? styles.inputFilled
                : styles.inputEmpty,
            ]}
            maxLength={1}
            keyboardType="number-pad"
            value={otp[index]}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            placeholder="0"
            placeholderTextColor={Colors.zinc[700]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ─────────────────────────────────────────
  // SAFE AREA
  // ─────────────────────────────────────────
  safeArea: {
    width: '100%',
  },

  // ─────────────────────────────────────────
  // CONTAINER
  // ─────────────────────────────────────────
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(8),
    width: '100%',
  },

  // ─────────────────────────────────────────
  // INPUT BOX
  // ─────────────────────────────────────────
  input: {
    flex: 1,
    height: verticalScale(52),
    borderWidth: scale(1),
    borderRadius: moderateScale(12),
    textAlign: 'center',
    color: Colors.white,
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(16),
  },

  // Empty State
  inputEmpty: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },

  // Filled State
  inputFilled: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
});

export default OTPInput;