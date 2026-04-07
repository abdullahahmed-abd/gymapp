// src/constants/Fonts.js
import { Platform } from 'react-native';

const Fonts = {
  orbitron: {
    regular: 'Orbitron-Regular',
    medium: 'Orbitron-Medium',
    semiBold: 'Orbitron-SemiBold',
    bold: 'Orbitron-Bold',
    extraBold: 'Orbitron-ExtraBold',
  },

  rajdhani: {
    light: Platform.OS === 'ios' ? 'System' : 'sans-serif-light',
    regular: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    medium: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    semiBold: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    bold: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },

  montserrat: {
    light: Platform.OS === 'ios' ? 'System' : 'sans-serif-light',
    regular: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    medium: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    semiBold: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
};

export default Fonts;