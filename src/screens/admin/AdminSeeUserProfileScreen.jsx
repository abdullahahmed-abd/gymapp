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
  Alert,
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
  Activity01Icon,
  Edit02Icon,
  Delete02Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Mail01Icon,
  Shield01Icon,
  Timer01Icon,
  SparklesIcon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';

import Header from '../../components/shared/Header';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const s = (size) => scale(size * 0.9);
const ms = (size) => moderateScale(size * 0.85, 0.2);
const vs = (size) => verticalScale(size * 0.85);
const rf = (size) => RFValue(size);

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

const TIER_TEMPLATES = {
  'ELITE TIER': {
    name: 'ELITE TIER',
    badge: 'ELITE',
    iconColor: '#EAB308',
    textColor: '#EAB308',
    lightColor: '#FCD34D',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.35)',
    subtitle: 'Cardio + Weight Lifting',
    workoutType: 'cardio_weights',
  },
  'LEGENDARY TIER': {
    name: 'LEGENDARY TIER',
    badge: 'LEGENDARY',
    iconColor: '#a855f7',
    textColor: '#c084fc',
    lightColor: '#c084fc',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
    subtitle: 'Weight Lifting Only',
    workoutType: 'weights_only',
  },
};

const TRIAL_CONFIG = {
  iconColor: '#3B82F6',
  bgColor: 'rgba(59, 130, 246, 0.15)',
  borderColor: 'rgba(59, 130, 246, 0.35)',
};

const MEMBERSHIP_STATUS = {
  active: {
    label: 'ACTIVE',
    color: '#22C55E',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    icon: CheckmarkCircle02Icon,
    message: 'Membership Active',
  },
  expired: {
    label: 'EXPIRED',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    icon: AlertCircleIcon,
    message: 'Membership Expired',
  },
  trial: {
    label: 'TRIAL',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    icon: Timer01Icon,
    message: 'Trial Period',
  },
};

const getTierConfig = (tier) => {
  return TIER_TEMPLATES[tier] || TIER_TEMPLATES['ELITE TIER'];
};

