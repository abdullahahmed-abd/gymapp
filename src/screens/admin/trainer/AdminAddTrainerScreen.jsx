// src/screens/admin/AdminAddTrainerScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Linking,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import * as HugeIcons from '@hugeicons/core-free-icons';

import Header from '../../../components/shared/Header';
import BottomNav from '../../../components/shared/BottomNav';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';

const s  = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

// ═══════════════════════════════════════════════════════════════
// SAFE ICON RESOLVER
// Tries multiple icon name variations to find one that exists
// ═══════════════════════════════════════════════════════════════
const resolveIcon = (...names) => {
  for (const n of names) {
    if (HugeIcons[n]) return HugeIcons[n];
  }
  if (__DEV__) {
    console.warn(`⚠️ No icon found for: ${names.join(', ')}`);
  }
  return null;
};

// Resolve all icons safely with fallbacks
const Icons = {
  arrowLeft:   resolveIcon('ArrowLeft01Icon', 'ArrowLeftIcon'),
  search:      resolveIcon('Search01Icon', 'SearchIcon'),
  cancel:      resolveIcon('Cancel01Icon', 'CancelIcon', 'MultiplicationSignIcon'),
  shield:      resolveIcon('SecurityIcon', 'Shield01Icon', 'ShieldIcon', 'SecurityCheckIcon'),
  checkCircle: resolveIcon('CheckmarkCircle02Icon', 'CheckmarkCircleIcon', 'CheckmarkCircle01Icon'),
  alertCircle: resolveIcon('AlertCircleIcon', 'Alert01Icon', 'AlertDiamondIcon'),
  clock:       resolveIcon('Clock01Icon', 'ClockIcon'),
  call:        resolveIcon('Call02Icon', 'Call01Icon', 'CallIcon'),
  dumbbell:    resolveIcon('Dumbbell01Icon', 'DumbbellIcon', 'Dumbbell02Icon'),
  userAdd:     resolveIcon('UserAdd01Icon', 'UserAddIcon', 'UserAdd02Icon'),
  flash:       resolveIcon('FlashIcon', 'ThunderboltIcon', 'Flash01Icon'),
  wifi:        resolveIcon('WifiIcon', 'Wifi01Icon', 'WifiFullSignalIcon'),
  crown:       resolveIcon('Crown02Icon', 'CrownIcon', 'Crown01Icon'),
  star:        resolveIcon('StarIcon', 'Star02Icon', 'Star01Icon'),
  chevronRight:resolveIcon('ArrowRight01Icon', 'ChevronRight01Icon', 'ArrowRightIcon'),
  userGroup:   resolveIcon('UserGroupIcon', 'UserMultipleIcon', 'UsersIcon'),
  filter:      resolveIcon('FilterHorizontalIcon', 'FilterIcon', 'Filter01Icon'),
  view:        resolveIcon('ViewIcon', 'EyeIcon', 'View01Icon'),
  target:      resolveIcon('Target02Icon', 'Target01Icon', 'TargetIcon'),
  fire:        resolveIcon('Fire02Icon', 'FireIcon', 'Fire01Icon'),
  hash:        resolveIcon('Hash01Icon', 'HashtagIcon', 'HashIcon'),
  whatsapp:    resolveIcon('WhatsappIcon', 'MessageMultiple01Icon', 'Message01Icon'),
  activity:    resolveIcon('Activity03Icon', 'Activity01Icon', 'ActivityIcon'),
};

// ═══════════════════════════════════════════════════════════════
// SAFE ICON COMPONENT — never crashes
// ═══════════════════════════════════════════════════════════════
const SafeIcon = ({ icon, size = 16, color = '#fff', strokeWidth, style }) => {
  if (!icon) {
    return <View style={[{ width: size, height: size }, style]} />;
  }
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
    />
  );
};

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const CYAN   = '#22D3EE';
const GOLD   = '#C5A059';
const GREEN  = '#22C55E';
const RED    = '#EF4444';
const BLUE   = '#3B82F6';
const PURPLE = '#A855F7';

// ═══════════════════════════════════════════════════════════════
// CONFIGS
// ═══════════════════════════════════════════════════════════════
const TIER_CONFIG = {
  'ELITE TIER':     { badge: 'ELITE',     color: GOLD,   icon: Icons.crown },
  'LEGENDARY TIER': { badge: 'LEGENDARY', color: PURPLE, icon: Icons.star  },
};
const TRIAL_CFG  = { badge: 'TRIAL', color: BLUE, icon: Icons.flash };
const STATUS_CFG = {
  active:  { label: 'ACTIVE',  color: GREEN, icon: Icons.checkCircle },
  expired: { label: 'EXPIRED', color: RED,   icon: Icons.alertCircle },
  trial:   { label: 'TRIAL',   color: BLUE,  icon: Icons.flash       },
};

