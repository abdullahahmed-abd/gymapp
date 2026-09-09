// src/screens/admin/TrainerDetailScreen.js
import React, { useRef, useEffect } from 'react';
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
// ═══════════════════════════════════════════════════════════════
const resolveIcon = (...names) => {
  for (const n of names) {
    if (HugeIcons[n]) return HugeIcons[n];
  }
  if (__DEV__) console.warn(`⚠️ No icon found for: ${names.join(', ')}`);
  return null;
};

const Icons = {
  arrowLeft:    resolveIcon('ArrowLeft01Icon', 'ArrowLeftIcon'),
  arrowRight:   resolveIcon('ArrowRight01Icon', 'ArrowRightIcon'),
  cancel:       resolveIcon('Cancel01Icon', 'CancelIcon', 'MultiplicationSignIcon'),
  shield:       resolveIcon('SecurityIcon', 'Shield01Icon', 'ShieldIcon'),
  checkCircle:  resolveIcon('CheckmarkCircle02Icon', 'CheckmarkCircleIcon', 'CheckmarkCircle01Icon'),
  clock:        resolveIcon('Clock01Icon', 'ClockIcon'),
  calendar:     resolveIcon('Calendar03Icon', 'Calendar01Icon', 'CalendarIcon'),
  clipboard:    resolveIcon('ClipboardIcon', 'TaskDaily01Icon', 'Note01Icon'),
  dumbbell:     resolveIcon('Dumbbell01Icon', 'DumbbellIcon', 'Dumbbell02Icon'),
  call:         resolveIcon('Call02Icon', 'Call01Icon', 'CallIcon'),
  whatsapp:     resolveIcon('WhatsappIcon', 'MessageMultiple01Icon', 'Message01Icon'),
  view:         resolveIcon('ViewIcon', 'EyeIcon', 'View01Icon'),
  target:       resolveIcon('Target02Icon', 'Target01Icon', 'TargetIcon'),
  star:         resolveIcon('StarIcon', 'Star02Icon', 'Star01Icon'),
  user:         resolveIcon('User02Icon', 'UserIcon', 'User01Icon'),
  hash:         resolveIcon('Hash01Icon', 'HashtagIcon', 'HashIcon'),
  wifi:         resolveIcon('WifiIcon', 'Wifi01Icon', 'WifiFullSignalIcon'),
  chevronRight: resolveIcon('ArrowRight01Icon', 'ChevronRight01Icon'),
};

// ═══════════════════════════════════════════════════════════════
// SAFE ICON COMPONENT
// ═══════════════════════════════════════════════════════════════
const SafeIcon = ({ icon, size = 16, color = '#fff', strokeWidth, style }) => {
  if (!icon) return <View style={[{ width: size, height: size }, style]} />;
  return (
    <HugeiconsIcon icon={icon} size={size} color={color} strokeWidth={strokeWidth} style={style} />
  );
};

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const CYAN  = '#22D3EE';
const GOLD  = '#C5A059';
const GREEN = '#22C55E';
const RED   = '#EF4444';

