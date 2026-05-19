// src/screens/admin/AdminTrainerProfileScreen.js
import React from 'react';
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
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Mail01Icon,
  Shield01Icon,
  Timer01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  UserAdd01Icon,
} from '@hugeicons/core-free-icons';

import Header from '../../../components/shared/Header';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import { useTrainer } from '../../../context/TrainerContext';

const s  = (size) => scale(size * 0.9);
const ms = (size) => moderateScale(size * 0.85, 0.2);
const vs = (size) => verticalScale(size * 0.85);
const rf = (size) => RFValue(size);

const TRAINER_COLOR = '#22D3EE';

// ═══════════════════════════════════════════════════════════════
// CONFIGS
// ═══════════════════════════════════════════════════════════════
const TIER_TEMPLATES = {
  'ELITE TIER': {
    badge: 'ELITE',
    iconColor: '#EAB308',
    bgColor: 'rgba(234,179,8,0.15)',
    borderColor: 'rgba(234,179,8,0.35)',
  },
  'LEGENDARY TIER': {
    badge: 'LEGENDARY',
    iconColor: '#a855f7',
    bgColor: 'rgba(168,85,247,0.15)',
    borderColor: 'rgba(168,85,247,0.35)',
  },
};

const TRIAL_CONFIG = {
  iconColor: '#3B82F6',
  bgColor: 'rgba(59,130,246,0.15)',
  borderColor: 'rgba(59,130,246,0.35)',
};

