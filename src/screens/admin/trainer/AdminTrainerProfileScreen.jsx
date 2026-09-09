// src/screens/admin/AdminTrainerProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Linking,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Call02Icon,
  MessageMultiple01Icon,
  Mail01Icon,
  SmartPhone01Icon,
  Clock01Icon,
  Login01Icon,
  Logout01Icon,
  Calendar03Icon,
  Dumbbell01Icon,
  Activity01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Shield01Icon,
  ArrowRight01Icon,
  UserAdd01Icon,
  Cancel01Icon,
  CrownIcon,
  StarIcon,
  FlashIcon,
  TimeQuarterPassIcon,
} from '@hugeicons/core-free-icons';
import Header from '../../../components/shared/Header';
import BottomNav from '../../../components/shared/BottomNav';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';

const s = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const TRAINER_COLOR = '#22D3EE';
const GOLD = '#C5A059';
const GOLD_L = '#EAB308';
const RED = '#EF4444';
const GREEN = '#22C55E';
const BLUE = '#3B82F6';
const PURPLE = '#A855F7';

// ═══════════════════════════════════════════════════════════════
// CONFIGS
// ═══════════════════════════════════════════════════════════════
const TIER_TEMPLATES = {
  'ELITE TIER':     { badge: 'ELITE',     iconColor: GOLD,   icon: CrownIcon    },
  'LEGENDARY TIER': { badge: 'LEGENDARY', iconColor: PURPLE, icon: StarIcon     },
};

const TRIAL_CONFIG = { iconColor: BLUE, badge: 'TRIAL', icon: FlashIcon };

const MEMBERSHIP_STATUS = {
  active:  { label: 'ACTIVE',  color: GREEN, icon: CheckmarkCircle02Icon, message: 'Membership Active'  },
  expired: { label: 'EXPIRED', color: RED,   icon: AlertCircleIcon,       message: 'Membership Expired' },
  trial:   { label: 'TRIAL',   color: BLUE,  icon: TimeQuarterPassIcon,   message: 'Trial Period'       },
};

const getTierConfig   = (t)  => TIER_TEMPLATES[t]    || TIER_TEMPLATES['ELITE TIER'];
const getStatusConfig = (st) => MEMBERSHIP_STATUS[st] || MEMBERSHIP_STATUS.active;

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const formatPhone = (phone) => {
  const c = phone?.replace(/\D/g, '') || '';
  return c.length === 12 ? `+${c.slice(0, 2)} ${c.slice(2, 7)} ${c.slice(7)}` : phone;
};

const getDaysLeftText = (m) => {
  if (m.membershipStatus === 'expired') return 'Expired';
  if (m.membershipStatus === 'trial')   return `${m.daysLeft} days trial left`;
  return `${m.daysLeft} days left`;
};

// ═══════════════════════════════════════════════════════════════
// DUMMY MEMBER (fallback if no route param)
// ═══════════════════════════════════════════════════════════════
const DUMMY_MEMBER = {
  id: 'm1',
  name: 'Arjun Sharma',
  avatar: 'AS',
  phone: '919876543210',
  email: 'arjun@example.com',
  memberId: 'GYM-001',
  membershipType: 'ELITE TIER',
  membershipStatus: 'active',
  workoutType: 'cardio_weights',
  isLive: true,
  checkinTime: '06:30 AM',
  lastCheckout: '08:15 AM',
  duration: '1h 45m',
  joinDate: '2024-01-15T00:00:00Z',
  expiryDate: '2025-07-15T00:00:00Z',
  daysLeft: 120,
  paidAmount: 12000,
  totalVisits: 142,
  currentStreak: 7,
};

// ═══════════════════════════════════════════════════════════════
// PULSE DOT
// ═══════════════════════════════════════════════════════════════
const PulseDot = ({ color = GREEN, size = 8 }) => {
  const anim = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1.8, duration: 1000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1,   duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <View style={{ width: size * 3, height: size * 3, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{
        position: 'absolute', width: size * 2, height: size * 2,
        borderRadius: size, backgroundColor: `${color}30`,
        transform: [{ scale: anim }],
      }} />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// GLASS CARD
// ═══════════════════════════════════════════════════════════════
const GlassCard = ({ children, style: customStyle, borderColor, onPress }) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.85}
      style={[gcSt.card, borderColor && { borderColor }, customStyle]}
    >
      {children}
    </Wrapper>
  );
};

const gcSt = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
});