// ═══════════════════════════════════════════════════════════════
// DUMMY TRAINER (fallback)
// ═══════════════════════════════════════════════════════════════
const DUMMY_TRAINER = {
  id: 'm1',
  name: 'Abdullah Ahmed',
  memberId: 'GYM001',
  phone: '+918817159218',
  assignedAt: '2024-12-01T00:00:00Z',
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// ═══════════════════════════════════════════════════════════════
// PULSE DOT
// ═══════════════════════════════════════════════════════════════
const PulseDot = ({ color = GREEN, size = 6 }) => {
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
const StatCard = ({ icon, label, value, color, sub, pulse }) => (
  <GlassPanel glow={`${color}08`} style={scSt.card}>
    <View style={scSt.inner}>
      <View style={scSt.topRow}>
        <View style={[scSt.iconBox, { backgroundColor: `${color}15`, borderColor: `${color}20` }]}>
          <SafeIcon icon={icon} size={ms(15)} color={color} />
        </View>
        {pulse && <PulseDot color={color} size={5} />}
      </View>
      <Text style={scSt.value} numberOfLines={1}>{value}</Text>
      <Text style={scSt.label}>{label}</Text>
      {sub && (
        <>
          <View style={scSt.divider} />
          <View style={scSt.subRow}>
            <View style={[scSt.subDot, { backgroundColor: `${color}80` }]} />
            <Text style={scSt.subText}>{sub}</Text>
          </View>
        </>
      )}
    </View>
  </GlassPanel>
);

const scSt = StyleSheet.create({
  card:    { flex: 1 },
  inner:   { padding: ms(12) },
  topRow:  { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: vs(10) },
  iconBox: { width: ms(36), height: ms(36), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  value:   { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(13), color: '#fff', marginBottom: vs(3) },
  label:   { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(7), color: 'rgba(161,161,170,1)', letterSpacing: 1.2, textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: vs(7) },
  subRow:  { flexDirection: 'row', alignItems: 'center', gap: s(5) },
  subDot:  { width: ms(3), height: ms(3), borderRadius: ms(1.5) },
  subText: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(6.5), color: 'rgba(113,113,122,1)', letterSpacing: 0.8, textTransform: 'uppercase' },
});

// ═══════════════════════════════════════════════════════════════
// INFO ROW
// ═══════════════════════════════════════════════════════════════
const InfoRow = ({ icon, label, value, valueColor, color = CYAN, last }) => (
  <View style={[irSt.row, !last && irSt.rowDivider]}>
    <View style={irSt.left}>
      <View style={[irSt.iconBox, { backgroundColor: `${color}10`, borderColor: `${color}15` }]}>
        <SafeIcon icon={icon} size={ms(11)} color={color} />
      </View>
      <Text style={irSt.label}>{label}</Text>
    </View>
    <Text style={[irSt.value, { color: valueColor || 'rgba(255,255,255,0.90)' }]} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

const irSt = StyleSheet.create({
  row:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(10) },
  rowDivider:  { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  left:        { flexDirection: 'row', alignItems: 'center', gap: s(10), flex: 1 },
  iconBox:     { width: ms(28), height: ms(28), borderRadius: ms(8), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  label:       { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(8.5), color: 'rgba(113,113,122,1)', letterSpacing: 1.2, textTransform: 'uppercase' },
  value:       { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(9), letterSpacing: 0.5, marginLeft: s(8), flexShrink: 1, textAlign: 'right' },
});

// ═══════════════════════════════════════════════════════════════
// ACTION BUTTON
// ═══════════════════════════════════════════════════════════════
const ActionBtn = ({ icon, label, sub, color, onPress, badge }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={abSt.btn}
  >
    <View style={[abSt.iconBox, {
      backgroundColor: `${color}10`,
      borderColor: `${color}18`,
      shadowColor: color,
    }]}>
      <SafeIcon icon={icon} size={ms(15)} color={color} />
    </View>
    <View style={abSt.textBlock}>
      <Text style={abSt.label}>{label}</Text>
      {sub && <Text style={abSt.sub} numberOfLines={1}>{sub}</Text>}
    </View>
    {badge && (
      <View style={[abSt.badge, { backgroundColor: `${color}12`, borderColor: `${color}22` }]}>
        <Text style={[abSt.badgeText, { color }]}>{badge}</Text>
      </View>
    )}
    <SafeIcon icon={Icons.chevronRight} size={ms(13)} color="rgba(255,255,255,0.15)" />
  </TouchableOpacity>
);

const abSt = StyleSheet.create({
  btn:       { flexDirection: 'row', alignItems: 'center', gap: s(12), paddingHorizontal: s(14), paddingVertical: vs(12), borderRadius: ms(16), backgroundColor: '#000', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  iconBox:   { width: ms(40), height: ms(40), borderRadius: ms(12), borderWidth: 1, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  textBlock: { flex: 1, minWidth: 0 },
  label:     { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(10), color: '#fff', letterSpacing: 1, textTransform: 'uppercase' },
  sub:       { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8), color: 'rgba(113,113,122,1)', letterSpacing: 0.3, marginTop: vs(2) },
  badge:     { paddingHorizontal: s(7), paddingVertical: vs(3), borderRadius: ms(7), borderWidth: 1 },
  badgeText: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(6.5), letterSpacing: 0.5 },
});

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const TrainerDetailScreen = ({ navigation, route }) => {
  const trainer = route?.params?.trainer || DUMMY_TRAINER;

  // ── Not found state ──
  if (!trainer) {
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
            <Header title="TRAINER DETAIL" showMenu={false} />
            <View style={st.notFoundContainer}>
              <GlassPanel style={st.notFoundCard}>
                <View style={st.notFoundIcon}>
                  <SafeIcon icon={Icons.user} size={ms(28)} color="rgba(63,63,70,1)" strokeWidth={1.5} />
                </View>
                <Text style={st.notFoundText}>TRAINER NOT FOUND</Text>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.85}
                  style={[st.notFoundBtn, { borderColor: `${CYAN}30` }]}
                >
                  <SafeIcon icon={Icons.arrowLeft} size={ms(13)} color={CYAN} />
                  <Text style={[st.notFoundBtnText, { color: CYAN }]}>Back to Trainers</Text>
                </TouchableOpacity>
              </GlassPanel>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }

  const daysActive = trainer.assignedAt
    ? Math.floor((Date.now() - new Date(trainer.assignedAt).getTime()) / 86400000)
    : 0;

  const handleRemove = () => {
    Alert.alert(
      'Remove Trainer',
      `Remove ${trainer.name} from trainer role?\nThey will return to regular member status.`,
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

  const handleAttendance = () => {
    navigation.navigate('TrainerAttendanceLog', { trainer });
  };

  const handleCall = () => {
    if (trainer.phone) {
      Linking.openURL(`tel:${trainer.phone.replace(/\D/g, '')}`);
    } else {
      Alert.alert('No Phone', 'Phone number not available');
    }
  };

  const handleWA = () => {
    if (trainer.phone) {
      Linking.openURL(`https://wa.me/${trainer.phone.replace(/\D/g, '')}`);
    } else {
      Alert.alert('No Phone', 'Phone number not available');
    }
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
          <Header title="TRAINER DETAIL" showMenu={false} />

          <ScrollView
            style={st.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={st.scrollContent}
          >
            {/* ══════════════════════════════════ HEADER */}
            <View style={st.headerArea}>
              <TouchableOpacity
                style={st.backBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <SafeIcon icon={Icons.arrowLeft} size={ms(14)} color="rgba(161,161,170,1)" />
                <Text style={st.backText}>Back</Text>
              </TouchableOpacity>

              <View style={st.headerBadges}>
                <View style={[st.liveBadge, { backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.18)' }]}>
                  <PulseDot color={GREEN} size={4} />
                  <SafeIcon icon={Icons.wifi} size={ms(10)} color={GREEN} />
                  <Text style={[st.liveBadgeText, { color: GREEN }]}>ACTIVE</Text>
                </View>
              </View>
            </View>

            {/* ══════════════════════════════════ HERO CARD */}
            <GlassPanel borderColor={`${CYAN}20`} glow={`${CYAN}06`}>
              {/* Top accent line */}
              <LinearGradient
                colors={['transparent', `${CYAN}50`, 'transparent']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={st.heroTopAccent}
              />

              {/* Watermark */}
              <View style={st.heroWatermark} pointerEvents="none">
                <SafeIcon icon={Icons.dumbbell} size={ms(120)} color={CYAN} />
              </View>

              <View style={st.heroInner}>
                {/* Top Row: Avatar + Remove */}
                <View style={st.heroTopRow}>
                  {/* Avatar */}
                  <View style={st.avatarWrap}>
                    <View style={[st.avatar, {
                      backgroundColor: `${CYAN}15`,
                      borderColor: `${CYAN}35`,
                    }]}>
                      <Text style={[st.avatarText, { color: CYAN }]}>
                        {trainer.name?.slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View style={st.avatarLiveDot}>
                      <View style={st.avatarLiveDotInner} />
                    </View>
                  </View>

                  {/* Remove button */}
                  <TouchableOpacity
                    onPress={handleRemove}
                    activeOpacity={0.85}
                    style={st.removeBtn}
                  >
                    <SafeIcon icon={Icons.cancel} size={ms(14)} color={RED} />
                  </TouchableOpacity>
                </View>

                {/* Badges */}
                <View style={st.heroBadgesRow}>
                  <View style={[st.heroBadge, { backgroundColor: `${CYAN}12`, borderColor: `${CYAN}22` }]}>
                    <SafeIcon icon={Icons.dumbbell} size={ms(10)} color={CYAN} />
                    <Text style={[st.heroBadgeText, { color: CYAN }]}>TRAINER</Text>
                  </View>
                  <View style={[st.heroBadge, { backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.18)' }]}>
                    <PulseDot color={GREEN} size={3} />
                    <Text style={[st.heroBadgeText, { color: GREEN }]}>ACTIVE</Text>
                  </View>
                  <View style={[st.heroBadge, { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }]}>
                    <SafeIcon icon={Icons.calendar} size={ms(9)} color="rgba(113,113,122,1)" />
                    <Text style={[st.heroBadgeText, { color: 'rgba(113,113,122,1)' }]}>
                      {fmtDate(trainer.assignedAt)}
                    </Text>
                  </View>
                </View>

                {/* Name */}
                <Text style={st.heroName} numberOfLines={2}>{trainer.name}</Text>

                {/* Sub info row */}
                <View style={st.heroSubRow}>
                  <View style={st.heroSubItem}>
                    <SafeIcon icon={Icons.hash} size={ms(10)} color="rgba(82,82,91,1)" />
                    <Text style={st.heroSubText}>{trainer.memberId}</Text>
                  </View>
                  <View style={st.heroSubDivider} />
                  <View style={st.heroSubItem}>
                    <SafeIcon icon={Icons.star} size={ms(10)} color="rgba(251,191,36,0.6)" />
                    <Text style={st.heroSubText}>{daysActive} days as trainer</Text>
                  </View>
                </View>
              </View>
            </GlassPanel>

            {/* ══════════════════════════════════ STAT CARDS */}
            <View style={st.statRow}>
              <StatCard
                icon={Icons.target}
                label="Days Active"
                value={`${daysActive}d`}
                color={CYAN}
              />
              <StatCard
                icon={Icons.checkCircle}
                label="Status"
                value="Active"
                color={GREEN}
                pulse
              />
            </View>
            <View style={st.statRow}>
              <StatCard
                icon={Icons.calendar}
                label="Assigned"
                value={fmtDate(trainer.assignedAt)}
                color={GOLD}
              />
              <StatCard
                icon={Icons.dumbbell}
                label="Role"
                value="Trainer"
                color={CYAN}
                sub="gym staff"
              />
            </View>

            {/* ══════════════════════════════════ ATTENDANCE CTA */}
            <GlassPanel
              onPress={handleAttendance}
              borderColor={`${CYAN}20`}
              glow={`${CYAN}06`}
            >
              <LinearGradient
                colors={['transparent', `${CYAN}40`, 'transparent']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={st.heroTopAccent}
              />

              <View style={st.attendancePad}>
                <View style={st.attendanceTopRow}>
                  <View style={[st.attendanceIconBox, {
                    backgroundColor: `${CYAN}12`,
                    borderColor: `${CYAN}22`,
                  }]}>
                    <SafeIcon icon={Icons.clipboard} size={ms(20)} color={CYAN} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.attendanceTitle}>ATTENDANCE LOG</Text>
                    <Text style={st.attendanceSub}>Weekly · Monthly · Yearly</Text>
                  </View>
                </View>

                {/* Preview Stats */}
                <View style={st.attendancePreviewRow}>
                  {[
                    { label: 'This Week',  value: '5 days' },
                    { label: 'This Month', value: '22 days' },
                    { label: 'Total',      value: `${daysActive}d` },
                  ].map((item) => (
                    <View key={item.label} style={st.attendancePreviewBox}>
                      <Text style={[st.attendancePreviewVal, { color: CYAN }]}>{item.value}</Text>
                      <Text style={st.attendancePreviewLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>

                {/* Divider */}
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.08)', 'transparent']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={st.attendanceDivider}
                />

                {/* CTA Row */}
                <View style={[st.attendanceCtaRow, {
                  backgroundColor: `${CYAN}05`,
                  borderColor: `${CYAN}12`,
                }]}>
                  <View style={st.attendanceCtaLeft}>
                    <SafeIcon icon={Icons.view} size={ms(13)} color={`${CYAN}80`} />
                    <Text style={st.attendanceCtaText}>View Full Attendance Log</Text>
                  </View>
                  <SafeIcon icon={Icons.chevronRight} size={ms(14)} color={`${CYAN}60`} />
                </View>
              </View>
            </GlassPanel>

            {/* ══════════════════════════════════ TRAINER INFO */}
            <GlassPanel borderColor={`${CYAN}12`} glow={`${CYAN}05`}>
              <LinearGradient
                colors={['transparent', `${CYAN}30`, 'transparent']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={st.heroTopAccent}
              />

              <View style={st.sectionPad}>
                <View style={st.sectionHeader}>
                  <View style={[st.sectionBar, { backgroundColor: CYAN }]} />
                  <View>
                    <Text style={st.sectionTitle}>TRAINER INFO</Text>
                    <Text style={st.sectionSub}>Profile & assignment details</Text>
                  </View>
                </View>

                <View style={{ paddingHorizontal: s(2) }}>
                  <InfoRow icon={Icons.user}        label="Full Name"   value={trainer.name}             color={CYAN} />
                  <InfoRow icon={Icons.hash}        label="Member ID"   value={trainer.memberId}         color={CYAN} />
                  <InfoRow icon={Icons.dumbbell}    label="Role"        value="Gym Trainer" valueColor={CYAN} color={CYAN} />
                  <InfoRow icon={Icons.calendar}    label="Assigned"    value={fmtDate(trainer.assignedAt)} color={GOLD} />
                  <InfoRow icon={Icons.target}      label="Days Active" value={`${daysActive} days`} valueColor={CYAN} color={CYAN} />
                  <InfoRow icon={Icons.checkCircle} label="Status"      value="Active" valueColor={GREEN} color={GREEN} last />
                </View>
              </View>
            </GlassPanel>

            {/* ══════════════════════════════════ QUICK ACTIONS */}
            <GlassPanel>
              <View style={st.sectionPad}>
                <View style={st.sectionHeader}>
                  <View style={[st.sectionBar, { backgroundColor: GOLD }]} />
                  <View>
                    <Text style={st.sectionTitle}>QUICK ACTIONS</Text>
                    <Text style={st.sectionSub}>Frequently used commands</Text>
                  </View>
                </View>

                <View style={{ gap: vs(8) }}>
                  <ActionBtn
                    icon={Icons.clipboard}
                    label="Attendance Log"
                    sub="View check-in / check-out history"
                    color={CYAN}
                    onPress={handleAttendance}
                    badge="VIEW"
                  />
                  <ActionBtn
                    icon={Icons.call}
                    label="Call Trainer"
                    sub={trainer.phone || 'No phone set'}
                    color={GREEN}
                    onPress={handleCall}
                  />
                  <ActionBtn
                    icon={Icons.whatsapp}
                    label="WhatsApp"
                    sub="Send a direct message"
                    color="#25D366"
                    onPress={handleWA}
                  />
                </View>
              </View>
            </GlassPanel>

            {/* ══════════════════════════════════ DANGER ZONE */}
            <GlassPanel borderColor="rgba(239,68,68,0.15)" glow="rgba(239,68,68,0.04)">
              <View style={st.sectionPad}>
                <View style={st.sectionHeader}>
                  <View style={[st.sectionBar, { backgroundColor: RED }]} />
                  <View>
                    <Text style={[st.sectionTitle, { color: RED }]}>DANGER ZONE</Text>
                    <Text style={st.sectionSub}>Irreversible action</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleRemove}
                  activeOpacity={0.85}
                  style={[st.dangerBtn, { borderColor: 'rgba(239,68,68,0.18)' }]}
                >
                  <View style={[st.dangerIconBox, {
                    backgroundColor: 'rgba(239,68,68,0.10)',
                    borderColor: 'rgba(239,68,68,0.20)',
                  }]}>
                    <SafeIcon icon={Icons.cancel} size={ms(14)} color={RED} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[st.dangerLabel, { color: RED }]}>Remove Trainer</Text>
                    <Text style={st.dangerSub}>Reverts to regular member role</Text>
                  </View>
                  <SafeIcon icon={Icons.chevronRight} size={ms(13)} color="rgba(239,68,68,0.40)" />
                </TouchableOpacity>
              </View>
            </GlassPanel>

            {/* ══════════════════════════════════ FOOTER NOTICE */}
            <GlassPanel borderColor={`${CYAN}10`}>
              <View style={st.footer}>
                <View style={[st.footerIconBox, {
                  backgroundColor: `${CYAN}08`,
                  borderColor: `${CYAN}15`,
                }]}>
                  <SafeIcon icon={Icons.shield} size={ms(13)} color={CYAN} />
                </View>
                <View style={st.footerText}>
                  <Text style={st.footerTitle}>Trainer Access Active</Text>
                  <Text style={st.footerSub} numberOfLines={2}>
                    {trainer.name} has full dashboard access · Removing revokes immediately
                  </Text>
                </View>
                <View style={st.footerBadge}>
                  <View style={st.footerBadgeDot} />
                  <Text style={st.footerBadgeText}>Active</Text>
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

  // Not Found
  notFoundContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: s(20) },
  notFoundCard:      { padding: ms(28), alignItems: 'center', width: '100%', maxWidth: ms(320) },
  notFoundIcon:      { width: ms(60), height: ms(60), borderRadius: ms(18), backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: vs(16) },
  notFoundText:      { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(11), color: 'rgba(113,113,122,1)', letterSpacing: 2, marginBottom: vs(18) },
  notFoundBtn:       { flexDirection: 'row', alignItems: 'center', gap: s(8), paddingHorizontal: s(16), paddingVertical: vs(10), borderRadius: ms(14), borderWidth: 1, backgroundColor: `${CYAN}10` },
  notFoundBtnText:   { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(9), letterSpacing: 1.5, textTransform: 'uppercase' },

  // Header
  headerArea:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8) },
  backBtn:        { flexDirection: 'row', alignItems: 'center', gap: s(8), paddingHorizontal: s(14), paddingVertical: vs(10), borderRadius: ms(14), backgroundColor: '#000', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  backText:       { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(9), color: 'rgba(161,161,170,1)', letterSpacing: 1.5, textTransform: 'uppercase' },
  headerBadges:   { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  liveBadge:      { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(10), paddingVertical: vs(6), borderRadius: ms(10), borderWidth: 1 },
  liveBadgeText:  { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(7), letterSpacing: 1.5 },

  // Hero
  heroTopAccent:  { position: 'absolute', top: 0, left: s(20), right: s(20), height: 2 },
  heroWatermark:  { position: 'absolute', right: -ms(20), top: '50%', opacity: 0.03, transform: [{ translateY: -ms(60) }] },
  heroInner:      { padding: ms(18) },
  heroTopRow:     { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: vs(12) },
  avatarWrap:     { position: 'relative' },
  avatar:         { width: ms(70), height: ms(70), borderRadius: ms(20), borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  avatarText:     { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(18), letterSpacing: 1 },
  avatarLiveDot:  { position: 'absolute', bottom: -ms(3), right: -ms(3), width: ms(20), height: ms(20), borderRadius: ms(10), backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(34,197,94,0.45)' },
  avatarLiveDotInner:{ width: ms(9), height: ms(9), borderRadius: ms(4.5), backgroundColor: GREEN },
  removeBtn:      { width: ms(40), height: ms(40), borderRadius: ms(14), backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.20)', alignItems: 'center', justifyContent: 'center' },
  heroBadgesRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginBottom: vs(12) },
  heroBadge:      { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(10), paddingVertical: vs(5), borderRadius: ms(10), borderWidth: 1 },
  heroBadgeText:  { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(7), letterSpacing: 1, textTransform: 'uppercase' },
  heroName:       { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(18), color: '#fff', letterSpacing: 1, marginBottom: vs(8) },
  heroSubRow:     { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  heroSubItem:    { flexDirection: 'row', alignItems: 'center', gap: s(4) },
  heroSubText:    { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8.5), color: 'rgba(113,113,122,1)', letterSpacing: 0.5 },
  heroSubDivider: { width: 1, height: ms(12), backgroundColor: 'rgba(255,255,255,0.08)' },

  // Stat row
  statRow: { flexDirection: 'row', gap: s(10) },

  // Section common
  sectionPad:    { padding: ms(16) },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(14) },
  sectionBar:    { width: ms(4), height: ms(24), borderRadius: ms(2) },
  sectionTitle:  { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(10), color: '#fff', letterSpacing: 1.8 },
  sectionSub:    { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7.5), color: 'rgba(113,113,122,1)', letterSpacing: 1, textTransform: 'uppercase', marginTop: vs(2) },

  // Attendance CTA
  attendancePad:        { padding: ms(16) },
  attendanceTopRow:     { flexDirection: 'row', alignItems: 'center', gap: s(12), marginBottom: vs(14) },
  attendanceIconBox:    { width: ms(48), height: ms(48), borderRadius: ms(14), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  attendanceTitle:      { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(11), color: '#fff', letterSpacing: 1.5, marginBottom: vs(2) },
  attendanceSub:        { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8), color: 'rgba(113,113,122,1)', letterSpacing: 1, textTransform: 'uppercase' },
  attendancePreviewRow: { flexDirection: 'row', gap: s(8), marginBottom: vs(14) },
  attendancePreviewBox: { flex: 1, padding: ms(12), borderRadius: ms(14), backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center' },
  attendancePreviewVal: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(12), marginBottom: vs(4) },
  attendancePreviewLabel:{ fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(6.5), color: 'rgba(82,82,91,1)', letterSpacing: 0.8, textTransform: 'uppercase' },
  attendanceDivider:    { height: 1, marginBottom: vs(12) },
  attendanceCtaRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: s(14), paddingVertical: vs(12), borderRadius: ms(14), borderWidth: 1 },
  attendanceCtaLeft:    { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  attendanceCtaText:    { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(9.5), color: '#fff', letterSpacing: 1, textTransform: 'uppercase' },

  // Danger Zone
  dangerBtn:     { flexDirection: 'row', alignItems: 'center', gap: s(12), paddingHorizontal: s(14), paddingVertical: vs(12), borderRadius: ms(16), backgroundColor: '#000', borderWidth: 1 },
  dangerIconBox: { width: ms(40), height: ms(40), borderRadius: ms(12), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  dangerLabel:   { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(10), letterSpacing: 1, textTransform: 'uppercase' },
  dangerSub:     { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8), color: 'rgba(239,68,68,0.40)', letterSpacing: 0.3, marginTop: vs(2) },

  // Footer
  footer:          { flexDirection: 'row', alignItems: 'center', gap: s(10), padding: ms(14) },
  footerIconBox:   { width: ms(34), height: ms(34), borderRadius: ms(12), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  footerText:      { flex: 1 },
  footerTitle:     { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(9), color: '#fff', letterSpacing: 1, textTransform: 'uppercase', marginBottom: vs(2) },
  footerSub:       { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7.5), color: 'rgba(113,113,122,1)', letterSpacing: 0.3 },
  footerBadge:     { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(8), paddingVertical: vs(4), borderRadius: ms(10), backgroundColor: 'rgba(34,197,94,0.08)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.15)' },
  footerBadgeDot:  { width: ms(4), height: ms(4), borderRadius: ms(2), backgroundColor: GREEN },
  footerBadgeText: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(7), color: GREEN, letterSpacing: 0.8, textTransform: 'uppercase' },
});

export default TrainerDetailScreen;