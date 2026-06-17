// src/screens/admin/TrainerAttendanceLogScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Clock01Icon,
  Calendar03Icon,
  Dumbbell01Icon,
  CheckmarkCircle02Icon,
  Login01Icon,
  Logout01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';

import Header from '../../../components/shared/Header';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';

const s  = (size) => scale(size * 0.9);
const ms = (size) => moderateScale(size * 0.85, 0.2);
const vs = (size) => verticalScale(size * 0.85);
const rf = (size) => RFValue(size);

const TRAINER_COLOR = '#22D3EE';

// ═══════════════════════════════════════════════════════════════
// DUMMY LOG DATA
// ═══════════════════════════════════════════════════════════════
const WEEKLY_LOG = [
  { date: '20 Jan', day: 'Mon', status: 'present', checkin: '6:15 AM', checkout: null, duration: '2h 30m (ongoing)' },
  { date: '19 Jan', day: 'Sun', status: 'present', checkin: '6:10 AM', checkout: '3:00 PM', duration: '8h 50m' },
  { date: '18 Jan', day: 'Sat', status: 'absent', checkin: null, checkout: null, duration: null },
  { date: '17 Jan', day: 'Fri', status: 'present', checkin: '6:30 AM', checkout: '2:30 PM', duration: '8h 00m' },
  { date: '16 Jan', day: 'Thu', status: 'present', checkin: '6:05 AM', checkout: '2:50 PM', duration: '8h 45m' },
  { date: '15 Jan', day: 'Wed', status: 'present', checkin: '6:20 AM', checkout: '3:10 PM', duration: '8h 50m' },
  { date: '14 Jan', day: 'Tue', status: 'present', checkin: '6:25 AM', checkout: '2:40 PM', duration: '8h 15m' },
];

const MONTHLY_LOG = [
  ...WEEKLY_LOG,
  { date: '13 Jan', day: 'Mon', status: 'present', checkin: '6:20 AM', checkout: '2:55 PM', duration: '8h 35m' },
  { date: '12 Jan', day: 'Sun', status: 'absent', checkin: null, checkout: null, duration: null },
  { date: '11 Jan', day: 'Sat', status: 'present', checkin: '6:30 AM', checkout: '3:00 PM', duration: '8h 30m' },
  { date: '10 Jan', day: 'Fri', status: 'present', checkin: '6:15 AM', checkout: '2:45 PM', duration: '8h 30m' },
  { date: '9 Jan', day: 'Thu', status: 'present', checkin: '6:10 AM', checkout: '2:50 PM', duration: '8h 40m' },
  { date: '8 Jan', day: 'Wed', status: 'absent', checkin: null, checkout: null, duration: null },
  { date: '7 Jan', day: 'Tue', status: 'present', checkin: '6:25 AM', checkout: '3:05 PM', duration: '8h 40m' },
  { date: '6 Jan', day: 'Mon', status: 'present', checkin: '6:20 AM', checkout: '2:40 PM', duration: '8h 20m' },
  { date: '5 Jan', day: 'Sun', status: 'present', checkin: '6:30 AM', checkout: '3:10 PM', duration: '8h 40m' },
  { date: '4 Jan', day: 'Sat', status: 'absent', checkin: null, checkout: null, duration: null },
  { date: '3 Jan', day: 'Fri', status: 'present', checkin: '6:15 AM', checkout: '2:50 PM', duration: '8h 35m' },
  { date: '2 Jan', day: 'Thu', status: 'present', checkin: '6:10 AM', checkout: '2:45 PM', duration: '8h 35m' },
  { date: '1 Jan', day: 'Wed', status: 'present', checkin: '7:00 AM', checkout: '1:00 PM', duration: '6h 00m' },
];