const getStatusConfig = (status) => {
  return MEMBERSHIP_STATUS[status] || MEMBERSHIP_STATUS.active;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getDaysLeftText = (member) => {
  if (member.membershipStatus === 'expired') {
    return 'Expired';
  } else if (member.membershipStatus === 'trial') {
    return `${member.daysLeft} days trial left`;
  } else {
    return `${member.daysLeft} days left`;
  }
};

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminSeeUserProfileScreen = ({ navigation, route }) => {
  const blurConfig = getBlurConfig();

  const member = route?.params?.member || {
    id: '1',
    name: 'Abdullah Ahmed',
    avatar: 'AA',
    phone: '+918817159218',
    email: 'abdullah@example.com',
    memberId: 'GYM001',
    membershipType: 'ELITE TIER',
    membershipStatus: 'active',
    workoutType: 'cardio_weights',
    joinDate: '2024-01-15',
    expiryDate: '2025-02-15',
    daysLeft: 25,
    lastCheckin: '6:30 AM',
    lastCheckout: '8:15 AM',
    lastVisitDate: 'Today',
    totalVisits: 156,
    currentStreak: 12,
    duration: '45 min',
    checkinTime: '6:30 AM',
    address: 'Mumbai, Maharashtra',
    emergencyContact: '+919876543210',
  };

  const isTrial = member.membershipStatus === 'trial';
  const tierConfig = isTrial ? null : getTierConfig(member.membershipType);
  const statusConfig = getStatusConfig(member.membershipStatus);
  const cardAccentColor = isTrial ? TRIAL_CONFIG.iconColor : tierConfig.iconColor;

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

  const handleEmail = () => {
    if (member.email) {
      Linking.openURL(`mailto:${member.email}`);
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Navigate to edit profile screen');
  };

  const handleRemoveMember = () => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleRenewMembership = () => {
    Alert.alert('Renew Membership', 'Navigate to renewal screen');
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

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PROFILE HERO CARD - LiveRoster card layout */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={[styles.heroCard, { borderColor: `${cardAccentColor}30` }]}>
            {/* Background Shield */}
            <View style={styles.heroBgIconContainer}>
              <HugeiconsIcon
                icon={Shield01Icon}
                size={ms(100)}
                color={`${cardAccentColor}15`}
                strokeWidth={0.5}
              />
            </View>

            <View style={styles.heroContent}>
              {/* ── TOP ROW: Avatar + Info (same as LiveRoster card) ── */}
              <View style={styles.heroTopRow}>
                {/* Avatar - exact LiveRoster style */}
                <View
                  style={[
                    styles.avatarContainer,
                    {
                      borderColor: isTrial
                        ? `${TRIAL_CONFIG.iconColor}80`
                        : `${tierConfig.iconColor}60`,
                      backgroundColor: isTrial
                        ? TRIAL_CONFIG.bgColor
                        : `${tierConfig.iconColor}15`,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['black', 'black']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarGradient}
                  >
                    <Text style={styles.avatarText}>{member.avatar}</Text>
                  </LinearGradient>
                  {/* Live indicator dot */}
                  <View style={styles.liveIndicator}>
                    <View
                      style={[
                        styles.liveIndicatorInner,
                        { backgroundColor: statusConfig.color },
                      ]}
                    />
                  </View>
                </View>

                {/* Info Column */}
                <View style={styles.heroInfoCol}>
                  {/* Badge Row - left badges + right member ID */}
                  <View style={styles.heroBadgeRow}>
                    <View style={styles.heroLeftBadges}>
                      {/* Tier Badge - only non-trial */}
                      {!isTrial && tierConfig && (
                        <View
                          style={[
                            styles.tierBadge,
                            { borderColor: `${tierConfig.iconColor}40` },
                          ]}
                        >
                          <View
                            style={[
                              styles.tierDot,
                              { backgroundColor: tierConfig.iconColor },
                            ]}
                          />
                          <Text
                            style={[
                              styles.tierText,
                              { color: Colors.zinc[400] },
                            ]}
                          >
                            {tierConfig.badge}
                          </Text>
                        </View>
                      )}

                      {/* Status Badge */}
                      <View
                        style={[
                          styles.statusBadge,
                          { borderColor: statusConfig.borderColor },
                        ]}
                      >
                        <HugeiconsIcon
                          icon={statusConfig.icon}
                          size={ms(10)}
                          color={statusConfig.color}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            { color: Colors.zinc[400] },
                          ]}
                        >
                          {statusConfig.label}
                        </Text>
                      </View>
                    </View>

                    {/* Member ID on right */}
                    <Text style={styles.memberId}>{member.memberId}</Text>
                  </View>

                  {/* Member Name */}
                  <Text style={styles.memberName} numberOfLines={1}>
                    {member.name}
                  </Text>

                  {/* Workout Badge - trial ke liye nahi */}
                  {!isTrial && tierConfig && (
                    <View
                      style={[
                        styles.workoutBadge,
                        { backgroundColor: `${cardAccentColor}15` },
                      ]}
                    >
                      <HugeiconsIcon
                        icon={
                          member.workoutType === 'cardio_weights'
                            ? Activity01Icon
                            : Dumbbell01Icon
                        }
                        size={ms(10)}
                        color={cardAccentColor}
                      />
                      <Text style={styles.workoutBadgeText}>
                        {member.workoutType === 'cardio_weights'
                          ? 'CARDIO + WEIGHTS'
                          : 'WEIGHTS ONLY'}
                      </Text>
                    </View>
                  )}

                  {/* Check-in + Duration time row */}
                  <View style={styles.timeRow}>
                    {member.checkinTime ? (
                      <>
                        <View style={styles.timeItem}>
                          <HugeiconsIcon
                            icon={Login01Icon}
                            size={ms(11)}
                            color="#22C55E"
                          />
                          <Text style={styles.timeText}>{member.checkinTime}</Text>
                        </View>
                        {member.duration && (
                          <>
                            <View style={styles.timeDot} />
                            <View style={styles.timeItem}>
                              <HugeiconsIcon
                                icon={Clock01Icon}
                                size={ms(11)}
                                color={cardAccentColor}
                              />
                              <Text style={styles.timeText}>{member.duration}</Text>
                            </View>
                          </>
                        )}
                      </>
                    ) : (
                      <View style={styles.timeItem}>
                        <HugeiconsIcon
                          icon={Clock01Icon}
                          size={ms(11)}
                          color="rgba(255,255,255,0.3)"
                        />
                        <Text
                          style={[
                            styles.timeText,
                            { color: 'rgba(255,255,255,0.4)' },
                          ]}
                        >
                          Last: {member.lastCheckout || 'N/A'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* ── DIVIDER ── */}
              <View
                style={[
                  styles.heroDivider,
                  { backgroundColor: `${cardAccentColor}25` },
                ]}
              />

              {/* ── BOTTOM ROW: Phone + Quick Actions ── */}
              <View style={styles.heroBottomRow}>
                {/* Phone */}
                <View style={styles.phoneContainer}>
                  <View
                    style={[
                      styles.phoneIconBox,
                      { backgroundColor: `${cardAccentColor}12` },
                    ]}
                  >
                    <HugeiconsIcon
                      icon={SmartPhone01Icon}
                      size={ms(14)}
                      color={cardAccentColor}
                    />
                  </View>
                  <View style={styles.phoneInfo}>
                    <Text style={styles.phoneLabel}>CONTACT</Text>
                    <Text style={styles.phoneNumber}>
                      {formatPhone(member.phone)}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.quickActions}>
                  <TouchableOpacity
                    style={styles.quickActionBtn}
                    onPress={handleCall}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['black', 'black']}
                      style={styles.quickActionGradient}
                    >
                      <HugeiconsIcon
                        icon={Call02Icon}
                        size={ms(18)}
                        color="#22C55E"
                      />
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickActionBtn}
                    onPress={handleWhatsApp}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['black', 'black']}
                      style={styles.quickActionGradient}
                    >
                      <HugeiconsIcon
                        icon={WhatsappIcon}
                        size={ms(18)}
                        color="#25D366"
                      />
                    </LinearGradient>
                  </TouchableOpacity>

                  {member.email && (
                    <TouchableOpacity
                      style={styles.quickActionBtn}
                      onPress={handleEmail}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={['black', 'black']}
                        style={styles.quickActionGradient}
                      >
                        <HugeiconsIcon
                          icon={Mail01Icon}
                          size={ms(18)}
                          color="#3B82F6"
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* ALERT CARD - Expired / Trial */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {(member.membershipStatus === 'expired' ||
            member.membershipStatus === 'trial') && (
            <View
              style={[
                styles.alertCard,
                { borderColor: statusConfig.borderColor },
              ]}
            >
              <LinearGradient
                colors={[statusConfig.bgColor, 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.alertContent}>
                <View
                  style={[
                    styles.alertIconBox,
                    { backgroundColor: statusConfig.bgColor },
                  ]}
                >
                  <HugeiconsIcon
                    icon={statusConfig.icon}
                    size={ms(20)}
                    color={statusConfig.color}
                  />
                </View>
                <View style={styles.alertTextBox}>
                  <Text
                    style={[
                      styles.alertTitle,
                      { color: statusConfig.color },
                    ]}
                  >
                    {member.membershipStatus === 'expired'
                      ? 'Membership Expired!'
                      : 'Trial Period'}
                  </Text>
                  <Text style={styles.alertSubtitle}>
                    {member.membershipStatus === 'expired'
                      ? `Expired on ${formatDate(member.expiryDate)}`
                      : `${member.daysLeft} days remaining in trial`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.renewButton,
                    { backgroundColor: `${statusConfig.color}CC` },
                  ]}
                  onPress={handleRenewMembership}
                  activeOpacity={0.8}
                >
                  <Text style={styles.renewButtonText}>
                    {member.membershipStatus === 'expired' ? 'RENEW' : 'UPGRADE'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* CONTACT INFO CARD */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>CONTACT INFO</Text>

              <TouchableOpacity
                style={styles.infoRow}
                onPress={handleCall}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.infoIconBox,
                    { backgroundColor: 'rgba(34, 197, 94, 0.1)' },
                  ]}
                >
                  <HugeiconsIcon
                    icon={SmartPhone01Icon}
                    size={ms(14)}
                    color="#22C55E"
                  />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{formatPhone(member.phone)}</Text>
                </View>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={ms(14)}
                  color="rgba(255,255,255,0.3)"
                />
              </TouchableOpacity>

              {member.email && (
                <TouchableOpacity
                  style={[styles.infoRow, { marginBottom: 0 }]}
                  onPress={handleEmail}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.infoIconBox,
                      { backgroundColor: 'rgba(59, 130, 246, 0.1)' },
                    ]}
                  >
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={ms(14)}
                      color="#3B82F6"
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{member.email}</Text>
                  </View>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={ms(14)}
                    color="rgba(255,255,255,0.3)"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* LAST ACTIVITY CARD */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>LAST ACTIVITY</Text>

              <View style={styles.activityGrid}>
                <View style={styles.activityItem}>
                  <View
                    style={[
                      styles.activityIconBox,
                      { backgroundColor: 'rgba(34, 197, 94, 0.15)' },
                    ]}
                  >
                    <HugeiconsIcon
                      icon={Login01Icon}
                      size={ms(16)}
                      color="#22C55E"
                    />
                  </View>
                  <View style={styles.activityTextBox}>
                    <Text style={styles.activityLabel}>Check-in</Text>
                    <Text style={styles.activityValue}>
                      {member.lastCheckin || member.checkinTime || '--'}
                    </Text>
                    <Text style={styles.activityDate}>
                      {member.lastVisitDate || 'Today'}
                    </Text>
                  </View>
                </View>

                <View style={styles.activityItem}>
                  <View
                    style={[
                      styles.activityIconBox,
                      { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
                    ]}
                  >
                    <HugeiconsIcon
                      icon={Logout01Icon}
                      size={ms(16)}
                      color="#EF4444"
                    />
                  </View>
                  <View style={styles.activityTextBox}>
                    <Text style={styles.activityLabel}>Check-out</Text>
                    <Text style={styles.activityValue}>
                      {member.lastCheckout || '--:--'}
                    </Text>
                    <Text style={styles.activityDate}>
                      {member.lastVisitDate || 'Today'}
                    </Text>
                  </View>
                </View>
              </View>

              {member.duration && (
                <View style={styles.sessionRow}>
                  <View
                    style={[
                      styles.sessionIconBox,
                      { backgroundColor: `${cardAccentColor}15` },
                    ]}
                  >
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      size={ms(14)}
                      color={cardAccentColor}
                    />
                  </View>
                  <Text style={styles.sessionLabel}>Session Duration</Text>
                  <Text style={[styles.sessionValue, { color: cardAccentColor }]}>
                    {member.duration}
                  </Text>
                </View>
              )}

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{member.totalVisits || 0}</Text>
                  <Text style={styles.statLabel}>Total Visits</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{member.currentStreak || 0}</Text>
                  <Text style={styles.statLabel}>Day Streak 🔥</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* MEMBERSHIP DETAILS CARD */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={[styles.infoCard, { borderColor: `${cardAccentColor}20` }]}>
            <View style={styles.infoCardContent}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.infoCardTitle}>MEMBERSHIP</Text>
                <Text style={[styles.daysLeftPlainText, { color: 'rgba(255,255,255,0.6)' }]}>
                  {getDaysLeftText(member)}
                </Text>
              </View>

              {/* Plan - trial ke liye nahi */}
              {!isTrial && tierConfig && (
                <View style={styles.membershipRow}>
                  <Text style={styles.membershipLabel}>Plan</Text>
                  <View
                    style={[
                      styles.membershipBadge,
                      { borderColor: `${tierConfig.iconColor}40` },
                    ]}
                  >
                    <View
                      style={[
                        styles.membershipBadgeDot,
                        { backgroundColor: tierConfig.iconColor },
                      ]}
                    />
                    <Text
                      style={[
                        styles.membershipBadgeText,
                        { color: tierConfig.iconColor },
                      ]}
                    >
                      {member.membershipType}
                    </Text>
                  </View>
                </View>
              )}

              {/* Workout - trial ke liye nahi */}
              {!isTrial && tierConfig && (
                <View style={styles.membershipRow}>
                  <Text style={styles.membershipLabel}>Workout</Text>
                  <View
                    style={[
                      styles.methodBadge,
                      { backgroundColor: `${cardAccentColor}15` },
                    ]}
                  >
                    <HugeiconsIcon
                      icon={
                        member.workoutType === 'cardio_weights'
                          ? Activity01Icon
                          : Dumbbell01Icon
                      }
                      size={ms(12)}
                      color={cardAccentColor}
                    />
                    <Text style={[styles.methodBadgeText, { color: 'white' }]}>
                      {member.workoutType === 'cardio_weights'
                        ? 'Cardio + Weights'
                        : 'Weights Only'}
                    </Text>
                  </View>
                </View>
              )}

              {/* Status */}
              <View style={styles.membershipRow}>
                <Text style={styles.membershipLabel}>Status</Text>
                <View
                  style={[
                    styles.statusSmallBadge,
                    { borderColor: statusConfig.borderColor },
                  ]}
                >
                  <HugeiconsIcon
                    icon={statusConfig.icon}
                    size={ms(10)}
                    color={statusConfig.color}
                  />
                  <Text
                    style={[
                      styles.statusSmallText,
                      { color: statusConfig.color },
                    ]}
                  >
                    {statusConfig.label}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Dates */}
              <View style={styles.datesRow}>
                <View style={styles.dateItem}>
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={ms(12)}
                    color="#22C55E"
                  />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>Joined</Text>
                    <Text style={styles.dateValue}>
                      {formatDate(member.joinDate)}
                    </Text>
                  </View>
                </View>

                <View style={styles.dateItem}>
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={ms(12)}
                    color={
                      member.membershipStatus === 'expired'
                        ? '#EF4444'
                        : cardAccentColor
                    }
                  />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>
                      {member.membershipStatus === 'expired' ? 'Expired' : 'Expires'}
                    </Text>
                    <Text
                      style={[
                        styles.dateValue,
                        member.membershipStatus === 'expired' && {
                          color: '#EF4444',
                        },
                      ]}
                    >
                      {formatDate(member.expiryDate)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Membership Status Bar */}
              <View style={styles.membershipStatusBar}>
                <HugeiconsIcon
                  icon={statusConfig.icon}
                  size={ms(14)}
                  color={statusConfig.color}
                />
                <Text
                  style={[
                    styles.membershipStatusText,
                    { color: statusConfig.color },
                  ]}
                >
                  {statusConfig.message}
                </Text>
                {member.membershipStatus === 'active' && (
                  <Text
                    style={[
                      styles.membershipDaysText,
                      { color: statusConfig.color },
                    ]}
                  >
                    • {member.daysLeft} days remaining
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* ACTION BUTTONS */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={styles.actionButtonsContainer}>
            {(member.membershipStatus === 'expired' ||
              member.membershipStatus === 'trial') && (
              <TouchableOpacity
                style={styles.renewFullButton}
                onPress={handleRenewMembership}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[`${cardAccentColor}CC`, `${cardAccentColor}50`]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0 }}
                  style={styles.renewFullGradient}
                >
                  <HugeiconsIcon
                    icon={SparklesIcon}
                    size={ms(16)}
                    color="#FFFFFF"
                  />
                  <Text style={styles.renewFullText}>
                    {member.membershipStatus === 'expired'
                      ? 'RENEW MEMBERSHIP'
                      : 'UPGRADE TO FULL'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditProfile}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[
                    'rgba(59, 130, 246, 0.15)',
                    'rgba(59, 130, 246, 0.05)',
                  ]}
                  style={styles.actionButtonGradient}
                >
                  <HugeiconsIcon
                    icon={Edit02Icon}
                    size={ms(14)}
                    color="#3B82F6"
                  />
                  <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>
                    Edit Profile
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleRemoveMember}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[
                    'rgba(239, 68, 68, 0.15)',
                    'rgba(239, 68, 68, 0.05)',
                  ]}
                  style={styles.actionButtonGradient}
                >
                  <HugeiconsIcon
                    icon={Delete02Icon}
                    size={ms(14)}
                    color="#EF4444"
                  />
                  <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>
                    Remove
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: s(14),
    paddingTop: vs(8),
    paddingBottom: vs(30),
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

  // ═══════════════════════════════════════════════════════════════
  // HERO CARD - LiveRoster card layout match
  // ═══════════════════════════════════════════════════════════════
  heroCard: {
    borderRadius: ms(16),
    overflow: 'hidden',
    marginBottom: vs(12),
    borderWidth: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  heroBgIconContainer: {
    position: 'absolute',
    top: -ms(5),
    right: -ms(10),
    opacity: 0.8,
  },
  heroContent: {
    paddingLeft: ms(14),
    paddingRight: ms(12),
    paddingVertical: ms(12),
  },

  // ── Top Row ──
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // ✅ Avatar - exact LiveRoster style
  avatarContainer: {
    position: 'relative',
    marginRight: s(12),
    borderWidth: scale(2),
    borderRadius: ms(27),
  },
  avatarGradient: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(14),
    color: '#FFFFFF',
  },
  liveIndicator: {
    position: 'absolute',
    bottom: ms(0),
    right: ms(0),
    width: ms(14),
    height: ms(14),
    borderRadius: ms(7),
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  liveIndicatorInner: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },

  // ── Info Column ──
  heroInfoCol: {
    flex: 1,
  },

  // ✅ Badge Row - space-between, left badges + right memberId
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
    justifyContent: 'space-between',
  },
  heroLeftBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    flexWrap: 'wrap',
  },

  // Tier Badge - no background, only border
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(5),
    borderWidth: 1,
    gap: s(4),
  },
  tierDot: {
    width: ms(4),
    height: ms(4),
    borderRadius: ms(2),
  },
  tierText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(6),
    letterSpacing: 0.5,
  },

  // Status Badge - no background, only border
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(5),
    borderWidth: 1,
    gap: s(3),
  },
  statusText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(6),
    letterSpacing: 0.5,
  },

  // Member ID - right side
  memberId: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(7),
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1,
  },

  // Member Name
  memberName: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(11),
    color: '#FFFFFF',
    marginBottom: vs(4),
  },

  // Workout Badge
  workoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
    marginBottom: vs(5),
    gap: s(4),
  },
  workoutBadgeText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(6),
    color: 'white',
    letterSpacing: 0.5,
  },

  // Time Row
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
  },
  timeText: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(8),
    color: '#FFFFFF',
  },
  timeDot: {
    width: ms(3),
    height: ms(3),
    borderRadius: ms(1.5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: s(6),
  },

  // ── Divider ──
  heroDivider: {
    height: 1,
    marginVertical: vs(10),
  },

  // ── Bottom Row: Phone + Actions ──
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  phoneIconBox: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(8),
  },
  phoneInfo: {
    flex: 1,
  },
  phoneLabel: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(6),
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.2,
    marginBottom: vs(1),
  },
  phoneNumber: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(8),
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  quickActions: {
    flexDirection: 'row',
    gap: s(6),
  },
  quickActionBtn: {
    borderRadius: ms(10),
    overflow: 'hidden',
  },
  quickActionGradient: {
    width: ms(36),
    height: ms(36),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  // ═══════════════════════════════════════════════════════════════
  // ALERT CARD
  // ═══════════════════════════════════════════════════════════════
  alertCard: {
    borderRadius: ms(14),
    overflow: 'hidden',
    marginBottom: vs(12),
    borderWidth: 1,
    backgroundColor: '#000000',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(12),
    gap: s(10),
  },
  alertIconBox: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTextBox: { flex: 1 },
  alertTitle: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(11),
    marginBottom: vs(2),
  },
  alertSubtitle: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(10),
    color: 'rgba(255,255,255,0.5)',
  },
  renewButton: {
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    borderRadius: ms(8),
  },
  renewButtonText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(9),
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  // ═══════════════════════════════════════════════════════════════
  // INFO CARD (shared)
  // ═══════════════════════════════════════════════════════════════
  infoCard: {
    borderRadius: ms(14),
    overflow: 'hidden',
    marginBottom: vs(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#000000',
  },
  infoCardContent: {
    padding: ms(14),
  },
  infoCardTitle: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(9),
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.5,
    marginBottom: vs(12),
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  daysLeftPlainText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(10),
    letterSpacing: 0.5,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  infoTextContainer: { flex: 1 },
  infoLabel: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(9),
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.3,
    marginBottom: vs(1),
  },
  infoValue: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(12),
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
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTextBox: { flex: 1 },
  activityLabel: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(9),
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.3,
  },
  activityValue: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(12),
    color: '#FFFFFF',
    marginVertical: vs(1),
  },
  activityDate: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(8),
    color: 'rgba(255,255,255,0.4)',
  },

  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: ms(10),
    paddingVertical: vs(8),
    paddingHorizontal: s(10),
    marginBottom: vs(10),
    gap: s(8),
  },
  sessionIconBox: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionLabel: {
    flex: 1,
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(10),
    color: 'rgba(255,255,255,0.6)',
  },
  sessionValue: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(12),
  },

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
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(18),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  statLabel: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(10),
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.3,
    marginTop: vs(4),
    includeFontPadding: false,
  },
  statDivider: {
    width: 1,
    height: vs(35),
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Membership rows
  membershipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(10),
  },
  membershipLabel: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(11),
    color: 'rgba(255,255,255,0.6)',
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
    fontSize: rf(9),
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
    fontSize: rf(9),
    letterSpacing: 0.2,
  },
  statusSmallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(6),
    borderWidth: 1,
    gap: s(4),
  },
  statusSmallText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(8),
    letterSpacing: 0.5,
  },

  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: vs(10),
  },

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
  dateInfo: { flex: 1 },
  dateLabel: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(8),
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.3,
    marginBottom: vs(1),
  },
  dateValue: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(10),
    color: '#FFFFFF',
  },

  membershipStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(4),
    gap: s(6),
  },
  membershipStatusText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(11),
    letterSpacing: 0.3,
  },
  membershipDaysText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(10),
    opacity: 0.8,
  },

  // ═══════════════════════════════════════════════════════════════
  // ACTION BUTTONS
  // ═══════════════════════════════════════════════════════════════
  actionButtonsContainer: {
    marginTop: vs(4),
    gap: vs(10),
  },
  renewFullButton: {
    borderRadius: ms(12),
    overflow: 'hidden',
  },
  renewFullGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(14),
    gap: s(10),
  },
  renewFullText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(11),
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: s(10),
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
    fontSize: rf(11),
    letterSpacing: 0.3,
  },

  bottomSpacer: {
    height: vs(20),
  },
});

export default AdminSeeUserProfileScreen;