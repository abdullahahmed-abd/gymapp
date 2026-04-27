// AdminSettingsScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Header from '../../components/shared/Header';
import GlassCard from '../../components/shared/GlassCard';
import GlassButton from '../../components/shared/GlassButton';
import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import gymlogoimg from "../user/gymlogoimg.png";

const AdminSettingsScreen = ({ navigation }) => {
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Logout',
          onPress: () => {
            navigation.navigate('Login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={styles.background}
      blurRadius={9}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.92)', '#000000']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['']}>
          <Header />

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeLabel}>Administrator</Text>
              <Text style={styles.welcomeName}>SETTINGS</Text>
            </View>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ADMIN PROFILE CARD */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <LinearGradient
              colors={['rgba(113, 113, 122, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000']}
              style={styles.statsGradient}
            >
              <GlassCard style={styles.profileCard}>
                <View style={styles.profileHeader}>
                  <View style={styles.profileAvatarContainer}>
                    <View style={styles.profileAvatar}>
                      <Text style={styles.avatarInitial}>AM</Text>
                    </View>
                    <View style={styles.profileStatus}>
                      <View style={styles.onlineBadge} />
                    </View>
                  </View>

                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>Admin Manager</Text>
                    <Text style={styles.profileEmail}>admin@fitzone.com</Text>
                    <View style={styles.profileBadges}>
                      <View style={styles.badgeAdmin}>
                        <Text style={styles.badgeText}>🛡️ Administrator</Text>
                      </View>
                      <View style={styles.badgeActive}>
                        <View style={styles.activeDot} />
                        <Text style={styles.badgeText}>Active</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.profileLogo}>
                    <Image
                      source={gymlogoimg}
                      style={styles.profileLogoImg}
                      resizeMode="contain"
                    />
                  </View>
                </View>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.editProfileButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editProfileButtonIcon}>👤</Text>
                  <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                  <Text style={styles.editProfileButtonArrow}>→</Text>
                </TouchableOpacity>
              </GlassCard>
            </LinearGradient>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ACCOUNT SECTION */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Settings</Text>

              {/* Contact Information */}
              <GlassCard style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <View style={styles.settingIconWrapper}>
                    <Text style={styles.iconText}>🏢</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>Gym Information</Text>
                    <Text style={styles.settingDescription}>
                      FitZone Premium Gym
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </GlassCard>

              {/* Email Setting */}
              <GlassCard style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <View style={styles.settingIconWrapper}>
                    <Text style={styles.iconText}>✉️</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>Email Address</Text>
                    <Text style={styles.settingDescription}>
                      admin@fitzone.com
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </GlassCard>

              {/* Phone Setting */}
              <GlassCard style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <View style={styles.settingIconWrapper}>
                    <Text style={styles.iconText}>📱</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>Phone Number</Text>
                    <Text style={styles.settingDescription}>
                      +91 9876543210
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </GlassCard>
            </View>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SECURITY SECTION */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Security & Privacy</Text>

              {/* Change Password */}
              <GlassCard style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <View style={styles.settingIconWrapper}>
                    <Text style={styles.iconText}>🔒</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>Change Password</Text>
                    <Text style={styles.settingDescription}>
                      Update your password regularly
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </GlassCard>

              {/* Two Factor Authentication */}
              <GlassCard style={styles.settingCardWithToggle}>
                <View style={styles.settingHeaderWithToggle}>
                  <View style={styles.settingHeaderLeft}>
                    <View style={styles.settingIconWrapper}>
                      <Text style={styles.iconText}>🛡️</Text>
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>
                        Two-Factor Authentication
                      </Text>
                      <Text style={styles.settingDescription}>
                        Add extra security to your account
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={enableTwoFactor}
                    onValueChange={setEnableTwoFactor}
                    trackColor={{ false: '#39404B', true: 'rgba(76, 222, 128, 0.3)' }}
                    thumbColor={enableTwoFactor ? '#22C55E' : '#71717A'}
                  />
                </View>
              </GlassCard>

              {/* Session Management */}
              <GlassCard style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <View style={styles.settingIconWrapper}>
                    <Text style={styles.iconText}>☁️</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>Active Sessions</Text>
                    <Text style={styles.settingDescription}>
                      1 device currently logged in
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </GlassCard>
            </View>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* NOTIFICATIONS SECTION */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notifications</Text>

              {/* Push Notifications */}
              <GlassCard style={styles.settingCardWithToggle}>
                <View style={styles.settingHeaderWithToggle}>
                  <View style={styles.settingHeaderLeft}>
                    <View style={styles.settingIconWrapper}>
                      <Text style={styles.iconText}>🔔</Text>
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>Push Notifications</Text>
                      <Text style={styles.settingDescription}>
                        Receive alerts and updates
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={enableNotifications}
                    onValueChange={setEnableNotifications}
                    trackColor={{ false: '#39404B', true: 'rgba(234, 179, 8, 0.3)' }}
                    thumbColor={enableNotifications ? Colors.gold : '#71717A'}
                  />
                </View>
              </GlassCard>

              {/* Email Notifications */}
              <GlassCard style={styles.settingCardWithToggle}>
                <View style={styles.settingHeaderWithToggle}>
                  <View style={styles.settingHeaderLeft}>
                    <View style={styles.settingIconWrapper}>
                      <Text style={styles.iconText}>💌</Text>
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>Email Notifications</Text>
                      <Text style={styles.settingDescription}>
                        Receive updates via email
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={true}
                    onValueChange={() => {}}
                    trackColor={{ false: '#39404B', true: 'rgba(245, 158, 11, 0.3)' }}
                    thumbColor={'#F59E0B'}
                  />
                </View>
              </GlassCard>

              {/* SMS Alerts */}
              <GlassCard style={styles.settingCardWithToggle}>
                <View style={styles.settingHeaderWithToggle}>
                  <View style={styles.settingHeaderLeft}>
                    <View style={styles.settingIconWrapper}>
                      <Text style={styles.iconText}>💬</Text>
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>SMS Alerts</Text>
                      <Text style={styles.settingDescription}>
                        Critical alerts via SMS
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={false}
                    onValueChange={() => {}}
                    trackColor={{ false: '#39404B', true: 'rgba(6, 182, 212, 0.3)' }}
                    thumbColor={'#06B6D4'}
                  />
                </View>
              </GlassCard>
            </View>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* PREFERENCES SECTION */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>

              {/* Dark Mode */}
              <GlassCard style={styles.settingCardWithToggle}>
                <View style={styles.settingHeaderWithToggle}>
                  <View style={styles.settingHeaderLeft}>
                    <View style={styles.settingIconWrapper}>
                      <Text style={styles.iconText}>🌙</Text>
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>Dark Mode</Text>
                      <Text style={styles.settingDescription}>
                        Always enabled
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: '#39404B', true: 'rgba(167, 139, 250, 0.3)' }}
                    thumbColor={darkMode ? '#A78BFA' : '#71717A'}
                  />
                </View>
              </GlassCard>

              {/* Auto Backup */}
              <GlassCard style={styles.settingCardWithToggle}>
                <View style={styles.settingHeaderWithToggle}>
                  <View style={styles.settingHeaderLeft}>
                    <View style={styles.settingIconWrapper}>
                      <Text style={styles.iconText}>💾</Text>
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>Auto Backup</Text>
                      <Text style={styles.settingDescription}>
                        Daily backup at 2:00 AM
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={autoBackup}
                    onValueChange={setAutoBackup}
                    trackColor={{ false: '#39404B', true: 'rgba(16, 185, 129, 0.3)' }}
                    thumbColor={autoBackup ? '#10B981' : '#71717A'}
                  />
                </View>
              </GlassCard>
            </View>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* BILLING SECTION */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Billing & Plan</Text>

              <GlassCard style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <View style={styles.settingIconWrapper}>
                    <Text style={styles.iconText}>💳</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>Current Plan</Text>
                    <Text style={styles.settingDescription}>
                      Premium - Annual Plan
                    </Text>
                  </View>
                  <View style={styles.planBadge}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                </View>
              </GlassCard>

              <GlassCard style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>Payment Methods</Text>
                    <Text style={styles.settingDescription}>
                      Visa ending in 4242
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </GlassCard>
            </View>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* HELP & SUPPORT SECTION */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Help & Support</Text>

              <GlassCard style={styles.settingCard}>
                <TouchableOpacity
                  style={styles.settingHeader}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingIconWrapper}>
                    <Text style={styles.iconText}>❓</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>Help Center</Text>
                    <Text style={styles.settingDescription}>
                      FAQs and documentation
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </TouchableOpacity>
              </GlassCard>

              <GlassCard style={styles.settingCard}>
                <TouchableOpacity
                  style={styles.settingHeader}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingIconWrapper}>
                    <Text style={styles.iconText}>📧</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>Contact Support</Text>
                    <Text style={styles.settingDescription}>
                      Get in touch with our team
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </TouchableOpacity>
              </GlassCard>
            </View>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* DANGER ZONE */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, styles.dangerTitle]}>
                Danger Zone
              </Text>

              <GlassCard style={[styles.settingCard, styles.dangerCard]}>
                <TouchableOpacity
                  style={styles.settingHeader}
                  activeOpacity={0.7}
                  onPress={handleLogout}
                >
                  <View
                    style={[
                      styles.settingIconWrapper,
                      styles.dangerIconWrapper,
                    ]}
                  >
                    <Text style={styles.dangerIconText}>🚪</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, styles.dangerText]}>
                      Logout
                    </Text>
                    <Text style={styles.settingDescription}>
                      Sign out from your account
                    </Text>
                  </View>
                  <Text style={[styles.arrowIcon, styles.dangerArrow]}>→</Text>
                </TouchableOpacity>
              </GlassCard>

              <GlassCard style={[styles.settingCard, styles.dangerCard]}>
                <TouchableOpacity
                  style={styles.settingHeader}
                  activeOpacity={0.7}
                  onPress={handleDeleteAccount}
                >
                  <View
                    style={[
                      styles.settingIconWrapper,
                      styles.dangerIconWrapper,
                    ]}
                  >
                    <Text style={styles.dangerIconText}>⚠️</Text>
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, styles.dangerText]}>
                      Delete Account
                    </Text>
                    <Text style={styles.settingDescription}>
                      Permanently delete your account
                    </Text>
                  </View>
                  <Text style={[styles.arrowIcon, styles.dangerArrow]}>→</Text>
                </TouchableOpacity>
              </GlassCard>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>App Version 1.0.0</Text>
              <Text style={styles.footerSubText}>Last updated: Nov 2024</Text>
            </View>
          </ScrollView>

         <BottomNav
  activeTab="settings"
  onTabChange={(tab) => {
    if (tab === 'dashboard') navigation.navigate('AdminDashboard');
    if (tab === 'plans') navigation.navigate('AdminAddPlan');
    if (tab === 'members') navigation.navigate('AdminUsersDetail');
    if (tab === 'settings') navigation.navigate('AdminSettings');
  }}
  // NO userType needed - auto-detects from route name 'AdminDashboard'
