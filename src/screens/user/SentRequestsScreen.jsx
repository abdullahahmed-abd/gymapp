// src/screens/user/SentRequestsScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ImageBackground, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  SentIcon,
  Clock01Icon,
  Cancel01Icon,
  UserAdd01Icon,
  Search01Icon,
  Loading03Icon,
  QrCodeIcon,
  UserRemove01Icon,
  UserCheck01Icon,
} from '@hugeicons/core-free-icons';

import Header from '../../components/shared/Header';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const s  = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const ORANGE = Colors.burlywood4;

const ALL_MEMBERS = [
  { id: 'user_002', name: 'Hassan Ali',    memberId: 'GYM-2024-002' },
  { id: 'user_003', name: 'Bilal Khan',    memberId: 'GYM-2024-003' },
  { id: 'user_004', name: 'Ahmed Raza',    memberId: 'GYM-2024-004' },
  { id: 'user_005', name: 'Usman Tariq',   memberId: 'GYM-2024-005' },
  { id: 'user_006', name: 'Zain Malik',    memberId: 'GYM-2024-006' },
  { id: 'user_007', name: 'Fahad Sheikh',  memberId: 'GYM-2024-007' },
  { id: 'user_008', name: 'Saad Qureshi',  memberId: 'GYM-2024-008' },
  { id: 'user_009', name: 'Waqar Hussain', memberId: 'GYM-2024-009' },
];

const CURRENT_USER_ID = 'user_001';
const FRIENDS_IDS     = ['user_003', 'user_005', 'user_002'];

const INITIAL_SENT = [
  { id: 'sr1', toId: 'user_007', toName: 'Fahad Sheikh', toMemberId: 'GYM-2024-007', sentAt: '2025-01-11T11:20:00' },
];