// ═══════════════════════════════════════════════════════════════
// SECTION HEADER
// ═══════════════════════════════════════════════════════════════
const SectionHeader = ({ label, color = 'rgba(255,255,255,0.5)' }) => (
  <Text style={[shSt.text, { color }]}>{label}</Text>
);

const shSt = StyleSheet.create({
  text: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(7.5),
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: vs(14),
  },
});

// ═══════════════════════════════════════════════════════════════
// BADGE
// ═══════════════════════════════════════════════════════════════
const Badge = ({ label, color, icon, iconSize = 10 }) => (
  <View style={[bdSt.badge, { borderColor: `${color}40`, backgroundColor: `${color}10` }]}>
    {icon && <HugeiconsIcon icon={icon} size={ms(iconSize)} color={color} />}
    <Text style={[bdSt.text, { color }]}>{label}</Text>
  </View>
);

const bdSt = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: s(4),
    paddingHorizontal: s(8), paddingVertical: vs(4),
    borderRadius: ms(8), borderWidth: 1,
  },
  text: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(6.5), letterSpacing: 1, textTransform: 'uppercase',
  },
});

// ═══════════════════════════════════════════════════════════════
// STAT MINI
// ═══════════════════════════════════════════════════════════════
const StatMini = ({ val, label }) => (
  <View style={smSt.item}>
    <Text style={smSt.val}>{val}</Text>
    <Text style={smSt.label}>{label}</Text>
  </View>
);

const smSt = StyleSheet.create({
  item: { alignItems: 'center', flex: 1 },
  val:  { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(11), color: 'rgba(255,255,255,0.7)', marginBottom: vs(2) },
  label:{ fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7), color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase' },
});

// ═══════════════════════════════════════════════════════════════
// CONTACT ROW
// ═══════════════════════════════════════════════════════════════
const ContactRow = ({ onPress, bgColor, icon, label, val, isFirst }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[crSt.row, !isFirst && crSt.rowMargin]}
  >
    <View style={[crSt.iconBox, { backgroundColor: bgColor }]}>
      <HugeiconsIcon icon={icon} size={ms(15)} color="#fff" />
    </View>
    <View style={crSt.content}>
      <Text style={crSt.label}>{label}</Text>
      <Text style={crSt.val} numberOfLines={1}>{val}</Text>
    </View>
    <HugeiconsIcon icon={ArrowRight01Icon} size={ms(13)} color="rgba(255,255,255,0.3)" />
  </TouchableOpacity>
);

const crSt = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  rowMargin: { marginTop: vs(14) },
  iconBox:   { width: ms(42), height: ms(42), borderRadius: ms(14), alignItems: 'center', justifyContent: 'center' },
  content:   { flex: 1 },
  label:     { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7.5), color: 'rgba(255,255,255,0.5)', marginBottom: vs(1) },
  val:       { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(10), color: '#fff', letterSpacing: 0.3 },
});

// ═══════════════════════════════════════════════════════════════
// ACTIVITY CARD
// ═══════════════════════════════════════════════════════════════
const ActivityCard = ({ icon, bg, border, label, val, sub }) => (
  <View style={[acSt.card, { backgroundColor: bg, borderColor: border }]}>
    <View style={[acSt.iconBox, { backgroundColor: `${border}80` }]}>
      <HugeiconsIcon icon={icon} size={ms(15)} color="#fff" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={acSt.label}>{label}</Text>
      <Text style={acSt.val}>{val}</Text>
      <Text style={acSt.sub}>{sub}</Text>
    </View>
  </View>
);

const acSt = StyleSheet.create({
  card:    { flex: 1, flexDirection: 'row', alignItems: 'center', gap: s(10), padding: ms(12), borderRadius: ms(14), borderWidth: 1 },
  iconBox: { width: ms(36), height: ms(36), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center' },
  label:   { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7.5), color: 'rgba(255,255,255,0.6)', marginBottom: vs(1) },
  val:     { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(9.5), color: '#fff', marginBottom: vs(1) },
  sub:     { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(6.5), color: 'rgba(255,255,255,0.4)' },
});

// ═══════════════════════════════════════════════════════════════
// DATE CARD
// ═══════════════════════════════════════════════════════════════
const DateCard = ({ icon, iconColor, label, val, expired }) => (
  <View style={dcSt.card}>
    <HugeiconsIcon icon={icon} size={ms(11)} color={iconColor} />
    <View style={{ flex: 1 }}>
      <Text style={dcSt.label}>{label}</Text>
      <Text style={[dcSt.val, expired && { color: RED }]}>{val}</Text>
    </View>
  </View>
);