/>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    gap: verticalScale(16),
    paddingBottom: verticalScale(100),
  },

  // Welcome Section
  welcomeSection: {
    marginBottom: verticalScale(0),
  },
  welcomeLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[400],
    letterSpacing: scale(2),
    textTransform: 'uppercase',
    marginBottom: verticalScale(4),
    fontWeight: '600',
  },
  welcomeName: {
    fontFamily: Fonts.orbitron.extraBold,
    fontSize: RFValue(18),
    color: Colors.white,
    letterSpacing: scale(3.6),
  },

  // ═══════════════════════════════════════════════════════════════
  // PROFILE CARD
  // ═══════════════════════════════════════════════════════════════
  statsGradient: {
    borderRadius: moderateScale(16),
    padding: scale(1),
  },
  profileCard: {
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  profileHeader: {
    flexDirection: 'row',
    gap: scale(12),
    marginBottom: verticalScale(16),
    position: 'relative',
  },
  profileAvatarContainer: {
    position: 'relative',
  },
  profileAvatar: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  avatarInitial: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(14),
    color: Colors.gold,
  },
  profileStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  onlineBadge: {
    width: moderateScale(14),
    height: moderateScale(14),
    borderRadius: moderateScale(7),
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#000000',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(14),
    color: Colors.white,
    marginBottom: verticalScale(2),
  },
  profileEmail: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[500],
    marginBottom: verticalScale(6),
  },
  profileBadges: {
    flexDirection: 'row',
    gap: scale(6),
  },
  badgeAdmin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  badgeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  badgeText: {
    fontFamily: Fonts.rajdhani.bold,
    fontSize: RFValue(7),
    color: Colors.zinc[300],
  },
  activeDot: {
    width: moderateScale(4),
    height: moderateScale(4),
    borderRadius: moderateScale(2),
    backgroundColor: '#22C55E',
  },
  profileLogo: {
    position: 'absolute',
    top: verticalScale(-20),
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileLogoImg: {
    width: moderateScale(100),
    height: moderateScale(100),
    opacity: 0.25,
  },
  divider: {
    height: verticalScale(1),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: verticalScale(12),
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(8),
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.2)',
  },
  editProfileButtonIcon: {
    fontSize: RFValue(14),
  },
  editProfileButtonText: {
    flex: 1,
    fontFamily: Fonts.rajdhani.bold,
    fontSize: RFValue(9),
    color: Colors.white,
    marginLeft: scale(8),
    textTransform: 'uppercase',
    letterSpacing: scale(1),
  },
  editProfileButtonArrow: {
    fontSize: RFValue(12),
    color: 'rgba(255,255,255,0.5)',
  },

  // ═══════════════════════════════════════════════════════════════
  // SETTINGS CARD
  // ═══════════════════════════════════════════════════════════════
  section: {
    gap: verticalScale(12),
  },
  sectionTitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.white,
    letterSpacing: scale(2),
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  dangerTitle: {
    color: '#EF4444',
  },
  settingCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dangerCard: {
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  settingCardWithToggle: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  settingHeaderWithToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    flex: 1,
  },
  settingIconWrapper: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerIconWrapper: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  iconText: {
    fontSize: RFValue(18),
  },
  dangerIconText: {
    fontSize: RFValue(18),
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: Fonts.rajdhani.bold,
    fontSize: RFValue(10),
    color: Colors.white,
    marginBottom: verticalScale(2),
  },
  dangerText: {
    color: '#EF4444',
  },
  settingDescription: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[500],
  },
  arrowIcon: {
    fontSize: RFValue(14),
    color: 'rgba(255,255,255,0.4)',
  },
  dangerArrow: {
    color: 'rgba(239, 68, 68, 0.6)',
  },
  planBadge: {
    marginLeft: scale(12),
  },
  checkmark: {
    fontSize: RFValue(16),
    color: Colors.green,
  },

  // Footer
  footer: {
    alignItems: 'center',
    gap: verticalScale(4),
    paddingVertical: verticalScale(20),
  },
  footerText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[500],
    letterSpacing: scale(1),
  },
  footerSubText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(7),
    color: Colors.zinc[700],
    letterSpacing: scale(0.5),
  },
});

export default AdminSettingsScreen;