const YEARLY_LOG = [
  ...MONTHLY_LOG,
  { date: '31 Dec', day: 'Tue', status: 'present', checkin: '6:20 AM', checkout: '2:50 PM', duration: '8h 30m' },
  { date: '30 Dec', day: 'Mon', status: 'present', checkin: '6:15 AM', checkout: '3:00 PM', duration: '8h 45m' },
  { date: '29 Dec', day: 'Sun', status: 'absent', checkin: null, checkout: null, duration: null },
  { date: '28 Dec', day: 'Sat', status: 'present', checkin: '6:25 AM', checkout: '2:40 PM', duration: '8h 15m' },
  { date: '27 Dec', day: 'Fri', status: 'present', checkin: '6:10 AM', checkout: '2:55 PM', duration: '8h 45m' },
  { date: '26 Dec', day: 'Thu', status: 'present', checkin: '6:30 AM', checkout: '3:05 PM', duration: '8h 35m' },
  { date: '25 Dec', day: 'Wed', status: 'absent', checkin: null, checkout: null, duration: null },
  { date: '24 Dec', day: 'Tue', status: 'present', checkin: '6:20 AM', checkout: '2:50 PM', duration: '8h 30m' },
  { date: '23 Dec', day: 'Mon', status: 'present', checkin: '6:15 AM', checkout: '2:45 PM', duration: '8h 30m' },
  { date: '22 Dec', day: 'Sun', status: 'present', checkin: '6:30 AM', checkout: '3:10 PM', duration: '8h 40m' },
];

// ═══════════════════════════════════════════════════════════════
// LOG ROW
// ═══════════════════════════════════════════════════════════════
const LogRow = ({ log, isLast }) => {
  const isPresent = log.status === 'present';
  const isOngoing = log.checkout === null && isPresent;

  return (
    <View style={[logSt.row, isLast && { marginBottom: 0 }]}>
      {/* Day + Date */}
      <View
        style={[
          logSt.dayBadge,
          {
            backgroundColor: isPresent
              ? `${TRAINER_COLOR}10`
              : 'rgba(239,68,68,0.08)',
          },
        ]}
      >
        <Text
          style={[
            logSt.dayText,
            { color: isPresent ? TRAINER_COLOR : '#EF4444' },
          ]}
        >
          {log.day}
        </Text>
        <Text style={logSt.dayDateText}>{log.date?.split(' ')[0]}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={logSt.topRow}>
          <Text style={logSt.dateText}>{log.date}</Text>
          <View
            style={[
              logSt.statusPill,
              {
                backgroundColor: isPresent
                  ? 'rgba(34,197,94,0.10)'
                  : 'rgba(239,68,68,0.10)',
                borderColor: isPresent
                  ? 'rgba(34,197,94,0.25)'
                  : 'rgba(239,68,68,0.25)',
              },
            ]}
          >
            {isOngoing && <View style={logSt.ongoingDot} />}
            <Text
              style={[
                logSt.statusText,
                { color: isPresent ? '#22C55E' : '#EF4444' },
              ]}
            >
              {isOngoing ? 'IN GYM' : isPresent ? 'PRESENT' : 'ABSENT'}
            </Text>
          </View>
        </View>

        {isPresent ? (
          <View style={logSt.timeRow}>
            <View style={logSt.timeItem}>
              <HugeiconsIcon icon={Login01Icon} size={ms(10)} color="#22C55E" />
              <Text style={logSt.timeLabel}>In</Text>
              <Text style={logSt.timeValue}>{log.checkin}</Text>
            </View>
            <View style={logSt.timeDot} />
            <View style={logSt.timeItem}>
              <HugeiconsIcon
                icon={Logout01Icon}
                size={ms(10)}
                color={isOngoing ? TRAINER_COLOR : '#EF4444'}
              />
              <Text style={logSt.timeLabel}>Out</Text>
              <Text
                style={[
                  logSt.timeValue,
                  isOngoing && { color: TRAINER_COLOR },
                ]}
              >
                {isOngoing ? 'Still here' : log.checkout}
              </Text>
            </View>
            <View style={logSt.timeDot} />
            <View style={logSt.timeItem}>
              <HugeiconsIcon
                icon={Clock01Icon}
                size={ms(10)}
                color={Colors.zinc[500]}
              />
              <Text style={logSt.timeLabel}>Time</Text>
              <Text style={logSt.timeValue}>{log.duration}</Text>
            </View>
          </View>
        ) : (
          <Text style={logSt.absentText}>Did not check in</Text>
        )}
      </View>
    </View>
  );
};

