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
  Calendar03Icon,
} from '@hugeicons/core-free-icons';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

/**
 * BottomNav Component
 * @param {Object}   props
 * @param {string}   props.activeTab    - Currently active tab id
 * @param {function} props.onTabChange  - Callback when tab is pressed
 * @param {string}   [props.userType]   - Optional: 'admin' | 'member' | 'trainer'
 */
const BottomNav = ({ activeTab, onTabChange, userType }) => {
  const route = useRoute();

  // ── Auto-detect user type from route name ──────────────────
  const detectedType = useMemo(() => {
    if (userType) return userType;
    if (route.name?.startsWith('Admin')) return 'admin';
    if (route.name?.startsWith('Trainer')) return 'trainer';
    return 'member';
  }, [route.name, userType]);

  // ── Tab configurations ──────────────────────────────────────
  const adminTabs = useMemo(
    () => [
      { id: 'dashboard', icon: Home01Icon,        label: 'Home'     },
      { id: 'plans',     icon: CreditCardIcon,    label: 'Plans'    },
      { id: 'members',   icon: UserMultipleIcon,  label: 'Members'  },
      { id: 'settings',  icon: SettingsIcon,      label: 'Settings' },
    ],
    []
  );

  const memberTabs = useMemo(
    () => [
      { id: 'home',       icon: Home01Icon,        label: 'Home'    },
      { id: 'membership', icon: CreditCardIcon,    label: 'Plans'   },
      { id: 'friends',    icon: UserMultipleIcon,  label: 'Friends' },
      { id: 'profile',    icon: User02Icon,        label: 'Profile' },
    ],
    []
  );

  // ✅ NEW: Trainer tabs - Attendance replaces Plans
  const trainerTabs = useMemo(
    () => [
      { id: 'home',       icon: Home01Icon,        label: 'Home'       },
      { id: 'attendance', icon: Calendar03Icon,     label: 'Attendance' },
      { id: 'friends',    icon: UserMultipleIcon,  label: 'Members'    },
      { id: 'profile',    icon: User02Icon,        label: 'Profile'    },
    ],
    []
  );

  const tabs =
    detectedType === 'admin'
      ? adminTabs
      : detectedType === 'trainer'
      ? trainerTabs
      : memberTabs;

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Gradient top border */}
        <View style={styles.topBorder} />

        <View style={styles.inner}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tab}
                onPress={() => onTabChange(tab.id)}
                activeOpacity={0.6}
              >
                {/* Icon */}
                <View
                  style={[
                    styles.iconContainer,
                    isActive && styles.iconContainerActive,
                  ]}
                >
                  <HugeiconsIcon
                    icon={tab.icon}
                    size={moderateScale(17)}
                    color={isActive ? Colors.white : Colors.zinc[500]}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {/* Subtle glow behind active icon */}
                  {isActive && <View style={styles.iconGlow} />}
                </View>

                {/* Label */}
                <Text
                  style={[
                    styles.label,
                    isActive && styles.labelActive,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
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
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: Colors.surfaceHeavy,
    paddingTop: 0,
    paddingBottom: verticalScale(4),
    paddingHorizontal: scale(12),
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    borderWidth: scale(1),
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
    overflow: 'hidden',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: scale(2),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: scale(4),
    paddingVertical: verticalScale(8),
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(6),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    flex: 1,
    maxWidth: scale(90),
  },
  iconContainer: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    position: 'relative',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: scale(1.5),
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  label: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(6),
    textTransform: 'uppercase',
    letterSpacing: scale(0.8),
    color: Colors.zinc[500],
    textAlign: 'center',
    marginTop: verticalScale(2),
  },
  labelActive: {
    color: Colors.white,
    fontFamily: Fonts.rajdhani.bold,
    letterSpacing: scale(1),
  },
});

export default BottomNav;