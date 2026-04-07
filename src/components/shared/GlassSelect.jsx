import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const GlassSelect = ({ label, value, onChange, options }) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={styles.picker}
          dropdownIconColor={Colors.zinc[400]}
          mode="dropdown"
        >
          {options.map((opt, i) => (
            <Picker.Item 
              key={i} 
              label={opt.label} 
              value={opt.value}
              color={Colors.white}
            />
          ))}
        </Picker>
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
  pickerWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    color: Colors.white,
    fontFamily: Fonts.montserrat.regular,
  },
});

export default GlassSelect;