// ═══════════════════════════════════════════════════════════════
// DUMMY DATA
// ═══════════════════════════════════════════════════════════════
const DUMMY_MEMBERS = [
  { id: 'm1', name: 'Abdullah Ahmed', avatar: 'AA', memberId: 'GYM001', phone: '+918817159218',
    membershipType: 'ELITE TIER',     membershipStatus: 'active',  workoutType: 'cardio_weights',
    isLive: true,  checkinTime: '6:30 AM', duration: '45m', lastCheckout: '8:15 AM',
    totalVisits: 156, currentStreak: 12 },
  { id: 'm2', name: 'Priya Patel',    avatar: 'PP', memberId: 'GYM002', phone: '+919876543211',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'expired', workoutType: 'weights_only',
    isLive: true,  checkinTime: '6:45 AM', duration: '32m', lastCheckout: null,
    totalVisits: 89, currentStreak: 0 },
  { id: 'm3', name: 'Rahul Verma',    avatar: 'RV', memberId: 'GYM003', phone: '+919876543212',
    membershipType: null,             membershipStatus: 'trial',   workoutType: 'cardio_weights',
    isLive: true,  checkinTime: '6:15 AM', duration: '58m', lastCheckout: null,
    totalVisits: 5,  currentStreak: 5 },
  { id: 'm4', name: 'Sneha Gupta',    avatar: 'SG', memberId: 'GYM004', phone: '+919876543213',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'active',  workoutType: 'weights_only',
    isLive: true,  checkinTime: '6:50 AM', duration: '40m', lastCheckout: null,
    totalVisits: 210, currentStreak: 28 },
  { id: 'm5', name: 'Vikram Singh',   avatar: 'VS', memberId: 'GYM005', phone: '+919876543214',
    membershipType: 'ELITE TIER',     membershipStatus: 'expired', workoutType: 'cardio_weights',
    isLive: false, checkinTime: null,       duration: null,  lastCheckout: '5:00 PM',
    totalVisits: 67, currentStreak: 0 },
  { id: 'm6', name: 'Ananya Reddy',   avatar: 'AR', memberId: 'GYM006', phone: '+919876543215',
    membershipType: null,             membershipStatus: 'trial',   workoutType: 'weights_only',
    isLive: true,  checkinTime: '6:20 AM', duration: '50m', lastCheckout: null,
    totalVisits: 3,  currentStreak: 3 },
  { id: 'm7', name: 'Karan Malhotra', avatar: 'KM', memberId: 'GYM007', phone: '+919876543216',
    membershipType: 'ELITE TIER',     membershipStatus: 'active',  workoutType: 'cardio_weights',
    isLive: true,  checkinTime: '6:40 AM', duration: '35m', lastCheckout: null,
    totalVisits: 178, currentStreak: 22 },
  { id: 'm8', name: 'Meera Iyer',     avatar: 'MI', memberId: 'GYM008', phone: '+919876543217',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'expired', workoutType: 'weights_only',
    isLive: false, checkinTime: null,       duration: null,  lastCheckout: '4:45 PM',
    totalVisits: 134, currentStreak: 0 },
];

const fmtPhone = (p) => {
  const c = (p || '').replace(/\D/g, '');
  return c.length === 12 ? `+${c.slice(0, 2)} ${c.slice(2, 7)} ${c.slice(7)}` : p;
};

// ═══════════════════════════════════════════════════════════════
// PULSE DOT
// ═══════════════════════════════════════════════════════════════
const PulseDot = ({ color = GREEN, size = 7 }) => {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
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
// GLASS PANEL
// ═══════════════════════════════════════════════════════════════
const GlassPanel = ({ children, style: customStyle, borderColor, glow, onPress }) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        gpSt.panel,
        borderColor && { borderColor },
        glow && { shadowColor: glow, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6 },
        customStyle,
      ]}
    >
      {children}
    </Wrapper>
  );
};

