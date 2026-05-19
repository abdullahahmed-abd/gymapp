// src/screens/admin/MembersProfileScreen.js
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
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
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
  ArrowRight01Icon,
  Cancel01Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import BottomNav from '../../components/shared/BottomNav';
import Header from '../../components/shared/Header';
import Fonts from '../../constants/Fonts';
import Colors from '../../constants/Colors';
import { useTrainer } from '../../context/TrainerContext';

const s = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const TRAINER_COLOR = '#22D3EE';

// ═══════════════════════════════════════════════════════════════
// CONFIGS
// ═══════════════════════════════════════════════════════════════
const TIER_TEMPLATES = {
  'ELITE TIER': {
    badge: 'ELITE',
    iconColor: '#EAB308',
    textColor: '#EAB308',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.35)',
  },
  'LEGENDARY TIER': {
    badge: 'LEGENDARY',
    iconColor: '#a855f7',
    textColor: '#c084fc',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
  },
};

const TRIAL_CONFIG = {
  iconColor: '#3B82F6',
  textColor: '#60A5FA',
  bgColor: 'rgba(59, 130, 246, 0.15)',
  borderColor: 'rgba(59, 130, 246, 0.35)',
  badge: 'TRIAL',
};

const STATUS_CONFIG = {
  active: {
    label: 'ACTIVE',
    color: '#22C55E',
    bgColor: 'rgba(34,197,94,0.15)',
    borderColor: 'rgba(34,197,94,0.3)',
    icon: CheckmarkCircle02Icon,
    message: 'Membership Active',
  },
  expired: {
    label: 'EXPIRED',
    color: '#EF4444',
    bgColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.3)',
    icon: AlertCircleIcon,
    message: 'Membership Expired',
  },
  trial: {
    label: 'TRIAL',
    color: '#3B82F6',
    bgColor: 'rgba(59,130,246,0.15)',
    borderColor: 'rgba(59,130,246,0.3)',
    icon: Timer01Icon,
    message: 'Trial Period',
  },
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatPhone = (phone) => {
  const cleaned = phone?.replace(/\D/g, '') || '';
  if (cleaned.length === 12) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const MembersProfileScreen = ({ navigation, route }) => {
  const member = route?.params?.member;

  // ✅ Use CORRECT new TrainerContext functions
  const {
    sendTrainerRequest,
    removeTrainerRequest,
    acceptTrainerRequest,
    getTrainerRequest,
    getTrainerStatus,
    loading: trainerLoading,
  } = useTrainer();

  // ✅ Get trainer data using new functions
  const trainerRequest = member ? getTrainerRequest(member.id) : null;
  const trainerStatus = member ? getTrainerStatus(member.id) : null;

  // ✅ Days since accepted
  const daysWithTrainer = trainerRequest?.respondedAt
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(trainerRequest.respondedAt).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  if (!member) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff' }}>Member not found</Text>
      </View>
    );
  }

  const isTrial = member.membershipStatus === 'trial';
  const tierConfig = isTrial
    ? TRIAL_CONFIG
    : TIER_TEMPLATES[member.membershipType] || TIER_TEMPLATES['ELITE TIER'];
  const statusConfig = STATUS_CONFIG[member.membershipStatus] || STATUS_CONFIG.active;
  const cardAccentColor = tierConfig.iconColor;

  // ── Handlers ──
  const handleGoBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };
  const handleCall = () => Linking.openURL(`tel:${member.phone.replace(/\D/g, '')}`);
  const handleWhatsApp = () => Linking.openURL(`whatsapp://send?phone=${member.phone.replace(/\D/g, '')}`);
  const handleEmail = () => { if (member.email) Linking.openURL(`mailto:${member.email}`); };
  const handleEdit = () => Alert.alert('Edit Member', 'Navigate to edit screen');
  const handleRemove = () => {
    Alert.alert('Remove Member', `Are you sure you want to remove ${member.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  const getDaysLeftText = () => {
    if (member.membershipStatus === 'expired') return 'Expired';
    if (member.membershipStatus === 'trial') return `${member.daysLeft}d trial left`;
    return `${member.daysLeft} days left`;
  };

  // ✅ TRAINER HANDLERS using new context
  const handleSendTrainerRequest = () => {
    Alert.alert(
      'Make Trainer',
      `Send trainer request to ${member.name}?\n\nThey will see it on their dashboard.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: async () => {
            try {
              await sendTrainerRequest(member.id, member.name);
              Alert.alert('Request Sent ✅', `Trainer request sent to ${member.name}.\nWaiting for acceptance.`);
            } catch (error) {
              Alert.alert('Error', 'Failed to send trainer request');
            }
          },
        },
      ]
    );
  };

  const handleCancelTrainerRequest = () => {
    Alert.alert(
      'Cancel Request',
      trainerStatus === 'pending'
        ? `Cancel trainer request for ${member.name}?`
        : `Remove trainer role from ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: trainerStatus === 'pending' ? 'Cancel Request' : 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTrainerRequest(member.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove trainer');
            }
          },
        },
      ]
    );
  };

  // ✅ Simulate accept - FOR TESTING ONLY
  const handleSimulateAccept = async () => {
    try {
      await acceptTrainerRequest(member.id);
      Alert.alert('Accepted ✅', `${member.name} is now a Trainer!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to simulate accept');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
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
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
            <View style={styles.backIconContainer}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={ms(16)} color="rgba(255,255,255,0.6)" />
            </View>
            <Text style={styles.backText}>Back to Members</Text>
          </TouchableOpacity>

          {/* HERO CARD */}
          <View style={[styles.heroCard, { borderColor: `${cardAccentColor}30` }]}>
            <View style={styles.heroBgIcon}>
              <HugeiconsIcon icon={Shield01Icon} size={ms(100)} color={`${cardAccentColor}15`} strokeWidth={0.5} />
            </View>

            <View style={styles.heroContent}>
              <View style={styles.heroTopRow}>
                {/* Avatar */}
                <View
                  style={[
                    styles.avatarContainer,
                    {
                      borderColor: isTrial ? `${TRIAL_CONFIG.iconColor}80` : `${tierConfig.iconColor}60`,
                      backgroundColor: isTrial ? TRIAL_CONFIG.bgColor : `${tierConfig.iconColor}15`,
                    },
                  ]}
                >
                  <LinearGradient colors={['black', 'black']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatarGradient}>
                    <Text style={styles.avatarText}>{member.avatar || member.name?.slice(0, 2).toUpperCase()}</Text>
                  </LinearGradient>
                  <View style={styles.liveIndicator}>
                    <View style={[styles.liveIndicatorInner, { backgroundColor: member.isLive ? '#22C55E' : 'rgba(255,255,255,0.25)' }]} />
                  </View>
                </View>

                {/* Info */}
                <View style={styles.heroInfoCol}>
                  <View style={styles.heroBadgeRow}>
                    <View style={styles.heroLeftBadges}>
                      {!isTrial && (
                        <View style={[styles.tierBadge, { borderColor: `${tierConfig.iconColor}40` }]}>
                          <View style={[styles.tierDot, { backgroundColor: tierConfig.iconColor }]} />
                          <Text style={[styles.tierText, { color: Colors.zinc[400] }]}>{tierConfig.badge}</Text>
                        </View>
                      )}
                      <View style={[styles.statusBadge, { borderColor: statusConfig.borderColor }]}>
                        <HugeiconsIcon icon={statusConfig.icon} size={ms(10)} color={statusConfig.color} />
                        <Text style={[styles.statusText, { color: Colors.zinc[400] }]}>{statusConfig.label}</Text>
                      </View>
                    </View>

                    {member.isLive ? (
                      <View style={styles.liveChip}>
                        <View style={styles.liveChipDot} />
                        <Text style={styles.liveChipText}>LIVE</Text>
                      </View>
                    ) : (
                      <View style={styles.offlineChip}>
                        <Text style={styles.offlineChipText}>OFFLINE</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.memberName} numberOfLines={1}>{member.name}</Text>

                  {!isTrial && (
                    <View style={[styles.workoutBadge, { backgroundColor: `${cardAccentColor}15` }]}>
                      <HugeiconsIcon
                        icon={member.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                        size={ms(10)} color={cardAccentColor}
                      />
                      <Text style={styles.workoutBadgeText}>
                        {member.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' : 'WEIGHTS ONLY'}
                      </Text>
                    </View>
                  )}

                  <View style={styles.timeRow}>
                    {member.isLive && member.checkinTime ? (
                      <>
                        <View style={styles.timeItem}>
                          <HugeiconsIcon icon={Login01Icon} size={ms(11)} color="#22C55E" />
                          <Text style={styles.timeText}>{member.checkinTime}</Text>
                        </View>
                        {member.duration && (
                          <>
                            <View style={styles.timeDot} />
                            <View style={styles.timeItem}>
                              <HugeiconsIcon icon={Clock01Icon} size={ms(11)} color={cardAccentColor} />
                              <Text style={styles.timeText}>{member.duration}</Text>
                            </View>
                          </>
                        )}
                      </>
                    ) : (
                      <View style={styles.timeItem}>
                        <HugeiconsIcon icon={Clock01Icon} size={ms(11)} color="rgba(255,255,255,0.3)" />
                        <Text style={[styles.timeText, { color: 'rgba(255,255,255,0.4)' }]}>
                          Last: {member.lastCheckout || 'N/A'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={[styles.heroDivider, { backgroundColor: `${cardAccentColor}25` }]} />

              <View style={styles.heroBottomRow}>
                <View style={styles.phoneContainer}>
                  <View style={[styles.phoneIconBox, { backgroundColor: `${cardAccentColor}12` }]}>
                    <HugeiconsIcon icon={SmartPhone01Icon} size={ms(14)} color={cardAccentColor} />
                  </View>
                  <View style={styles.phoneInfo}>
                    <Text style={styles.phoneLabel}>CONTACT</Text>
                    <Text style={styles.phoneNumber}>{formatPhone(member.phone)}</Text>
                  </View>
                </View>

                <View style={styles.quickActions}>
                  <TouchableOpacity style={styles.quickActionBtn} onPress={handleCall} activeOpacity={0.7}>
                    <LinearGradient colors={['black', 'black']} style={styles.quickActionGradient}>
                      <HugeiconsIcon icon={Call02Icon} size={ms(18)} color="#22C55E" />
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickActionBtn} onPress={handleWhatsApp} activeOpacity={0.7}>
                    <LinearGradient colors={['black', 'black']} style={styles.quickActionGradient}>
                      <HugeiconsIcon icon={WhatsappIcon} size={ms(18)} color="#25D366" />
                    </LinearGradient>
                  </TouchableOpacity>
                  {member.email && (
                    <TouchableOpacity style={styles.quickActionBtn} onPress={handleEmail} activeOpacity={0.7}>
                      <LinearGradient colors={['black', 'black']} style={styles.quickActionGradient}>
                        <HugeiconsIcon icon={Mail01Icon} size={ms(18)} color="#3B82F6" />
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* MINI STATS CARD */}
          <View style={styles.miniStatsCard}>
            <View style={styles.miniStatItem}>
              <Text style={styles.miniStatValue}>{member.memberId}</Text>
              <Text style={styles.miniStatLabel}>MEMBER ID</Text>
            </View>
            <View style={styles.miniStatDivider} />
            <View style={styles.miniStatItem}>
              <Text style={[styles.miniStatValue, { color: '#FFFFFF' }]}>{member.totalVisits || 0}</Text>
              <Text style={styles.miniStatLabel}>TOTAL VISITS</Text>
            </View>
            <View style={styles.miniStatDivider} />
            <View style={styles.miniStatItem}>
              <Text style={[styles.miniStatValue, { color: '#FFFFFF' }]}>{member.currentStreak || 0}🔥</Text>
              <Text style={styles.miniStatLabel}>STREAK</Text>
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* ✅ TRAINER SECTION - Only for trial members */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {isTrial && (
            <View style={trainerStyles.section}>
              {/* Title Row */}
              <View style={trainerStyles.sectionTitleRow}>
                <HugeiconsIcon icon={Dumbbell01Icon} size={ms(13)} color={TRAINER_COLOR} />
                <Text style={trainerStyles.sectionTitle}>TRAINER ROLE</Text>
                {/* Simulate Accept - DEV ONLY */}
                {trainerStatus === 'pending' && (
                  <TouchableOpacity
                    style={trainerStyles.simBtn}
                    onPress={handleSimulateAccept}
                    activeOpacity={0.7}
                  >
                    <Text style={trainerStyles.simBtnText}>Simulate Accept</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* STATE 1: No request sent */}
              {!trainerStatus && (
                <View style={trainerStyles.emptyCard}>
                  <LinearGradient colors={['rgba(34,211,238,0.05)', 'transparent']} style={StyleSheet.absoluteFill} />
                  <View style={trainerStyles.emptyLeft}>
                    <View style={trainerStyles.emptyIcon}>
                      <HugeiconsIcon icon={Dumbbell01Icon} size={ms(20)} color={`${TRAINER_COLOR}50`} />
                    </View>
                    <View>
                      <Text style={trainerStyles.emptyTitle}>Not a Trainer</Text>
                      <Text style={trainerStyles.emptySub}>Send trainer role request</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={trainerStyles.assignBtn}
                    onPress={handleSendTrainerRequest}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[TRAINER_COLOR, '#0ea5e9']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={trainerStyles.assignBtnGrad}
                    >
                      <HugeiconsIcon icon={Dumbbell01Icon} size={ms(12)} color="#fff" />
                      <Text style={trainerStyles.assignBtnText}>Make Trainer</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {/* STATE 2: Request Pending */}
              {trainerStatus === 'pending' && (
                <View style={trainerStyles.pendingCard}>
                  <LinearGradient colors={['rgba(234,179,8,0.07)', 'transparent']} style={StyleSheet.absoluteFill} />
                  <View style={trainerStyles.pendingLeft}>
                    <View style={trainerStyles.pendingAvatar}>
                      <Text style={trainerStyles.pendingAvatarText}>
                        {member.avatar || member.name?.slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={trainerStyles.pendingBadge}>
                        <View style={trainerStyles.pendingDot} />
                        <Text style={trainerStyles.pendingBadgeText}>REQUEST SENT</Text>
                      </View>
                      <Text style={trainerStyles.pendingName}>{member.name}</Text>
                      <View style={trainerStyles.pendingTimeRow}>
                        <HugeiconsIcon icon={Clock01Icon} size={ms(10)} color={Colors.zinc[600]} />
                        <Text style={trainerStyles.pendingTimeText}>
                          Requested{' '}
                          {trainerRequest?.sentAt
                            ? new Date(trainerRequest.sentAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                            : 'Today'}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={trainerStyles.cancelBtn}
                      onPress={handleCancelTrainerRequest}
                      activeOpacity={0.7}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={ms(13)} color={Colors.zinc[500]} />
                    </TouchableOpacity>
                  </View>
                  <View style={trainerStyles.pendingFooter}>
                    <HugeiconsIcon icon={InformationCircleIcon} size={ms(12)} color={Colors.zinc[600]} />
                    <Text style={trainerStyles.pendingFooterText}>
                      Waiting for {member.name} to accept on their dashboard
                    </Text>
                  </View>
                </View>
              )}

              {/* STATE 3: Accepted - Now a Trainer */}
              {trainerStatus === 'accepted' && (
                <View style={trainerStyles.activeCard}>
                  <LinearGradient
                    colors={['rgba(34,211,238,0.10)', 'rgba(34,211,238,0.03)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={trainerStyles.activeHeader}>
                    <View style={trainerStyles.activeBadge}>
                      <View style={trainerStyles.activeBadgeDot} />
                      <Text style={trainerStyles.activeBadgeText}>TRAINER ROLE ACTIVE</Text>
                    </View>
                    <TouchableOpacity
                      style={trainerStyles.removeTrainerBtn}
                      onPress={handleCancelTrainerRequest}
                      activeOpacity={0.7}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={ms(11)} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  <View style={trainerStyles.activeDivider} />

                  <View style={trainerStyles.activeInfo}>
                    <View style={trainerStyles.activeAvatar}>
                      <Text style={trainerStyles.activeAvatarText}>
                        {member.avatar || member.name?.slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={trainerStyles.activeName}>{member.name}</Text>
                      <Text style={trainerStyles.activeSpec}>Gym Trainer</Text>
                      <Text style={trainerStyles.activeExp}>
                        Accepted on{' '}
                        {trainerRequest?.respondedAt
                          ? formatDate(trainerRequest.respondedAt)
                          : 'Today'}
                      </Text>
                    </View>
                  </View>

                  <View style={trainerStyles.daysRow}>
                    <View style={trainerStyles.daysItem}>
                      <HugeiconsIcon icon={Calendar03Icon} size={ms(12)} color={TRAINER_COLOR} />
                      <Text style={trainerStyles.daysLabel}>Days as Trainer</Text>
                      <Text style={trainerStyles.daysValue}>{daysWithTrainer}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* STATE 4: Rejected */}
              {trainerStatus === 'rejected' && (
                <View style={trainerStyles.rejectedCard}>
                  <View style={trainerStyles.emptyLeft}>
                    <View style={[trainerStyles.emptyIcon, { backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.15)' }]}>
                      <HugeiconsIcon icon={Cancel01Icon} size={ms(20)} color="rgba(239,68,68,0.5)" />
                    </View>
                    <View>
                      <Text style={[trainerStyles.emptyTitle, { color: '#EF4444' }]}>Request Declined</Text>
                      <Text style={trainerStyles.emptySub}>{member.name} declined the request</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={trainerStyles.assignBtn}
                    onPress={handleSendTrainerRequest}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[TRAINER_COLOR, '#0ea5e9']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={trainerStyles.assignBtnGrad}
                    >
                      <Text style={trainerStyles.assignBtnText}>Resend</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* CONTACT INFO CARD */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>CONTACT INFO</Text>
              <TouchableOpacity style={styles.infoRow} onPress={handleCall} activeOpacity={0.7}>
                <View style={[styles.infoIconBox, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
                  <HugeiconsIcon icon={SmartPhone01Icon} size={ms(14)} color="#22C55E" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{formatPhone(member.phone)}</Text>
                </View>
                <HugeiconsIcon icon={ArrowRight01Icon} size={ms(14)} color="rgba(255,255,255,0.3)" />
              </TouchableOpacity>
              {member.email && (
                <TouchableOpacity style={[styles.infoRow, { marginBottom: 0 }]} onPress={handleEmail} activeOpacity={0.7}>
                  <View style={[styles.infoIconBox, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                    <HugeiconsIcon icon={Mail01Icon} size={ms(14)} color="#3B82F6" />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{member.email}</Text>
                  </View>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={ms(14)} color="rgba(255,255,255,0.3)" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ACTIVITY CARD */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>ACTIVITY</Text>
              <View style={styles.activityGrid}>
                <View style={styles.activityItem}>
                  <View style={[styles.activityIconBox, { backgroundColor: 'rgba(34,197,94,0.15)' }]}>
                    <HugeiconsIcon icon={Login01Icon} size={ms(16)} color="#22C55E" />
                  </View>
                  <View style={styles.activityTextBox}>
                    <Text style={styles.activityLabel}>Check-in</Text>
                    <Text style={styles.activityValue}>{member.checkinTime || '--:--'}</Text>
                    <Text style={styles.activityDate}>{member.isLive ? 'Today' : 'Last visit'}</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={[styles.activityIconBox, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
                    <HugeiconsIcon icon={Logout01Icon} size={ms(16)} color="#EF4444" />
                  </View>
                  <View style={styles.activityTextBox}>
                    <Text style={styles.activityLabel}>Check-out</Text>
                    <Text style={styles.activityValue}>{member.lastCheckout || '--:--'}</Text>
                    <Text style={styles.activityDate}>{member.isLive ? 'In progress' : 'Last visit'}</Text>
                  </View>
                </View>
              </View>
              {member.duration && (
                <View style={styles.sessionRow}>
                  <View style={[styles.sessionIconBox, { backgroundColor: `${cardAccentColor}15` }]}>
                    <HugeiconsIcon icon={Clock01Icon} size={ms(14)} color={cardAccentColor} />
                  </View>
                  <Text style={styles.sessionLabel}>Session Duration</Text>
                  <Text style={[styles.sessionValue, { color: cardAccentColor }]}>{member.duration}</Text>
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

          {/* MEMBERSHIP DETAILS CARD */}
          <View style={[styles.infoCard, { borderColor: `${cardAccentColor}20` }]}>
            <View style={styles.infoCardContent}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.infoCardTitle}>MEMBERSHIP</Text>
                <Text style={styles.daysLeftText}>{getDaysLeftText()}</Text>
              </View>
              {!isTrial && (
                <View style={styles.membershipRow}>
                  <Text style={styles.membershipLabel}>Plan</Text>
                  <View style={[styles.membershipBadge, { borderColor: `${cardAccentColor}40` }]}>
                    <View style={[styles.membershipBadgeDot, { backgroundColor: cardAccentColor }]} />
                    <Text style={[styles.membershipBadgeText, { color: cardAccentColor }]}>{member.membershipType}</Text>
                  </View>
                </View>
              )}
              {!isTrial && (
                <View style={styles.membershipRow}>
                  <Text style={styles.membershipLabel}>Workout</Text>
                  <View style={[styles.methodBadge, { backgroundColor: `${cardAccentColor}15` }]}>
                    <HugeiconsIcon
                      icon={member.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                      size={ms(12)} color={cardAccentColor}
                    />
                    <Text style={[styles.methodBadgeText, { color: 'white' }]}>
                      {member.workoutType === 'cardio_weights' ? 'Cardio + Weights' : 'Weights Only'}
                    </Text>
                  </View>
                </View>
              )}
              <View style={styles.membershipRow}>
                <Text style={styles.membershipLabel}>Status</Text>
                <View style={[styles.statusSmallBadge, { borderColor: statusConfig.borderColor }]}>
                  <HugeiconsIcon icon={statusConfig.icon} size={ms(10)} color={statusConfig.color} />
                  <Text style={[styles.statusSmallText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                </View>
              </View>
              {member.paidAmount > 0 && (
                <View style={styles.membershipRow}>
                  <Text style={styles.membershipLabel}>Paid Amount</Text>
                  <Text style={[styles.paidAmount, { color: cardAccentColor }]}>₹{member.paidAmount}</Text>
                </View>
              )}
              <View style={styles.cardDivider} />
              <View style={styles.datesRow}>
                <View style={styles.dateItem}>
                  <HugeiconsIcon icon={Calendar03Icon} size={ms(12)} color="#22C55E" />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>Joined</Text>
                    <Text style={styles.dateValue}>{formatDate(member.joinDate)}</Text>
                  </View>
                </View>
                <View style={styles.dateItem}>
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={ms(12)}
                    color={member.membershipStatus === 'expired' ? '#EF4444' : cardAccentColor}
                  />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>{member.membershipStatus === 'expired' ? 'Expired' : 'Expires'}</Text>
                    <Text style={[styles.dateValue, member.membershipStatus === 'expired' && { color: '#EF4444' }]}>
                      {formatDate(member.expiryDate)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.membershipStatusBar}>
                <HugeiconsIcon icon={statusConfig.icon} size={ms(14)} color={statusConfig.color} />
                <Text style={[styles.membershipStatusText, { color: statusConfig.color }]}>{statusConfig.message}</Text>
                {member.membershipStatus === 'active' && (
                  <Text style={[styles.membershipDaysText, { color: statusConfig.color }]}>
                    • {member.daysLeft} days remaining
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.actionButtonsContainer}>
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.editButton} onPress={handleEdit} activeOpacity={0.8}>
                <LinearGradient colors={['rgba(59,130,246,0.15)', 'rgba(59,130,246,0.05)']} style={styles.actionButtonGradient}>
                  <HugeiconsIcon icon={Edit02Icon} size={ms(14)} color="#3B82F6" />
                  <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Edit Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleRemove} activeOpacity={0.8}>
                <LinearGradient colors={['rgba(239,68,68,0.15)', 'rgba(239,68,68,0.05)']} style={styles.actionButtonGradient}>
                  <HugeiconsIcon icon={Delete02Icon} size={ms(14)} color="#EF4444" />
                  <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Remove</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: vs(30) }} />
        </ScrollView>
      </LinearGradient>

      <BottomNav
        activeTab="members"
        onTabChange={(tab) => {
          if (tab === 'dashboard') navigation.navigate('AdminDashboard');
          if (tab === 'plans') navigation.navigate('AdminAddPlan');
          if (tab === 'members') navigation.navigate('AdminUsersDetail');
          if (tab === 'settings') navigation.navigate('AdminSettings');
        }}
        userType="admin"
      />
    </ImageBackground>
  );
};

// ═══════════════════════════════════════════════════════════════
// TRAINER STYLES
// ═══════════════════════════════════════════════════════════════
const trainerStyles = StyleSheet.create({
  section: { marginBottom: vs(2) },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginBottom: vs(8),
  },
  sectionTitle: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(9),
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: s(1.5),
    flex: 1,
    textTransform: 'uppercase',
  },
  simBtn: {
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(6),
    backgroundColor: 'rgba(34,211,238,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.2)',
  },
  simBtnText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(7),
    color: TRAINER_COLOR,
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}20`,
    borderStyle: 'dashed',
    backgroundColor: '#000',
    padding: s(14),
    overflow: 'hidden',
  },
  rejectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    borderStyle: 'dashed',
    backgroundColor: '#000',
    padding: s(14),
    overflow: 'hidden',
  },
  emptyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    flex: 1,
  },
  emptyIcon: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(12),
    backgroundColor: `${TRAINER_COLOR}08`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}15`,
  },
  emptyTitle: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(10),
    color: Colors.zinc[300],
    letterSpacing: 0.3,
  },
  emptySub: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(8),
    color: Colors.zinc[600],
  },
  assignBtn: { borderRadius: ms(10), overflow: 'hidden' },
  assignBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
  },
  assignBtnText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(9),
    color: '#fff',
    letterSpacing: 0.5,
  },
  pendingCard: {
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.25)',
    backgroundColor: '#000',
    padding: s(14),
    overflow: 'hidden',
  },
  pendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginBottom: vs(10),
  },
  pendingAvatar: {
    width: ms(42),
    height: ms(42),
    borderRadius: ms(21),
    backgroundColor: 'rgba(234,179,8,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.3)',
  },
  pendingAvatarText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(10),
    color: '#EAB308',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    backgroundColor: 'rgba(234,179,8,0.10)',
    borderRadius: ms(4),
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    alignSelf: 'flex-start',
    marginBottom: vs(3),
  },
  pendingDot: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(2.5),
    backgroundColor: '#EAB308',
  },
  pendingBadgeText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(6.5),
    color: '#EAB308',
    letterSpacing: 0.8,
  },
  pendingName: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(11),
    color: Colors.white,
  },
  pendingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    marginTop: vs(3),
  },
  pendingTimeText: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(8),
    color: Colors.zinc[600],
  },
  cancelBtn: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(7),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  pendingFooterText: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(8),
    color: Colors.zinc[500],
    flex: 1,
  },
  activeCard: {
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}30`,
    backgroundColor: '#000',
    padding: s(14),
    overflow: 'hidden',
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(10),
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    backgroundColor: `${TRAINER_COLOR}12`,
    borderRadius: ms(6),
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}25`,
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
  },
  activeBadgeDot: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(2.5),
    backgroundColor: TRAINER_COLOR,
  },
  activeBadgeText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(7),
    color: TRAINER_COLOR,
    letterSpacing: s(1),
  },
  removeTrainerBtn: {
    width: ms(26),
    height: ms(26),
    borderRadius: ms(13),
    backgroundColor: 'rgba(239,68,68,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  activeDivider: {
    height: 1,
    backgroundColor: `${TRAINER_COLOR}15`,
    marginBottom: vs(12),
  },
  activeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginBottom: vs(12),
  },
  activeAvatar: {
    width: ms(46),
    height: ms(46),
    borderRadius: ms(23),
    backgroundColor: `${TRAINER_COLOR}15`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: `${TRAINER_COLOR}40`,
  },
  activeAvatarText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(10),
    color: TRAINER_COLOR,
  },
  activeName: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(13),
    color: Colors.white,
    letterSpacing: 0.3,
    marginBottom: vs(2),
  },
  activeSpec: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(9),
    color: Colors.zinc[400],
  },
  activeExp: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(8),
    color: Colors.zinc[600],
    marginTop: vs(2),
  },
  daysRow: { flexDirection: 'row', gap: s(10) },
  daysItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(7),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  daysLabel: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7.5),
    color: Colors.zinc[500],
    flex: 1,
  },
  daysValue: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(9),
    color: Colors.white,
  },
});

// ═══════════════════════════════════════════════════════════════
// MAIN STYLES
// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(8),
    paddingBottom: vs(30),
    gap: vs(12),
  },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(2) },
  backIconContainer: {
    width: ms(32), height: ms(32), borderRadius: ms(16),
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center', marginRight: s(10),
  },
  backText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(11), color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  heroCard: {
    borderRadius: ms(16), overflow: 'hidden', borderWidth: 1,
    backgroundColor: '#000000', position: 'relative',
  },
  heroBgIcon: { position: 'absolute', top: -ms(5), right: -ms(10), opacity: 0.8 },
  heroContent: { paddingLeft: ms(14), paddingRight: ms(12), paddingVertical: ms(12) },
  heroTopRow: { flexDirection: 'row', alignItems: 'flex-start' },
  avatarContainer: {
    position: 'relative', marginRight: s(12),
    borderWidth: scale(2), borderRadius: ms(27),
  },
  avatarGradient: {
    width: ms(50), height: ms(50), borderRadius: ms(25),
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(14), color: '#FFFFFF' },
  liveIndicator: {
    position: 'absolute', bottom: ms(0), right: ms(0),
    width: ms(14), height: ms(14), borderRadius: ms(7),
    backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#000000',
  },
  liveIndicatorInner: { width: ms(8), height: ms(8), borderRadius: ms(4) },
  heroInfoCol: { flex: 1 },
  heroBadgeRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: vs(4), justifyContent: 'space-between',
  },
  heroLeftBadges: { flexDirection: 'row', alignItems: 'center', gap: s(6), flexWrap: 'wrap' },
  tierBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: s(6), paddingVertical: vs(2),
    borderRadius: ms(5), borderWidth: 1, gap: s(4),
  },
  tierDot: { width: ms(4), height: ms(4), borderRadius: ms(2) },
  tierText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(6), letterSpacing: 0.5 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: s(6), paddingVertical: vs(2),
    borderRadius: ms(5), borderWidth: 1, gap: s(3),
  },
  statusText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(6), letterSpacing: 0.5 },
  liveChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(5), gap: s(3) },
  liveChipDot: { width: ms(4), height: ms(4), borderRadius: ms(2), backgroundColor: '#22C55E' },
  liveChipText: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(5), color: '#22C55E', letterSpacing: 0.5 },
  offlineChip: { paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(5) },
  offlineChipText: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(5), color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5 },
  memberName: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(11), color: '#FFFFFF', marginBottom: vs(4) },
  workoutBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: s(6), paddingVertical: vs(2),
    borderRadius: ms(4), alignSelf: 'flex-start', marginBottom: vs(5), gap: s(4),
  },
  workoutBadgeText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(6), color: 'white', letterSpacing: 0.5 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeItem: { flexDirection: 'row', alignItems: 'center', gap: s(3) },
  timeText: { fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(8), color: '#FFFFFF' },
  timeDot: {
    width: ms(3), height: ms(3), borderRadius: ms(1.5),
    backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: s(6),
  },
  heroDivider: { height: 1, marginVertical: vs(10) },
  heroBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  phoneContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  phoneIconBox: {
    width: ms(32), height: ms(32), borderRadius: ms(10),
    alignItems: 'center', justifyContent: 'center', marginRight: s(8),
  },
  phoneInfo: { flex: 1 },
  phoneLabel: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(6), color: 'rgba(255,255,255,0.4)', letterSpacing: 1.2, marginBottom: vs(1) },
  phoneNumber: { fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(8), color: '#FFFFFF', letterSpacing: 0.5 },
  quickActions: { flexDirection: 'row', gap: s(6) },
  quickActionBtn: { borderRadius: ms(10), overflow: 'hidden' },
  quickActionGradient: {
    width: ms(36), height: ms(36), alignItems: 'center', justifyContent: 'center',
    borderRadius: ms(10), borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  miniStatsCard: {
    flexDirection: 'row', backgroundColor: '#000000',
    borderRadius: ms(12), borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: vs(12), alignItems: 'center', justifyContent: 'space-around',
  },
  miniStatItem: { flex: 1, alignItems: 'center' },
  miniStatValue: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(11), color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 },
  miniStatLabel: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(6), color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginTop: vs(3) },
  miniStatDivider: { width: 1, height: vs(28), backgroundColor: 'rgba(255,255,255,0.06)' },
  infoCard: { borderRadius: ms(14), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#000000' },
  infoCardContent: { padding: ms(14) },
  infoCardTitle: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(9), color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, marginBottom: vs(12) },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12) },
  daysLeftText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(10), color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(10) },
  infoIconBox: { width: ms(34), height: ms(34), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center', marginRight: s(10) },
  infoTextContainer: { flex: 1 },
  infoLabel: { fontFamily: Fonts.rajdhani?.medium || 'System', fontSize: rf(9), color: 'rgba(255,255,255,0.5)', marginBottom: vs(1) },
  infoValue: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(12), color: '#FFFFFF' },
  activityGrid: { flexDirection: 'row', gap: s(10), marginBottom: vs(10) },
  activityItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: ms(12),
    padding: ms(10), borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', gap: s(8),
  },
  activityIconBox: { width: ms(34), height: ms(34), borderRadius: ms(17), alignItems: 'center', justifyContent: 'center' },
  activityTextBox: { flex: 1 },
  activityLabel: { fontFamily: Fonts.rajdhani?.medium || 'System', fontSize: rf(9), color: 'rgba(255,255,255,0.6)' },
  activityValue: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(12), color: '#FFFFFF', marginVertical: vs(1) },
  activityDate: { fontFamily: Fonts.rajdhani?.medium || 'System', fontSize: rf(8), color: 'rgba(255,255,255,0.4)' },
  sessionRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: ms(10),
    paddingVertical: vs(8), paddingHorizontal: s(10), marginBottom: vs(10), gap: s(8),
  },
  sessionIconBox: { width: ms(28), height: ms(28), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center' },
  sessionLabel: { flex: 1, fontFamily: Fonts.rajdhani?.medium || 'System', fontSize: rf(10), color: 'rgba(255,255,255,0.6)' },
  sessionValue: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(12) },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: ms(12),
    paddingVertical: ms(14), paddingHorizontal: ms(10),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(18), color: '#FFFFFF' },
  statLabel: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(10), color: 'rgba(255,255,255,0.6)', marginTop: vs(4) },
  statDivider: { width: 1, height: vs(35), backgroundColor: 'rgba(255,255,255,0.1)' },
  membershipRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(10) },
  membershipLabel: { fontFamily: Fonts.rajdhani?.medium || 'System', fontSize: rf(11), color: 'rgba(255,255,255,0.6)' },
  membershipBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(8), paddingVertical: vs(4), borderRadius: ms(6), borderWidth: 1, gap: s(4) },
  membershipBadgeDot: { width: ms(5), height: ms(5), borderRadius: ms(2.5) },
  membershipBadgeText: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(9), letterSpacing: 0.3 },
  methodBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(8), paddingVertical: vs(4), borderRadius: ms(6), gap: s(4) },
  methodBadgeText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(9) },
  statusSmallBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(6), borderWidth: 1, gap: s(4) },
  statusSmallText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(8), letterSpacing: 0.5 },
  paidAmount: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(13) },
  cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: vs(10) },
  datesRow: { flexDirection: 'row', gap: s(8), marginBottom: vs(10) },
  dateItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: ms(10),
    padding: ms(10), gap: s(8), borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  dateInfo: { flex: 1 },
  dateLabel: { fontFamily: Fonts.rajdhani?.medium || 'System', fontSize: rf(8), color: 'rgba(255,255,255,0.5)', marginBottom: vs(1) },
  dateValue: { fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(10), color: '#FFFFFF' },
  membershipStatusBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: vs(4), gap: s(6) },
  membershipStatusText: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(11), letterSpacing: 0.3 },
  membershipDaysText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(10), opacity: 0.8 },
  actionButtonsContainer: { marginTop: vs(4), gap: vs(10) },
  actionButtonsRow: { flexDirection: 'row', gap: s(10) },
  editButton: { flex: 1, borderRadius: ms(10), overflow: 'hidden' },
  deleteButton: { flex: 1, borderRadius: ms(10), overflow: 'hidden' },
  actionButtonGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: vs(12), borderRadius: ms(10),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: s(6),
  },
  actionButtonText: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(11), letterSpacing: 0.3 },
});

export default MembersProfileScreen;