const MEMBERSHIP_STATUS = {
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
const getTierConfig   = (tier)   => TIER_TEMPLATES[tier]     || TIER_TEMPLATES['ELITE TIER'];
const getStatusConfig = (status) => MEMBERSHIP_STATUS[status] || MEMBERSHIP_STATUS.active;

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const formatPhone = (phone) => {
  const c = phone?.replace(/\D/g, '') || '';
  return c.length === 12
    ? `+${c.slice(0, 2)} ${c.slice(2, 7)} ${c.slice(7)}`
    : phone;
};

const getDaysLeftText = (member) => {
  if (member.membershipStatus === 'expired') return 'Expired';
  if (member.membershipStatus === 'trial')   return `${member.daysLeft} days trial left`;
  return `${member.daysLeft} days left`;
};

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminTrainerProfileScreen = ({ navigation, route }) => {
  const member = route?.params?.member;

  // ✅ NEW: Simplified trainer context
  const { addTrainer, removeTrainer, isTrainer, getTrainer } = useTrainer();

  const isMemberTrainer = member ? isTrainer(member.id) : false;
  const trainerData     = member ? getTrainer(member.id) : null;

  // Days as trainer
  const daysAsTrainer = trainerData?.assignedAt
    ? Math.floor(
        (Date.now() - new Date(trainerData.assignedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  if (!member) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff' }}>Member not found</Text>
      </View>
    );
  }

  const isTrial      = member.membershipStatus === 'trial';
  const tierConfig   = isTrial ? null : getTierConfig(member.membershipType);
  const statusConfig = getStatusConfig(member.membershipStatus);
  const accentColor  = isTrial ? TRIAL_CONFIG.iconColor : tierConfig?.iconColor || '#EAB308';

  // ── Handlers ──
  const handleGoBack = () => {
    if (navigation?.canGoBack()) navigation.goBack();
    else navigation?.navigate('AdminAddTrainer');
  };

  const handleCall     = () => Linking.openURL(`tel:${member.phone.replace(/\D/g, '')}`);
  const handleWhatsApp = () => Linking.openURL(`whatsapp://send?phone=${member.phone.replace(/\D/g, '')}`);
  const handleEmail    = () => { if (member.email) Linking.openURL(`mailto:${member.email}`); };

  // ✅ NEW: Direct trainer assignment
  const handleMakeTrainer = () => {
    Alert.alert(
      'Make Trainer',
      `Assign ${member.name} as a trainer?\n\nThis will take effect immediately.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign as Trainer',
          onPress: async () => {
            try {
              await addTrainer(member.id, member.name, member.memberId);
              Alert.alert(
                'Trainer Assigned ✅',
                `${member.name} is now a trainer!\n\nThey will see the trainer dashboard when they open the app.`
              );
            } catch (e) {
              Alert.alert('Error', 'Failed to assign trainer');
            }
          },
        },
      ]
    );
  };

  // ✅ Remove trainer
  const handleRemoveTrainer = () => {
    Alert.alert(
      'Remove Trainer',
      `Remove ${member.name} from trainer role?\n\nThey will return to regular member dashboard.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove Trainer',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTrainer(member.id);
              Alert.alert('Removed ✅', `${member.name} is no longer a trainer.`);
            } catch (e) {
              Alert.alert('Error', 'Failed to remove trainer');
            }
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={st.background}
      blurRadius={Platform.OS === 'ios' ? 8 : 12}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.92)', '#000']}
        style={st.gradient}
      >
        <Header title="MEMBER PROFILE" showMenu={false} />

        <ScrollView
          style={st.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={st.scroll}
        >
          {/* ── Back Button ── */}
          <TouchableOpacity style={st.backBtn} onPress={handleGoBack} activeOpacity={0.7}>
            <View style={st.backIcon}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={ms(16)} color="rgba(255,255,255,0.6)" />
            </View>
            <Text style={st.backText}>Back to Members</Text>
          </TouchableOpacity>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* HERO CARD */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={[st.heroCard, { borderColor: isMemberTrainer ? `${TRAINER_COLOR}40` : `${accentColor}30` }]}>
            <View style={st.heroBgIcon}>
              <HugeiconsIcon
                icon={Shield01Icon}
                size={ms(100)}
                color={isMemberTrainer ? `${TRAINER_COLOR}15` : `${accentColor}15`}
                strokeWidth={0.5}
              />
            </View>

            <View style={st.heroContent}>
              <View style={st.heroTopRow}>
                {/* Avatar */}
                <View
                  style={[
                    st.avatarWrap,
                    {
                      borderColor: isMemberTrainer
                        ? `${TRAINER_COLOR}80`
                        : isTrial
                        ? `${TRIAL_CONFIG.iconColor}80`
                        : `${tierConfig?.iconColor || accentColor}60`,
                      backgroundColor: isMemberTrainer
                        ? `${TRAINER_COLOR}15`
                        : isTrial
                        ? TRIAL_CONFIG.bgColor
                        : `${tierConfig?.iconColor || accentColor}15`,
                    },
                  ]}
                >
                  <LinearGradient colors={['black', 'black']} style={st.avatarGrad}>
                    <Text style={[st.avatarText, isMemberTrainer && { color: TRAINER_COLOR }]}>
                      {member.avatar || member.name?.slice(0, 2).toUpperCase()}
                    </Text>
                  </LinearGradient>
                  <View style={st.liveIndicator}>
                    <View
                      style={[
                        st.liveInner,
                        { backgroundColor: member.isLive ? '#22C55E' : 'rgba(255,255,255,0.25)' },
                      ]}
                    />
                  </View>
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <View style={st.badgeRow}>
                    <View style={st.badgesLeft}>
                      {/* ✅ Show TRAINER badge if trainer */}
                      {isMemberTrainer ? (
                        <View style={[st.tierBadge, { borderColor: `${TRAINER_COLOR}40`, backgroundColor: `${TRAINER_COLOR}10` }]}>
                          <HugeiconsIcon icon={Dumbbell01Icon} size={ms(10)} color={TRAINER_COLOR} />
                          <Text style={[st.tierBadgeText, { color: TRAINER_COLOR }]}>TRAINER</Text>
                        </View>
                      ) : (
                        <>
                          {!isTrial && tierConfig && (
                            <View style={[st.tierBadge, { borderColor: `${tierConfig.iconColor}40` }]}>
                              <View style={[st.dot, { backgroundColor: tierConfig.iconColor }]} />
                              <Text style={[st.tierBadgeText, { color: Colors.zinc[400] }]}>{tierConfig.badge}</Text>
                            </View>
                          )}
                        </>
                      )}
                      <View style={[st.statusBadge, { borderColor: statusConfig.borderColor }]}>
                        <HugeiconsIcon icon={statusConfig.icon} size={ms(10)} color={statusConfig.color} />
                        <Text style={[st.statusBadgeText, { color: Colors.zinc[400] }]}>{statusConfig.label}</Text>
                      </View>
                    </View>
                    {member.isLive ? (
                      <View style={st.liveChip}>
                        <View style={st.liveChipDot} />
                        <Text style={st.liveChipText}>LIVE</Text>
                      </View>
                    ) : (
                      <View style={st.offlineChip}>
                        <Text style={st.offlineChipText}>OFFLINE</Text>
                      </View>
                    )}
                  </View>

                  <Text style={st.memberName} numberOfLines={1}>{member.name}</Text>

                  {/* Workout Badge or Trainer Badge */}
                  {isMemberTrainer ? (
                    <View style={[st.workoutBadge, { backgroundColor: `${TRAINER_COLOR}15` }]}>
                      <HugeiconsIcon icon={Dumbbell01Icon} size={ms(10)} color={TRAINER_COLOR} />
                      <Text style={[st.workoutBadgeText, { color: TRAINER_COLOR }]}>GYM TRAINER</Text>
                    </View>
                  ) : (
                    !isTrial && tierConfig && (
                      <View style={[st.workoutBadge, { backgroundColor: `${accentColor}15` }]}>
                        <HugeiconsIcon
                          icon={member.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                          size={ms(10)}
                          color={accentColor}
                        />
                        <Text style={st.workoutBadgeText}>
                          {member.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' : 'WEIGHTS ONLY'}
                        </Text>
                      </View>
                    )
                  )}

                  <View style={st.timeRow}>
                    {member.isLive && member.checkinTime ? (
                      <>
                        <View style={st.timeItem}>
                          <HugeiconsIcon icon={Login01Icon} size={ms(11)} color="#22C55E" />
                          <Text style={st.timeText}>{member.checkinTime}</Text>
                        </View>
                        {member.duration && (
                          <>
                            <View style={st.timeDot} />
                            <View style={st.timeItem}>
                              <HugeiconsIcon icon={Clock01Icon} size={ms(11)} color={accentColor} />
                              <Text style={st.timeText}>{member.duration}</Text>
                            </View>
                          </>
                        )}
                      </>
                    ) : (
                      <View style={st.timeItem}>
                        <HugeiconsIcon icon={Clock01Icon} size={ms(11)} color="rgba(255,255,255,0.3)" />
                        <Text style={[st.timeText, { color: 'rgba(255,255,255,0.4)' }]}>
                          Last: {member.lastCheckout || 'N/A'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={[st.heroDivider, { backgroundColor: isMemberTrainer ? `${TRAINER_COLOR}25` : `${accentColor}25` }]} />

              {/* Bottom Row */}
              <View style={st.heroBottomRow}>
                <View style={st.phoneRow}>
                  <View style={[st.phoneIcon, { backgroundColor: isMemberTrainer ? `${TRAINER_COLOR}12` : `${accentColor}12` }]}>
                    <HugeiconsIcon icon={SmartPhone01Icon} size={ms(14)} color={isMemberTrainer ? TRAINER_COLOR : accentColor} />
                  </View>
                  <View>
                    <Text style={st.phoneLabel}>CONTACT</Text>
                    <Text style={st.phoneNumber}>{formatPhone(member.phone)}</Text>
                  </View>
                </View>

                <View style={st.quickActions}>
                  <TouchableOpacity style={st.qaBtn} onPress={handleCall} activeOpacity={0.7}>
                    <LinearGradient colors={['black', 'black']} style={st.qaGrad}>
                      <HugeiconsIcon icon={Call02Icon} size={ms(18)} color="#22C55E" />
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity style={st.qaBtn} onPress={handleWhatsApp} activeOpacity={0.7}>
                    <LinearGradient colors={['black', 'black']} style={st.qaGrad}>
                      <HugeiconsIcon icon={WhatsappIcon} size={ms(18)} color="#25D366" />
                    </LinearGradient>
                  </TouchableOpacity>
                  {member.email && (
                    <TouchableOpacity style={st.qaBtn} onPress={handleEmail} activeOpacity={0.7}>
                      <LinearGradient colors={['black', 'black']} style={st.qaGrad}>
                        <HugeiconsIcon icon={Mail01Icon} size={ms(18)} color="#3B82F6" />
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* MINI STATS */}
          <View style={st.miniStatsCard}>
            <View style={st.miniStatItem}>
              <Text style={st.miniStatValue}>{member.memberId}</Text>
              <Text style={st.miniStatLabel}>MEMBER ID</Text>
            </View>
            <View style={st.miniStatDivider} />
            <View style={st.miniStatItem}>
              <Text style={[st.miniStatValue, { color: '#FFFFFF' }]}>{member.totalVisits || 0}</Text>
              <Text style={st.miniStatLabel}>TOTAL VISITS</Text>
            </View>
            <View style={st.miniStatDivider} />
            <View style={st.miniStatItem}>
              <Text style={[st.miniStatValue, { color: '#FFFFFF' }]}>{member.currentStreak || 0}🔥</Text>
              <Text style={st.miniStatLabel}>STREAK</Text>
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* ✅ TRAINER SECTION - SIMPLIFIED (2 States Only) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={trainerSt.section}>
            <View style={trainerSt.sectionTitleRow}>
              <HugeiconsIcon icon={Dumbbell01Icon} size={ms(13)} color={TRAINER_COLOR} />
              <Text style={trainerSt.sectionTitle}>TRAINER ROLE</Text>
            </View>

            {/* STATE 1: Not a Trainer */}
            {!isMemberTrainer && (
              <View style={trainerSt.emptyCard}>
                <LinearGradient colors={['rgba(34,211,238,0.05)', 'transparent']} style={StyleSheet.absoluteFill} />
                <View style={trainerSt.emptyLeft}>
                  <View style={trainerSt.emptyIcon}>
                    <HugeiconsIcon icon={Dumbbell01Icon} size={ms(20)} color={`${TRAINER_COLOR}50`} />
                  </View>
                  <View>
                    <Text style={trainerSt.emptyTitle}>Not a Trainer</Text>
                    <Text style={trainerSt.emptySub}>Assign as trainer</Text>
                  </View>
                </View>
                <TouchableOpacity style={trainerSt.assignBtn} onPress={handleMakeTrainer} activeOpacity={0.8}>
                  <LinearGradient
                    colors={[TRAINER_COLOR, '#0ea5e9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={trainerSt.assignBtnGrad}
                  >
                    <HugeiconsIcon icon={UserAdd01Icon} size={ms(12)} color="#fff" />
                    <Text style={trainerSt.assignBtnText}>Make Trainer</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* STATE 2: Already a Trainer */}
            {isMemberTrainer && (
              <View style={trainerSt.activeCard}>
                <LinearGradient
                  colors={['rgba(34,211,238,0.10)', 'rgba(34,211,238,0.03)', 'transparent']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={trainerSt.activeHeader}>
                  <View style={trainerSt.activeBadge}>
                    <View style={trainerSt.activeBadgeDot} />
                    <Text style={trainerSt.activeBadgeText}>TRAINER ROLE ACTIVE</Text>
                  </View>
                  <TouchableOpacity style={trainerSt.removeTrainerBtn} onPress={handleRemoveTrainer} activeOpacity={0.7}>
                    <HugeiconsIcon icon={Cancel01Icon} size={ms(11)} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                <View style={trainerSt.activeDivider} />

                <View style={trainerSt.activeInfo}>
                  <View style={trainerSt.activeAvatar}>
                    <Text style={trainerSt.activeAvatarText}>
                      {member.avatar || member.name?.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={trainerSt.activeName}>{member.name}</Text>
                    <Text style={trainerSt.activeSpec}>Gym Trainer</Text>
                    <Text style={trainerSt.activeExp}>
                      Assigned on{' '}
                      {trainerData?.assignedAt
                        ? formatDate(trainerData.assignedAt)
                        : 'Today'}
                    </Text>
                  </View>
                </View>

                <View style={trainerSt.daysRow}>
                  <View style={trainerSt.daysItem}>
                    <HugeiconsIcon icon={Calendar03Icon} size={ms(12)} color={TRAINER_COLOR} />
                    <Text style={trainerSt.daysLabel}>Days as Trainer</Text>
                    <Text style={trainerSt.daysValue}>{daysAsTrainer}</Text>
                  </View>
                  <View style={trainerSt.daysItem}>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={ms(12)} color="#22C55E" />
                    <Text style={trainerSt.daysLabel}>Status</Text>
                    <Text style={[trainerSt.daysValue, { color: '#22C55E' }]}>Active</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* CONTACT INFO */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={st.infoCard}>
            <View style={st.infoCardPad}>
              <Text style={st.infoCardTitle}>CONTACT INFO</Text>
              <TouchableOpacity style={st.infoRow} onPress={handleCall} activeOpacity={0.7}>
                <View style={[st.infoIcon, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
                  <HugeiconsIcon icon={SmartPhone01Icon} size={ms(14)} color="#22C55E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={st.infoLabel}>Phone</Text>
                  <Text style={st.infoValue}>{formatPhone(member.phone)}</Text>
                </View>
                <HugeiconsIcon icon={ArrowRight01Icon} size={ms(14)} color="rgba(255,255,255,0.3)" />
              </TouchableOpacity>
              {member.email && (
                <TouchableOpacity style={[st.infoRow, { marginBottom: 0 }]} onPress={handleEmail} activeOpacity={0.7}>
                  <View style={[st.infoIcon, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                    <HugeiconsIcon icon={Mail01Icon} size={ms(14)} color="#3B82F6" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.infoLabel}>Email</Text>
                    <Text style={st.infoValue}>{member.email}</Text>
                  </View>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={ms(14)} color="rgba(255,255,255,0.3)" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* ACTIVITY */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={st.infoCard}>
            <View style={st.infoCardPad}>
              <Text style={st.infoCardTitle}>ACTIVITY</Text>
              <View style={st.activityGrid}>
                <View style={st.activityItem}>
                  <View style={[st.activityIcon, { backgroundColor: 'rgba(34,197,94,0.15)' }]}>
                    <HugeiconsIcon icon={Login01Icon} size={ms(16)} color="#22C55E" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.activityLabel}>Check-in</Text>
                    <Text style={st.activityValue}>{member.checkinTime || '--:--'}</Text>
                    <Text style={st.activityDate}>{member.isLive ? 'Today' : 'Last visit'}</Text>
                  </View>
                </View>
                <View style={st.activityItem}>
                  <View style={[st.activityIcon, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
                    <HugeiconsIcon icon={Logout01Icon} size={ms(16)} color="#EF4444" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.activityLabel}>Check-out</Text>
                    <Text style={st.activityValue}>{member.lastCheckout || '--:--'}</Text>
                    <Text style={st.activityDate}>{member.isLive ? 'In progress' : 'Last visit'}</Text>
                  </View>
                </View>
              </View>
              {member.duration && (
                <View style={st.sessionRow}>
                  <View style={[st.sessionIcon, { backgroundColor: `${accentColor}15` }]}>
                    <HugeiconsIcon icon={Clock01Icon} size={ms(14)} color={accentColor} />
                  </View>
                  <Text style={st.sessionLabel}>Session Duration</Text>
                  <Text style={[st.sessionValue, { color: accentColor }]}>{member.duration}</Text>
                </View>
              )}
              <View style={st.statsRow}>
                <View style={st.statItem}>
                  <Text style={st.statValue}>{member.totalVisits || 0}</Text>
                  <Text style={st.statLabel}>Total Visits</Text>
                </View>
                <View style={st.statDiv} />
                <View style={st.statItem}>
                  <Text style={st.statValue}>{member.currentStreak || 0}</Text>
                  <Text style={st.statLabel}>Day Streak 🔥</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* MEMBERSHIP */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={[st.infoCard, { borderColor: `${accentColor}20` }]}>
            <View style={st.infoCardPad}>
              <View style={st.cardTitleRow}>
                <Text style={st.infoCardTitle}>MEMBERSHIP</Text>
                <Text style={st.daysLeftText}>{getDaysLeftText(member)}</Text>
              </View>
              {!isTrial && tierConfig && (
                <View style={st.memRow}>
                  <Text style={st.memLabel}>Plan</Text>
                  <View style={[st.memBadge, { borderColor: `${tierConfig.iconColor}40` }]}>
                    <View style={[st.dot, { backgroundColor: tierConfig.iconColor }]} />
                    <Text style={[st.memBadgeText, { color: tierConfig.iconColor }]}>{member.membershipType}</Text>
                  </View>
                </View>
              )}
              {!isTrial && tierConfig && (
                <View style={st.memRow}>
                  <Text style={st.memLabel}>Workout</Text>
                  <View style={[st.methodBadge, { backgroundColor: `${accentColor}15` }]}>
                    <HugeiconsIcon
                      icon={member.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                      size={ms(12)}
                      color={accentColor}
                    />
                    <Text style={st.methodBadgeText}>
                      {member.workoutType === 'cardio_weights' ? 'Cardio + Weights' : 'Weights Only'}
                    </Text>
                  </View>
                </View>
              )}
              <View style={st.memRow}>
                <Text style={st.memLabel}>Status</Text>
                <View style={[st.statusSmall, { borderColor: statusConfig.borderColor }]}>
                  <HugeiconsIcon icon={statusConfig.icon} size={ms(10)} color={statusConfig.color} />
                  <Text style={[st.statusSmallText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                </View>
              </View>
              {member.paidAmount > 0 && (
                <View style={st.memRow}>
                  <Text style={st.memLabel}>Paid Amount</Text>
                  <Text style={[st.paidAmount, { color: accentColor }]}>₹{member.paidAmount}</Text>
                </View>
              )}
              <View style={st.cardDivider} />
              <View style={st.datesRow}>
                <View style={st.dateItem}>
                  <HugeiconsIcon icon={Calendar03Icon} size={ms(12)} color="#22C55E" />
                  <View style={{ flex: 1 }}>
                    <Text style={st.dateLabel}>Joined</Text>
                    <Text style={st.dateValue}>{formatDate(member.joinDate)}</Text>
                  </View>
                </View>
                <View style={st.dateItem}>
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={ms(12)}
                    color={member.membershipStatus === 'expired' ? '#EF4444' : accentColor}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={st.dateLabel}>{member.membershipStatus === 'expired' ? 'Expired' : 'Expires'}</Text>
                    <Text style={[st.dateValue, member.membershipStatus === 'expired' && { color: '#EF4444' }]}>
                      {formatDate(member.expiryDate)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={st.memStatusBar}>
                <HugeiconsIcon icon={statusConfig.icon} size={ms(14)} color={statusConfig.color} />
                <Text style={[st.memStatusText, { color: statusConfig.color }]}>{statusConfig.message}</Text>
                {member.membershipStatus === 'active' && (
                  <Text style={[st.memDaysText, { color: statusConfig.color }]}>• {member.daysLeft} days remaining</Text>
                )}
              </View>
            </View>
          </View>

          <View style={{ height: vs(30) }} />
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

// ═══════════════════════════════════════════════════════════════
// TRAINER STYLES
// ═══════════════════════════════════════════════════════════════
const trainerSt = StyleSheet.create({
  section: { marginBottom: vs(2) },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(8) },
  sectionTitle: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(9), color: 'rgba(255,255,255,0.5)',
    letterSpacing: s(1.5), flex: 1, textTransform: 'uppercase',
  },
  emptyCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: ms(14), borderWidth: 1, borderColor: `${TRAINER_COLOR}20`,
    borderStyle: 'dashed', backgroundColor: '#000', padding: s(14), overflow: 'hidden',
  },
  emptyLeft: { flexDirection: 'row', alignItems: 'center', gap: s(10), flex: 1 },
  emptyIcon: {
    width: ms(40), height: ms(40), borderRadius: ms(12),
    backgroundColor: `${TRAINER_COLOR}08`, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: `${TRAINER_COLOR}15`,
  },
  emptyTitle: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(10), color: Colors.zinc[300], letterSpacing: 0.3 },
  emptySub: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8), color: Colors.zinc[600] },
  assignBtn: { borderRadius: ms(10), overflow: 'hidden' },
  assignBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(12), paddingVertical: vs(8) },
  assignBtnText: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(9), color: '#fff', letterSpacing: 0.5 },
  activeCard: { borderRadius: ms(14), borderWidth: 1, borderColor: `${TRAINER_COLOR}30`, backgroundColor: '#000', padding: s(14), overflow: 'hidden' },
  activeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(10) },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: s(5),
    backgroundColor: `${TRAINER_COLOR}12`, borderRadius: ms(6),
    borderWidth: 1, borderColor: `${TRAINER_COLOR}25`,
    paddingHorizontal: s(8), paddingVertical: vs(3),
  },
  activeBadgeDot: { width: ms(5), height: ms(5), borderRadius: ms(2.5), backgroundColor: TRAINER_COLOR },
  activeBadgeText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(7), color: TRAINER_COLOR, letterSpacing: s(1) },
  removeTrainerBtn: {
    width: ms(26), height: ms(26), borderRadius: ms(13),
    backgroundColor: 'rgba(239,68,68,0.08)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
  },
  activeDivider: { height: 1, backgroundColor: `${TRAINER_COLOR}15`, marginBottom: vs(12) },
  activeInfo: { flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(12) },
  activeAvatar: {
    width: ms(46), height: ms(46), borderRadius: ms(23),
    backgroundColor: `${TRAINER_COLOR}15`, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: `${TRAINER_COLOR}40`,
  },
  activeAvatarText: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(10), color: TRAINER_COLOR },
  activeName: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(13), color: Colors.white, letterSpacing: 0.3, marginBottom: vs(2) },
  activeSpec: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(9), color: Colors.zinc[400] },
  activeExp: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8), color: Colors.zinc[600], marginTop: vs(2) },
  daysRow: { flexDirection: 'row', gap: s(10) },
  daysItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: s(6),
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: ms(8),
    paddingHorizontal: s(10), paddingVertical: vs(7),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  daysLabel: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7.5), color: Colors.zinc[500], flex: 1 },
  daysValue: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(9), color: Colors.white },
});

// ═══════════════════════════════════════════════════════════════
// MAIN STYLES
// ═══════════════════════════════════════════════════════════════
const st = StyleSheet.create({
  background: { flex: 1 },
  gradient: { flex: 1 },
  container: { flex: 1 },
  scroll: { paddingHorizontal: s(14), paddingTop: vs(8), paddingBottom: vs(30), gap: vs(12) },

  backBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(2) },
  backIcon: {
    width: ms(32), height: ms(32), borderRadius: ms(16),
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center', marginRight: s(10),
  },
  backText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(11), color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.8, textTransform: 'uppercase',
  },

  heroCard: { borderRadius: ms(16), overflow: 'hidden', borderWidth: 1, backgroundColor: '#000', position: 'relative' },
  heroBgIcon: { position: 'absolute', top: -ms(5), right: -ms(10), opacity: 0.8 },
  heroContent: { paddingLeft: ms(14), paddingRight: ms(12), paddingVertical: ms(12) },
  heroTopRow: { flexDirection: 'row', alignItems: 'flex-start' },
  avatarWrap: { position: 'relative', marginRight: s(12), borderWidth: scale(2), borderRadius: ms(27) },
  avatarGrad: { width: ms(50), height: ms(50), borderRadius: ms(25), alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(14), color: '#fff' },
  liveIndicator: {
    position: 'absolute', bottom: 0, right: 0,
    width: ms(14), height: ms(14), borderRadius: ms(7),
    backgroundColor: '#000', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#000',
  },
  liveInner: { width: ms(8), height: ms(8), borderRadius: ms(4) },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(4), justifyContent: 'space-between' },
  badgesLeft: { flexDirection: 'row', alignItems: 'center', gap: s(6), flexWrap: 'wrap' },
  tierBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(5), borderWidth: 1, gap: s(4) },
  dot: { width: ms(4), height: ms(4), borderRadius: ms(2) },
  tierBadgeText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(6), letterSpacing: 0.5 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(5), borderWidth: 1, gap: s(3) },
  statusBadgeText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(6), letterSpacing: 0.5 },
  liveChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(5), gap: s(3) },
  liveChipDot: { width: ms(4), height: ms(4), borderRadius: ms(2), backgroundColor: '#22C55E' },
  liveChipText: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(5), color: '#22C55E', letterSpacing: 0.5 },
  offlineChip: { paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(5) },
  offlineChipText: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(5), color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5 },
  memberName: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(11), color: '#fff', marginBottom: vs(4) },
  workoutBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(4), alignSelf: 'flex-start', marginBottom: vs(5), gap: s(4) },
  workoutBadgeText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(6), color: 'white', letterSpacing: 0.5 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeItem: { flexDirection: 'row', alignItems: 'center', gap: s(3) },
  timeText: { fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(8), color: '#fff' },
  timeDot: { width: ms(3), height: ms(3), borderRadius: ms(1.5), backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: s(6) },
  heroDivider: { height: 1, marginVertical: vs(10) },
  heroBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  phoneIcon: { width: ms(32), height: ms(32), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center', marginRight: s(8) },
  phoneLabel: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(6), color: 'rgba(255,255,255,0.4)', letterSpacing: 1.2, marginBottom: vs(1) },
  phoneNumber: { fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(8), color: '#fff', letterSpacing: 0.5 },
  quickActions: { flexDirection: 'row', gap: s(6) },
  qaBtn: { borderRadius: ms(10), overflow: 'hidden' },
  qaGrad: { width: ms(36), height: ms(36), alignItems: 'center', justifyContent: 'center', borderRadius: ms(10), borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },

  miniStatsCard: {
    flexDirection: 'row', backgroundColor: '#000000',
    borderRadius: ms(12), borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: vs(12), alignItems: 'center', justifyContent: 'space-around',
  },
  miniStatItem: { flex: 1, alignItems: 'center' },
  miniStatValue: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(11), color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 },
  miniStatLabel: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(6), color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginTop: vs(3) },
  miniStatDivider: { width: 1, height: vs(28), backgroundColor: 'rgba(255,255,255,0.06)' },

  infoCard: { borderRadius: ms(14), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#000' },
  infoCardPad: { padding: ms(14) },
  infoCardTitle: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(9), color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, marginBottom: vs(12) },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12) },
  daysLeftText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(10), color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(10) },
  infoIcon: { width: ms(34), height: ms(34), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center', marginRight: s(10) },
  infoLabel: { fontFamily: Fonts.rajdhani?.medium || 'System', fontSize: rf(9), color: 'rgba(255,255,255,0.5)', marginBottom: vs(1) },
  infoValue: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(12), color: '#fff' },

  activityGrid: { flexDirection: 'row', gap: s(10), marginBottom: vs(10) },
  activityItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: ms(12),
    padding: ms(10), borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', gap: s(8),
  },
  activityIcon: { width: ms(34), height: ms(34), borderRadius: ms(17), alignItems: 'center', justifyContent: 'center' },
  activityLabel: { fontFamily: Fonts.rajdhani?.medium || 'System', fontSize: rf(9), color: 'rgba(255,255,255,0.6)' },
  activityValue: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(12), color: '#fff', marginVertical: vs(1) },
  activityDate: { fontFamily: Fonts.rajdhani?.medium || 'System', fontSize: rf(8), color: 'rgba(255,255,255,0.4)' },
  sessionRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: ms(10),
    paddingVertical: vs(8), paddingHorizontal: s(10), marginBottom: vs(10), gap: s(8),
  },
  sessionIcon: { width: ms(28), height: ms(28), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center' },
  sessionLabel: { flex: 1, fontFamily: Fonts.rajdhani?.medium || 'System', fontSize: rf(10), color: 'rgba(255,255,255,0.6)' },
  sessionValue: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(12) },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: ms(12),
    paddingVertical: ms(14), paddingHorizontal: ms(10),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(18), color: '#fff' },
  statLabel: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(10), color: 'rgba(255,255,255,0.6)', marginTop: vs(4) },
  statDiv: { width: 1, height: vs(35), backgroundColor: 'rgba(255,255,255,0.1)' },

  memRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(10) },
  memLabel: { fontFamily: Fonts.rajdhani?.medium || 'System', fontSize: rf(11), color: 'rgba(255,255,255,0.6)' },
  memBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(8), paddingVertical: vs(4), borderRadius: ms(6), borderWidth: 1, gap: s(4) },
  memBadgeText: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(9), letterSpacing: 0.3 },
  methodBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(8), paddingVertical: vs(4), borderRadius: ms(6), gap: s(4) },
  methodBadgeText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(9), color: 'white' },
  statusSmall: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(6), borderWidth: 1, gap: s(4) },
  statusSmallText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(8), letterSpacing: 0.5 },
  paidAmount: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(13) },
  cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: vs(10) },
  datesRow: { flexDirection: 'row', gap: s(8), marginBottom: vs(10) },
  dateItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: ms(10),
    padding: ms(10), gap: s(8), borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  dateLabel: { fontFamily: Fonts.rajdhani?.medium || 'System', fontSize: rf(8), color: 'rgba(255,255,255,0.5)', marginBottom: vs(1) },
  dateValue: { fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(10), color: '#fff' },
  memStatusBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: vs(4), gap: s(6) },
  memStatusText: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(11), letterSpacing: 0.3 },
  memDaysText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(10), opacity: 0.8 },
});

export default AdminTrainerProfileScreen;