const dcSt = StyleSheet.create({
  card:  { flex: 1, flexDirection: 'row', alignItems: 'center', gap: s(8), padding: ms(10), borderRadius: ms(12), backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  label: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7), color: 'rgba(255,255,255,0.5)', marginBottom: vs(1) },
  val:   { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(8), color: '#fff' },
});

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminTrainerProfileScreen = ({ navigation, route }) => {
  const member = route?.params?.member || DUMMY_MEMBER;

  const [isTrainer, setIsTrainer] = useState(member?.id === 'm1');
  const trainerAssignedAt = '2024-12-01T00:00:00Z';
  const daysAsTrainer = Math.floor(
    (Date.now() - new Date(trainerAssignedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const isTrial      = member.membershipStatus === 'trial';
  const tierConfig   = isTrial ? null : getTierConfig(member.membershipType);
  const statusConfig = getStatusConfig(member.membershipStatus);
  const accentColor  = isTrial ? TRIAL_CONFIG.iconColor : tierConfig?.iconColor || GOLD_L;

  const handleCall  = () => Linking.openURL(`tel:${member.phone.replace(/\D/g, '')}`);
  const handleWA    = () => Linking.openURL(`https://wa.me/${member.phone.replace(/\D/g, '')}`);
  const handleEmail = () => member.email && Linking.openURL(`mailto:${member.email}`);

  const handleMakeTrainer = () =>
    Alert.alert('Assign Trainer', `Assign ${member.name} as a trainer?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Assign', onPress: () => { setIsTrainer(true); Alert.alert('✅', `${member.name} is now a trainer!`); } },
    ]);

  const handleRemoveTrainer = () =>
    Alert.alert('Remove Trainer', `Remove ${member.name} from trainer role?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => { setIsTrainer(false); Alert.alert('Done', `${member.name} is no longer a trainer.`); } },
    ]);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={st.bg}
      blurRadius={9}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.88)', 'rgba(0,0,0,0.95)', '#000']}
        style={st.gradient}
      >
        <SafeAreaView style={st.safe} edges={['top']}>
          <Header title="MEMBER PROFILE" showMenu={false} />

          <ScrollView
            style={st.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={st.scrollContent}
          >
            {/* ── BACK BUTTON ── */}
            <TouchableOpacity
              style={st.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <View style={st.backIcon}>
                <HugeiconsIcon icon={ArrowLeft01Icon} size={ms(15)} color="rgba(255,255,255,0.6)" />
              </View>
              <Text style={st.backText}>Back to Members</Text>
            </TouchableOpacity>

            {/* ══════════════════════════════════ HERO CARD */}
            <GlassCard borderColor={isTrainer ? `${TRAINER_COLOR}40` : `${accentColor}30`} style={st.heroCard}>
              {/* BG Shield Icon */}
              <View style={st.heroBgIcon} pointerEvents="none">
                <HugeiconsIcon icon={Shield01Icon} size={ms(120)} color={isTrainer ? TRAINER_COLOR : accentColor} strokeWidth={0.3} />
              </View>

              <View style={st.heroInner}>
                {/* Avatar Row */}
                <View style={st.avatarRow}>
                  {/* Avatar */}
                  <View style={st.avatarWrap}>
                    <View style={[st.avatar, {
                      borderColor: isTrainer ? `${TRAINER_COLOR}80` : `${accentColor}60`,
                      backgroundColor: isTrainer ? `${TRAINER_COLOR}15` : `${accentColor}15`,
                    }]}>
                      <Text style={[st.avatarText, { color: isTrainer ? TRAINER_COLOR : accentColor }]}>
                        {member.avatar}
                      </Text>
                    </View>
                    {/* Online dot */}
                    <View style={st.onlineDot}>
                      {member.isLive
                        ? <PulseDot color={GREEN} size={5} />
                        : <View style={st.offlineDot} />}
                    </View>
                  </View>

                  {/* Name + Badges */}
                  <View style={st.nameBlock}>
                    {/* Top badges row */}
                    <View style={st.badgesRow}>
                      {isTrainer ? (
                        <Badge label="TRAINER" color={TRAINER_COLOR} icon={Dumbbell01Icon} />
                      ) : (
                        !isTrial && tierConfig && (
                          <Badge label={tierConfig.badge} color={tierConfig.iconColor} icon={tierConfig.icon} />
                        )
                      )}
                      <Badge label={statusConfig.label} color={statusConfig.color} icon={statusConfig.icon} />
                      {member.isLive ? (
                        <Badge label="LIVE" color={GREEN} />
                      ) : (
                        <View style={st.offlineBadge}>
                          <Text style={st.offlineBadgeText}>OFFLINE</Text>
                        </View>
                      )}
                    </View>

                    {/* Name */}
                    <Text style={st.memberName} numberOfLines={1}>{member.name}</Text>

                    {/* Workout badge */}
                    {isTrainer ? (
                      <View style={[st.workoutBadge, { backgroundColor: `${TRAINER_COLOR}15` }]}>
                        <HugeiconsIcon icon={Dumbbell01Icon} size={ms(11)} color={TRAINER_COLOR} />
                        <Text style={[st.workoutBadgeText, { color: TRAINER_COLOR }]}>GYM TRAINER</Text>
                      </View>
                    ) : (
                      !isTrial && tierConfig && (
                        <View style={[st.workoutBadge, { backgroundColor: `${accentColor}15` }]}>
                          <HugeiconsIcon
                            icon={member.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                            size={ms(11)}
                            color={accentColor}
                          />
                          <Text style={[st.workoutBadgeText, { color: accentColor }]}>
                            {member.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' : 'WEIGHTS ONLY'}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                </View>

                {/* Time Row */}
                <View style={st.timeRow}>
                  {member.isLive && member.checkinTime ? (
                    <>
                      <View style={st.timeItem}>
                        <HugeiconsIcon icon={Login01Icon} size={ms(11)} color={GREEN} />
                        <Text style={st.timeText}>{member.checkinTime}</Text>
                      </View>
                      {member.duration && (
                        <>
                          <View style={st.timeDot} />
                          <View style={st.timeItem}>
                            <HugeiconsIcon icon={Clock01Icon} size={ms(11)} color={accentColor} />
                            <Text style={[st.timeText, { color: accentColor }]}>{member.duration}</Text>
                          </View>
                        </>
                      )}
                    </>
                  ) : (
                    <View style={st.timeItem}>
                      <HugeiconsIcon icon={Clock01Icon} size={ms(11)} color="rgba(255,255,255,0.3)" />
                      <Text style={st.timeTextMuted}>Last: {member.lastCheckout || 'N/A'}</Text>
                    </View>
                  )}
                </View>

                {/* Divider */}
                <LinearGradient
                  colors={['transparent', `${isTrainer ? TRAINER_COLOR : accentColor}25`, 'transparent']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={st.heroDivider}
                />

                {/* Contact strip */}
                <View style={st.contactStrip}>
                  <View style={st.contactLeft}>
                    <View style={[st.contactIconBox, {
                      backgroundColor: isTrainer ? `${TRAINER_COLOR}12` : `${accentColor}12`,
                    }]}>
                      <HugeiconsIcon
                        icon={SmartPhone01Icon}
                        size={ms(15)}
                        color={isTrainer ? TRAINER_COLOR : accentColor}
                      />
                    </View>
                    <View>
                      <Text style={st.contactLabel}>Contact</Text>
                      <Text style={st.contactPhone}>{formatPhone(member.phone)}</Text>
                    </View>
                  </View>

                  {/* Quick Action Buttons */}
                  <View style={st.actionBtns}>
                    <TouchableOpacity style={st.actionBtn} onPress={handleCall} activeOpacity={0.7}>
                      <HugeiconsIcon icon={Call02Icon} size={ms(14)} color={GREEN} />
                    </TouchableOpacity>
                    <TouchableOpacity style={st.actionBtn} onPress={handleWA} activeOpacity={0.7}>
                      <HugeiconsIcon icon={MessageMultiple01Icon} size={ms(14)} color="#25D366" />
                    </TouchableOpacity>
                    {member.email && (
                      <TouchableOpacity style={st.actionBtn} onPress={handleEmail} activeOpacity={0.7}>
                        <HugeiconsIcon icon={Mail01Icon} size={ms(14)} color={BLUE} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </GlassCard>

            {/* ══════════════════════════════════ MINI STATS */}
            <GlassCard style={st.miniStatsCard}>
              <StatMini val={member.memberId}          label="Member ID"    />
              <View style={st.statDivider} />
              <StatMini val={member.totalVisits || 0}  label="Total Visits" />
              <View style={st.statDivider} />
              <StatMini val={`${member.currentStreak || 0} 🔥`} label="Streak" />
            </GlassCard>

            {/* ══════════════════════════════════ TRAINER ROLE */}
            <View>
              <View style={st.sectionTitleRow}>
                <View style={[st.sideBar, { backgroundColor: TRAINER_COLOR }]} />
                <HugeiconsIcon icon={Dumbbell01Icon} size={ms(12)} color={TRAINER_COLOR} />
                <Text style={[st.sectionTitleText, { color: 'rgba(255,255,255,0.5)' }]}>TRAINER ROLE</Text>
              </View>

              {!isTrainer ? (
                /* ── NOT A TRAINER ── */
                <GlassCard borderColor={`${TRAINER_COLOR}20`}>
                  <View style={st.trainerRow}>
                    <View style={[st.trainerIconLarge, {
                      backgroundColor: `${TRAINER_COLOR}08`,
                      borderColor: `${TRAINER_COLOR}15`,
                    }]}>
                      <HugeiconsIcon icon={Dumbbell01Icon} size={ms(22)} color={`${TRAINER_COLOR}50`} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={st.trainerNotTitle}>Not a Trainer</Text>
                      <Text style={st.trainerNotSub}>Assign as trainer</Text>
                    </View>
                    <TouchableOpacity onPress={handleMakeTrainer} activeOpacity={0.85}>
                      <LinearGradient
                        colors={[TRAINER_COLOR, '#0ea5e9']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={st.makeTrainerBtn}
                      >
                        <HugeiconsIcon icon={UserAdd01Icon} size={ms(12)} color="#fff" />
                        <Text style={st.makeTrainerBtnText}>Make Trainer</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              ) : (
                /* ── IS A TRAINER ── */
                <GlassCard borderColor={`${TRAINER_COLOR}30`}>
                  <LinearGradient
                    colors={[`${TRAINER_COLOR}10`, `${TRAINER_COLOR}03`, 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={st.trainerActiveInner}>
                    {/* Top Row */}
                    <View style={st.trainerActiveTop}>
                      <Badge label="Trainer Role Active" color={TRAINER_COLOR} />
                      <TouchableOpacity
                        style={st.removeTrainerBtn}
                        onPress={handleRemoveTrainer}
                        activeOpacity={0.7}
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={ms(12)} color={RED} />
                      </TouchableOpacity>
                    </View>

                    <LinearGradient
                      colors={['transparent', `${TRAINER_COLOR}20`, 'transparent']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={st.trainerDivider}
                    />

                    {/* Avatar Row */}
                    <View style={st.trainerAvatarRow}>
                      <View style={[st.trainerAvatarBox, {
                        backgroundColor: `${TRAINER_COLOR}15`,
                        borderColor: `${TRAINER_COLOR}40`,
                      }]}>
                        <Text style={[st.trainerAvatarText, { color: TRAINER_COLOR }]}>{member.avatar}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={st.trainerActiveName}>{member.name}</Text>
                        <Text style={st.trainerActiveRole}>Gym Trainer</Text>
                        <Text style={st.trainerAssignedDate}>
                          Assigned on {formatDate(trainerAssignedAt)}
                        </Text>
                      </View>
                    </View>

                    {/* Stat Grid */}
                    <View style={st.trainerStatGrid}>
                      {[
                        { icon: Calendar03Icon,       iconColor: TRAINER_COLOR, label: 'Days as Trainer', val: daysAsTrainer, valColor: '#fff' },
                        { icon: CheckmarkCircle02Icon, iconColor: GREEN,         label: 'Status',         val: 'Active',      valColor: GREEN   },
                      ].map((item, i) => (
                        <View key={i} style={st.trainerStatCard}>
                          <HugeiconsIcon icon={item.icon} size={ms(13)} color={item.iconColor} />
                          <View style={{ flex: 1 }}>
                            <Text style={st.trainerStatLabel}>{item.label}</Text>
                            <Text style={[st.trainerStatVal, { color: item.valColor }]}>{item.val}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </GlassCard>
              )}
            </View>

            {/* ══════════════════════════════════ CONTACT INFO */}
            <GlassCard>
              <View style={st.cardPad}>
                <SectionHeader label="Contact Info" />
                <ContactRow
                  onPress={handleCall}
                  bgColor="rgba(34,197,94,0.15)"
                  icon={SmartPhone01Icon}
                  label="Phone"
                  val={formatPhone(member.phone)}
                  isFirst
                />
                {member.email && (
                  <ContactRow
                    onPress={handleEmail}
                    bgColor="rgba(59,130,246,0.15)"
                    icon={Mail01Icon}
                    label="Email"
                    val={member.email}
                  />
                )}
              </View>
            </GlassCard>

            {/* ══════════════════════════════════ ACTIVITY */}
            <GlassCard>
              <View style={st.cardPad}>
                <SectionHeader label="Activity" />

                {/* Check-in / Check-out */}
                <View style={st.activityRow}>
                  <ActivityCard
                    icon={Login01Icon}
                    bg="rgba(34,197,94,0.08)"
                    border="rgba(34,197,94,0.15)"
                    label="Check-in"
                    val={member.checkinTime || '--:--'}
                    sub={member.isLive ? 'Today' : 'Last visit'}
                  />
                  <View style={{ width: s(8) }} />
                  <ActivityCard
                    icon={Logout01Icon}
                    bg="rgba(239,68,68,0.08)"
                    border="rgba(239,68,68,0.15)"
                    label="Check-out"
                    val={member.lastCheckout || '--:--'}
                    sub={member.isLive ? 'In progress' : 'Last visit'}
                  />
                </View>

                {/* Duration */}
                {member.duration && (
                  <View style={[st.durationBox, {
                    backgroundColor: `${accentColor}08`,
                    borderColor: `${accentColor}15`,
                  }]}>
                    <View style={[st.durationIconBox, { backgroundColor: `${accentColor}15` }]}>
                      <HugeiconsIcon icon={Clock01Icon} size={ms(13)} color={accentColor} />
                    </View>
                    <Text style={st.durationLabel}>Session Duration</Text>
                    <Text style={[st.durationVal, { color: accentColor }]}>{member.duration}</Text>
                  </View>
                )}

                {/* Totals */}
                <View style={st.totalsBox}>
                  <View style={st.totalItem}>
                    <Text style={st.totalVal}>{member.totalVisits || 0}</Text>
                    <Text style={st.totalLabel}>Total Visits</Text>
                  </View>
                  <View style={st.totalDivider} />
                  <View style={st.totalItem}>
                    <Text style={st.totalVal}>{member.currentStreak || 0}</Text>
                    <Text style={st.totalLabel}>Day Streak 🔥</Text>
                  </View>
                </View>
              </View>
            </GlassCard>

            {/* ══════════════════════════════════ MEMBERSHIP */}
            <GlassCard borderColor={`${accentColor}20`}>
              <View style={st.cardPad}>
                <View style={st.membershipHeader}>
                  <SectionHeader label="Membership" />
                  <Text style={st.daysLeftText}>{getDaysLeftText(member)}</Text>
                </View>

                {/* Plan + Workout Rows */}
                {!isTrial && tierConfig && (
                  <>
                    <View style={st.membershipRow}>
                      <Text style={st.membershipRowLabel}>Plan</Text>
                      <Badge label={member.membershipType} color={tierConfig.iconColor} icon={tierConfig.icon} />
                    </View>
                    <View style={st.membershipRow}>
                      <Text style={st.membershipRowLabel}>Workout</Text>
                      <View style={[st.workoutBadge2, { backgroundColor: `${accentColor}15` }]}>
                        <HugeiconsIcon
                          icon={member.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                          size={ms(10)}
                          color={accentColor}
                        />
                        <Text style={[st.workoutBadge2Text, { color: accentColor }]}>
                          {member.workoutType === 'cardio_weights' ? 'Cardio + Weights' : 'Weights Only'}
                        </Text>
                      </View>
                    </View>
                  </>
                )}

                <View style={st.membershipRow}>
                  <Text style={st.membershipRowLabel}>Status</Text>
                  <Badge label={statusConfig.label} color={statusConfig.color} icon={statusConfig.icon} />
                </View>

                {member.paidAmount > 0 && (
                  <View style={st.membershipRow}>
                    <Text style={st.membershipRowLabel}>Paid</Text>
                    <Text style={[st.paidAmount, { color: accentColor }]}>₹{member.paidAmount}</Text>
                  </View>
                )}

                <View style={st.membershipDivider} />

                {/* Date Cards */}
                <View style={st.dateRow}>
                  <DateCard
                    icon={Calendar03Icon}
                    iconColor={GREEN}
                    label="Joined"
                    val={formatDate(member.joinDate)}
                    expired={false}
                  />
                  <View style={{ width: s(8) }} />
                  <DateCard
                    icon={Calendar03Icon}
                    iconColor={member.membershipStatus === 'expired' ? RED : accentColor}
                    label={member.membershipStatus === 'expired' ? 'Expired' : 'Expires'}
                    val={formatDate(member.expiryDate)}
                    expired={member.membershipStatus === 'expired'}
                  />
                </View>

                {/* Status Footer */}
                <View style={st.statusFooter}>
                  <HugeiconsIcon icon={statusConfig.icon} size={ms(13)} color={statusConfig.color} />
                  <Text style={[st.statusFooterText, { color: statusConfig.color }]}>
                    {statusConfig.message}
                  </Text>
                  {member.membershipStatus === 'active' && (
                    <>
                      <Text style={st.statusDot}>•</Text>
                      <Text style={[st.statusRemaining, { color: statusConfig.color }]}>
                        {member.daysLeft} days remaining
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </GlassCard>
          </ScrollView>

          <BottomNav
            activeTab="members"
            onTabChange={(tab) => {
              if (tab === 'dashboard') navigation.navigate('AdminDashboard');
              if (tab === 'plans')     navigation.navigate('AdminPlans');
              if (tab === 'members')   navigation.navigate('AdminUsersDetail');
              if (tab === 'settings')  navigation.navigate('AdminSettings');
            }}
            userType="admin"
          />
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const st = StyleSheet.create({
  bg:           { flex: 1 },
  gradient:     { flex: 1 },
  safe:         { flex: 1 },
  scroll:       { flex: 1 },
  scrollContent:{ paddingHorizontal: s(16), paddingBottom: vs(120), gap: vs(12) },

  // Back
  backBtn:  { flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(8) },
  backIcon: { width: ms(36), height: ms(36), borderRadius: ms(12), backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  backText: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(8.5), color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, textTransform: 'uppercase' },

  // Hero
  heroCard:  { marginBottom: 0 },
  heroBgIcon:{ position: 'absolute', top: -ms(10), right: -ms(10), opacity: 0.03, zIndex: 0 },
  heroInner: { padding: ms(18), zIndex: 1 },

  avatarRow: { flexDirection: 'row', alignItems: 'flex-start', gap: s(12), marginBottom: vs(12) },
  avatarWrap:{ position: 'relative' },
  avatar:    { width: ms(58), height: ms(58), borderRadius: ms(16), borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  avatarText:{ fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(14) },
  onlineDot: { position: 'absolute', bottom: -ms(3), right: -ms(3), width: ms(18), height: ms(18), borderRadius: ms(9), backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#000' },
  offlineDot:{ width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: 'rgba(255,255,255,0.25)' },

  nameBlock:   { flex: 1 },
  badgesRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: s(5), marginBottom: vs(6) },
  memberName:  { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(13), color: '#fff', marginBottom: vs(5), letterSpacing: 0.5 },
  workoutBadge:{ flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(10), paddingVertical: vs(4), borderRadius: ms(8), alignSelf: 'flex-start' },
  workoutBadgeText:{ fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(7.5), letterSpacing: 0.8, textTransform: 'uppercase' },

  offlineBadge:    { paddingHorizontal: s(8), paddingVertical: vs(4), borderRadius: ms(8), backgroundColor: 'rgba(255,255,255,0.02)' },
  offlineBadgeText:{ fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(6), color: 'rgba(255,255,255,0.3)', letterSpacing: 1 },

  timeRow:    { flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(14) },
  timeItem:   { flexDirection: 'row', alignItems: 'center', gap: s(5) },
  timeDot:    { width: ms(3), height: ms(3), borderRadius: ms(1.5), backgroundColor: 'rgba(255,255,255,0.2)' },
  timeText:   { fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(8), color: '#fff' },
  timeTextMuted:{ fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(8), color: 'rgba(255,255,255,0.4)' },

  heroDivider:{ height: 1, marginBottom: vs(14) },

  contactStrip:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  contactLeft:   { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  contactIconBox:{ width: ms(40), height: ms(40), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center' },
  contactLabel:  { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7), color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: vs(2) },
  contactPhone:  { fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(9), color: '#fff', letterSpacing: 0.8 },

  actionBtns:{ flexDirection: 'row', gap: s(6) },
  actionBtn: { width: ms(36), height: ms(36), borderRadius: ms(12), backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },

  // Mini Stats
  miniStatsCard:{ flexDirection: 'row', alignItems: 'center', paddingVertical: vs(16), paddingHorizontal: s(10) },
  statDivider:  { width: 1, height: ms(36), backgroundColor: 'rgba(255,255,255,0.06)' },

  // Section Title
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(10) },
  sideBar:         { width: ms(4), height: ms(20), borderRadius: ms(2) },
  sectionTitleText:{ fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(8), letterSpacing: 2, textTransform: 'uppercase' },

  // Trainer NOT
  trainerRow:     { flexDirection: 'row', alignItems: 'center', gap: s(12), padding: ms(16) },
  trainerIconLarge:{ width: ms(52), height: ms(52), borderRadius: ms(14), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  trainerNotTitle: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(11), color: 'rgba(255,255,255,0.8)', marginBottom: vs(2) },
  trainerNotSub:   { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8.5), color: 'rgba(113,113,122,1)' },
  makeTrainerBtn:  { flexDirection: 'row', alignItems: 'center', gap: s(6), paddingHorizontal: s(14), paddingVertical: vs(10), borderRadius: ms(12) },
  makeTrainerBtnText:{ fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(8.5), color: '#fff', letterSpacing: 0.8, textTransform: 'uppercase' },

  // Trainer ACTIVE
  trainerActiveInner: { padding: ms(16) },
  trainerActiveTop:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12) },
  removeTrainerBtn:   { width: ms(34), height: ms(34), borderRadius: ms(10), backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.20)', alignItems: 'center', justifyContent: 'center' },
  trainerDivider:     { height: 1, marginBottom: vs(14) },
  trainerAvatarRow:   { flexDirection: 'row', alignItems: 'center', gap: s(12), marginBottom: vs(14) },
  trainerAvatarBox:   { width: ms(52), height: ms(52), borderRadius: ms(16), borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  trainerAvatarText:  { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(13) },
  trainerActiveName:  { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(12), color: '#fff', marginBottom: vs(2) },
  trainerActiveRole:  { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8.5), color: 'rgba(161,161,170,1)', marginBottom: vs(2) },
  trainerAssignedDate:{ fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7.5), color: 'rgba(82,82,91,1)' },
  trainerStatGrid:    { flexDirection: 'row', gap: s(10) },
  trainerStatCard:    { flex: 1, flexDirection: 'row', alignItems: 'center', gap: s(8), padding: ms(10), borderRadius: ms(12), backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  trainerStatLabel:   { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7), color: 'rgba(113,113,122,1)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: vs(2) },
  trainerStatVal:     { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(10) },

  // Card padding
  cardPad:{ padding: ms(16) },

  // Activity
  activityRow: { flexDirection: 'row', marginBottom: vs(10) },
  durationBox: { flexDirection: 'row', alignItems: 'center', gap: s(10), padding: ms(12), borderRadius: ms(14), borderWidth: 1, marginBottom: vs(10) },
  durationIconBox:{ width: ms(34), height: ms(34), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center' },
  durationLabel: { flex: 1, fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(9), color: 'rgba(255,255,255,0.6)' },
  durationVal:   { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(10) },
  totalsBox:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', padding: vs(16), borderRadius: ms(16), backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  totalItem:     { alignItems: 'center' },
  totalVal:      { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(16), color: '#fff', marginBottom: vs(2) },
  totalLabel:    { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8.5), color: 'rgba(255,255,255,0.6)' },
  totalDivider:  { width: 1, height: ms(44), backgroundColor: 'rgba(255,255,255,0.10)' },

  // Membership
  membershipHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(14) },
  daysLeftText:      { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(8.5), color: 'rgba(255,255,255,0.6)' },
  membershipRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12) },
  membershipRowLabel:{ fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(9.5), color: 'rgba(255,255,255,0.6)' },
  workoutBadge2:     { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(10), paddingVertical: vs(4), borderRadius: ms(8) },
  workoutBadge2Text: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(8), letterSpacing: 0.5 },
  paidAmount:        { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(12) },
  membershipDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: vs(12) },
  dateRow:           { flexDirection: 'row', marginBottom: vs(12) },
  statusFooter:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(6), paddingVertical: vs(10) },
  statusDot:         { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8), color: 'rgba(255,255,255,0.3)' },
  statusFooterText:  { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(10), letterSpacing: 0.5 },
  statusRemaining:   { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(9.5), opacity: 0.8 },
});

export default AdminTrainerProfileScreen;