const gpSt = StyleSheet.create({
  panel: {
    backgroundColor: '#000000',
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
});

// ═══════════════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════════════
const StatCard = ({ icon, label, value, color, pulse }) => (
  <GlassPanel glow={`${color}08`} style={scSt.card}>
    <View style={scSt.inner}>
      <View style={scSt.topRow}>
        <View style={[scSt.iconBox, { backgroundColor: `${color}15`, borderColor: `${color}20` }]}>
          <SafeIcon icon={icon} size={ms(15)} color={color} />
        </View>
        {pulse && <PulseDot color={color} size={6} />}
      </View>
      <Text style={[scSt.value, { color }]}>{value}</Text>
      <Text style={scSt.label}>{label}</Text>
    </View>
  </GlassPanel>
);

const scSt = StyleSheet.create({
  card:    { flex: 1 },
  inner:   { padding: ms(12) },
  topRow:  { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: vs(10) },
  iconBox: { width: ms(36), height: ms(36), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  value:   { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(16), marginBottom: vs(3) },
  label:   { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(7), color: 'rgba(161,161,170,1)', letterSpacing: 1.2, textTransform: 'uppercase' },
});

// ═══════════════════════════════════════════════════════════════
// BADGE
// ═══════════════════════════════════════════════════════════════
const Badge = ({ label, color, icon, iconSize = 9 }) => (
  <View style={[bdSt.badge, { borderColor: `${color}25`, backgroundColor: `${color}10` }]}>
    {icon && <SafeIcon icon={icon} size={ms(iconSize)} color={color} />}
    <Text style={[bdSt.text, { color }]}>{label}</Text>
  </View>
);

const bdSt = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: s(3),
    paddingHorizontal: s(7), paddingVertical: vs(3),
    borderRadius: ms(7), borderWidth: 1,
  },
  text: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(5.5), letterSpacing: 0.8, textTransform: 'uppercase',
  },
});