// ── Avatar ──────────────────────────────────────────────────
const Avatar = ({ name, size = 44, color = ORANGE }) => {
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
const SentRequestsScreen = ({ navigation }) => {
  const [sentRequests, setSentRequests] = useState(INITIAL_SENT);
  const [searchQuery, setSearchQuery]   = useState('');

  const searchResults = searchQuery.length > 0
    ? ALL_MEMBERS.filter(
        (m) => m.id !== CURRENT_USER_ID &&
          (m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
           m.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleCancel = (request) => {
    Alert.alert('Cancel Request', `Cancel friend request to ${request.toName}?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Cancel Request', style: 'destructive',
        onPress: () => setSentRequests((p) => p.filter((r) => r.id !== request.id)),
      },
    ]);
  };

  const handleSend = (member) => {
    Alert.alert('Send Friend Request', `Send request to ${member.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send',
        onPress: () => {
          setSentRequests((p) => [...p, {
            id: `sr_${Date.now()}`, toId: member.id, toName: member.name,
            toMemberId: member.memberId, sentAt: new Date().toISOString(),
          }]);
          setSearchQuery('');
          Alert.alert('Request Sent! 🎉', `Friend request sent to ${member.name}`);
        },
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
                <Text style={styles.pageTitle}>Sent</Text>
              </View>
              <View style={styles.headerBadge}>
                <HugeiconsIcon icon={SentIcon} size={ms(12)} color={ORANGE} />
                <Text style={styles.headerBadgeText}>{sentRequests.length}</Text>
              </View>
            </View>

            {/* ── Search Section ── */}
            <View style={styles.searchSection}>
              <Text style={styles.searchLabel}>ADD BY MEMBER ID</Text>
              <View style={styles.searchRow}>
                <View style={styles.searchInputWrap}>
                  <HugeiconsIcon icon={Search01Icon} size={ms(14)} color={Colors.zinc[500]} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Enter Member ID or name..."
                    placeholderTextColor={Colors.zinc[600]}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <HugeiconsIcon icon={Cancel01Icon} size={ms(14)} color={Colors.zinc[500]} />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.qrBtn}
                  onPress={() => Alert.alert('QR Scanner', 'Coming soon!')}
                  activeOpacity={0.7}
                >
                  <HugeiconsIcon icon={QrCodeIcon} size={ms(18)} color={Colors.white} />
                </TouchableOpacity>
              </View>

              {searchQuery.length > 0 && (
                <View style={styles.searchResults}>
                  {searchResults.length === 0 ? (
                    <View style={styles.searchEmpty}>
                      <HugeiconsIcon icon={UserRemove01Icon} size={ms(22)} color={Colors.zinc[700]} />
                      <Text style={styles.searchEmptyText}>No member found</Text>
                    </View>
                  ) : (
                    searchResults.map((member) => {
                      const isFriend = FRIENDS_IDS.includes(member.id);
                      const isSent   = sentRequests.some((r) => r.toId === member.id);
                      return (
                        <View key={member.id} style={styles.searchItem}>
                          <View style={styles.searchItemLeft}>
                            <Avatar name={member.name} size={36} color={Colors.zinc[400]} />
                            <View style={{ gap: vs(2) }}>
                              <Text style={styles.searchItemName}>{member.name}</Text>
                              <Text style={styles.searchItemId}>{member.memberId}</Text>
                            </View>
                          </View>
                          {isFriend ? (
                            <View style={[styles.miniTag, { borderColor: 'rgba(34,197,94,0.30)' }]}>
                              <HugeiconsIcon icon={UserCheck01Icon} size={ms(10)} color="#22c55e" />
                              <Text style={[styles.miniTagText, { color: '#22c55e' }]}>Friends</Text>
                            </View>
                          ) : isSent ? (
                            <View style={[styles.miniTag, { borderColor: `${ORANGE}35` }]}>
                              <HugeiconsIcon icon={Loading03Icon} size={ms(10)} color={ORANGE} />
                              <Text style={[styles.miniTagText, { color: ORANGE }]}>Sent</Text>
                            </View>
                          ) : (
                            <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend(member)} activeOpacity={0.7}>
                              <HugeiconsIcon icon={UserAdd01Icon} size={ms(12)} color={Colors.white} />
                              <Text style={styles.sendBtnText}>Send</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })
                  )}
                </View>
              )}
            </View>

            {/* ── Info Banner ── */}
            <View style={styles.infoBanner}>
              <HugeiconsIcon icon={SentIcon} size={ms(16)} color={ORANGE} />
              <Text style={styles.infoBannerText}>
                Requests you've sent. The member can accept or decline.
              </Text>
            </View>

            {/* ── List / Empty ── */}
            {sentRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <HugeiconsIcon icon={SentIcon} size={ms(50)} color={Colors.zinc[700]} />
                <Text style={styles.emptyTitle}>No Sent Requests</Text>
                <Text style={styles.emptySubtitle}>
                  Use the search above to find and add gym members
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionLeft}>
                    <HugeiconsIcon icon={Clock01Icon} size={ms(13)} color={ORANGE} />
                    <Text style={styles.sectionTitle}>Pending Requests</Text>
                  </View>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{sentRequests.length}</Text>
                  </View>
                </View>

                {sentRequests.map((request) => (
                  <View key={request.id} style={styles.card}>
                    {/* Top Row */}
                    <View style={styles.cardTopRow}>
                      <View style={styles.cardLeft}>
                        <Avatar name={request.toName} size={46} color={ORANGE} />
                        <View style={styles.cardInfo}>
                          <Text style={styles.cardName} numberOfLines={1}>{request.toName}</Text>
                          <View style={styles.cardIdBadge}>
                            <Text style={styles.cardIdText}>{request.toMemberId}</Text>
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
                      <Text style={styles.timeDetailText}>Sent: {formatTime(request.sentAt)}</Text>
                    </View>

                    {/* Divider + Bottom */}
                    <View style={styles.divider} />
                    <View style={styles.cardBottom}>
                      <View style={styles.waitingRow}>
                        <HugeiconsIcon icon={Loading03Icon} size={ms(11)} color={ORANGE} />
                        <Text style={styles.waitingText}>Waiting for response</Text>
                      </View>
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(request)} activeOpacity={0.7}>
                        <HugeiconsIcon icon={Cancel01Icon} size={ms(12)} color="#ef4444" />
                        <Text style={styles.cancelText}>Cancel</Text>
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
    backgroundColor: '#000', borderColor: `${ORANGE}40`,
  },
  headerBadgeText: { fontFamily: Fonts.orbitron.bold, fontSize: rf(10), color: ORANGE },

  // ── Search ──
  searchSection: { gap: vs(8) },
  searchLabel: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7),
    color: Colors.zinc[500], letterSpacing: s(2), textTransform: 'uppercase',
  },
  searchRow: { flexDirection: 'row', gap: s(8) },
  searchInputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#000', borderRadius: ms(10),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: s(12), gap: s(8),
  },
  searchInput: {
    flex: 1, fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9), color: Colors.white, paddingVertical: vs(11),
  },
  qrBtn: {
    width: ms(44), height: ms(44), borderRadius: ms(10),
    backgroundColor: '#000', borderWidth: 1, borderColor: `${ORANGE}35`,
    alignItems: 'center', justifyContent: 'center',
  },
  searchResults: { gap: vs(6) },
  searchEmpty:   { alignItems: 'center', paddingVertical: vs(16), gap: vs(6) },
  searchEmptyText: {
    fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[600],
  },
  searchItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#000', borderRadius: ms(10), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)', padding: s(10),
  },
  searchItemLeft: { flexDirection: 'row', alignItems: 'center', gap: s(10), flex: 1 },
  searchItemName: {
    fontFamily: Fonts.orbitron.semiBold, fontSize: rf(8),
    color: Colors.white, letterSpacing: s(0.5),
  },
  searchItemId: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(7), color: Colors.zinc[600] },
  miniTag: {
    flexDirection: 'row', alignItems: 'center', gap: s(4),
    paddingHorizontal: s(8), paddingVertical: vs(4),
    borderRadius: ms(6), borderWidth: 1, backgroundColor: '#000',
  },
  miniTagText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7), letterSpacing: s(0.5) },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', gap: s(4),
    backgroundColor: '#000', paddingHorizontal: s(10), paddingVertical: vs(6),
    borderRadius: ms(6), borderWidth: 1, borderColor: `${ORANGE}35`,
  },
  sendBtnText: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(8),
    color: Colors.white, letterSpacing: s(0.5),
  },

  // ── Info Banner ──
  infoBanner: {
    flexDirection: 'row', alignItems: 'center', gap: s(10),
    padding: s(14), borderRadius: ms(12),
    borderWidth: 1, borderColor: `${ORANGE}20`, backgroundColor: '#000',
  },
  infoBannerText: {
    fontFamily: Fonts.rajdhani.regular, fontSize: rf(8),
    color: Colors.zinc[400], flex: 1, lineHeight: rf(13),
  },

  // ── Section ──
  listContainer: { gap: vs(10) },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLeft:   { flexDirection: 'row', alignItems: 'center', gap: s(7) },
  sectionTitle: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(8),
    color: ORANGE, letterSpacing: s(2), textTransform: 'uppercase',
  },
  countBadge: {
    paddingHorizontal: s(8), paddingVertical: vs(2),
    borderRadius: ms(4), borderWidth: 1,
    backgroundColor: '#000', borderColor: `${ORANGE}30`,
  },
  countText: { fontFamily: Fonts.orbitron.bold, fontSize: rf(8), color: ORANGE },

  // ── Card ──
  card: {
    backgroundColor: '#000',
    borderRadius: ms(14), borderWidth: 1,
    borderColor: `${ORANGE}20`, padding: s(14),
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft:   { flexDirection: 'row', alignItems: 'center', gap: s(12), flex: 1 },
  cardInfo:   { flex: 1, gap: vs(4) },
  cardName: {
    fontFamily: Fonts.orbitron.semiBold, fontSize: rf(10),
    color:"#8B8878", letterSpacing: s(0.5),
  },
  cardIdBadge: {
    alignSelf: 'flex-start', backgroundColor: '#0a0a0a',
    paddingHorizontal: s(7), paddingVertical: vs(2),
    borderRadius: ms(4), borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  cardIdText: {
    fontFamily: Fonts.rajdhani.regular, fontSize: rf(7),
    color: Colors.zinc[500], letterSpacing: s(0.5),
  },
  timeBadge: {
    paddingHorizontal: s(9), paddingVertical: vs(4),
    borderRadius: ms(6), backgroundColor: '#000',
    borderWidth: 1, borderColor: `${ORANGE}25`,
  },
  timeAgoText: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7),
    color: ORANGE, letterSpacing: s(0.5),
  },
  timeDetailRow: { flexDirection: 'row', alignItems: 'center', gap: s(6), marginTop: vs(10) },
  timeDetailText: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(7), color: Colors.zinc[600] },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: vs(12) },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  waitingRow: { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  waitingText: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(8), color: ORANGE },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', gap: s(5),
    paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(8),
    backgroundColor: '#000', borderWidth: 1, borderColor: 'rgba(239,68,68,0.22)',
  },
  cancelText: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(8),
    color: '#ef4444', letterSpacing: s(1),
  },

  // ── Avatar ──
  avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, backgroundColor: '#000' },
  avatarText: { fontFamily: Fonts.orbitron.bold },

  // ── Empty ──
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: vs(80), gap: vs(10) },
  emptyTitle: {
    fontFamily: Fonts.orbitron.semiBold, fontSize: rf(13),
    color: Colors.zinc[400], marginTop: vs(8),
  },
  emptySubtitle: {
    fontFamily: Fonts.rajdhani.regular, fontSize: rf(9),
    color: Colors.zinc[600], textAlign: 'center', paddingHorizontal: s(30),
  },
});

export default SentRequestsScreen;