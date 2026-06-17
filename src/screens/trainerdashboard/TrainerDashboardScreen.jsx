// src/screens/trainer/TrainerDashboardScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  CheckmarkCircle02Icon,
  LogoutSquare01Icon,
  Activity01Icon,
  Clock01Icon,
  Dumbbell01Icon,
  Login01Icon,
  Logout01Icon,
  Calendar03Icon,
  UserGroupIcon,
  ArrowRight01Icon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';

import Header from '../../components/shared/Header';
import GlassCard from '../../components/shared/GlassCard';
import GlassButton from '../../components/shared/GlassButton';
import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import gymlogoimg from '../user/gymlogoimg.png';
import { useTrainer } from '../../context/TrainerContext';

const s  = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const TRAINER_COLOR = '#22D3EE';

// ═══════════════════════════════════════════════════════════════
// DUMMY DATA
// ═══════════════════════════════════════════════════════════════
const TODAY_DATA = {
  status: 'present',
  checkinTime: '6:15 AM',
  checkoutTime: null,
  duration: '2h 30m',
  isOngoing: true,
};

const ATTENDANCE_STATS = {
  weekPresent: 5,
  weekAbsent: 1,
  weekTotal: 6,
  monthPresent: 22,
  monthAbsent: 4,
  monthTotal: 26,
};

const LIVE_MEMBERS = [
  { id: '1', name: 'Abdullah Ahmed',   avatar: 'AA', checkinTime: '6:30 AM', duration: '2h 00m', tier: 'ELITE' },
  { id: '2', name: 'Sneha Gupta',      avatar: 'SG', checkinTime: '6:50 AM', duration: '1h 40m', tier: 'LEGENDARY' },
  { id: '3', name: 'Karan Malhotra',   avatar: 'KM', checkinTime: '7:00 AM', duration: '1h 30m', tier: 'ELITE' },
  { id: '4', name: 'Nisha Joshi',      avatar: 'NJ', checkinTime: '7:10 AM', duration: '1h 20m', tier: 'LEGENDARY' },
  { id: '5', name: 'Rahul Verma',      avatar: 'RV', checkinTime: '7:15 AM', duration: '1h 15m', tier: 'TRIAL' },
];

const TIER_COLORS = {
  ELITE: '#EAB308',
  LEGENDARY: '#a855f7',
  TRIAL: '#3B82F6',
};

// ═══════════════════════════════════════════════════════════════
// LIVE MEMBER ROW
// ═══════════════════════════════════════════════════════════════
const LiveMemberRow = ({ member, isLast }) => {
  const tierColor = TIER_COLORS[member.tier] || Colors.zinc[400];

  return (
    <View style={[liveSt.row, isLast && { marginBottom: 0 }]}>
      {/* Avatar */}
      <View style={[liveSt.avatar, { borderColor: `${tierColor}60` }]}>
        <Text style={liveSt.avatarText}>{member.avatar}</Text>
        <View style={liveSt.liveDotWrap}>
          <View style={liveSt.liveDot} />
        </View>
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <View style={liveSt.nameRow}>
          <Text style={liveSt.name} numberOfLines={1}>{member.name}</Text>
          <View style={[liveSt.tierPill, { borderColor: `${tierColor}40` }]}>
            <View style={[liveSt.tierDot, { backgroundColor: tierColor }]} />
            <Text style={[liveSt.tierText, { color: tierColor }]}>{member.tier}</Text>
          </View>
        </View>
        <View style={liveSt.timeRow}>
          <HugeiconsIcon icon={Login01Icon} size={ms(10)} color="#22C55E" />
          <Text style={liveSt.timeText}>{member.checkinTime}</Text>
          <View style={liveSt.timeDot} />
          <HugeiconsIcon icon={Clock01Icon} size={ms(10)} color={Colors.zinc[500]} />
          <Text style={liveSt.timeText}>{member.duration}</Text>
        </View>
      </View>
    </View>
  );
};