// ═══════════════════════════════════════════════════════════════
// MEMBER CARD
// ═══════════════════════════════════════════════════════════════
const MemberCard = ({ member, onPress, isTrainer }) => {
  const isTrial   = member.membershipStatus === 'trial';
  const tierCfg   = isTrial
    ? TRIAL_CFG
    : (TIER_CONFIG[member.membershipType] || TIER_CONFIG['ELITE TIER']);
  const statusCfg = STATUS_CFG[member.membershipStatus] || STATUS_CFG.active;
  const accent    = isTrainer ? CYAN : tierCfg.color;

  const handleCall = () => Linking.openURL(`tel:${member.phone.replace(/\D/g, '')}`);
  const handleWA   = () => Linking.openURL(`https://wa.me/${member.phone.replace(/\D/g, '')}`);

  return (
    <GlassPanel
      onPress={() => onPress(member)}
      borderColor={isTrainer ? `${CYAN}22` : `${accent}14`}
      glow={`${accent}04`}
      style={mcSt.card}
    >
      {/* Top accent line */}
      <LinearGradient
        colors={['transparent', `${accent}40`, 'transparent']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={mcSt.topLine}
      />

      {/* BG gradient */}
      <LinearGradient
        colors={[`${accent}05`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      <View style={mcSt.inner}>
        {/* ── Row 1: Avatar + Info ── */}
        <View style={mcSt.avatarRow}>
          {/* Avatar */}
          <View style={mcSt.avatarWrap}>
            <View style={[mcSt.avatar, {
              backgroundColor: `${accent}15`,
              borderColor: `${accent}28`,
            }]}>
              <Text style={[mcSt.avatarText, { color: accent }]}>{member.avatar}</Text>
            </View>
            {member.isLive && (
              <View style={mcSt.liveDot}>
                <View style={mcSt.liveDotInner} />
              </View>
            )}
          </View>

          {/* Info */}
          <View style={mcSt.infoBlock}>
            {/* Badges */}
            <View style={mcSt.badgesRow}>
              {isTrainer ? (
                <Badge label="TRAINER" color={CYAN} icon={Icons.dumbbell} />
              ) : (
                <>
                  <Badge label={tierCfg.badge} color={tierCfg.color} icon={tierCfg.icon} />
                  <Badge label={statusCfg.label} color={statusCfg.color} icon={statusCfg.icon} />
                </>
              )}
              {member.isLive ? (
                <Badge label="LIVE" color={GREEN} icon={Icons.wifi} />
              ) : (
                <View style={mcSt.offlineBadge}>
                  <Text style={mcSt.offlineBadgeText}>OFFLINE</Text>
                </View>
              )}
            </View>

            {/* Name */}
            <Text style={mcSt.name} numberOfLines={1}>{member.name}</Text>

            {/* Mini stats */}
            <View style={mcSt.miniStats}>
              <View style={mcSt.miniStatItem}>
                <SafeIcon icon={Icons.hash} size={ms(8)} color="rgba(82,82,91,1)" />
                <Text style={mcSt.miniStatText}>{member.memberId}</Text>
              </View>
              <View style={mcSt.miniStatDivider} />
              <View style={mcSt.miniStatItem}>
                <SafeIcon icon={Icons.target} size={ms(8)} color="rgba(82,82,91,1)" />
                <Text style={mcSt.miniStatText}>{member.totalVisits}</Text>
              </View>
              {member.currentStreak > 0 && (
                <>
                  <View style={mcSt.miniStatDivider} />
                  <View style={mcSt.miniStatItem}>
                    <SafeIcon icon={Icons.fire} size={ms(8)} color="rgba(251,146,60,0.7)" />
                    <Text style={mcSt.miniStatText}>{member.currentStreak}d</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        {/* ── Session Strip ── */}
        {member.isLive && member.checkinTime ? (
          <View style={mcSt.sessionStrip}>
            <View style={mcSt.sessionDot} />
            <Text style={mcSt.sessionText} numberOfLines={1}>
              In since {member.checkinTime}
            </Text>
            {member.duration && (
              <View style={mcSt.durationRow}>
                <SafeIcon icon={Icons.clock} size={ms(9)} color="rgba(251,191,36,1)" />
                <Text style={mcSt.durationText}>{member.duration}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={mcSt.offlineStrip}>
            <SafeIcon icon={Icons.clock} size={ms(10)} color="rgba(63,63,70,1)" />
            <Text style={mcSt.offlineStripText}>
              Last checkout: {member.lastCheckout || 'N/A'}
            </Text>
          </View>
        )}

        {/* ── Divider ── */}
        <LinearGradient
          colors={['transparent', `${accent}18`, 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={mcSt.divider}
        />

        {/* ── Bottom Row ── */}
        <View style={mcSt.bottomRow}>
          {/* Phone */}
          <View style={mcSt.phoneRow}>
            <View style={[mcSt.phoneIcon, { backgroundColor: `${accent}10`, borderColor: `${accent}15` }]}>
              <SafeIcon icon={Icons.call} size={ms(11)} color={accent} />
            </View>
            <Text style={mcSt.phoneText}>{fmtPhone(member.phone)}</Text>
          </View>

          {/* Action Buttons */}
          <View style={mcSt.actionBtns}>
            <TouchableOpacity
              style={[mcSt.actionBtn, { backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.18)' }]}
              onPress={handleCall}
              activeOpacity={0.7}
            >
              <SafeIcon icon={Icons.call} size={ms(12)} color={GREEN} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[mcSt.actionBtn, { backgroundColor: 'rgba(37,211,102,0.08)', borderColor: 'rgba(37,211,102,0.18)' }]}
              onPress={handleWA}
              activeOpacity={0.7}
            >
              <SafeIcon icon={Icons.whatsapp} size={ms(12)} color="#25D366" />
            </TouchableOpacity>
            <View style={[mcSt.actionBtn, { backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }]}>
              <SafeIcon icon={Icons.chevronRight} size={ms(12)} color="rgba(255,255,255,0.2)" />
            </View>
          </View>
        </View>

        {/* ── Trainer overlay badge ── */}
        {isTrainer && (
          <View style={mcSt.trainerOverlay}>
            <SafeIcon icon={Icons.view} size={ms(11)} color={`${CYAN}80`} />
            <Text style={mcSt.trainerOverlayText}>
              Already a Trainer · Tap to Manage
            </Text>
          </View>
        )}
      </View>
    </GlassPanel>
  );
};

const mcSt = StyleSheet.create({
  card:        { marginBottom: vs(10) },
  topLine:     { height: 1.5 },
  inner:       { padding: ms(14) },
  avatarRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: s(12), marginBottom: vs(10) },
  avatarWrap:  { position: 'relative' },
  avatar:      { width: ms(52), height: ms(52), borderRadius: ms(16), borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  avatarText:  { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(13) },
  liveDot:     { position: 'absolute', bottom: -ms(3), right: -ms(3), width: ms(16), height: ms(16), borderRadius: ms(8), backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(34,197,94,0.4)' },
  liveDotInner:{ width: ms(7), height: ms(7), borderRadius: ms(3.5), backgroundColor: GREEN },
  infoBlock:   { flex: 1, minWidth: 0 },
  badgesRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: s(4), marginBottom: vs(5) },
  name:        { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(10.5), color: '#fff', letterSpacing: 0.5, marginBottom: vs(5) },
  offlineBadge:{ paddingHorizontal: s(7), paddingVertical: vs(3), borderRadius: ms(7), backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  offlineBadgeText:{ fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(5.5), color: 'rgba(63,63,70,1)', letterSpacing: 0.8 },
  miniStats:   { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  miniStatItem:{ flexDirection: 'row', alignItems: 'center', gap: s(3) },
  miniStatText:{ fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(7.5), color: 'rgba(161,161,170,1)' },
  miniStatDivider:{ width: 1, height: ms(10), backgroundColor: 'rgba(255,255,255,0.06)' },
  sessionStrip:{ flexDirection: 'row', alignItems: 'center', gap: s(8), paddingHorizontal: s(10), paddingVertical: vs(7), borderRadius: ms(12), backgroundColor: 'rgba(34,197,94,0.05)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.12)', marginBottom: vs(10) },
  sessionDot:  { width: ms(5), height: ms(5), borderRadius: ms(2.5), backgroundColor: GREEN },
  sessionText: { flex: 1, fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(8), color: GREEN, letterSpacing: 0.8 },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: s(3) },
  durationText:{ fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(7.5), color: 'rgba(251,191,36,1)' },
  offlineStrip:{ flexDirection: 'row', alignItems: 'center', gap: s(8), paddingHorizontal: s(10), paddingVertical: vs(7), borderRadius: ms(12), backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: vs(10) },
  offlineStripText:{ fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8), color: 'rgba(82,82,91,1)', letterSpacing: 0.5 },
  divider:     { height: 1, marginBottom: vs(10) },
  bottomRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  phoneRow:    { flexDirection: 'row', alignItems: 'center', gap: s(7), flex: 1 },
  phoneIcon:   { width: ms(28), height: ms(28), borderRadius: ms(8), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  phoneText:   { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8.5), color: 'rgba(161,161,170,1)', letterSpacing: 0.5 },
  actionBtns:  { flexDirection: 'row', gap: s(6) },
  actionBtn:   { width: ms(32), height: ms(32), borderRadius: ms(10), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  trainerOverlay:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(6), marginTop: vs(10), paddingVertical: vs(8), borderRadius: ms(12), backgroundColor: `${CYAN}08`, borderWidth: 1, borderColor: `${CYAN}18` },
  trainerOverlayText:{ fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(8), color: `${CYAN}80`, letterSpacing: 0.8, textTransform: 'uppercase' },
});

// ═══════════════════════════════════════════════════════════════
// FILTER TAB
// ═══════════════════════════════════════════════════════════════
const FilterTab = ({ label, value, count, color, active, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(value)}
    activeOpacity={0.7}
    style={[
      ftSt.tab,
      active && { backgroundColor: `${color}10`, borderColor: `${color}25` },
    ]}
  >
    <View style={[ftSt.dot, {
      backgroundColor: active ? color : '#3F3F46',
    }]} />
    <Text style={[ftSt.label, active && { color }]}>{label}</Text>
    <Text style={[ftSt.count, active && { color: `${color}CC` }]}>{count}</Text>
  </TouchableOpacity>
);

const ftSt = StyleSheet.create({
  tab:   { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(10), paddingVertical: vs(6), borderRadius: ms(10), borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' },
  dot:   { width: ms(5), height: ms(5), borderRadius: ms(2.5) },
  label: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(7.5), color: '#52525B', letterSpacing: 0.8, textTransform: 'uppercase' },
  count: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(6.5), color: '#3F3F46' },
});

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminAddTrainerScreen = ({ navigation }) => {
  const [search,     setSearch]     = useState('');
  const [focused,    setFocused]    = useState(false);
  const [filter,     setFilter]     = useState('all');
  const [trainerIds, setTrainerIds] = useState(['m1']);

  const liveCount   = DUMMY_MEMBERS.filter((m) => m.isLive).length;
  const activeCount = DUMMY_MEMBERS.filter((m) => m.membershipStatus === 'active').length;
  const trialCount  = DUMMY_MEMBERS.filter((m) => m.membershipStatus === 'trial').length;

  const filtered = DUMMY_MEMBERS.filter((m) => {
    const q      = search.toLowerCase();
    const matchQ = m.name.toLowerCase().includes(q) || m.memberId.toLowerCase().includes(q) || m.phone.includes(search);
    const matchF =
      filter === 'all'    ||
      (filter === 'active' && m.membershipStatus === 'active') ||
      (filter === 'trial'  && m.membershipStatus === 'trial')  ||
      (filter === 'live'   && m.isLive);
    return matchQ && matchF;
  });

  const filterTabs = [
    { label: 'All',    value: 'all',    count: DUMMY_MEMBERS.length, color: GOLD  },
    { label: 'Active', value: 'active', count: activeCount,          color: GREEN },
    { label: 'Trial',  value: 'trial',  count: trialCount,           color: BLUE  },
    { label: 'Live',   value: 'live',   count: liveCount,            color: GREEN },
  ];

  const handleMemberPress = (member) => {
    navigation.navigate('AdminTrainerProfile', { member });
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={st.bg}
      blurRadius={9}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.88)', 'rgba(0,0,0,0.95)', '#000000']}
        style={st.gradient}
      >
        <SafeAreaView style={st.safe} edges={['top']}>
          <Header title="ADD TRAINER" showMenu={false} />

          <ScrollView
            style={st.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={st.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* ══════════════════════════════════ HEADER */}
            <View style={st.headerArea}>
              <View style={st.headerLeft}>
                <TouchableOpacity
                  style={st.backBtn}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <SafeIcon icon={Icons.arrowLeft} size={ms(16)} color="rgba(161,161,170,1)" />
                </TouchableOpacity>

                <View style={st.headerIconBox}>
                  <SafeIcon icon={Icons.userAdd} size={ms(20)} color={CYAN} />
                </View>

                <View>
                  <Text style={st.headerSub}>Select Member</Text>
                  <Text style={st.headerTitle}>ADD TRAINER</Text>
                </View>
              </View>

              {/* Count badge */}
              <View style={[st.countBadge, { backgroundColor: `${CYAN}10`, borderColor: `${CYAN}20` }]}>
                <Text style={[st.countBadgeNum, { color: CYAN }]}>{DUMMY_MEMBERS.length}</Text>
                <Text style={st.countBadgeLabel}>members</Text>
              </View>
            </View>

            {/* ══════════════════════════════════ STAT CARDS */}
            <View style={st.statRow}>
              <StatCard icon={Icons.userGroup}   label="Total"    value={DUMMY_MEMBERS.length} color={GOLD}  />
              <StatCard icon={Icons.wifi}        label="Live Now" value={liveCount}            color={GREEN} pulse />
              <StatCard icon={Icons.checkCircle} label="Active"   value={activeCount}          color={GREEN} />
              <StatCard icon={Icons.dumbbell}    label="Trainers" value={trainerIds.length}    color={CYAN}  />
            </View>

            {/* ══════════════════════════════════ SEARCH + FILTERS */}
            <GlassPanel>
              <View style={st.searchSection}>
                {/* Search Bar */}
                <View style={[st.searchBar, focused && st.searchBarFocused]}>
                  <SafeIcon
                    icon={Icons.search}
                    size={ms(14)}
                    color={focused ? '#fff' : 'rgba(82,82,91,1)'}
                  />
                  <TextInput
                    style={st.searchInput}
                    placeholder="Search by name, ID or phone..."
                    placeholderTextColor="rgba(63,63,70,1)"
                    value={search}
                    onChangeText={setSearch}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoCorrect={false}
                    autoCapitalize="none"
                    selectionColor={CYAN}
                    cursorColor={CYAN}
                  />
                  {search.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSearch('')}
                      style={st.searchClear}
                      activeOpacity={0.7}
                    >
                      <SafeIcon icon={Icons.cancel} size={ms(10)} color="rgba(113,113,122,1)" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Filter Tabs */}
                <View style={st.filterRow}>
                  <View style={st.filterLabelRow}>
                    <SafeIcon icon={Icons.filter} size={ms(10)} color="rgba(82,82,91,1)" />
                    <Text style={st.filterLabel}>Filter</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.filterScroll}>
                    {filterTabs.map((f) => (
                      <FilterTab
                        key={f.value}
                        {...f}
                        active={filter === f.value}
                        onPress={setFilter}
                      />
                    ))}
                  </ScrollView>
                </View>
              </View>
            </GlassPanel>

            {/* ══════════════════════════════════ RESULTS INFO */}
            <View style={st.resultsRow}>
              <View style={st.resultsLeft}>
                <SafeIcon icon={Icons.view} size={ms(10)} color="rgba(82,82,91,1)" />
                <Text style={st.resultsText}>
                  Showing{' '}
                  <Text style={st.resultsWhite}>{filtered.length}</Text>
                  {' '}of{' '}
                  <Text style={{ color: 'rgba(161,161,170,1)' }}>{DUMMY_MEMBERS.length}</Text>
                  {' '}members
                </Text>
              </View>
              {filter !== 'all' && (
                <TouchableOpacity
                  style={st.clearFilterBtn}
                  onPress={() => setFilter('all')}
                  activeOpacity={0.7}
                >
                  <SafeIcon icon={Icons.cancel} size={ms(8)} color="rgba(113,113,122,1)" />
                  <Text style={st.clearFilterText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ══════════════════════════════════ INFO NOTICE */}
            <GlassPanel borderColor={`${CYAN}12`}>
              <View style={st.infoNotice}>
                <View style={[st.infoIconBox, { backgroundColor: `${CYAN}10`, borderColor: `${CYAN}18` }]}>
                  <SafeIcon icon={Icons.shield} size={ms(14)} color={CYAN} />
                </View>
                <Text style={st.infoText}>
                  Tap on any member card to view their profile and assign them as a trainer
                </Text>
                <View style={[st.assignedBadge, { backgroundColor: `${CYAN}10`, borderColor: `${CYAN}18` }]}>
                  <View style={[st.assignedDot, { backgroundColor: CYAN }]} />
                  <Text style={[st.assignedText, { color: CYAN }]}>{trainerIds.length} Assigned</Text>
                </View>
              </View>
            </GlassPanel>

            {/* ══════════════════════════════════ MEMBER LIST */}
            {filtered.length === 0 ? (
              <GlassPanel borderColor={`${CYAN}10`}>
                <View style={st.emptyState}>
                  <View style={st.emptyIcon}>
                    <SafeIcon icon={Icons.search} size={ms(24)} color="rgba(39,39,42,1)" strokeWidth={1.5} />
                  </View>
                  <Text style={st.emptyTitle}>NO MEMBERS FOUND</Text>
                  <Text style={st.emptySub}>Try a different search or filter</Text>
                  <TouchableOpacity
                    style={[st.clearAllBtn, { backgroundColor: `${CYAN}08`, borderColor: `${CYAN}18` }]}
                    onPress={() => { setSearch(''); setFilter('all'); }}
                    activeOpacity={0.7}
                  >
                    <SafeIcon icon={Icons.cancel} size={ms(10)} color={CYAN} />
                    <Text style={[st.clearAllBtnText, { color: CYAN }]}>Clear Filters</Text>
                  </TouchableOpacity>
                </View>
              </GlassPanel>
            ) : (
              filtered.map((m) => (
                <MemberCard
                  key={m.id}
                  member={m}
                  onPress={handleMemberPress}
                  isTrainer={trainerIds.includes(m.id)}
                />
              ))
            )}

            {/* ══════════════════════════════════ FOOTER */}
            <GlassPanel borderColor="rgba(197,160,89,0.10)">
              <View style={st.footer}>
                <View style={st.footerIconBox}>
                  <SafeIcon icon={Icons.dumbbell} size={ms(14)} color={GOLD} />
                </View>
                <View style={st.footerText}>
                  <Text style={st.footerTitle}>Trainer Assignment</Text>
                  <Text style={st.footerSub}>Select a member to assign trainer role</Text>
                </View>
                <View style={st.footerLiveBadge}>
                  <View style={st.footerLiveDot} />
                  <Text style={st.footerLiveText}>Live</Text>
                </View>
              </View>
            </GlassPanel>
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
  bg:            { flex: 1 },
  gradient:      { flex: 1 },
  safe:          { flex: 1 },
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: s(16), paddingBottom: vs(120), gap: vs(12) },

  // Header
  headerArea:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8) },
  headerLeft:   { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  backBtn:      { width: ms(40), height: ms(40), borderRadius: ms(14), backgroundColor: '#000', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  headerIconBox:{ width: ms(48), height: ms(48), borderRadius: ms(16), backgroundColor: `${CYAN}15`, borderWidth: 1, borderColor: `${CYAN}22`, alignItems: 'center', justifyContent: 'center' },
  headerSub:    { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(7.5), color: CYAN, letterSpacing: 2, textTransform: 'uppercase', marginBottom: vs(2) },
  headerTitle:  { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(14), color: '#fff', letterSpacing: 2 },
  countBadge:   { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(10), paddingVertical: vs(6), borderRadius: ms(10), borderWidth: 1 },
  countBadgeNum:{ fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(11) },
  countBadgeLabel:{ fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8), color: 'rgba(113,113,122,1)' },

  // Stat Row
  statRow: { flexDirection: 'row', gap: s(8) },

  // Search
  searchSection:  { padding: ms(14) },
  searchBar:      { flexDirection: 'row', alignItems: 'center', gap: s(8), paddingHorizontal: s(14), paddingVertical: vs(10), borderRadius: ms(16), backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: vs(12) },
  searchBarFocused:{ borderColor: 'rgba(255,255,255,0.20)' },
  searchInput:    { flex: 1, fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(9.5), color: '#fff', letterSpacing: 0.3, backgroundColor: 'transparent', paddingVertical: 0 },
  searchClear:    { width: ms(24), height: ms(24), borderRadius: ms(8), backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  filterRow:      { gap: vs(8) },
  filterLabelRow: { flexDirection: 'row', alignItems: 'center', gap: s(5) },
  filterLabel:    { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(7.5), color: 'rgba(82,82,91,1)', letterSpacing: 1.5, textTransform: 'uppercase' },
  filterScroll:   { gap: s(6), paddingVertical: vs(2) },

  // Results
  resultsRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: s(2) },
  resultsLeft:     { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  resultsText:     { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8.5), color: 'rgba(113,113,122,1)', letterSpacing: 0.5 },
  resultsWhite:    { color: '#fff', fontFamily: Fonts.rajdhani?.bold || 'System' },
  clearFilterBtn:  { flexDirection: 'row', alignItems: 'center', gap: s(4), paddingHorizontal: s(10), paddingVertical: vs(5), borderRadius: ms(10), backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  clearFilterText: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(7.5), color: 'rgba(161,161,170,1)', letterSpacing: 0.8, textTransform: 'uppercase' },

  // Info Notice
  infoNotice:   { flexDirection: 'row', alignItems: 'center', gap: s(10), padding: ms(14) },
  infoIconBox:  { width: ms(36), height: ms(36), borderRadius: ms(12), borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoText:     { flex: 1, fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8.5), color: 'rgba(161,161,170,1)', letterSpacing: 0.3 },
  assignedBadge:{ flexDirection: 'row', alignItems: 'center', gap: s(4), paddingHorizontal: s(8), paddingVertical: vs(4), borderRadius: ms(10), borderWidth: 1, flexShrink: 0 },
  assignedDot:  { width: ms(5), height: ms(5), borderRadius: ms(2.5) },
  assignedText: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(7), letterSpacing: 0.8, textTransform: 'uppercase' },

  // Empty
  emptyState:   { alignItems: 'center', paddingVertical: vs(50) },
  emptyIcon:    { width: ms(56), height: ms(56), borderRadius: ms(18), backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginBottom: vs(14) },
  emptyTitle:   { fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(9.5), color: 'rgba(82,82,91,1)', letterSpacing: 1.5, marginBottom: vs(6) },
  emptySub:     { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8.5), color: 'rgba(63,63,70,1)', marginBottom: vs(20) },
  clearAllBtn:  { flexDirection: 'row', alignItems: 'center', gap: s(6), paddingHorizontal: s(16), paddingVertical: vs(8), borderRadius: ms(12), borderWidth: 1 },
  clearAllBtnText:{ fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(8.5), letterSpacing: 0.8, textTransform: 'uppercase' },

  // Footer
  footer:          { flexDirection: 'row', alignItems: 'center', gap: s(12), padding: ms(14) },
  footerIconBox:   { width: ms(36), height: ms(36), borderRadius: ms(12), backgroundColor: 'rgba(197,160,89,0.08)', borderWidth: 1, borderColor: 'rgba(197,160,89,0.15)', alignItems: 'center', justifyContent: 'center' },
  footerText:      { flex: 1 },
  footerTitle:     { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(9), color: '#fff', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: vs(2) },
  footerSub:       { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7.5), color: 'rgba(113,113,122,1)', letterSpacing: 0.5 },
  footerLiveBadge: { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(10), paddingVertical: vs(4), borderRadius: ms(10), backgroundColor: 'rgba(34,197,94,0.08)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.15)' },
  footerLiveDot:   { width: ms(5), height: ms(5), borderRadius: ms(2.5), backgroundColor: GREEN },
  footerLiveText:  { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(7.5), color: GREEN, letterSpacing: 0.8, textTransform: 'uppercase' },
});

export default AdminAddTrainerScreen;