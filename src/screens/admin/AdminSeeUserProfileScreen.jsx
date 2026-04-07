import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  scale,
  moderateScale,
  verticalScale,
} from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Call02Icon,
  WhatsappIcon,
  SmartPhone01Icon,
  Clock01Icon,
  Login01Icon,
  Logout01Icon,
  Calendar03Icon,
  Dumbbell01Icon,
  Running01Icon,
  HeartRateIcon,
  UserIcon,
  Edit02Icon,
  Delete02Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Mail01Icon,
} from '@hugeicons/core-free-icons';

import Header from '../../components/shared/Header';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

// Responsive helpers - reduced scaling
const s = (size) => scale(size * 0.9);
const ms = (size) => moderateScale(size * 0.85, 0.2);
const vs = (size) => verticalScale(size * 0.85);
const rf = (size) => RFValue(size);

// Platform specific blur
const getBlurConfig = () => ({
  blurType: Platform.select({
    ios: 'ultraThinMaterialDark',
    android: 'dark',
  }),
  blurAmount: Platform.select({
    ios: 20,
    android: 10,
  }),
});

// ═══════════════════════════════════════════════════════════════
// TIER CONFIG
// ═══════════════════════════════════════════════════════════════
const getTierConfig = (tier) => {
  switch (tier) {
    case 'ELITE TIER':
      return {
        color: '#F59E0B',
        lightColor: '#FCD34D',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
      };
    case 'VIP TIER':
      return {
        color: '#A855F7',
        lightColor: '#C084FC',
        bgColor: 'rgba(168, 85, 247, 0.1)',
        borderColor: 'rgba(168, 85, 247, 0.3)',
      };
    case 'PRO TIER':
      return {
        color: '#3B82F6',
        lightColor: '#60A5FA',
        bgColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
      };
    case 'BASIC TIER':
      return {
        color: '#71717A',
        lightColor: '#A1A1AA',
        bgColor: 'rgba(113, 113, 122, 0.1)',
        borderColor: 'rgba(113, 113, 122, 0.3)',
      };
    default:
      return {
        color: '#FFFFFF',
        lightColor: '#E4E4E7',
        bgColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
      };
  }
};

