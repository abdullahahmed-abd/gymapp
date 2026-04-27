// src/components/shared/BottomNav.js
import React, { useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Home01Icon,
  CreditCardIcon,
  User02Icon,
  UserMultipleIcon,
  SettingsIcon,
} from '@hugeicons/core-free-icons';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

/**
 * BottomNav Component
 * @param {Object}   props
 * @param {string}   props.activeTab    - Currently active tab id
 * @param {function} props.onTabChange  - Callback when tab is pressed
 * @param {string}   [props.userType]   - Optional: 'admin' | 'member'
 */
const BottomNav = ({ activeTab, onTabChange, userType }) => {
  const route = useRoute();

  // ── Auto-detect user type from route name ──────────────────
  const isAdminScreen = useMemo(() => {
    if (userType) return userType === 'admin';
    return route.name?.startsWith('Admin') || false;
  }, [route.name, userType]);

  // ── Tab configurations ──────────────────────────────────────
  const adminTabs = useMemo(
    () => [
      { id: 'dashboard',  icon: Home01Icon,         label: 'Home'     },
      { id: 'plans',      icon: CreditCardIcon,      label: 'Plans'    },
      { id: 'members',    icon: UserMultipleIcon,    label: 'Members'  },
      { id: 'settings',   icon: SettingsIcon,        label: 'Settings' },
    ],
    []
  );

  const memberTabs = useMemo(
    () => [
      { id: 'home',       icon: Home01Icon,          label: 'Home'     },
      { id: 'membership', icon: CreditCardIcon,       label: 'Plans'   },
      { id: 'friends',    icon: UserMultipleIcon,     label: 'Friends' },
      { id: 'profile',    icon: User02Icon,           label: 'Profile' },
    ],
    []
  );

  const tabs = isAdminScreen ? adminTabs : memberTabs;

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top border glow */}
        <View style={styles.topGlow} />

        <View style={styles.inner}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tab}
                onPress={() => onTabChange(tab.id)}
                activeOpacity={0.7}
              >
                {/* Icon wrapper */}
                <View
                  style={[
                    styles.iconWrapper,
                    isActive && styles.iconWrapperActive,
                  ]}
                >
                  <HugeiconsIcon
                    icon={tab.icon}
                    size={moderateScale(19)}
                    color={isActive ? Colors.white : Colors.zinc[600]}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                </View>

                {/* Label */}
                {/* ✅ Fix #3 — semiBold (capital B) consistent with rest of app */}
                <Text style={[styles.label, isActive && styles.labelActive]}>
                  {tab.label}
                </Text>

                {/* Active indicator dot */}
                {isActive && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            );
          })}
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
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(8),
    paddingHorizontal: scale(20),
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
    borderWidth: scale(1),
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: scale(1),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: scale(8),
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(5),
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(8),
    position: 'relative',
    minWidth: scale(60),
  },
  iconWrapper: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    // ✅ Fix #7 — removed invalid `transition` CSS prop
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: scale(1),
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  label: {
    // ✅ Fix #3 — semiBold not semibold
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(8),
    textTransform: 'uppercase',
    letterSpacing: scale(1.2),
    color: Colors.zinc[600],
    textAlign: 'center',
  },
  labelActive: {
    color: Colors.white,
    fontFamily: Fonts.rajdhani.bold,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: verticalScale(0),
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: Colors.white,
    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default BottomNav;