// src/screens/admin/AdminTrainersScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Alert,
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
  dumbbell:     resolveIcon('Dumbbell01Icon', 'DumbbellIcon', 'Dumbbell02Icon'),
  userAdd:      resolveIcon('UserAdd01Icon', 'UserAddIcon', 'UserAdd02Icon'),
  userMinus:    resolveIcon('UserMinus01Icon', 'UserRemove01Icon', 'UserMinusIcon'),
  userGroup:    resolveIcon('UserGroupIcon', 'UserMultipleIcon', 'UsersIcon'),
  view:         resolveIcon('ViewIcon', 'EyeIcon', 'View01Icon'),
  target:       resolveIcon('Target02Icon', 'Target01Icon', 'TargetIcon'),
  star:         resolveIcon('StarIcon', 'Star02Icon', 'Star01Icon'),
  trending:     resolveIcon('TradingUpIcon', 'ArrowUpRight01Icon', 'ChartLineData01Icon'),
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
// HELPERS
// ═══════════════════════════════════════════════════════════════
const fmtDate  = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtShort = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

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
          <SafeIcon icon={icon} size={ms(16)} color={color} />
        </View>
        {pulse && <PulseDot color={color} size={6} />}
      </View>
      <Text style={scSt.value}>{value}</Text>
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
  inner:   { padding: ms(13) },
  topRow:  { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: vs(10) },
  iconBox: { width: ms(38), height: ms(38), borderRadius: ms(13), alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  value:   { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(16), color: '#fff', marginBottom: vs(3) },
  label:   { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(7), color: 'rgba(161,161,170,1)', letterSpacing: 1.2, textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: vs(8) },
  subRow:  { flexDirection: 'row', alignItems: 'center', gap: s(5) },
  subDot:  { width: ms(3), height: ms(3), borderRadius: ms(1.5) },
  subText: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(6.5), color: 'rgba(113,113,122,1)', letterSpacing: 0.8, textTransform: 'uppercase' },
});

