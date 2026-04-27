// src/screens/user/ReceivedRequestsScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ImageBackground, TouchableOpacity, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Notification01Icon,
  Clock01Icon,
  Tick02Icon,
  Cancel01Icon,
  UserMultipleIcon,
} from '@hugeicons/core-free-icons';

import Header from '../../components/shared/Header';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const s  = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);
const CYAN = '#8B8878';

// const CYAN = '#CDC8B1';

const INITIAL_RECEIVED = [
  { id: 'r1', fromId: 'user_004', fromName: 'Ahmed Raza',   fromMemberId: 'GYM-2024-004', sentAt: '2025-01-10T09:30:00' },
  { id: 'r2', fromId: 'user_006', fromName: 'Zain Malik',   fromMemberId: 'GYM-2024-006', sentAt: '2025-01-12T14:15:00' },
  { id: 'r3', fromId: 'user_008', fromName: 'Saad Qureshi', fromMemberId: 'GYM-2024-008', sentAt: '2025-01-13T18:45:00' },
];

// ── Avatar ──────────────────────────────────────────────────
const Avatar = ({ name, size = 44, color = CYAN }) => {
  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';
  return (
    <View style={[
      styles.avatar,
      { width: ms(size), height: ms(size), borderRadius: ms(size / 2), borderColor: `${color}50` },
    ]}>
      <Text style={[styles.avatarText, { color, fontSize: rf(size / 4) }]}>{initials}</Text>
    </View>
  );
};

// ── Helpers ─────────────────────────────────────────────────
const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) +
    '  •  ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  );
};

const getTimeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} days ago`;
};

// ── Screen ──────────────────────────────────────────────────
const ReceivedRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState(INITIAL_RECEIVED);

  const handleAccept = (request) => {
    Alert.alert('Accept Request', `Accept friend request from ${request.fromName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Accept',
        onPress: () => {
          setRequests((p) => p.filter((r) => r.id !== request.id));
          Alert.alert('Friend Added! 🎉', `${request.fromName} is now your friend`);
        },
      },
    ]);
  };

  const handleReject = (request) => {
    Alert.alert('Reject Request', `Reject friend request from ${request.fromName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject', style: 'destructive',
        onPress: () => setRequests((p) => p.filter((r) => r.id !== request.id)),
      },
    ]);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={styles.background}
      blurRadius={10}
    >
      <LinearGradient colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.92)', '#000000']} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea} edges={['']}>
          <Header />

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* ── Page Header ── */}
            <View style={styles.pageHeader}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                <HugeiconsIcon icon={ArrowLeft01Icon} size={ms(18)} color={Colors.white} />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={styles.pageLabel}>FRIEND REQUESTS</Text>
                <Text style={styles.pageTitle}>Received</Text>
              </View>
              <View style={styles.headerBadge}>
                <HugeiconsIcon icon={Notification01Icon} size={ms(12)} color={CYAN} />
                <Text style={styles.headerBadgeText}>{requests.length}</Text>
              </View>
            </View>

            {/* ── Info Banner ── */}
            <View style={styles.infoBanner}>
              <HugeiconsIcon icon={Notification01Icon} size={ms(16)} color={CYAN} />
              <Text style={styles.infoBannerText}>
                These members want to add you as a friend. Accept to start tracking together!
              </Text>
            </View>

            {/* ── List / Empty ── */}
            {requests.length === 0 ? (
              <View style={styles.emptyState}>
                <HugeiconsIcon icon={UserMultipleIcon} size={ms(50)} color={Colors.zinc[700]} />
                <Text style={styles.emptyTitle}>No Pending Requests</Text>
                <Text style={styles.emptySubtitle}>
                  When someone sends you a friend request, it will appear here
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {/* Section label */}
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionLeft}>
                    <HugeiconsIcon icon={Notification01Icon} size={ms(13)} color={CYAN} />
                    <Text style={styles.sectionTitle}>Pending Requests</Text>
                  </View>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{requests.length}</Text>
                  </View>
                </View>

                {requests.map((request) => (
                  <View key={request.id} style={styles.card}>
                    {/* Top Row */}
                    <View style={styles.cardTopRow}>
                      <View style={styles.cardLeft}>
                        <Avatar name={request.fromName} size={46} color={CYAN} />
                        <View style={styles.cardInfo}>
                          <Text style={styles.cardName} numberOfLines={1}>{request.fromName}</Text>
                          <View style={styles.cardIdBadge}>
                            <Text style={styles.cardIdText}>{request.fromMemberId}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.timeBadge}>
                        <Text style={styles.timeAgoText}>{getTimeAgo(request.sentAt)}</Text>
                      </View>
                    </View>

                    {/* Time detail */}
                    <View style={styles.timeDetailRow}>
                      <HugeiconsIcon icon={Clock01Icon} size={ms(10)} color={Colors.zinc[600]} />
                      <Text style={styles.timeDetailText}>{formatTime(request.sentAt)}</Text>
                    </View>

                    {/* Divider + Actions */}
                    <View style={styles.divider} />
                    <View style={styles.actionsRow}>
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(request)} activeOpacity={0.7}>
                        <HugeiconsIcon icon={Cancel01Icon} size={ms(13)} color="#ef4444" />
                        <Text style={styles.rejectText}>Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(request)} activeOpacity={0.7}>
                        <HugeiconsIcon icon={Tick02Icon} size={ms(13)} color="#22c55e" />
                        <Text style={styles.acceptText}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient:   { flex: 1 },
  safeArea:   { flex: 1 },
  container:  { flex: 1 },
  scrollContent: { paddingHorizontal: s(22), gap: vs(14), paddingBottom: vs(40) },

  // ── Header ──
  pageHeader: { flexDirection: 'row', alignItems: 'center', gap: s(12) },
  backBtn: {
    width: ms(36), height: ms(36), borderRadius: ms(10),
    backgroundColor: '#000', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center',
  },
  pageLabel: {
    fontFamily: Fonts.rajdhani.regular, fontSize: rf(7),
    color: Colors.zinc[500], letterSpacing: s(2),
    textTransform: 'uppercase', fontWeight: '600',
  },
  pageTitle: {
    fontFamily: Fonts.orbitron.extraBold, fontSize: rf(18),
    color: Colors.white, letterSpacing: s(2),
  },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: s(5),
    paddingHorizontal: s(10), paddingVertical: vs(5),
    borderRadius: ms(8), borderWidth: 1,
    backgroundColor: '#000', borderColor: `${CYAN}40`,
  },
  headerBadgeText: { fontFamily: Fonts.orbitron.bold, fontSize: rf(10), color: CYAN },

  // ── Info Banner ──
  infoBanner: {
    flexDirection: 'row', alignItems: 'center', gap: s(10),
    padding: s(14), borderRadius: ms(12),
    borderWidth: 1, borderColor: `${CYAN}20`,
    backgroundColor: '#000',
  },
  infoBannerText: {
    fontFamily: Fonts.rajdhani.regular, fontSize: rf(8),
    color: Colors.zinc[400], flex: 1, lineHeight: rf(13),
  },

  // ── Section Header ──
  listContainer: { gap: vs(10) },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLeft:   { flexDirection: 'row', alignItems: 'center', gap: s(7) },
  sectionTitle: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(8),
    color: CYAN, letterSpacing: s(2), textTransform: 'uppercase',
  },
  countBadge: {
    paddingHorizontal: s(8), paddingVertical: vs(2),
    borderRadius: ms(4), borderWidth: 1,
    backgroundColor: '#000', borderColor: `${CYAN}30`,
  },
  countText: { fontFamily: Fonts.orbitron.bold, fontSize: rf(8), color: CYAN },

  // ── Card ──
  card: {
    backgroundColor: '#000',
    borderRadius: ms(14), borderWidth: 1,
    borderColor: `${CYAN}20`, padding: s(14),
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft:   { flexDirection: 'row', alignItems: 'center', gap: s(12), flex: 1 },
  cardInfo:   { flex: 1, gap: vs(4) },
  cardName: {
    fontFamily: Fonts.orbitron.semiBold, fontSize: rf(11),
    color:"#8B7355", letterSpacing: s(0.5),
  },
  cardIdBadge: {
    alignSelf: 'flex-start', backgroundColor: '#0a0a0a',
    paddingHorizontal: s(7), paddingVertical: vs(2),
    borderRadius: ms(4), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardIdText: {
    fontFamily: Fonts.rajdhani.regular, fontSize: rf(7),
    color: Colors.zinc[500], letterSpacing: s(0.5),
  },
  timeBadge: {
    paddingHorizontal: s(9), paddingVertical: vs(4),
    borderRadius: ms(6), backgroundColor: '#000',
    borderWidth: 1, borderColor: `${CYAN}25`,
  },
  timeAgoText: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7),
    color: CYAN, letterSpacing: s(0.5),
  },
  timeDetailRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: s(6), marginTop: vs(10),
  },
  timeDetailText: {
    fontFamily: Fonts.rajdhani.regular, fontSize: rf(7), color: Colors.zinc[600],
  },
  divider: {
    height: 1, backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: vs(12),
  },
  actionsRow: { flexDirection: 'row', gap: s(10) },
  rejectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: s(6), paddingVertical: vs(6), borderRadius: ms(10),
    backgroundColor: '#000', borderWidth: 1, borderColor: 'rgba(239,68,68,0.22)',
  },
  rejectText: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(9),
    color: '#ef4444', letterSpacing: s(1),
  },
  acceptBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: s(6), paddingVertical: vs(11), borderRadius: ms(10),
    backgroundColor: '#000', borderWidth: 1, borderColor: 'rgba(34,197,94,0.22)',
  },
  acceptText: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(9),
    color: '#22c55e', letterSpacing: s(1),
  },

  // ── Avatar ──
  avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, backgroundColor: '#000' },
  avatarText: { fontFamily: Fonts.orbitron.bold },

  // ── Empty ──
  emptyState: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: vs(80), gap: vs(10),
  },
  emptyTitle: {
    fontFamily: Fonts.orbitron.semiBold, fontSize: rf(13),
    color: Colors.zinc[400], marginTop: vs(8),
  },
  emptySubtitle: {
    fontFamily: Fonts.rajdhani.regular, fontSize: rf(9),
    color: Colors.zinc[600], textAlign: 'center', paddingHorizontal: s(30),
  },
});

export default ReceivedRequestsScreen;