const logSt = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'flex-start', gap: s(10),
    marginBottom: vs(8), backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: ms(10), padding: ms(10), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  dayBadge: {
    width: ms(40), borderRadius: ms(10), alignItems: 'center',
    justifyContent: 'center', paddingVertical: vs(6),
  },
  dayText: {
    fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(9), letterSpacing: 0.5,
  },
  dayDateText: {
    fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7),
    color: Colors.zinc[600], marginTop: vs(1),
  },
  topRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: vs(5),
  },
  dateText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(9), color: Colors.zinc[300],
  },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: s(4),
    paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(6), borderWidth: 1,
  },
  ongoingDot: {
    width: ms(5), height: ms(5), borderRadius: ms(2.5), backgroundColor: '#22C55E',
  },
  statusText: {
    fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(6.5), letterSpacing: 0.8,
  },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: s(4) },
  timeItem: { flexDirection: 'row', alignItems: 'center', gap: s(3) },
  timeLabel: {
    fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7), color: Colors.zinc[600],
  },
  timeValue: {
    fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(7.5), color: Colors.zinc[300],
  },
  timeDot: {
    width: ms(3), height: ms(3), borderRadius: ms(1.5),
    backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: s(4),
  },
  absentText: {
    fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8), color: Colors.zinc[600],
  },
});

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const TrainerAttendanceLogScreen = ({ navigation, route }) => {
  const trainer = route?.params?.trainer;
  const [activeTab, setActiveTab] = useState('weekly');

  if (!trainer) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff' }}>Trainer not found</Text>
      </View>
    );
  }

  const getLogData = () => {
    if (activeTab === 'weekly') return WEEKLY_LOG;
    if (activeTab === 'monthly') return MONTHLY_LOG;
    return YEARLY_LOG;
  };

  const logData = getLogData();
  const presentCount = logData.filter((l) => l.status === 'present').length;
  const absentCount = logData.filter((l) => l.status === 'absent').length;

  const handleGoBack = () => {
    if (navigation?.canGoBack()) navigation.goBack();
    else navigation?.navigate('TrainerDetail');
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
        <SafeAreaView style={st.safeArea} edges={['top']}>
          <Header title="ATTENDANCE LOG" showMenu={false} />

          {/* Stats Bar */}
          <View style={st.statsBar}>
            <View style={st.statsBarItem}>
              <Text style={[st.statsBarNumber, { color: '#22C55E' }]}>
                {presentCount}
              </Text>
              <Text style={st.statsBarLabel}>PRESENT</Text>
            </View>
            <View style={st.statsBarDivider} />
            <View style={st.statsBarItem}>
              <Text style={[st.statsBarNumber, { color: '#EF4444' }]}>
                {absentCount}
              </Text>
              <Text style={st.statsBarLabel}>ABSENT</Text>
            </View>
            <View style={st.statsBarDivider} />
            <View style={st.statsBarItem}>
              <Text style={[st.statsBarNumber, { color: TRAINER_COLOR }]}>
                {logData.length}
              </Text>
              <Text style={st.statsBarLabel}>TOTAL</Text>
            </View>
          </View>

          {/* Tab Buttons */}
          <View style={st.tabsContainer}>
            {['weekly', 'monthly', 'yearly'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[st.tabBtn, activeTab === tab && st.tabBtnActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    st.tabBtnText,
                    activeTab === tab && st.tabBtnTextActive,
                  ]}
                >
                  {tab === 'weekly'
                    ? 'Weekly'
                    : tab === 'monthly'
                    ? 'Monthly'
                    : 'Yearly'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            style={st.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={st.scrollContent}
          >
            {/* Back */}
            <TouchableOpacity
              style={st.backBtn}
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <View style={st.backIcon}>
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  size={ms(16)}
                  color="rgba(255,255,255,0.6)"
                />
              </View>
              <Text style={st.backText}>Back to Trainer</Text>
            </TouchableOpacity>

            {/* Trainer Mini Card */}
            <View style={st.miniCard}>
              <LinearGradient
                colors={[`${TRAINER_COLOR}08`, 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              <View style={st.miniAvatar}>
                <Text style={st.miniAvatarText}>
                  {trainer.name?.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={st.miniName}>{trainer.name}</Text>
                <Text style={st.miniId}>ID: {trainer.memberId}</Text>
              </View>
              <View style={st.miniTabBadge}>
                <Text style={st.miniTabBadgeText}>
                  {activeTab === 'weekly'
                    ? 'Last 7 Days'
                    : activeTab === 'monthly'
                    ? 'Last 30 Days'
                    : 'This Year'}
                </Text>
              </View>
            </View>

            {/* Section Header */}
            <View style={st.sectionHeader}>
              <View style={st.sectionLeft}>
                <HugeiconsIcon
                  icon={Login01Icon}
                  size={ms(14)}
                  color={TRAINER_COLOR}
                />
                <Text style={st.sectionTitle}>
                  {activeTab === 'weekly'
                    ? 'WEEKLY LOG'
                    : activeTab === 'monthly'
                    ? 'MONTHLY LOG'
                    : 'YEARLY LOG'}
                </Text>
              </View>
              <Text style={st.sectionCount}>{logData.length} entries</Text>
            </View>

            {/* Log Entries */}
            {logData.map((log, i) => (
              <LogRow
                key={`${activeTab}-${i}`}
                log={log}
                isLast={i === logData.length - 1}
              />
            ))}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const st = StyleSheet.create({
  background: { flex: 1 },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingBottom: vs(30),
    gap: vs(10),
  },

  // Stats Bar
  statsBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    marginHorizontal: s(16), marginBottom: vs(10), backgroundColor: '#000000',
    borderRadius: ms(12), borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: vs(10),
  },
  statsBarItem: { flex: 1, alignItems: 'center' },
  statsBarNumber: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(18), color: Colors.white },
  statsBarLabel: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7), color: Colors.zinc[500], letterSpacing: s(1.2), marginTop: vs(2) },
  statsBarDivider: { width: 1, height: vs(28), backgroundColor: 'rgba(255,255,255,0.08)' },

  // Tabs
  tabsContainer: {
    flexDirection: 'row', marginHorizontal: s(16), backgroundColor: '#000000',
    borderRadius: ms(10), padding: s(4), marginBottom: vs(10), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tabBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: vs(10), borderRadius: ms(8),
  },
  tabBtnActive: { backgroundColor: `${TRAINER_COLOR}15` },
  tabBtnText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(10),
    color: Colors.zinc[500], letterSpacing: s(1), textTransform: 'uppercase',
  },
  tabBtnTextActive: { color: TRAINER_COLOR },

  // Back
  backBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(2) },
  backIcon: {
    width: ms(32), height: ms(32), borderRadius: ms(16),
    backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center',
    justifyContent: 'center', marginRight: s(10),
  },
  backText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(11),
    color: 'rgba(255,255,255,0.6)', letterSpacing: 0.8, textTransform: 'uppercase',
  },

  // Mini Card
  miniCard: {
    flexDirection: 'row', alignItems: 'center', gap: s(10),
    borderRadius: ms(12), borderWidth: 1, borderColor: `${TRAINER_COLOR}20`,
    backgroundColor: '#000', padding: s(12), overflow: 'hidden',
  },
  miniAvatar: {
    width: ms(40), height: ms(40), borderRadius: ms(20),
    backgroundColor: `${TRAINER_COLOR}15`, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: `${TRAINER_COLOR}40`,
  },
  miniAvatarText: {
    fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(10), color: TRAINER_COLOR,
  },
  miniName: {
    fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(10), color: '#fff', marginBottom: vs(2),
  },
  miniId: {
    fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8), color: Colors.zinc[500],
  },
  miniTabBadge: {
    backgroundColor: `${TRAINER_COLOR}12`, borderRadius: ms(6), borderWidth: 1,
    borderColor: `${TRAINER_COLOR}25`, paddingHorizontal: s(8), paddingVertical: vs(3),
  },
  miniTabBadgeText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(7), color: TRAINER_COLOR, letterSpacing: 0.5,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  sectionTitle: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(10),
    color: 'rgba(255,255,255,0.6)', letterSpacing: s(1.5), textTransform: 'uppercase',
  },
  sectionCount: {
    fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8), color: Colors.zinc[600],
  },
});

export default TrainerAttendanceLogScreen;