// ═══════════════════════════════════════════════════════════════
// MEMBERSHIP METHOD CONFIG
// ═══════════════════════════════════════════════════════════════
const getMembershipMethodConfig = (method) => {
  switch (method) {
    case 'WEIGHT_LIFTING':
      return {
        label: 'Weight Lifting',
        icon: Dumbbell01Icon,
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.1)',
      };
    case 'CARDIO':
      return {
        label: 'Cardio',
        icon: Running01Icon,
        color: '#22C55E',
        bgColor: 'rgba(34, 197, 94, 0.1)',
      };
    case 'BOTH':
      return {
        label: 'Weights + Cardio',
        icon: HeartRateIcon,
        color: '#A855F7',
        bgColor: 'rgba(168, 85, 247, 0.1)',
      };
    default:
      return {
        label: 'Not Specified',
        icon: Dumbbell01Icon,
        color: '#71717A',
        bgColor: 'rgba(113, 113, 122, 0.1)',
      };
  }
};

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminSeeUserProfileScreen = ({ navigation, route }) => {
  const blurConfig = getBlurConfig();
  
  // Get member data from route params or use dummy data
  const member = route?.params?.member || {
    id: '1',
    name: 'Abdullah Ahmed',
    avatar: 'AA',
    phone: '+918817159218',
    membershipType: 'ELITE TIER',
    membershipMethod: 'BOTH',
    joinDate: '15 Jan 2024',
    expiryDate: '15 Jan 2025',
    isActive: true,
    lastCheckin: '6:30 AM',
    lastCheckout: '8:15 AM',
    lastVisitDate: 'Today',
    totalVisits: 156,
    currentStreak: 12,
    email: 'abdullah@example.com',
    address: 'Mumbai, Maharashtra',
    emergencyContact: '+919876543210',
  };

  const tierConfig = getTierConfig(member.membershipType);
  const methodConfig = getMembershipMethodConfig(member.membershipMethod);

  const handleGoBack = () => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    } else if (navigation) {
      navigation.navigate('AdminLiveRoster');
    }
  };

  const handleCall = () => {
    const phoneNumber = member.phone.replace(/\D/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = () => {
    const phoneNumber = member.phone.replace(/\D/g, '');
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
  };

  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      }}
      style={styles.background}
      blurRadius={Platform.OS === 'ios' ? 8 : 12}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.92)', '#000000']}
        style={styles.gradient}
      >
        <Header title="MEMBER PROFILE" showMenu={false} />

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <View style={styles.backIconContainer}>
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={ms(16)}
                color="rgba(255,255,255,0.6)"
              />
            </View>
            <Text style={styles.backText}>Back to Roster</Text>
          </TouchableOpacity>

          {/* Profile Hero Card */}
          <View style={styles.heroCard}>
            {Platform.OS === 'ios' ? (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType={blurConfig.blurType}
                blurAmount={blurConfig.blurAmount}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidBlurFallback]} />
            )}
            
            {/* Tier Glow */}
            <LinearGradient
              colors={[`${tierConfig.color}25`, 'transparent']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.heroGlow}
            />

            <View style={styles.heroContent}>
              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                <View style={[styles.avatarOuter, { borderColor: tierConfig.color }]}>
                  <LinearGradient
                    colors={[tierConfig.color, tierConfig.lightColor]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>{member.avatar}</Text>
                  </LinearGradient>
                </View>
              </View>

              {/* Name */}
              <Text style={styles.memberName}>{member.name}</Text>
              
              {/* Status Badge - Below Name */}
              <View style={[
                styles.statusBadge,
                member.isActive ? styles.statusActive : styles.statusInactive
              ]}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: member.isActive ? '#22C55E' : '#EF4444' }
                ]} />
                <Text style={[
                  styles.statusText,
                  { color: member.isActive ? '#22C55E' : '#EF4444' }
                ]}>
                  {member.isActive ? 'ACTIVE' : 'INACTIVE'}
                </Text>
              </View>

              {/* Tier Badge */}
              <View style={[styles.tierBadge, { backgroundColor: tierConfig.bgColor, borderColor: tierConfig.borderColor }]}>
                <View style={[styles.tierDot, { backgroundColor: tierConfig.color }]} />
                <Text style={[styles.tierText, { color: tierConfig.color }]}>
                  {member.membershipType}
                </Text>
              </View>

              {/* Quick Actions */}
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={styles.quickActionBtn}
                  onPress={handleCall}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(34, 197, 94, 0.2)', 'rgba(34, 197, 94, 0.08)']}
                    style={styles.quickActionGradient}
                  >
                    <HugeiconsIcon icon={Call02Icon} size={ms(18)} color="#22C55E" />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionBtn}
                  onPress={handleWhatsApp}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(37, 211, 102, 0.2)', 'rgba(37, 211, 102, 0.08)']}
                    style={styles.quickActionGradient}
                  >
                    <HugeiconsIcon icon={WhatsappIcon} size={ms(18)} color="#25D366" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Contact Info Card */}
          <View style={styles.infoCard}>
            {Platform.OS === 'ios' ? (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType={blurConfig.blurType}
                blurAmount={blurConfig.blurAmount}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidBlurFallback]} />
            )}
            
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>CONTACT INFO</Text>
              
              {/* Phone */}
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <HugeiconsIcon icon={SmartPhone01Icon} size={ms(14)} color="#22C55E" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{formatPhone(member.phone)}</Text>
                </View>
              </View>

              {/* Email */}
              {member.email && (
                <View style={[styles.infoRow, { marginBottom: 0 }]}>
                  <View style={styles.infoIconBox}>
                    <HugeiconsIcon icon={Mail01Icon} size={ms(14)} color="#3B82F6" />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{member.email}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Last Activity Card */}
          <View style={styles.infoCard}>
            {Platform.OS === 'ios' ? (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType={blurConfig.blurType}
                blurAmount={blurConfig.blurAmount}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidBlurFallback]} />
            )}
            
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>LAST ACTIVITY</Text>
              
              <View style={styles.activityGrid}>
                {/* Last Check-in */}
                <View style={styles.activityItem}>
                  <View style={[styles.activityIconBox, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                    <HugeiconsIcon icon={Login01Icon} size={ms(16)} color="#22C55E" />
                  </View>
                  <View style={styles.activityTextBox}>
                    <Text style={styles.activityLabel}>Check-in</Text>
                    <Text style={styles.activityValue}>{member.lastCheckin}</Text>
                    <Text style={styles.activityDate}>{member.lastVisitDate}</Text>
                  </View>
                </View>

                {/* Last Check-out */}
                <View style={styles.activityItem}>
                  <View style={[styles.activityIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                    <HugeiconsIcon icon={Logout01Icon} size={ms(16)} color="#EF4444" />
                  </View>
                  <View style={styles.activityTextBox}>
                    <Text style={styles.activityLabel}>Check-out</Text>
                    <Text style={styles.activityValue}>{member.lastCheckout}</Text>
                    <Text style={styles.activityDate}>{member.lastVisitDate}</Text>
                  </View>
                </View>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{member.totalVisits}</Text>
                  <Text style={styles.statLabel}>Total Visits</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue }>{member.currentStreak}</Text>
                  <Text style={styles.statLabel}>Day Streak 🔥</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Membership Details Card */}
          <View style={styles.infoCard}>
            {Platform.OS === 'ios' ? (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType={blurConfig.blurType}
                blurAmount={blurConfig.blurAmount}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidBlurFallback]} />
            )}
            
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>MEMBERSHIP</Text>
              
              {/* Membership Type */}
              <View style={styles.membershipRow}>
                <Text style={styles.membershipLabel}>Plan</Text>
                <View style={[styles.membershipBadge, { backgroundColor: tierConfig.bgColor, borderColor: tierConfig.borderColor }]}>
                  <View style={[styles.membershipBadgeDot, { backgroundColor: tierConfig.color }]} />
                  <Text style={[styles.membershipBadgeText, { color: tierConfig.color }]}>
                    {member.membershipType}
                  </Text>
                </View>
              </View>

              {/* Membership Method */}
              <View style={styles.membershipRow}>
                <Text style={styles.membershipLabel}>Workout</Text>
                <View style={[styles.methodBadge, { backgroundColor: methodConfig.bgColor }]}>
                  <HugeiconsIcon icon={methodConfig.icon} size={ms(12)} color={methodConfig.color} />
                  <Text style={[styles.methodBadgeText, { color: methodConfig.color }]}>
                    {methodConfig.label}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.cardDivider} />

              {/* Dates */}
              <View style={styles.datesRow}>
                <View style={styles.dateItem}>
                  <HugeiconsIcon icon={Calendar03Icon} size={ms(12)} color="#22C55E" />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>Joined</Text>
                    <Text style={styles.dateValue}>{member.joinDate}</Text>
                  </View>
                </View>

                <View style={styles.dateItem}>
                  <HugeiconsIcon icon={Calendar03Icon} size={ms(12)} color="#EF4444" />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>Expires</Text>
                    <Text style={styles.dateValue}>{member.expiryDate}</Text>
                  </View>
                </View>
              </View>

              {/* Membership Status */}
              <View style={[
                styles.membershipStatus,
                { 
                  backgroundColor: member.isActive ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  borderColor: member.isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                }
              ]}>
                <HugeiconsIcon 
                  icon={member.isActive ? CheckmarkCircle02Icon : AlertCircleIcon} 
                  size={ms(14)} 
                  color={member.isActive ? '#22C55E' : '#EF4444'} 
                />
                <Text style={[
                  styles.membershipStatusText,
                  { color: member.isActive ? '#22C55E' : '#EF4444' }
                ]}>
                  {member.isActive ? 'Membership Active' : 'Membership Expired'}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            {/* Edit Profile */}
            <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0.05)']}
                style={styles.actionButtonGradient}
              >
                <HugeiconsIcon icon={Edit02Icon} size={ms(14)} color="#3B82F6" />
                <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Edit</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Delete/Deactivate */}
            <TouchableOpacity style={styles.deleteButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.05)']}
                style={styles.actionButtonGradient}
              >
                <HugeiconsIcon icon={Delete02Icon} size={ms(14)} color="#EF4444" />
                <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Remove</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: s(14),
    paddingTop: vs(8),
    paddingBottom: vs(30),
  },
  androidBlurFallback: {
    backgroundColor: 'rgba(15, 15, 20, 0.92)',
  },

  // Back Button
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
    paddingVertical: vs(2),
  },
  backIconContainer: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  backText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(11),
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // Hero Card
  heroCard: {
    borderRadius: ms(18),
    overflow: 'hidden',
    marginBottom: vs(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ms(80),
  },
  heroContent: {
    alignItems: 'center',
    paddingVertical: vs(20),
    paddingHorizontal: s(16),
  },

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    marginBottom: vs(10),
  },
  avatarOuter: {
    width: ms(72),
    height: ms(72),
    borderRadius: ms(36),
    padding: ms(2),
    borderWidth: 2,
  },
  avatar: {
    flex: 1,
    borderRadius: ms(34),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(18),
    color: '#FFFFFF',
  },

  // Name
  memberName: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(17),
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: vs(8),
  },

  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(10),
    marginBottom: vs(8),
    gap: s(4),
  },
  statusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.25)',
  },
  statusInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  statusDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
  },
  statusText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(8),
    letterSpacing: 0.8,
  },

  // Tier Badge
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
    borderWidth: 1,
    gap: s(5),
    marginBottom: vs(14),
  },
  tierDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
  },
  tierText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(10),
    letterSpacing: 0.8,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: s(12),
  },
  quickActionBtn: {
    borderRadius: ms(12),
    overflow: 'hidden',
  },
  quickActionGradient: {
    width: ms(44),
    height: ms(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  // Info Card
  infoCard: {
    borderRadius: ms(14),
    overflow: 'hidden',
    marginBottom: vs(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  infoCardContent: {
    padding: ms(14),
  },
  infoCardTitle: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(10),
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.5,
    marginBottom: vs(12),
  },

  // Info Row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  infoIconBox: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(10),
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(10),
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.3,
    marginBottom: vs(1),
  },
  infoValue: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(13),
    color: '#FFFFFF',
  },

  // Activity Grid
  activityGrid: {
    flexDirection: 'row',
    gap: s(10),
    marginBottom: vs(10),
  },
  activityItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: ms(12),
    padding: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: s(8),
  },
  activityIconBox: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTextBox: {
    flex: 1,
  },
  activityLabel: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(10),
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
  },
  activityValue: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(13),
    color: '#FFFFFF',
    marginVertical: vs(1),
  },
  activityDate: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(9),
    color: 'rgba(255,255,255,0.5)',
  },

  // Stats Row - FIXED VISIBILITY
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: ms(12),
    paddingVertical: ms(14),
    paddingHorizontal: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(20),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  statLabel: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(11),
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
    marginTop: vs(4),
    includeFontPadding: false,
  },
  statDivider: {
    width: 1,
    height: vs(35),
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Membership Row
  membershipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(10),
  },
  membershipLabel: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(12),
    color: 'rgba(255,255,255,0.7)',
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(6),
    borderWidth: 1,
    gap: s(4),
  },
  membershipBadgeDot: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(2.5),
  },
  membershipBadgeText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(10),
    letterSpacing: 0.3,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(6),
    gap: s(4),
  },
  methodBadgeText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(10),
    letterSpacing: 0.2,
  },

  // Card Divider
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: vs(10),
  },

  // Dates Row
  datesRow: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(10),
  },
  dateItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: ms(10),
    padding: ms(10),
    gap: s(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(9),
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.3,
    marginBottom: vs(1),
  },
  dateValue: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(11),
    color: '#FFFFFF',
  },

  // Membership Status
  membershipStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ms(10),
    padding: ms(12),
    gap: s(6),
    borderWidth: 1,
  },
  membershipStatusText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(12),
    letterSpacing: 0.3,
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: s(10),
    marginTop: vs(4),
  },
  editButton: {
    flex: 1,
    borderRadius: ms(10),
    overflow: 'hidden',
  },
  deleteButton: {
    flex: 1,
    borderRadius: ms(10),
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(12),
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: s(6),
  },
  actionButtonText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(12),
    letterSpacing: 0.3,
  },

  // Bottom Spacer
  bottomSpacer: {
    height: vs(20),
  },
});

export default AdminSeeUserProfileScreen;