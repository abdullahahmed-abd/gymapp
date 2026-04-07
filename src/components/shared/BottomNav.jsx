// src/components/admin/BottomNav.js (ya jo bhi path ho)
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Home01Icon,
  CreditCardIcon,
  User02Icon,
  UserMultipleIcon, // Ye icon use karo
} from '@hugeicons/core-free-icons';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', icon: Home01Icon, label: 'Home' },
    { id: 'membership', icon: CreditCardIcon, label: 'Plans' },
    { id: 'profile', icon: User02Icon, label: 'Profile' },
    { id: 'usersdetail', icon: UserMultipleIcon, label: 'Users' }, // ✅ Ye add karo
  ];

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.inner}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <HugeiconsIcon
                icon={tab.icon}
                size={moderateScale(19)}
                color={activeTab === tab.id ? Colors.white : Colors.zinc[600]}
                strokeWidth={activeTab === tab.id ? 2 : 1.5}
              />
              <Text
                style={[
                  styles.label,
                  activeTab === tab.id && styles.labelActive,
                ]}
              >
                {tab.label}
              </Text>
              {activeTab === tab.id && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.surfaceHeavy,
  },
  container: {
    backgroundColor: Colors.surfaceHeavy,
    paddingTop: verticalScale(9),
    paddingBottom: verticalScale(8),
    paddingHorizontal: scale(30),
    borderTopLeftRadius: moderateScale(4),
    borderTopRightRadius: moderateScale(4),
    borderWidth: scale(1),
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(6),
  },
  tab: {
    alignItems: 'center',
    gap: verticalScale(6),
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(1),
    position: 'relative',
  },
  label: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(6),
    textTransform: 'uppercase',
    letterSpacing: scale(1.8),
    color: Colors.zinc[600],
  },
  labelActive: {
    color: Colors.white,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: verticalScale(-2),
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: Colors.white,
  },
});

export default BottomNav;