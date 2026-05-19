// src/screens/admin/TrainerDetailScreen.js
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
  Calendar03Icon,
  Dumbbell01Icon,
  CheckmarkCircle02Icon,
  Mail01Icon,
  Login01Icon,
  Logout01Icon,
  Cancel01Icon,
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
// DUMMY ATTENDANCE DATA
// ═══════════════════════════════════════════════════════════════
const ATTENDANCE_DATA = {
  todayStatus: 'present',
  todayCheckin: '6:15 AM',
  todayCheckout: null,
  todayDuration: '2h 30m',

  thisWeekPresent: 5,
  thisWeekAbsent: 1,
  thisWeekTotal: 6,

  thisMonthPresent: 22,
  thisMonthAbsent: 4,
  thisMonthTotal: 26,

  avgCheckinTime: '6:20 AM',
  avgCheckoutTime: '2:45 PM',
  avgSessionDuration: '8h 25m',

  totalDaysPresent: 124,
  totalDaysAbsent: 18,

  recentLog: [
    {
      date: 'Today',
      day: 'Mon',
      status: 'present',
      checkin: '6:15 AM',
      checkout: null,
      duration: '2h 30m (ongoing)',
    },
    {
      date: 'Yesterday',
      day: 'Sun',
      status: 'present',
      checkin: '6:10 AM',
      checkout: '3:00 PM',
      duration: '8h 50m',
    },
    {
      date: '2 days ago',
      day: 'Sat',
      status: 'absent',
      checkin: null,
      checkout: null,
      duration: null,
    },
    {
      date: '3 days ago',
      day: 'Fri',
      status: 'present',
      checkin: '6:30 AM',
      checkout: '2:30 PM',
      duration: '8h 00m',
    },
    {
      date: '4 days ago',
      day: 'Thu',
      status: 'present',
      checkin: '6:05 AM',
      checkout: '2:50 PM',
      duration: '8h 45m',
    },
    {
      date: '5 days ago',
      day: 'Wed',
      status: 'present',
      checkin: '6:20 AM',
      checkout: '3:10 PM',
      duration: '8h 50m',
    },
    {
      date: '6 days ago',
      day: 'Tue',
      status: 'present',
      checkin: '6:25 AM',
      checkout: '2:40 PM',
      duration: '8h 15m',
    },
  ],
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
  const c = phone?.replace(/\D/g, '') || '';
  return c.length === 12
    ? `+${c.slice(0, 2)} ${c.slice(2, 7)} ${c.slice(7)}`
    : phone;
};

