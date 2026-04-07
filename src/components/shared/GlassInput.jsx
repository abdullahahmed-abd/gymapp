import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const GlassInput = ({ label, icon: Icon, ...props }) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={styles.inputWrapper}>
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon name={Icon.name} size={16} color={Colors.zinc[500]} />
          </View>
        )}
        <TextInput
          style={[styles.input, Icon && styles.inputWithIcon]}
          placeholderTextColor={Colors.zinc[600]}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: Colors.zinc[400],
    fontFamily: Fonts.rajdhani.regular,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.white,
    fontFamily: Fonts.montserrat.regular,
    fontSize: 14,
  },
  inputWithIcon: {
    paddingLeft: 40,
  },
  iconContainer: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: [{ translateY: -8 }],
    zIndex: 1,
  }
});

export default GlassInput;