// ═══════════════════════════════════════════════════════════════
// TRAINER CARD
// ═══════════════════════════════════════════════════════════════
const TrainerCard = ({ trainer, onRemove, onPress }) => {
  const daysActive = trainer.assignedAt
    ? Math.floor((Date.now() - new Date(trainer.assignedAt).getTime()) / 86400000)
    : 0;

  const stats = [
    { icon: Icons.target,      label: 'Days Active', value: `${daysActive}d`,            color: CYAN  },
    { icon: Icons.calendar,    label: 'Since',        value: fmtShort(trainer.assignedAt), color: GOLD  },
    { icon: Icons.checkCircle, label: 'Status',       value: 'Active',                   color: GREEN },
  ];

  return (
    <GlassPanel
      onPress={() => onPress(trainer)}
      borderColor={`${CYAN}18`}
      glow={`${CYAN}05`}
      style={tcSt.card}
    >
      {/* Top accent */}
      <LinearGradient
        colors={['transparent', `${CYAN}50`, 'transparent']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={tcSt.topAccent}
      />

      {/* BG gradient */}
      <LinearGradient
        colors={[`${CYAN}04`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      {/* Watermark dumbbell */}
      <View style={tcSt.watermark} pointerEvents="none">
        <SafeIcon icon={Icons.dumbbell} size={ms(80)} color={CYAN} strokeWidth={0.3} />
      </View>

      <View style={tcSt.inner}>
        {/* ── Row 1: Avatar + Info + Remove ── */}
        <View style={tcSt.row1}>
          {/* Avatar */}
          <View style={tcSt.avatarWrap}>
            <View style={[tcSt.avatar, {
              backgroundColor: `${CYAN}15`,
              borderColor: `${CYAN}30`,
            }]}>
              <Text style={[tcSt.avatarText, { color: CYAN }]}>
                {trainer.name?.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            {/* Live indicator */}
            <View style={tcSt.liveDot}>
              <View style={tcSt.liveDotInner} />
            </View>
          </View>

          {/* Info */}
          <View style={tcSt.infoBlock}>
            {/* Badges row */}
            <View style={tcSt.badgesRow}>
              <View style={[tcSt.badge, { backgroundColor: `${CYAN}10`, borderColor: `${CYAN}20` }]}>
                <View style={[tcSt.badgeDot, { backgroundColor: CYAN }]} />
                <Text style={[tcSt.badgeText, { color: CYAN }]}>TRAINER</Text>
              </View>
              <View style={[tcSt.badge, { backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.18)' }]}>
                <PulseDot color={GREEN} size={3} />
                <Text style={[tcSt.badgeText, { color: GREEN }]}>ACTIVE</Text>
              </View>
            </View>

            {/* Name */}
            <Text style={tcSt.name} numberOfLines={1}>{trainer.name}</Text>

            {/* ID */}
            <View style={tcSt.idBox}>
              <Text style={tcSt.idText}>{trainer.memberId}</Text>
            </View>
          </View>

          {/* Remove button */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation?.();
              onRemove(trainer);
            }}
            activeOpacity={0.7}
            style={tcSt.removeBtn}
          >
            <SafeIcon icon={Icons.cancel} size={ms(13)} color={RED} />
          </TouchableOpacity>
        </View>

        {/* ── Divider ── */}
        <LinearGradient
          colors={['transparent', `${CYAN}18`, 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={tcSt.divider}
        />

        {/* ── Stats Row ── */}
        <View style={tcSt.statsRow}>
          {stats.map((stat, i) => (
            <View key={i} style={tcSt.statBox}>
              <View style={[tcSt.statIconBox, {
                backgroundColor: `${stat.color}10`,
                borderColor: `${stat.color}15`,
              }]}>
                <SafeIcon icon={stat.icon} size={ms(10)} color={stat.color} />
              </View>
              <Text style={[tcSt.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={tcSt.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Assigned Date Row ── */}
        <View style={tcSt.assignedRow}>
          <SafeIcon icon={Icons.calendar} size={ms(11)} color="rgba(82,82,91,1)" />
          <Text style={tcSt.assignedLabel}>Assigned</Text>
          <Text style={tcSt.assignedDate}>{fmtDate(trainer.assignedAt)}</Text>
        </View>

        {/* ── Footer CTA ── */}
        <View style={[tcSt.ctaRow, { backgroundColor: `${CYAN}04`, borderColor: `${CYAN}10` }]}>
          <View style={tcSt.ctaLeft}>
            <SafeIcon icon={Icons.view} size={ms(12)} color={`${CYAN}60`} />
            <Text style={[tcSt.ctaText, { color: `${CYAN}70` }]}>View Full Profile</Text>
          </View>
          <SafeIcon icon={Icons.chevronRight} size={ms(13)} color={`${CYAN}35`} />
        </View>
      </View>
    </GlassPanel>
  );
};

const tcSt = StyleSheet.create({
  card:        { marginBottom: vs(10) },
  topAccent:   { height: 1.5 },
  watermark:   { position: 'absolute', top: -ms(6), right: -ms(6), opacity: 0.04 },
  inner:       { padding: ms(16) },

  row1:        { flexDirection: 'row', alignItems: 'flex-start', gap: s(12), marginBottom: vs(14) },
  avatarWrap:  { position: 'relative' },
  avatar:      { width: ms(56), height: ms(56), borderRadius: ms(16), borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  avatarText:  { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(14) },
  liveDot:     { position: 'absolute', bottom: -ms(3), right: -ms(3), width: ms(18), height: ms(18), borderRadius: ms(9), backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(34,197,94,0.4)' },
  liveDotInner:{ width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: GREEN },

  infoBlock:   { flex: 1, minWidth: 0 },
  badgesRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: s(5), marginBottom: vs(6) },
  badge:       { flexDirection: 'row', alignItems: 'center', gap: s(4), paddingHorizontal: s(7), paddingVertical: vs(3), borderRadius: ms(7), borderWidth: 1 },
  badgeDot:    { width: ms(4), height: ms(4), borderRadius: ms(2) },
  badgeText:   { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(6), letterSpacing: 1, textTransform: 'uppercase' },
  name:        { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(12), color: '#fff', letterSpacing: 0.8, marginBottom: vs(4) },
  idBox:       { alignSelf: 'flex-start', paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(6), backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  idText:      { fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(7.5), color: 'rgba(113,113,122,1)' },

  removeBtn:   { width: ms(36), height: ms(36), borderRadius: ms(12), backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.18)', alignItems: 'center', justifyContent: 'center' },

  divider:     { height: 1, marginBottom: vs(12) },

  statsRow:    { flexDirection: 'row', gap: s(8), marginBottom: vs(12) },
  statBox:     { flex: 1, padding: ms(10), borderRadius: ms(14), backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center' },
  statIconBox: { width: ms(26), height: ms(26), borderRadius: ms(8), borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: vs(6) },
  statValue:   { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(10), marginBottom: vs(2) },
  statLabel:   { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(6), color: 'rgba(82,82,91,1)', letterSpacing: 0.8, textTransform: 'uppercase' },

  assignedRow:    { flexDirection: 'row', alignItems: 'center', gap: s(8), paddingHorizontal: s(12), paddingVertical: vs(8), borderRadius: ms(14), backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: vs(10) },
  assignedLabel:  { flex: 1, fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8.5), color: 'rgba(113,113,122,1)', letterSpacing: 0.5 },
  assignedDate:   { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(8.5), color: '#fff' },

  ctaRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: s(12), paddingVertical: vs(10), borderRadius: ms(14), borderWidth: 1 },
  ctaLeft:     { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  ctaText:     { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(8.5), letterSpacing: 1, textTransform: 'uppercase' },
});

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminTrainersScreen = ({ navigation }) => {
  const [trainers, setTrainers] = useState([
    { id: 'm1', name: 'Abdullah Ahmed', memberId: 'GYM001', assignedAt: '2024-12-01T00:00:00Z' },
    { id: 'm4', name: 'Sneha Gupta',    memberId: 'GYM004', assignedAt: '2024-11-15T00:00:00Z' },
  ]);

  const activeCount = trainers.length;
  const avgDays = trainers.length > 0
    ? Math.round(trainers.reduce((sum, t) => sum + Math.floor((Date.now() - new Date(t.assignedAt)) / 86400000), 0) / trainers.length)
    : 0;

  const handleRemove = (trainer) => {
    Alert.alert(
      'Remove Trainer',
      `Remove ${trainer.name} from trainer role?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setTrainers((p) => p.filter((t) => t.id !== trainer.id)),
        },
      ]
    );
  };

  const handlePress = (trainer) => {
    navigation.navigate('AdminTrainerProfile', { member: trainer });
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
          <Header title="TRAINERS" showMenu={false} />

          <ScrollView
            style={st.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={st.scrollContent}
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
                  <SafeIcon icon={Icons.dumbbell} size={ms(20)} color={CYAN} />
                </View>

                <View>
                  <Text style={st.headerSub}>Roster Management</Text>
                  <Text style={st.headerTitle}>TRAINERS</Text>
                </View>
              </View>
            </View>

            {/* ══════════════════════════════════ ADD TRAINER BUTTON */}
            <TouchableOpacity
              onPress={() => navigation.navigate('AdminAddTrainer')}
              activeOpacity={0.85}
              style={st.addBtnOuter}
            >
              <LinearGradient
                colors={[CYAN, '#0ea5e9']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={st.addBtnGrad}
              >
                <View style={st.addBtnIconBox}>
                  <SafeIcon icon={Icons.userAdd} size={ms(14)} color="#000" />
                </View>
                <Text style={st.addBtnText}>ADD TRAINER</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* ══════════════════════════════════ STAT CARDS */}
            <View style={st.statRow}>
              <StatCard
                icon={Icons.userGroup}
                label="Total"
                value={trainers.length}
                color={CYAN}
                sub="registered"
              />
              <StatCard
                icon={Icons.checkCircle}
                label="Active"
                value={activeCount}
                color={GREEN}
                pulse
                sub="on roster"
              />
            </View>
            <View style={st.statRow}>
              <StatCard
                icon={Icons.star}
                label="Avg Days"
                value={avgDays}
                color={GOLD}
                sub="active days"
              />
              <StatCard
                icon={Icons.trending}
                label="Performance"
                value="100%"
                color={CYAN}
                sub="attendance"
              />
            </View>

            {/* ══════════════════════════════════ SECTION HEADER */}
            <View style={st.sectionRow}>
              <View style={st.sectionLeft}>
                <View style={st.sectionBar} />
                <View>
                  <Text style={st.sectionTitle}>ACTIVE TRAINERS</Text>
                  <Text style={st.sectionSub}>Manage your training staff</Text>
                </View>
              </View>
              {trainers.length > 0 && (
                <View style={[st.countBadge, { backgroundColor: `${CYAN}10`, borderColor: `${CYAN}20` }]}>
                  <Text style={[st.countNum, { color: CYAN }]}>{trainers.length}</Text>
                  <Text style={st.countLabel}>registered</Text>
                </View>
              )}
            </View>

            {/* ══════════════════════════════════ TRAINER LIST or EMPTY */}
            {trainers.length === 0 ? (
              <GlassPanel borderColor={`${CYAN}12`}>
                <View style={st.emptyState}>
                  <View style={st.emptyIconWrap}>
                    <View style={[st.emptyIconBox, {
                      backgroundColor: `${CYAN}06`,
                      borderColor: `${CYAN}15`,
                    }]}>
                      <SafeIcon icon={Icons.userMinus} size={ms(36)} color={`${CYAN}30`} strokeWidth={1.5} />
                    </View>
                    <View style={[st.emptyBadge, { borderColor: `${CYAN}25` }]}>
                      <SafeIcon icon={Icons.userAdd} size={ms(13)} color={CYAN} />
                    </View>
                  </View>

                  <Text style={st.emptyTitle}>NO TRAINERS YET</Text>
                  <Text style={st.emptySub}>
                    Assign trainers from your member roster to get started
                  </Text>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('AdminAddTrainer')}
                    activeOpacity={0.85}
                    style={[st.firstTrainerBtn, {
                      backgroundColor: `${CYAN}10`,
                      borderColor: `${CYAN}30`,
                    }]}
                  >
                    <View style={[st.firstTrainerIconBox, {
                      backgroundColor: `${CYAN}15`,
                      borderColor: `${CYAN}25`,
                    }]}>
                      <SafeIcon icon={Icons.userAdd} size={ms(13)} color={CYAN} />
                    </View>
                    <Text style={[st.firstTrainerText, { color: CYAN }]}>
                      ADD FIRST TRAINER
                    </Text>
                    <SafeIcon icon={Icons.chevronRight} size={ms(13)} color={`${CYAN}60`} />
                  </TouchableOpacity>
                </View>
              </GlassPanel>
            ) : (
              <>
                {trainers.map((t) => (
                  <TrainerCard
                    key={t.id}
                    trainer={t}
                    onRemove={handleRemove}
                    onPress={handlePress}
                  />
                ))}

                {/* ── Add Another (dashed) ── */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('AdminAddTrainer')}
                  activeOpacity={0.85}
                  style={[st.addMoreBtn, { borderColor: `${CYAN}30` }]}
                >
                  <View style={[st.addMoreIconBox, {
                    backgroundColor: `${CYAN}08`,
                    borderColor: `${CYAN}15`,
                  }]}>
                    <SafeIcon icon={Icons.userAdd} size={ms(13)} color={CYAN} />
                  </View>
                  <Text style={[st.addMoreText, { color: `${CYAN}80` }]}>
                    ADD ANOTHER TRAINER
                  </Text>
                  <SafeIcon icon={Icons.chevronRight} size={ms(13)} color={`${CYAN}50`} />
                </TouchableOpacity>
              </>
            )}

            {/* ══════════════════════════════════ FOOTER NOTICE */}
            <GlassPanel borderColor={`${CYAN}10`}>
              <View style={st.footer}>
                <View style={[st.footerIconBox, {
                  backgroundColor: `${CYAN}08`,
                  borderColor: `${CYAN}15`,
                }]}>
                  <SafeIcon icon={Icons.shield} size={ms(14)} color={CYAN} />
                </View>
                <View style={st.footerText}>
                  <Text style={st.footerTitle}>Trainer Access</Text>
                  <Text style={st.footerSub}>
                    Trainers get dedicated dashboard · Removing revokes access
                  </Text>
                </View>
                <View style={st.footerBadge}>
                  <View style={st.footerBadgeDot} />
                  <Text style={st.footerBadgeText}>{activeCount} Active</Text>
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
  headerArea:    { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8) },
  headerLeft:    { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  backBtn:       { width: ms(40), height: ms(40), borderRadius: ms(14), backgroundColor: '#000', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  headerIconBox: { width: ms(48), height: ms(48), borderRadius: ms(16), backgroundColor: `${CYAN}15`, borderWidth: 1, borderColor: `${CYAN}22`, alignItems: 'center', justifyContent: 'center' },
  headerSub:     { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(7.5), color: CYAN, letterSpacing: 2, textTransform: 'uppercase', marginBottom: vs(2) },
  headerTitle:   { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(14), color: '#fff', letterSpacing: 2 },

  // Add button
  addBtnOuter:   { borderRadius: ms(16), overflow: 'hidden', shadowColor: CYAN, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  addBtnGrad:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(10), paddingVertical: vs(14) },
  addBtnIconBox: { width: ms(28), height: ms(28), borderRadius: ms(8), backgroundColor: 'rgba(0,0,0,0.10)', alignItems: 'center', justifyContent: 'center' },
  addBtnText:    { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(9.5), color: '#000', letterSpacing: 1.5 },

  // Stats
  statRow: { flexDirection: 'row', gap: s(10) },

  // Section header
  sectionRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: vs(4) },
  sectionLeft:  { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  sectionBar:   { width: ms(4), height: ms(24), borderRadius: ms(2), backgroundColor: CYAN },
  sectionTitle: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(11), color: '#fff', letterSpacing: 1.8 },
  sectionSub:   { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7.5), color: 'rgba(113,113,122,1)', letterSpacing: 1, textTransform: 'uppercase' },
  countBadge:   { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(10), paddingVertical: vs(5), borderRadius: ms(10), borderWidth: 1 },
  countNum:     { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(10) },
  countLabel:   { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7.5), color: 'rgba(113,113,122,1)' },

  // Empty state
  emptyState:    { alignItems: 'center', paddingVertical: vs(40), paddingHorizontal: s(20) },
  emptyIconWrap: { position: 'relative', marginBottom: vs(20) },
  emptyIconBox:  { width: ms(80), height: ms(80), borderRadius: ms(24), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  emptyBadge:    { position: 'absolute', bottom: -ms(4), right: -ms(4), width: ms(30), height: ms(30), borderRadius: ms(10), backgroundColor: '#000', borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle:    { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(14), color: '#fff', letterSpacing: 2, marginBottom: vs(8) },
  emptySub:      { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(9), color: 'rgba(113,113,122,1)', textAlign: 'center', letterSpacing: 0.5, marginBottom: vs(24), lineHeight: rf(13) },
  firstTrainerBtn:    { flexDirection: 'row', alignItems: 'center', gap: s(10), paddingHorizontal: s(18), paddingVertical: vs(12), borderRadius: ms(16), borderWidth: 1 },
  firstTrainerIconBox:{ width: ms(32), height: ms(32), borderRadius: ms(10), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  firstTrainerText:   { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(9.5), letterSpacing: 1.5 },

  // Add more (dashed)
  addMoreBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(10), paddingVertical: vs(14), borderRadius: ms(16), borderWidth: 1, borderStyle: 'dashed', backgroundColor: '#000' },
  addMoreIconBox:  { width: ms(32), height: ms(32), borderRadius: ms(10), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  addMoreText:     { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(9), letterSpacing: 1.5 },

  // Footer
  footer:          { flexDirection: 'row', alignItems: 'center', gap: s(12), padding: ms(14) },
  footerIconBox:   { width: ms(36), height: ms(36), borderRadius: ms(12), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  footerText:      { flex: 1 },
  footerTitle:     { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(9), color: '#fff', letterSpacing: 1, textTransform: 'uppercase', marginBottom: vs(2) },
  footerSub:       { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7.5), color: 'rgba(113,113,122,1)', letterSpacing: 0.3 },
  footerBadge:     { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(10), paddingVertical: vs(4), borderRadius: ms(10), backgroundColor: 'rgba(34,197,94,0.08)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.15)' },
  footerBadgeDot:  { width: ms(5), height: ms(5), borderRadius: ms(2.5), backgroundColor: GREEN },
  footerBadgeText: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(7.5), color: GREEN, letterSpacing: 0.8, textTransform: 'uppercase' },
});

export default AdminTrainersScreen;