// ═══════════════════════════════════════════════════════════════
// ATTENDANCE LOG ROW
// ═══════════════════════════════════════════════════════════════
const AttendanceLogRow = ({ log, isLast }) => {
  const isPresent = log.status === 'present';
  const isOngoing = log.checkout === null && isPresent;

  return (
    <View style={[logSt.row, isLast && { marginBottom: 0 }]}>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(10),
    marginBottom: vs(10),
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: ms(10),
    padding: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  dayBadge: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(9),
    letterSpacing: 0.5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(5),
  },
  dateText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(9),
    color: Colors.zinc[300],
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(6),
    borderWidth: 1,
  },
  ongoingDot: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(2.5),
    backgroundColor: '#22C55E',
  },
  statusText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(6.5),
    letterSpacing: 0.8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
  },
  timeLabel: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7),
    color: Colors.zinc[600],
  },
  timeValue: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(7.5),
    color: Colors.zinc[300],
  },
  timeDot: {
    width: ms(3),
    height: ms(3),
    borderRadius: ms(1.5),
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: s(4),
  },
  absentText: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(8),
    color: Colors.zinc[600],
  },
});

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const TrainerDetailScreen = ({ navigation, route }) => {
  const trainer = route?.params?.trainer;
  const { removeTrainer } = useTrainer();
  const [activeFilter, setActiveFilter] = useState('week');

  if (!trainer) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#000',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#fff' }}>Trainer not found</Text>
      </View>
    );
  }

  const daysAsTrainer = trainer.assignedAt
    ? Math.floor(
        (Date.now() - new Date(trainer.assignedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const isToday = ATTENDANCE_DATA.todayStatus === 'present';
  const isOngoing = isToday && !ATTENDANCE_DATA.todayCheckout;

  const weekRate = Math.round(
    (ATTENDANCE_DATA.thisWeekPresent / ATTENDANCE_DATA.thisWeekTotal) * 100
  );
  const monthRate = Math.round(
    (ATTENDANCE_DATA.thisMonthPresent / ATTENDANCE_DATA.thisMonthTotal) * 100
  );
  const allRate = Math.round(
    (ATTENDANCE_DATA.totalDaysPresent /
      (ATTENDANCE_DATA.totalDaysPresent + ATTENDANCE_DATA.totalDaysAbsent)) *
      100
  );

  // Handlers
  const handleGoBack = () => {
    if (navigation?.canGoBack()) navigation.goBack();
    else navigation?.navigate('AdminTrainers');
  };

  const handleCall = () => {
    if (trainer.phone)
      Linking.openURL(`tel:${trainer.phone.replace(/\D/g, '')}`);
  };

  const handleWhatsApp = () => {
    if (trainer.phone)
      Linking.openURL(
        `whatsapp://send?phone=${trainer.phone.replace(/\D/g, '')}`
      );
  };

  const handleEmail = () => {
    if (trainer.email) Linking.openURL(`mailto:${trainer.email}`);
  };

  const handleRemoveTrainer = () => {
    Alert.alert(
      'Remove Trainer',
      `Remove ${trainer.name} from trainer role?\n\nThey will return to regular member dashboard.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove Trainer',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTrainer(trainer.id);
              Alert.alert(
                'Removed ✅',
                `${trainer.name} is no longer a trainer.`
              );
              navigation.goBack();
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
      source={{
        uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      }}
      style={st.background}
      blurRadius={Platform.OS === 'ios' ? 8 : 12}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.92)', '#000']}
        style={st.gradient}
      >
        <Header title="TRAINER DETAILS" showMenu={false} />

        <ScrollView
          style={st.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={st.scroll}
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
            <Text style={st.backText}>Back to Trainers</Text>
          </TouchableOpacity>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* HERO CARD */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={st.heroCard}>
            <View style={st.heroBgIcon}>
              <HugeiconsIcon
                icon={Dumbbell01Icon}
                size={ms(100)}
                color={`${TRAINER_COLOR}08`}
                strokeWidth={0.5}
              />
            </View>
            <LinearGradient
              colors={[
                'rgba(34,211,238,0.08)',
                'rgba(34,211,238,0.02)',
                'transparent',
              ]}
              style={StyleSheet.absoluteFill}
            />

            <View style={st.heroContent}>
              <View style={st.heroTopRow}>
                {/* Avatar */}
                <View style={st.avatarWrap}>
                  <LinearGradient
                    colors={[`${TRAINER_COLOR}20`, `${TRAINER_COLOR}08`]}
                    style={st.avatarGrad}
                  >
                    <Text style={st.avatarText}>
                      {trainer.name?.slice(0, 2).toUpperCase()}
                    </Text>
                  </LinearGradient>
                  {isOngoing && (
                    <View style={st.liveDotWrap}>
                      <View style={st.liveDot} />
                    </View>
                  )}
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <View style={st.badgeRow}>
                    <View style={st.trainerBadge}>
                      <View style={st.trainerBadgeDot} />
                      <Text style={st.trainerBadgeText}>ACTIVE TRAINER</Text>
                    </View>
                    {isOngoing ? (
                      <View style={st.inGymChip}>
                        <View style={st.inGymDot} />
                        <Text style={st.inGymText}>IN GYM</Text>
                      </View>
                    ) : isToday ? (
                      <View style={st.presentChip}>
                        <Text style={st.presentChipText}>PRESENT</Text>
                      </View>
                    ) : (
                      <View style={st.absentChip}>
                        <Text style={st.absentChipText}>ABSENT</Text>
                      </View>
                    )}
                  </View>

                  <Text style={st.trainerName} numberOfLines={1}>
                    {trainer.name}
                  </Text>

                  <View style={st.metaRow}>
                    <Text style={st.trainerId}>ID: {trainer.memberId}</Text>
                    <View style={st.daysBadge}>
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        size={ms(10)}
                        color={TRAINER_COLOR}
                      />
                      <Text style={st.daysText}>{daysAsTrainer} days</Text>
                    </View>
                  </View>

                  {isToday && (
                    <View style={st.todayTimeRow}>
                      <HugeiconsIcon
                        icon={Login01Icon}
                        size={ms(11)}
                        color="#22C55E"
                      />
                      <Text style={st.todayTimeText}>
                        Checked in at {ATTENDANCE_DATA.todayCheckin}
                      </Text>
                      {isOngoing && (
                        <>
                          <View style={st.timeSep} />
                          <HugeiconsIcon
                            icon={Clock01Icon}
                            size={ms(11)}
                            color={TRAINER_COLOR}
                          />
                          <Text
                            style={[
                              st.todayTimeText,
                              { color: TRAINER_COLOR },
                            ]}
                          >
                            {ATTENDANCE_DATA.todayDuration}
                          </Text>
                        </>
                      )}
                    </View>
                  )}
                </View>
              </View>

              <View style={st.heroDivider} />

              <View style={st.heroBottomRow}>
                <View style={st.phoneRow}>
                  <View style={st.phoneIconBox}>
                    <HugeiconsIcon
                      icon={SmartPhone01Icon}
                      size={ms(14)}
                      color={TRAINER_COLOR}
                    />
                  </View>
                  <View>
                    <Text style={st.phoneLabel}>CONTACT</Text>
                    <Text style={st.phoneNumber}>
                      {formatPhone(trainer.phone || '+910000000000')}
                    </Text>
                  </View>
                </View>

                <View style={st.quickActions}>
                  <TouchableOpacity
                    style={st.qaBtn}
                    onPress={handleCall}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['black', 'black']}
                      style={st.qaGrad}
                    >
                      <HugeiconsIcon
                        icon={Call02Icon}
                        size={ms(18)}
                        color="#22C55E"
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={st.qaBtn}
                    onPress={handleWhatsApp}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['black', 'black']}
                      style={st.qaGrad}
                    >
                      <HugeiconsIcon
                        icon={WhatsappIcon}
                        size={ms(18)}
                        color="#25D366"
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={st.qaBtn}
                    onPress={handleEmail}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['black', 'black']}
                      style={st.qaGrad}
                    >
                      <HugeiconsIcon
                        icon={Mail01Icon}
                        size={ms(18)}
                        color="#3B82F6"
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TODAY CARD */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View
            style={[
              st.infoCard,
              {
                borderColor: isToday
                  ? `${TRAINER_COLOR}25`
                  : 'rgba(239,68,68,0.2)',
              },
            ]}
          >
            <LinearGradient
              colors={
                isToday
                  ? ['rgba(34,211,238,0.06)', 'transparent']
                  : ['rgba(239,68,68,0.05)', 'transparent']
              }
              style={StyleSheet.absoluteFill}
            />
            <View style={st.infoCardPad}>
              <View style={st.cardTitleRow}>
                <View style={st.cardTitleLeft}>
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={ms(14)}
                    color={isToday ? TRAINER_COLOR : '#EF4444'}
                  />
                  <Text style={st.infoCardTitle}>TODAY'S ATTENDANCE</Text>
                </View>
                <View
                  style={[
                    st.todayStatusBadge,
                    {
                      backgroundColor: isToday
                        ? 'rgba(34,197,94,0.10)'
                        : 'rgba(239,68,68,0.10)',
                      borderColor: isToday
                        ? 'rgba(34,197,94,0.25)'
                        : 'rgba(239,68,68,0.25)',
                    },
                  ]}
                >
                  <Text
                    style={[
                      st.todayStatusText,
                      { color: isToday ? '#22C55E' : '#EF4444' },
                    ]}
                  >
                    {isToday ? 'PRESENT' : 'ABSENT'}
                  </Text>
                </View>
              </View>

              {isToday ? (
                <View style={st.todayGrid}>
                  <View style={st.todayItem}>
                    <View
                      style={[
                        st.todayIconBox,
                        { backgroundColor: 'rgba(34,197,94,0.12)' },
                      ]}
                    >
                      <HugeiconsIcon
                        icon={Login01Icon}
                        size={ms(16)}
                        color="#22C55E"
                      />
                    </View>
                    <Text style={st.todayItemLabel}>Check In</Text>
                    <Text style={st.todayItemValue}>
                      {ATTENDANCE_DATA.todayCheckin}
                    </Text>
                    <Text style={st.todayItemSub}>Today</Text>
                  </View>

                  <View style={st.todayDivider} />

                  <View style={st.todayItem}>
                    <View
                      style={[
                        st.todayIconBox,
                        {
                          backgroundColor: isOngoing
                            ? `${TRAINER_COLOR}12`
                            : 'rgba(239,68,68,0.12)',
                        },
                      ]}
                    >
                      <HugeiconsIcon
                        icon={Logout01Icon}
                        size={ms(16)}
                        color={isOngoing ? TRAINER_COLOR : '#EF4444'}
                      />
                    </View>
                    <Text style={st.todayItemLabel}>Check Out</Text>
                    <Text
                      style={[
                        st.todayItemValue,
                        isOngoing && {
                          color: TRAINER_COLOR,
                          fontSize: rf(9),
                        },
                      ]}
                    >
                      {isOngoing
                        ? 'Still in gym'
                        : ATTENDANCE_DATA.todayCheckout}
                    </Text>
                    <Text style={st.todayItemSub}>Today</Text>
                  </View>

                  <View style={st.todayDivider} />

                  <View style={st.todayItem}>
                    <View
                      style={[
                        st.todayIconBox,
                        { backgroundColor: 'rgba(234,179,8,0.12)' },
                      ]}
                    >
                      <HugeiconsIcon
                        icon={Clock01Icon}
                        size={ms(16)}
                        color="#EAB308"
                      />
                    </View>
                    <Text style={st.todayItemLabel}>Duration</Text>
                    <Text style={st.todayItemValue}>
                      {ATTENDANCE_DATA.todayDuration}
                    </Text>
                    <Text
                      style={[
                        st.todayItemSub,
                        isOngoing && { color: TRAINER_COLOR },
                      ]}
                    >
                      {isOngoing ? 'Ongoing' : 'Completed'}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={st.absentTodayBox}>
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={ms(28)}
                    color="rgba(239,68,68,0.4)"
                  />
                  <Text style={st.absentTodayTitle}>Not Checked In</Text>
                  <Text style={st.absentTodaySubtitle}>
                    Trainer has not checked in today
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* AVERAGE TIMES */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={st.infoCard}>
            <View style={st.infoCardPad}>
              <View style={[st.cardTitleLeft, { marginBottom: vs(12) }]}>
                <HugeiconsIcon
                  icon={Clock01Icon}
                  size={ms(14)}
                  color={TRAINER_COLOR}
                />
                <Text style={st.infoCardTitle}>AVERAGE TIMES</Text>
              </View>

              <View style={st.avgGrid}>
                <View style={st.avgItem}>
                  <LinearGradient
                    colors={['rgba(34,197,94,0.08)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View
                    style={[
                      st.avgIconBox,
                      { backgroundColor: 'rgba(34,197,94,0.12)' },
                    ]}
                  >
                    <HugeiconsIcon
                      icon={Login01Icon}
                      size={ms(16)}
                      color="#22C55E"
                    />
                  </View>
                  <Text style={st.avgLabel}>Avg Check In</Text>
                  <Text style={st.avgValue}>
                    {ATTENDANCE_DATA.avgCheckinTime}
                  </Text>
                </View>

                <View style={st.avgItem}>
                  <LinearGradient
                    colors={['rgba(239,68,68,0.08)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View
                    style={[
                      st.avgIconBox,
                      { backgroundColor: 'rgba(239,68,68,0.12)' },
                    ]}
                  >
                    <HugeiconsIcon
                      icon={Logout01Icon}
                      size={ms(16)}
                      color="#EF4444"
                    />
                  </View>
                  <Text style={st.avgLabel}>Avg Check Out</Text>
                  <Text style={st.avgValue}>
                    {ATTENDANCE_DATA.avgCheckoutTime}
                  </Text>
                </View>

                <View style={[st.avgItem, { width: '100%' }]}>
                  <LinearGradient
                    colors={[`${TRAINER_COLOR}08`, 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View
                    style={[
                      st.avgIconBox,
                      { backgroundColor: `${TRAINER_COLOR}12` },
                    ]}
                  >
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      size={ms(16)}
                      color={TRAINER_COLOR}
                    />
                  </View>
                  <Text style={st.avgLabel}>Avg Session Duration</Text>
                  <Text style={[st.avgValue, { color: TRAINER_COLOR }]}>
                    {ATTENDANCE_DATA.avgSessionDuration}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* ATTENDANCE SUMMARY */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={st.infoCard}>
            <View style={st.infoCardPad}>
              <View style={st.cardTitleRow}>
                <View style={st.cardTitleLeft}>
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={ms(14)}
                    color={TRAINER_COLOR}
                  />
                  <Text style={st.infoCardTitle}>ATTENDANCE</Text>
                </View>
                <View style={st.filterTabs}>
                  {['week', 'month', 'all'].map((f) => (
                    <TouchableOpacity
                      key={f}
                      style={[
                        st.filterTab,
                        activeFilter === f && st.filterTabActive,
                      ]}
                      onPress={() => setActiveFilter(f)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          st.filterTabText,
                          activeFilter === f && st.filterTabTextActive,
                        ]}
                      >
                        {f === 'week' ? 'Week' : f === 'month' ? 'Month' : 'All'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={st.summaryRow}>
                <View style={st.summaryItem}>
                  <LinearGradient
                    colors={['rgba(34,197,94,0.10)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={[st.summaryNumber, { color: '#22C55E' }]}>
                    {activeFilter === 'week'
                      ? ATTENDANCE_DATA.thisWeekPresent
                      : activeFilter === 'month'
                      ? ATTENDANCE_DATA.thisMonthPresent
                      : ATTENDANCE_DATA.totalDaysPresent}
                  </Text>
                  <Text style={st.summaryLabel}>Present</Text>
                  <View
                    style={[st.summaryDot, { backgroundColor: '#22C55E' }]}
                  />
                </View>

                <View style={st.summaryDivider} />

                <View style={st.summaryItem}>
                  <LinearGradient
                    colors={['rgba(239,68,68,0.08)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={[st.summaryNumber, { color: '#EF4444' }]}>
                    {activeFilter === 'week'
                      ? ATTENDANCE_DATA.thisWeekAbsent
                      : activeFilter === 'month'
                      ? ATTENDANCE_DATA.thisMonthAbsent
                      : ATTENDANCE_DATA.totalDaysAbsent}
                  </Text>
                  <Text style={st.summaryLabel}>Absent</Text>
                  <View
                    style={[st.summaryDot, { backgroundColor: '#EF4444' }]}
                  />
                </View>

                <View style={st.summaryDivider} />

                <View style={st.summaryItem}>
                  <LinearGradient
                    colors={[`${TRAINER_COLOR}08`, 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={[st.summaryNumber, { color: TRAINER_COLOR }]}>
                    {activeFilter === 'week'
                      ? `${weekRate}%`
                      : activeFilter === 'month'
                      ? `${monthRate}%`
                      : `${allRate}%`}
                  </Text>
                  <Text style={st.summaryLabel}>Rate</Text>
                  <View
                    style={[
                      st.summaryDot,
                      { backgroundColor: TRAINER_COLOR },
                    ]}
                  />
                </View>
              </View>

              <View style={st.progressTrack}>
                <LinearGradient
                  colors={['#22C55E', '#22D3EE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    st.progressFill,
                    {
                      width: `${
                        activeFilter === 'week'
                          ? weekRate
                          : activeFilter === 'month'
                          ? monthRate
                          : allRate
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* RECENT LOG */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={st.infoCard}>
            <View style={st.infoCardPad}>
              <View style={[st.cardTitleRow, { marginBottom: vs(12) }]}>
                <View style={st.cardTitleLeft}>
                  <HugeiconsIcon
                    icon={Login01Icon}
                    size={ms(14)}
                    color={TRAINER_COLOR}
                  />
                  <Text style={st.infoCardTitle}>RECENT LOG</Text>
                </View>
                <Text style={st.logSubText}>Last 7 days</Text>
              </View>

              {ATTENDANCE_DATA.recentLog.map((log, i) => (
                <AttendanceLogRow
                  key={i}
                  log={log}
                  isLast={i === ATTENDANCE_DATA.recentLog.length - 1}
                />
              ))}
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TRAINER INFO */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={[st.infoCard, { borderColor: `${TRAINER_COLOR}20` }]}>
            <View style={st.infoCardPad}>
              <View style={[st.cardTitleLeft, { marginBottom: vs(12) }]}>
                <HugeiconsIcon
                  icon={Dumbbell01Icon}
                  size={ms(14)}
                  color={TRAINER_COLOR}
                />
                <Text style={st.infoCardTitle}>TRAINER INFO</Text>
              </View>

              <View style={st.infoGrid}>
                <View style={st.infoGridItem}>
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={ms(12)}
                    color={TRAINER_COLOR}
                  />
                  <Text style={st.infoGridLabel}>Days Active</Text>
                  <Text style={st.infoGridValue}>{daysAsTrainer}</Text>
                </View>
                <View style={st.infoGridItem}>
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={ms(12)}
                    color="#22C55E"
                  />
                  <Text style={st.infoGridLabel}>Status</Text>
                  <Text style={[st.infoGridValue, { color: '#22C55E' }]}>
                    Active
                  </Text>
                </View>
              </View>

              <View style={st.infoGrid}>
                <View style={st.infoGridItem}>
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={ms(12)}
                    color={Colors.zinc[500]}
                  />
                  <Text style={st.infoGridLabel}>Assigned On</Text>
                  <Text style={st.infoGridValue}>
                    {trainer.assignedAt
                      ? formatDate(trainer.assignedAt)
                      : 'Today'}
                  </Text>
                </View>
                <View style={st.infoGridItem}>
                  <HugeiconsIcon
                    icon={Dumbbell01Icon}
                    size={ms(12)}
                    color={TRAINER_COLOR}
                  />
                  <Text style={st.infoGridLabel}>Member ID</Text>
                  <Text style={st.infoGridValue}>{trainer.memberId}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* REMOVE TRAINER */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <TouchableOpacity
            style={st.removeTrainerBtn}
            onPress={handleRemoveTrainer}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(239,68,68,0.15)', 'rgba(239,68,68,0.05)']}
              style={st.removeTrainerGrad}
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={ms(16)}
                color="#EF4444"
              />
              <Text style={st.removeTrainerText}>Remove Trainer Role</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: vs(30) }} />
        </ScrollView>
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
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: s(14),
    paddingTop: vs(8),
    paddingBottom: vs(30),
    gap: vs(12),
  },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(2),
  },
  backIcon: {
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

  heroCard: {
    borderRadius: ms(16),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}30`,
    backgroundColor: '#000',
    position: 'relative',
  },
  heroBgIcon: {
    position: 'absolute',
    top: -ms(5),
    right: -ms(15),
    opacity: 1,
  },
  heroContent: {
    paddingLeft: ms(14),
    paddingRight: ms(12),
    paddingVertical: ms(14),
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'flex-start' },
  avatarWrap: { position: 'relative', marginRight: s(12) },
  avatarGrad: {
    width: ms(58),
    height: ms(58),
    borderRadius: ms(29),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: `${TRAINER_COLOR}50`,
  },
  avatarText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(15),
    color: TRAINER_COLOR,
  },
  liveDotWrap: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: ms(16),
    height: ms(16),
    borderRadius: ms(8),
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  liveDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    backgroundColor: '#22C55E',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(5),
  },
  trainerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    backgroundColor: `${TRAINER_COLOR}12`,
    borderRadius: ms(6),
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}25`,
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
  },
  trainerBadgeDot: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(2.5),
    backgroundColor: TRAINER_COLOR,
  },
  trainerBadgeText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(6.5),
    color: TRAINER_COLOR,
    letterSpacing: s(1),
  },
  inGymChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    backgroundColor: 'rgba(34,197,94,0.10)',
    borderRadius: ms(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
  },
  inGymDot: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(2.5),
    backgroundColor: '#22C55E',
  },
  inGymText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(6),
    color: '#22C55E',
    letterSpacing: 0.8,
  },
  presentChip: {
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderRadius: ms(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
  },
  presentChipText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(6),
    color: '#22C55E',
    letterSpacing: 0.8,
  },
  absentChip: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: ms(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  absentChipText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(6),
    color: '#EF4444',
    letterSpacing: 0.8,
  },
  trainerName: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(12),
    color: '#fff',
    marginBottom: vs(4),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginBottom: vs(4),
  },
  trainerId: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(8),
    color: Colors.zinc[500],
    letterSpacing: 0.8,
  },
  daysBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
    backgroundColor: `${TRAINER_COLOR}10`,
    borderRadius: ms(6),
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
  },
  daysText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(7.5),
    color: TRAINER_COLOR,
  },
  todayTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  todayTimeText: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(8),
    color: Colors.zinc[400],
  },
  timeSep: {
    width: ms(3),
    height: ms(3),
    borderRadius: ms(1.5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: s(2),
  },
  heroDivider: {
    height: 1,
    backgroundColor: `${TRAINER_COLOR}20`,
    marginVertical: vs(12),
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  phoneIconBox: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    backgroundColor: `${TRAINER_COLOR}12`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(8),
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
    color: '#fff',
    letterSpacing: 0.5,
  },
  quickActions: { flexDirection: 'row', gap: s(6) },
  qaBtn: { borderRadius: ms(10), overflow: 'hidden' },
  qaGrad: {
    width: ms(36),
    height: ms(36),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  infoCard: {
    borderRadius: ms(14),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#000',
  },
  infoCardPad: { padding: ms(14) },
  infoCardTitle: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(9),
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(14),
  },
  cardTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },

  todayStatusBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(8),
    borderWidth: 1,
  },
  todayStatusText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(7),
    letterSpacing: 0.8,
  },
  todayGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  todayItem: { flex: 1, alignItems: 'center', gap: vs(5) },
  todayIconBox: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(2),
  },
  todayItemLabel: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7.5),
    color: Colors.zinc[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  todayItemValue: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(10),
    color: '#fff',
    textAlign: 'center',
  },
  todayItemSub: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7),
    color: Colors.zinc[600],
  },
  todayDivider: {
    width: 1,
    height: vs(50),
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: s(8),
  },
  absentTodayBox: {
    alignItems: 'center',
    gap: vs(6),
    paddingVertical: vs(20),
  },
  absentTodayTitle: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(12),
    color: Colors.zinc[400],
  },
  absentTodaySubtitle: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(9),
    color: Colors.zinc[600],
  },

  avgGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: s(8) },
  avgItem: {
    width: '47%',
    borderRadius: ms(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: ms(12),
    alignItems: 'center',
    gap: vs(5),
  },
  avgIconBox: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avgLabel: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7.5),
    color: Colors.zinc[500],
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  avgValue: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(13),
    color: '#fff',
  },

  filterTabs: {
    flexDirection: 'row',
    gap: s(4),
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: ms(8),
    padding: s(3),
  },
  filterTab: {
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(6),
  },
  filterTabActive: { backgroundColor: 'rgba(255,255,255,0.10)' },
  filterTabText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(8),
    color: Colors.zinc[500],
  },
  filterTabTextActive: { color: Colors.white },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: ms(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: vs(10),
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
    paddingVertical: vs(12),
    gap: vs(3),
  },
  summaryNumber: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(20),
    lineHeight: rf(24),
  },
  summaryLabel: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7.5),
    color: Colors.zinc[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryDot: { width: ms(5), height: ms(5), borderRadius: ms(2.5) },
  summaryDivider: {
    width: 1,
    height: vs(50),
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  progressTrack: {
    height: vs(4),
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: ms(2),
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: ms(2) },

  logSubText: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(8),
    color: Colors.zinc[600],
  },

  infoGrid: { flexDirection: 'row', gap: s(10), marginBottom: vs(8) },
  infoGridItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  infoGridLabel: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7.5),
    color: Colors.zinc[500],
    flex: 1,
  },
  infoGridValue: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(8.5),
    color: '#fff',
  },

  removeTrainerBtn: { borderRadius: ms(12), overflow: 'hidden' },
  removeTrainerGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(14),
    gap: s(8),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  removeTrainerText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(11),
    color: '#EF4444',
    letterSpacing: 0.5,
  },
});

export default TrainerDetailScreen;