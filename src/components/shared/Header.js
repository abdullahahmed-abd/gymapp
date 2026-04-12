import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const Header = ({ title = "GOS", showMenu = true, onMenuPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <View style={styles.logoInner} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {showMenu && (
        <TouchableOpacity onPress={onMenuPress}>
          <Icon name="menu" size={28} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    width: 24,
    height: 24,
    borderWidth: 1.5,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: 8,
    height: 8,
    backgroundColor: Colors.white,
  },
  title: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: 18,
    letterSpacing: 3.6,
    color: Colors.white,
    marginTop: 2,
  }
});

export default Header;