const liveSt = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginBottom: vs(8),
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: ms(10),
    padding: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  avatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    position: 'relative',
  },
  avatarText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(10),
    color: '#fff',
  },
  liveDotWrap: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  liveDot: {
    width: ms(7),
    height: ms(7),
    borderRadius: ms(3.5),
    backgroundColor: '#22C55E',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(3),
  },
  name: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(10),
    color: '#fff',
    flex: 1,
    marginRight: s(8),
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
    paddingHorizontal: s(6),
    paddingVertical: vs(1),
    borderRadius: ms(4),
    borderWidth: 1,
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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
  },
  timeText: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(7),
    color: Colors.zinc[400],
  },
  timeDot: {
    width: ms(3),
    height: ms(3),
    borderRadius: ms(1.5),
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: s(3),
  },
});

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const TrainerDashboardScreen = ({ navigation }) => {
  const { getTrainer } = useTrainer();

  const currentUser = {
    id: 'user_001',
    name: 'Abdullah Ahmed',
  };

  const trainerData = getTrainer(currentUser.id);

  const daysAsTrainer = trainerData?.assignedAt
    ? Math.floor(
        (Date.now() - new Date(trainerData.assignedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const isToday   = TODAY_DATA.status === 'present';
  const isOngoing = TODAY_DATA.isOngoing;

  const weekRate = Math.round(
    (ATTENDANCE_STATS.weekPresent / ATTENDANCE_STATS.weekTotal) * 100
  );
  const monthRate = Math.round(
    (ATTENDANCE_STATS.monthPresent / ATTENDANCE_STATS.monthTotal) * 100
  );

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={st.background}
      blurRadius={9}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.92)', '#000000']}
        style={st.gradient}
      >
        <SafeAreaView style={st.safeArea} edges={['top']}>
          <Header />

          <ScrollView
            style={st.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={st.scrollContent}
          >
            {/* ═══════════════════════════════════════════════════ */}
            {/* WELCOME */}
            {/* ═══════════════════════════════════════════════════ */}
            <View style={st.welcomeSection}>
              <Text style={st.welcomeLabel}>Welcome back</Text>
              <Text style={st.welcomeName}>{currentUser.name}</Text>
              <View style={st.trainerBadge}>
                <HugeiconsIcon icon={Dumbbell01Icon} size={ms(10)} color={TRAINER_COLOR} />
                <Text style={st.trainerBadgeText}>GYM TRAINER</Text>
              </View>
            </View>

            {/* ═══════════════════════════════════════════════════ */}
            {/* HERO TRAINER CARD */}
            {/* ═══════════════════════════════════════════════════ */}
            <View style={st.heroCard}>
              {/* BG */}
              <View style={st.heroBgIcon}>
                <HugeiconsIcon
                  icon={Dumbbell01Icon}
                  size={ms(100)}
                  color={`${TRAINER_COLOR}08`}
                  strokeWidth={0.5}
                />
              </View>
              <View style={st.heroLogo}>
                <Image source={gymlogoimg} style={st.heroLogoImg} />
              </View>

              <LinearGradient
                colors={[`${TRAINER_COLOR}10`, `${TRAINER_COLOR}04`, 'transparent']}
                style={StyleSheet.absoluteFill}
              />

              <View style={st.heroContent}>
                {/* Top */}
                <View style={st.heroTopRow}>
                  <View style={{ flex: 1 }}>
                    <View style={st.heroBadge}>
                      <View style={st.heroBadgeDot} />
                      <Text style={st.heroBadgeText}>Active Role</Text>
                    </View>
                    <Text style={st.heroTitle}>GYM TRAINER</Text>
                    <View style={st.heroWorkoutBadge}>
                      <HugeiconsIcon icon={Dumbbell01Icon} size={ms(10)} color={TRAINER_COLOR} />
                      <Text style={st.heroWorkoutText}>PERSONAL TRAINER</Text>
                    </View>
                  </View>
                  <View style={st.heroDaysBox}>
                    <Text style={st.heroDaysNumber}>{daysAsTrainer}</Text>
                    <Text style={st.heroDaysLabel}>Days Active</Text>
                  </View>
                </View>

                <View style={st.heroDivider} />

                {/* Today Status */}
                <View style={st.heroFooter}>
                  <Text style={st.heroFooterText}>
                    Assigned{' '}
                    {trainerData?.assignedAt
                      ? new Date(trainerData.assignedAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Today'}
                  </Text>
                  {isOngoing ? (
                    <View style={st.heroInGymChip}>
                      <View style={st.heroInGymDot} />
                      <Text style={st.heroInGymText}>IN GYM</Text>
                    </View>
                  ) : isToday ? (
                    <View style={st.heroActiveChip}>
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={ms(12)} color={TRAINER_COLOR} />
                      <Text style={st.heroActiveChipText}>PRESENT</Text>
                    </View>
                  ) : (
                    <View style={st.heroAbsentChip}>
                      <Text style={st.heroAbsentChipText}>ABSENT</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* ═══════════════════════════════════════════════════ */}
            {/* TODAY'S ATTENDANCE */}
            {/* ═══════════════════════════════════════════════════ */}
            <View style={[st.card, { borderColor: isToday ? `${TRAINER_COLOR}25` : 'rgba(239,68,68,0.2)' }]}>
              <LinearGradient
                colors={isToday ? [`${TRAINER_COLOR}06`, 'transparent'] : ['rgba(239,68,68,0.05)', 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              <View style={st.cardPad}>
                <View style={st.cardTitleRow}>
                  <View style={st.cardTitleLeft}>
                    <HugeiconsIcon icon={Calendar03Icon} size={ms(14)} color={isToday ? TRAINER_COLOR : '#EF4444'} />
                    <Text style={st.cardTitle}>TODAY</Text>
                  </View>
                  <View style={[st.statusBadge, {
                    backgroundColor: isToday ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)',
                    borderColor: isToday ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)',
                  }]}>
                    <Text style={[st.statusBadgeText, { color: isToday ? '#22C55E' : '#EF4444' }]}>
                      {isToday ? 'PRESENT' : 'ABSENT'}
                    </Text>
                  </View>
                </View>

                {isToday ? (
                  <View style={st.todayGrid}>
                    {/* Check In */}
                    <View style={st.todayItem}>
                      <View style={[st.todayIconBox, { backgroundColor: 'rgba(34,197,94,0.12)' }]}>
                        <HugeiconsIcon icon={Login01Icon} size={ms(16)} color="#22C55E" />
                      </View>
                      <Text style={st.todayLabel}>CHECK IN</Text>
                      <Text style={st.todayValue}>{TODAY_DATA.checkinTime}</Text>
                    </View>

                    <View style={st.todayDivider} />

                    {/* Check Out */}
                    <View style={st.todayItem}>
                      <View style={[st.todayIconBox, {
                        backgroundColor: isOngoing ? `${TRAINER_COLOR}12` : 'rgba(239,68,68,0.12)'
                      }]}>
                        <HugeiconsIcon
                          icon={Logout01Icon}
                          size={ms(16)}
                          color={isOngoing ? TRAINER_COLOR : '#EF4444'}
                        />
                      </View>
                      <Text style={st.todayLabel}>CHECK OUT</Text>
                      <Text style={[st.todayValue, isOngoing && { color: TRAINER_COLOR, fontSize: rf(9) }]}>
                        {isOngoing ? 'Still here' : TODAY_DATA.checkoutTime}
                      </Text>
                    </View>

                    <View style={st.todayDivider} />

                    {/* Duration */}
                    <View style={st.todayItem}>
                      <View style={[st.todayIconBox, { backgroundColor: 'rgba(234,179,8,0.12)' }]}>
                        <HugeiconsIcon icon={Clock01Icon} size={ms(16)} color="#EAB308" />
                      </View>
                      <Text style={st.todayLabel}>DURATION</Text>
                      <Text style={st.todayValue}>{TODAY_DATA.duration}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={st.absentBox}>
                    <HugeiconsIcon icon={AlertCircleIcon} size={ms(28)} color="rgba(239,68,68,0.4)" />
                    <Text style={st.absentTitle}>Not Checked In</Text>
                    <Text style={st.absentSub}>Check in to start your shift</Text>
                  </View>
                )}
              </View>
            </View>

            {/* ═══════════════════════════════════════════════════ */}
            {/* ATTENDANCE OVERVIEW */}
            {/* ═══════════════════════════════════════════════════ */}
            <View style={st.card}>
              <View style={st.cardPad}>
                <View style={st.cardTitleRow}>
                  <View style={st.cardTitleLeft}>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={ms(14)} color={TRAINER_COLOR} />
                    <Text style={st.cardTitle}>ATTENDANCE</Text>
                  </View>
                </View>

                {/* Week / Month Stats */}
                <View style={st.attendanceGrid}>
                  {/* This Week */}
                  <View style={st.attendanceCol}>
                    <Text style={st.attendanceColTitle}>This Week</Text>
                    <View style={st.attendanceRow}>
                      <View style={st.attendanceItem}>
                        <View style={[st.attendanceDot, { backgroundColor: '#22C55E' }]} />
                        <Text style={st.attendanceLabel}>Present</Text>
                        <Text style={[st.attendanceValue, { color: '#22C55E' }]}>
                          {ATTENDANCE_STATS.weekPresent}
                        </Text>
                      </View>
                      <View style={st.attendanceItem}>
                        <View style={[st.attendanceDot, { backgroundColor: '#EF4444' }]} />
                        <Text style={st.attendanceLabel}>Absent</Text>
                        <Text style={[st.attendanceValue, { color: '#EF4444' }]}>
                          {ATTENDANCE_STATS.weekAbsent}
                        </Text>
                      </View>
                      <View style={st.attendanceItem}>
                        <View style={[st.attendanceDot, { backgroundColor: TRAINER_COLOR }]} />
                        <Text style={st.attendanceLabel}>Rate</Text>
                        <Text style={[st.attendanceValue, { color: TRAINER_COLOR }]}>
                          {weekRate}%
                        </Text>
                      </View>
                    </View>
                    {/* Progress */}
                    <View style={st.progressTrack}>
                      <LinearGradient
                        colors={['#22C55E', TRAINER_COLOR]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[st.progressFill, { width: `${weekRate}%` }]}
                      />
                    </View>
                  </View>

                  <View style={st.attendanceColDivider} />

                  {/* This Month */}
                  <View style={st.attendanceCol}>
                    <Text style={st.attendanceColTitle}>This Month</Text>
                    <View style={st.attendanceRow}>
                      <View style={st.attendanceItem}>
                        <View style={[st.attendanceDot, { backgroundColor: '#22C55E' }]} />
                        <Text style={st.attendanceLabel}>Present</Text>
                        <Text style={[st.attendanceValue, { color: '#22C55E' }]}>
                          {ATTENDANCE_STATS.monthPresent}
                        </Text>
                      </View>
                      <View style={st.attendanceItem}>
                        <View style={[st.attendanceDot, { backgroundColor: '#EF4444' }]} />
                        <Text style={st.attendanceLabel}>Absent</Text>
                        <Text style={[st.attendanceValue, { color: '#EF4444' }]}>
                          {ATTENDANCE_STATS.monthAbsent}
                        </Text>
                      </View>
                      <View style={st.attendanceItem}>
                        <View style={[st.attendanceDot, { backgroundColor: TRAINER_COLOR }]} />
                        <Text style={st.attendanceLabel}>Rate</Text>
                        <Text style={[st.attendanceValue, { color: TRAINER_COLOR }]}>
                          {monthRate}%
                        </Text>
                      </View>
                    </View>
                    <View style={st.progressTrack}>
                      <LinearGradient
                        colors={['#22C55E', TRAINER_COLOR]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[st.progressFill, { width: `${monthRate}%` }]}
                      />
                    </View>
                  </View>
                </View>

                {/* View Full Log */}
                <TouchableOpacity
                  style={st.viewLogBtn}
                  onPress={() => navigation.navigate('TrainerAttendanceLog', {
                    trainer: { id: currentUser.id, name: currentUser.name, ...trainerData }
                  })}
                  activeOpacity={0.8}
                >
                  <View style={st.viewLogContent}>
                    <HugeiconsIcon icon={Login01Icon} size={ms(14)} color={TRAINER_COLOR} />
                    <Text style={st.viewLogText}>View Full Attendance Log</Text>
                  </View>
                  <View style={st.viewLogArrow}>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={ms(14)} color="rgba(255,255,255,0.4)" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* ═══════════════════════════════════════════════════ */}
            {/* LIVE MEMBERS IN GYM */}
            {/* ═══════════════════════════════════════════════════ */}
           

            {/* ═══════════════════════════════════════════════════ */}
            {/* FACILITY STATUS */}
            {/* ═══════════════════════════════════════════════════ */}
            <GlassCard>
              <View style={st.facilityHeader}>
                <View style={st.facilityTitleRow}>
                  <HugeiconsIcon icon={Activity01Icon} size={ms(16)} color={Colors.zinc[400]} />
                  <Text style={st.facilityTitleText}>Facility Status</Text>
                </View>
                <View style={st.facilityLogoContainer}>
                  <Image source={gymlogoimg} style={st.facilityLogo} resizeMode="contain" />
                </View>
              </View>
              <View style={st.facilityStats}>
                <Text style={st.facilityNumber}>42</Text>
                <Text style={st.facilityLabel}>Members Inside</Text>
              </View>
              <View style={st.facilityProgressBar}>
                <View style={st.facilityProgressFill} />
              </View>
              <View style={st.facilityPrediction}>
                <View style={st.facilityPredictionDivider} />
                <View style={st.facilityPredictionContent}>
                  <View style={st.facilityPredictionLeft}>
                    <View style={st.facilityPredictionIconWrap}>
                      <HugeiconsIcon icon={Clock01Icon} size={ms(14)} color={Colors.zinc[400]} />
                    </View>
                    <View>
                      <Text style={st.facilityPredictionLabel}>ESTIMATED IN 15 MIN</Text>
                      <View style={st.facilityPredictionValue}>
                        <Text style={st.facilityPredictionNumber}>4</Text>
                        <Text style={st.facilityPredictionText}> members will leave</Text>
                      </View>
                    </View>
                  </View>
                  <View style={st.facilityTrendBadge}>
                    <Text style={st.facilityTrendText}>-4</Text>
                  </View>
                </View>
                <View style={st.facilityExpected}>
                  <Text style={st.facilityExpectedLabel}>Expected count:</Text>
                  <Text style={st.facilityExpectedValue}>38 members</Text>
                </View>
              </View>
            </GlassCard>

            {/* ═══════════════════════════════════════════════════ */}
            {/* CHECK IN / OUT */}
            {/* ═══════════════════════════════════════════════════ */}
            <View style={st.actionButtons}>
              <GlassButton variant="glass" style={st.actionButton}>
                <View style={st.actionButtonContent}>
                  <View style={st.actionIcon}>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color={Colors.white} />
                  </View>
                  <Text style={st.actionButtonText}>Check In</Text>
                </View>
              </GlassButton>
              <GlassButton variant="outline" style={st.actionButton}>
                <View style={st.actionButtonContent}>
                  <View style={[st.actionIcon, st.actionIconInactive]}>
                    <HugeiconsIcon icon={LogoutSquare01Icon} size={20} color={Colors.zinc[500]} />
                  </View>
                  <Text style={[st.actionButtonText, st.actionButtonTextInactive]}>Check Out</Text>
                </View>
              </GlassButton>
            </View>
          </ScrollView>

          {/* ✅ TRAINER BOTTOM NAV */}
          <BottomNav
            activeTab="home"
            onTabChange={(tab) => {
              if (tab === 'home') {}
              if (tab === 'attendance') navigation.navigate('TrainerAttendanceLog', {
                trainer: { id: currentUser.id, name: currentUser.name, ...trainerData }
              });
              if (tab === 'friends') navigation.navigate('MembersFriend');
              if (tab === 'profile') navigation.navigate('UserProfile');
            }}
            userType="trainer"
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
  background: { flex: 1 },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: s(24), gap: vs(12), paddingBottom: vs(100) },

  // Welcome
  welcomeSection: { marginBottom: vs(0) },
  welcomeLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(8), color: Colors.zinc[400], letterSpacing: s(2), textTransform: 'uppercase', marginBottom: vs(4), fontWeight: '600' },
  welcomeName: { fontFamily: Fonts.orbitron.extraBold, fontSize: rf(18), color: Colors.white, letterSpacing: s(3.6) },
  trainerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: s(6), marginTop: vs(8),
    backgroundColor: `${TRAINER_COLOR}15`, paddingHorizontal: s(10), paddingVertical: vs(4),
    borderRadius: ms(6), alignSelf: 'flex-start', borderWidth: 1, borderColor: `${TRAINER_COLOR}30`,
  },
  trainerBadgeText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(8), color: TRAINER_COLOR, letterSpacing: s(1.5) },

  // Hero Card
  heroCard: { borderRadius: ms(16), padding: s(16), borderWidth: 1, borderColor: `${TRAINER_COLOR}40`, overflow: 'hidden', position: 'relative', backgroundColor: '#0a0a0a' },
  heroBgIcon: { position: 'absolute', top: -ms(10), right: -ms(15), opacity: 0.8 },
  heroLogo: { position: 'absolute', top: scale(10), right: 0, bottom: 0, left: scale(10), justifyContent: 'center', alignItems: 'center' },
  heroLogoImg: { width: moderateScale(300), height: moderateScale(150), opacity: 0.12 },
  heroContent: { zIndex: 1 },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(12) },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(4) },
  heroBadgeDot: { width: s(6), height: s(6), borderRadius: s(3), backgroundColor: TRAINER_COLOR },
  heroBadgeText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7), color: TRAINER_COLOR, letterSpacing: s(1.5), textTransform: 'uppercase' },
  heroTitle: { fontFamily: Fonts.orbitron.bold, fontSize: rf(15), color: TRAINER_COLOR, letterSpacing: s(3.5), marginBottom: vs(6) },
  heroWorkoutBadge: { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(4), alignSelf: 'flex-start', backgroundColor: `${TRAINER_COLOR}15` },
  heroWorkoutText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7), color: TRAINER_COLOR, letterSpacing: s(1) },
  heroDaysBox: { alignItems: 'flex-end' },
  heroDaysNumber: { fontFamily: Fonts.orbitron.regular, fontSize: rf(28), lineHeight: rf(36), color: TRAINER_COLOR },
  heroDaysLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(8), color: Colors.zinc[500], letterSpacing: s(1.5), textTransform: 'uppercase' },
  heroDivider: { height: vs(1), backgroundColor: `${TRAINER_COLOR}25`, marginVertical: vs(12) },
  heroFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroFooterText: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[500] },
  heroInGymChip: { flexDirection: 'row', alignItems: 'center', gap: s(4), paddingHorizontal: s(10), paddingVertical: vs(5), borderRadius: ms(6), borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)', backgroundColor: 'rgba(34,197,94,0.10)' },
  heroInGymDot: { width: ms(5), height: ms(5), borderRadius: ms(2.5), backgroundColor: '#22C55E' },
  heroInGymText: { fontFamily: Fonts.orbitron.bold, fontSize: rf(6), color: '#22C55E', letterSpacing: 0.8 },
  heroActiveChip: { flexDirection: 'row', alignItems: 'center', gap: s(4), paddingHorizontal: s(10), paddingVertical: vs(5), borderRadius: ms(6), borderWidth: 1, borderColor: `${TRAINER_COLOR}40`, backgroundColor: `${TRAINER_COLOR}10` },
  heroActiveChipText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(8), color: TRAINER_COLOR, letterSpacing: s(1) },
  heroAbsentChip: { paddingHorizontal: s(10), paddingVertical: vs(5), borderRadius: ms(6), borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', backgroundColor: 'rgba(239,68,68,0.08)' },
  heroAbsentChipText: { fontFamily: Fonts.orbitron.bold, fontSize: rf(6), color: '#EF4444', letterSpacing: 0.8 },

  // Card
  card: { borderRadius: ms(14), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#000' },
  cardPad: { padding: ms(14) },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(14) },
  cardTitleLeft: { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  cardTitle: { fontFamily: Fonts.rajdhani.bold, fontSize: rf(9), color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, textTransform: 'uppercase' },

  // Status Badge
  statusBadge: { paddingHorizontal: s(10), paddingVertical: vs(3), borderRadius: ms(8), borderWidth: 1 },
  statusBadgeText: { fontFamily: Fonts.orbitron.bold, fontSize: rf(7), letterSpacing: 0.8 },

  // Today
  todayGrid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  todayItem: { flex: 1, alignItems: 'center', gap: vs(5) },
  todayIconBox: { width: ms(44), height: ms(44), borderRadius: ms(14), alignItems: 'center', justifyContent: 'center', marginBottom: vs(2) },
  todayLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(7), color: Colors.zinc[500], textTransform: 'uppercase', letterSpacing: 0.5 },
  todayValue: { fontFamily: Fonts.orbitron.bold, fontSize: rf(10), color: '#fff', textAlign: 'center' },
  todayDivider: { width: 1, height: vs(50), backgroundColor: 'rgba(255,255,255,0.06)', marginHorizontal: s(8) },
  absentBox: { alignItems: 'center', gap: vs(6), paddingVertical: vs(20) },
  absentTitle: { fontFamily: Fonts.orbitron.bold, fontSize: rf(12), color: Colors.zinc[400] },
  absentSub: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[600] },

  // Attendance
  attendanceGrid: { gap: vs(14) },
  attendanceCol: { gap: vs(8) },
  attendanceColTitle: { fontFamily: Fonts.rajdhani.bold, fontSize: rf(9), color: Colors.zinc[300], letterSpacing: 0.5, textTransform: 'uppercase' },
  attendanceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  attendanceItem: { flexDirection: 'row', alignItems: 'center', gap: s(5) },
  attendanceDot: { width: ms(6), height: ms(6), borderRadius: ms(3) },
  attendanceLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(8), color: Colors.zinc[500] },
  attendanceValue: { fontFamily: Fonts.orbitron.bold, fontSize: rf(10) },
  attendanceColDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  progressTrack: { height: vs(4), backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: ms(2), overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: ms(2) },

  // View Log
  viewLogBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#000', paddingVertical: vs(10), paddingHorizontal: s(12),
    borderRadius: ms(10), borderWidth: 1, borderColor: `${TRAINER_COLOR}20`, marginTop: vs(12),
  },
  viewLogContent: { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  viewLogText: { fontFamily: Fonts.rajdhani.bold, fontSize: rf(9), color: '#fff', letterSpacing: s(0.8), textTransform: 'uppercase' },
  viewLogArrow: { width: ms(24), height: ms(24), borderRadius: ms(12), backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },

  // Live Members
  liveCountBadge: {
    flexDirection: 'row', alignItems: 'center', gap: s(5),
    paddingHorizontal: s(10), paddingVertical: vs(3), borderRadius: ms(8),
    borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)', backgroundColor: 'rgba(34,197,94,0.10)',
  },
  liveCountDot: { width: ms(5), height: ms(5), borderRadius: ms(2.5), backgroundColor: '#22C55E' },
  liveCountText: { fontFamily: Fonts.orbitron.bold, fontSize: rf(10), color: '#22C55E' },

  // Facility
  facilityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(16) },
  facilityTitleRow: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  facilityTitleText: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(7), color: Colors.white, letterSpacing: s(2.4), textTransform: 'uppercase' },
  facilityLogoContainer: { position: 'absolute', top: s(27), right: 0, bottom: 0, left: s(230), justifyContent: 'center', alignItems: 'center', paddingRight: s(10) },
  facilityLogo: { width: ms(150), height: ms(150), opacity: 0.5 },
  facilityStats: { flexDirection: 'row', alignItems: 'flex-end', gap: s(12), marginBottom: vs(8) },
  facilityNumber: { fontFamily: Fonts.orbitron.regular, fontSize: rf(36), color: Colors.white, lineHeight: rf(40) },
  facilityLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(10), color: Colors.zinc[500], letterSpacing: s(2), textTransform: 'uppercase', paddingBottom: vs(4) },
  facilityProgressBar: { height: vs(4), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(2), overflow: 'hidden', marginTop: vs(16) },
  facilityProgressFill: { height: '100%', width: '45%', backgroundColor: Colors.zinc[400] },
  facilityPrediction: { marginTop: vs(16) },
  facilityPredictionDivider: { height: vs(1), backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: vs(16) },
  facilityPredictionContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  facilityPredictionLeft: { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  facilityPredictionIconWrap: { width: ms(28), height: ms(28), borderRadius: ms(14), backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  facilityPredictionLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(6), color: Colors.zinc[500], letterSpacing: s(1.5), textTransform: 'uppercase' },
  facilityPredictionValue: { flexDirection: 'row', alignItems: 'baseline' },
  facilityPredictionNumber: { fontFamily: Fonts.orbitron.bold, fontSize: rf(14), color: Colors.green },
  facilityPredictionText: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(10), color: Colors.zinc[400] },
  facilityTrendBadge: { flexDirection: 'row', alignItems: 'center', gap: s(4), backgroundColor: 'rgba(34,197,94,0.1)', paddingHorizontal: s(8), paddingVertical: vs(4), borderRadius: ms(4), borderWidth: s(1), borderColor: 'rgba(34,197,94,0.2)' },
  facilityTrendText: { fontFamily: Fonts.orbitron.bold, fontSize: rf(10), color: Colors.green },
  facilityExpected: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(12), paddingTop: vs(12), borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)' },
  facilityExpectedLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[500], letterSpacing: s(1) },
  facilityExpectedValue: { fontFamily: Fonts.orbitron.regular, fontSize: rf(11), color: Colors.zinc[300] },

  // Action Buttons
  actionButtons: { flexDirection: 'row', gap: s(16) },
  actionButton: { flex: 1, paddingVertical: vs(24) },
  actionButtonContent: { alignItems: 'center', gap: vs(8) },
  actionIcon: { width: ms(32), height: ms(32), borderRadius: ms(16), borderWidth: s(1), borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  actionIconInactive: { borderColor: 'rgba(255,255,255,0.1)' },
  actionButtonText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(9), color: Colors.white, letterSpacing: s(1.8), textTransform: 'uppercase' },
  actionButtonTextInactive: { color: Colors.zinc[500] },
});

export default TrainerDashboardScreen;