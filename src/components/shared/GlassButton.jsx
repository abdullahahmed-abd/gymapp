import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const GlassButton = ({ children, variant = 'primary', onPress, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.base, styles[variant], style]}
      onPress={onPress}
      activeOpacity={0.98}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2.4,
  },
  primary: {
    backgroundColor: Colors.zinc[100],
  },
  primaryText: {
    color: Colors.background,
  },
  glass: {
    backgroundColor: Colors.surface,
  },
  glassText: {
    color: Colors.white,
  },
  outline: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'transparent',
  },
  outlineText: {
    color: Colors.white,
  },
  gold: {
    backgroundColor: 'rgba(197, 160, 89, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
  },
  goldText: {
    color: Colors.gold,
  }
});

export default GlassButton;