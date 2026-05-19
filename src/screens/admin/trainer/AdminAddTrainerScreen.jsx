// src/screens/admin/AdminAddTrainerScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Dumbbell01Icon,
  Search01Icon,
  Cancel01Icon,
  Shield01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Timer01Icon,
  Activity01Icon,
  Login01Icon,
  Clock01Icon,
  SmartPhone01Icon,
  Call02Icon,
  WhatsappIcon,
} from '@hugeicons/core-free-icons';
import Header from '../../../components/shared/Header';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import { useTrainer } from '../../../context/TrainerContext';
import { Linking } from 'react-native';

const s  = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const TRAINER_COLOR = '#22D3EE';

// ── Dummy Members Data ──
const DUMMY_MEMBERS = [
  {
    id: 'm1', name: 'Abdullah Ahmed', avatar: 'AA', memberId: 'GYM001',
    phone: '+918817159218', email: 'abdullah@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'active',
    workoutType: 'cardio_weights', isLive: true,
    checkinTime: '6:30 AM', duration: '45 min', lastCheckout: '8:15 AM',
    joinDate: '2024-01-15', expiryDate: '2025-02-15', daysLeft: 25,
    totalVisits: 156, currentStreak: 12, paidAmount: 2500,
  },
  {
    id: 'm2', name: 'Priya Patel', avatar: 'PP', memberId: 'GYM002',
    phone: '+919876543211', email: 'priya@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'expired',
    workoutType: 'weights_only', isLive: true,
    checkinTime: '6:45 AM', duration: '32 min', lastCheckout: null,
    joinDate: '2024-03-10', expiryDate: '2025-01-10', daysLeft: 0,
    totalVisits: 89, currentStreak: 0, paidAmount: 3500,
  },
  {
    id: 'm3', name: 'Rahul Verma', avatar: 'RV', memberId: 'GYM003',
    phone: '+919876543212', email: 'rahul@example.com',
    membershipType: null, membershipStatus: 'trial',
    workoutType: 'cardio_weights', isLive: true,
    checkinTime: '6:15 AM', duration: '58 min', lastCheckout: null,
    joinDate: '2025-01-15', expiryDate: '2025-01-22', daysLeft: 5,
    totalVisits: 5, currentStreak: 5, paidAmount: 0,
  },
  {
    id: 'm4', name: 'Sneha Gupta', avatar: 'SG', memberId: 'GYM004',
    phone: '+919876543213', email: 'sneha@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'active',
    workoutType: 'weights_only', isLive: true,
    checkinTime: '6:50 AM', duration: '40 min', lastCheckout: null,
    joinDate: '2024-06-01', expiryDate: '2025-03-05', daysLeft: 45,
    totalVisits: 210, currentStreak: 28, paidAmount: 3500,
  },
  {
    id: 'm5', name: 'Vikram Singh', avatar: 'VS', memberId: 'GYM005',
    phone: '+919876543214', email: 'vikram@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'expired',
    workoutType: 'cardio_weights', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '5:00 PM',
    joinDate: '2024-02-20', expiryDate: '2025-01-05', daysLeft: 0,
    totalVisits: 67, currentStreak: 0, paidAmount: 2500,
  },
  {
    id: 'm6', name: 'Ananya Reddy', avatar: 'AR', memberId: 'GYM006',
    phone: '+919876543215', email: 'ananya@example.com',
    membershipType: null, membershipStatus: 'trial',
    workoutType: 'weights_only', isLive: true,
    checkinTime: '6:20 AM', duration: '50 min', lastCheckout: null,
    joinDate: '2025-01-17', expiryDate: '2025-01-24', daysLeft: 3,
    totalVisits: 3, currentStreak: 3, paidAmount: 0,
  },
  {
    id: 'm7', name: 'Karan Malhotra', avatar: 'KM', memberId: 'GYM007',
    phone: '+919876543216', email: 'karan@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'active',
    workoutType: 'cardio_weights', isLive: true,
    checkinTime: '6:40 AM', duration: '35 min', lastCheckout: null,
    joinDate: '2024-05-15', expiryDate: '2025-03-20', daysLeft: 60,
    totalVisits: 178, currentStreak: 22, paidAmount: 2500,
  },
  {
    id: 'm8', name: 'Meera Iyer', avatar: 'MI', memberId: 'GYM008',
    phone: '+919876543217', email: 'meera@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'expired',
    workoutType: 'weights_only', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '4:45 PM',
    joinDate: '2024-04-01', expiryDate: '2025-01-08', daysLeft: 0,
    totalVisits: 134, currentStreak: 0, paidAmount: 3500,
  },
  {
    id: 'm9', name: 'Aditya Kumar', avatar: 'AK', memberId: 'GYM009',
    phone: '+919876543218', email: 'aditya@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'active',
    workoutType: 'cardio_weights', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '9:00 AM',
    joinDate: '2024-08-10', expiryDate: '2025-02-05', daysLeft: 15,
    totalVisits: 95, currentStreak: 8, paidAmount: 2500,
  },
  {
    id: 'm10', name: 'Riya Chopra', avatar: 'RC', memberId: 'GYM010',
    phone: '+919876543219', email: 'riya@example.com',
    membershipType: null, membershipStatus: 'trial',
    workoutType: 'weights_only', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '11:00 AM',
    joinDate: '2025-01-13', expiryDate: '2025-01-20', daysLeft: 7,
    totalVisits: 7, currentStreak: 7, paidAmount: 0,
  },
];

// ═══════════════════════════════════════════════════════════════
// CONFIGS
// ═══════════════════════════════════════════════════════════════
const TIER_TEMPLATES = {
  'ELITE TIER': {
    badge: 'ELITE',
    iconColor: '#EAB308',
  },
  'LEGENDARY TIER': {
    badge: 'LEGENDARY',
    iconColor: '#a855f7',
  },
};

const TRIAL_CONFIG = {
  iconColor: '#3B82F6',
  bgColor: 'rgba(59,130,246,0.15)',
  badge: 'TRIAL',
};

const STATUS_CONFIG = {
  active: {
    label: 'ACTIVE',
    color: '#22C55E',
    borderColor: 'rgba(34,197,94,0.3)',
    icon: CheckmarkCircle02Icon,
  },
  expired: {
    label: 'EXPIRED',
    color: '#EF4444',
    borderColor: 'rgba(239,68,68,0.3)',
    icon: AlertCircleIcon,
  },
  trial: {
    label: 'TRIAL',
    color: '#3B82F6',
    borderColor: 'rgba(59,130,246,0.3)',
    icon: Timer01Icon,
  },
};

const formatPhone = (phone) => {
  const c = phone?.replace(/\D/g, '') || '';
  if (c.length === 12) {
    return `+${c.slice(0, 2)} ${c.slice(2, 7)} ${c.slice(7)}`;
  }
  return phone;
};

// ═══════════════════════════════════════════════════════════════
// MEMBER CARD
// ✅ FIXED: uses isMemberTrainer (boolean) instead of trainerStatus
// ═══════════════════════════════════════════════════════════════
const MemberCard = ({ member, onPress, isMemberTrainer }) => {
  const isTrial = member.membershipStatus === 'trial';
  const tierConfig = isTrial
    ? TRIAL_CONFIG
    : TIER_TEMPLATES[member.membershipType] || TIER_TEMPLATES['ELITE TIER'];
  const statusConfig = STATUS_CONFIG[member.membershipStatus] || STATUS_CONFIG.active;
  const accentColor = tierConfig.iconColor;

  const handleCall = (e) => {
    e.stopPropagation();
    Linking.openURL(`tel:${member.phone.replace(/\D/g, '')}`);
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    Linking.openURL(`whatsapp://send?phone=${member.phone.replace(/\D/g, '')}`);
  };

  return (
    <TouchableOpacity
      style={[
        styles.memberCard,
        {
          borderColor: isMemberTrainer
            ? `${TRAINER_COLOR}40`
            : `${accentColor}30`,
        },
      ]}
      onPress={() => onPress(member)}
      activeOpacity={0.9}
    >
      {/* BG Icon */}
      <View style={styles.cardBgIcon}>
        <HugeiconsIcon
          icon={Shield01Icon}
          size={ms(70)}
          color={`${accentColor}15`}
          strokeWidth={0.5}
        />
      </View>

      <View style={styles.memberCardInner}>
        {/* Top Row */}
        <View style={styles.memberTopRow}>

          {/* Avatar */}
          <View
            style={[
              styles.memberAvatar,
              {
                borderColor: isMemberTrainer
                  ? `${TRAINER_COLOR}80`
                  : `${accentColor}60`,
                backgroundColor: isMemberTrainer
                  ? `${TRAINER_COLOR}15`
                  : `${accentColor}15`,
              },
            ]}
          >
            <LinearGradient
              colors={['black', 'black']}
              style={styles.memberAvatarGrad}
            >
              <Text style={styles.memberAvatarText}>{member.avatar}</Text>
            </LinearGradient>
            {member.isLive && (
              <View style={styles.liveDotWrap}>
                <View style={styles.liveDot} />
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.memberInfo}>
            {/* Badges */}
            <View style={styles.badgeRow}>
              <View style={styles.badgesLeft}>

                {/* ✅ Show TRAINER badge if already trainer, else show tier */}
                {isMemberTrainer ? (
                  <View style={[styles.tierBadge, { borderColor: `${TRAINER_COLOR}40` }]}>
                    <View style={[styles.tierDot, { backgroundColor: TRAINER_COLOR }]} />
                    <Text style={[styles.tierText, { color: TRAINER_COLOR }]}>TRAINER</Text>
                  </View>
                ) : (
                  <View style={[styles.tierBadge, { borderColor: `${accentColor}40` }]}>
                    <View style={[styles.tierDot, { backgroundColor: accentColor }]} />
                    <Text style={[styles.tierText, { color: Colors.zinc[400] }]}>
                      {tierConfig.badge || 'MEMBER'}
                    </Text>
                  </View>
                )}

                {!isMemberTrainer && (
                  <View style={[styles.statusBadge, { borderColor: statusConfig.borderColor }]}>
                    <HugeiconsIcon
                      icon={statusConfig.icon}
                      size={ms(10)}
                      color={statusConfig.color}
                    />
                    <Text style={[styles.statusText, { color: Colors.zinc[400] }]}>
                      {statusConfig.label}
                    </Text>
                  </View>
                )}
              </View>

              {/* Live / Offline */}
              {member.isLive ? (
                <View style={styles.liveChip}>
                  <View style={styles.liveChipDot} />
                  <Text style={styles.liveChipText}>LIVE</Text>
                </View>
              ) : (
                <View style={styles.offlineChip}>
                  <Text style={styles.offlineChipText}>OFFLINE</Text>
                </View>
              )}
            </View>

            <Text style={styles.memberName} numberOfLines={1}>{member.name}</Text>

            {/* Workout / Trainer Badge */}
            {isMemberTrainer ? (
              <View style={[styles.workoutBadge, { backgroundColor: `${TRAINER_COLOR}15` }]}>
                <HugeiconsIcon icon={Dumbbell01Icon} size={ms(10)} color={TRAINER_COLOR} />
                <Text style={[styles.workoutText, { color: TRAINER_COLOR }]}>GYM TRAINER</Text>
              </View>
            ) : (
              <View style={[styles.workoutBadge, { backgroundColor: `${accentColor}15` }]}>
                <HugeiconsIcon
                  icon={member.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                  size={ms(10)}
                  color={accentColor}
                />
                <Text style={[styles.workoutText, { color: 'white' }]}>
                  {member.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' : 'WEIGHTS ONLY'}
                </Text>
              </View>
            )}

            {/* Time Row */}
            <View style={styles.timeRow}>
              {member.isLive && member.checkinTime ? (
                <>
                  <View style={styles.timeItem}>
                    <HugeiconsIcon icon={Login01Icon} size={ms(11)} color="#22C55E" />
                    <Text style={styles.timeText}>{member.checkinTime}</Text>
                  </View>
                  {member.duration && (
                    <>
                      <View style={styles.timeDot} />
                      <View style={styles.timeItem}>
                        <HugeiconsIcon icon={Clock01Icon} size={ms(11)} color={accentColor} />
                        <Text style={styles.timeText}>{member.duration}</Text>
                      </View>
                    </>
                  )}
                </>
              ) : (
                <View style={styles.timeItem}>
                  <HugeiconsIcon icon={Clock01Icon} size={ms(11)} color="rgba(255,255,255,0.3)" />
                  <Text style={[styles.timeText, { color: 'rgba(255,255,255,0.4)' }]}>
                    Last: {member.lastCheckout || 'N/A'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View
          style={[
            styles.memberDivider,
            {
              backgroundColor: isMemberTrainer
                ? `${TRAINER_COLOR}25`
                : `${accentColor}25`,
            },
          ]}
        />

        {/* Bottom Row */}
        <View style={styles.memberBottomRow}>
          <View style={styles.phoneBox}>
            <View
              style={[
                styles.phoneIcon,
                {
                  backgroundColor: isMemberTrainer
                    ? `${TRAINER_COLOR}12`
                    : `${accentColor}12`,
                },
              ]}
            >
              <HugeiconsIcon
                icon={SmartPhone01Icon}
                size={ms(14)}
                color={isMemberTrainer ? TRAINER_COLOR : accentColor}
              />
            </View>
            <View>
              <Text style={styles.phoneLabel}>CONTACT</Text>
              <Text style={styles.phoneNumber}>{formatPhone(member.phone)}</Text>
            </View>
          </View>

          {/* Call & WhatsApp */}
          <View style={styles.actionBtns}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleCall}
              activeOpacity={0.7}
            >
              <LinearGradient colors={['black', 'black']} style={styles.actionBtnGrad}>
                <HugeiconsIcon icon={Call02Icon} size={ms(18)} color="#22C55E" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleWhatsApp}
              activeOpacity={0.7}
            >
              <LinearGradient colors={['black', 'black']} style={styles.actionBtnGrad}>
                <HugeiconsIcon icon={WhatsappIcon} size={ms(18)} color="#25D366" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminAddTrainerScreen = ({ navigation }) => {

  // ✅ FIXED: Use isTrainer & getTrainerCount from new context
  const { isTrainer, getTrainerCount } = useTrainer();

  const [searchQuery, setSearchQuery]         = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [memberFilter, setMemberFilter]       = useState('all');

  const filteredMembers = DUMMY_MEMBERS.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery);

    const matchFilter =
      memberFilter === 'all' ||
      (memberFilter === 'active'  && m.membershipStatus === 'active') ||
      (memberFilter === 'trial'   && m.membershipStatus === 'trial')  ||
      (memberFilter === 'live'    && m.isLive);

    return matchSearch && matchFilter;
  });

  // ✅ Navigate to profile screen
  const handleMemberPress = (member) => {
    navigation.navigate('AdminTrainerProfile', { member });
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('AdminTrainers');
  };

  const liveCount    = DUMMY_MEMBERS.filter((m) => m.isLive).length;
  const activeCount  = DUMMY_MEMBERS.filter((m) => m.membershipStatus === 'active').length;
  const trialCount   = DUMMY_MEMBERS.filter((m) => m.membershipStatus === 'trial').length;
  const trainerCount = getTrainerCount();

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={styles.background}
      blurRadius={9}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.92)', '#000000']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Header title="ADD TRAINER" showMenu={false} />

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <View style={styles.backIcon}>
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  size={ms(16)}
                  color="rgba(255,255,255,0.6)"
                />
              </View>
              <Text style={styles.backText}>Back to Trainers</Text>
            </TouchableOpacity>

            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <LinearGradient
                colors={['rgba(34,211,238,0.08)', 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              <HugeiconsIcon icon={Dumbbell01Icon} size={ms(16)} color={TRAINER_COLOR} />
              <Text style={styles.infoBannerText}>
                Tap on a member to view their profile and assign them as a trainer.
              </Text>
            </View>

            {/* Search Bar */}
            <View
              style={[
                styles.searchBar,
                isSearchFocused && styles.searchBarFocused,
              ]}
            >
              <HugeiconsIcon
                icon={Search01Icon}
                size={ms(18)}
                color={isSearchFocused ? '#fff' : 'rgba(255,255,255,0.4)'}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search name, ID, or phone..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.7}
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={ms(14)}
                    color="rgba(255,255,255,0.5)"
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Row */}
            <View style={styles.filterRow}>
              {[
                { label: 'All',    value: 'all',    count: DUMMY_MEMBERS.length },
                { label: 'Active', value: 'active', count: activeCount, color: '#22C55E' },
                { label: 'Trial',  value: 'trial',  count: trialCount,  color: '#3B82F6' },
                { label: 'Live',   value: 'live',   count: liveCount,   color: '#22C55E' },
              ].map((f) => (
                <TouchableOpacity
                  key={f.value}
                  style={[
                    styles.filterChip,
                    memberFilter === f.value && styles.filterChipActive,
                  ]}
                  onPress={() => setMemberFilter(f.value)}
                  activeOpacity={0.7}
                >
                  {f.color && (
                    <View style={[styles.filterDot, { backgroundColor: f.color }]} />
                  )}
                  <Text
                    style={[
                      styles.filterChipText,
                      memberFilter === f.value && styles.filterChipTextActive,
                    ]}
                  >
                    {f.label} ({f.count})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {searchQuery
                  ? 'Search Results'
                  : memberFilter === 'live'
                  ? 'Live Members'
                  : memberFilter === 'active'
                  ? 'Active Members'
                  : memberFilter === 'trial'
                  ? 'Trial Members'
                  : 'All Members'}
              </Text>
              <View style={styles.sectionCount}>
                <Text style={styles.sectionCountText}>
                  {filteredMembers.length}
                </Text>
              </View>
            </View>

            {/* Member List */}
            {filteredMembers.length === 0 ? (
              <View style={styles.emptyContainer}>
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={ms(40)}
                  color="rgba(255,255,255,0.2)"
                />
                <Text style={styles.emptyTitle}>No Members Found</Text>
                <Text style={styles.emptySub}>
                  Try adjusting your search or filter
                </Text>
              </View>
            ) : (
              filteredMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onPress={handleMemberPress}
                  // ✅ FIXED: Pass boolean instead of trainerStatus string
                  isMemberTrainer={isTrainer(member.id)}
                />
              ))
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
  scrollContent: {
    paddingHorizontal: s(20),
    paddingBottom: vs(100),
    gap: vs(12),
  },

  // Back
  backBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(2) },
  backIcon: {
    width: ms(32), height: ms(32), borderRadius: ms(16),
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center', marginRight: s(10),
  },
  backText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(11), color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.8, textTransform: 'uppercase',
  },

  // Info Banner
  infoBanner: {
    flexDirection: 'row', alignItems: 'center', gap: s(10),
    borderRadius: ms(12), borderWidth: 1, borderColor: `${TRAINER_COLOR}20`,
    padding: s(12), overflow: 'hidden', backgroundColor: '#000',
  },
  infoBannerText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9), color: Colors.zinc[400], flex: 1, lineHeight: rf(14),
  },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#000000', borderRadius: ms(12),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: s(13), paddingVertical: vs(6), gap: s(10),
  },
  searchBarFocused: { borderColor: 'rgba(255,255,255,0.15)' },
  searchInput: {
    flex: 1, fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(13), color: '#FFFFFF', paddingVertical: 0,
  },

  // Filter
  filterRow: { flexDirection: 'row', gap: s(6), flexWrap: 'wrap' },
  filterChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: s(8), paddingVertical: vs(5),
    borderRadius: ms(16), backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', gap: s(4),
  },
  filterChipActive: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  filterDot: { width: ms(5), height: ms(5), borderRadius: ms(2.5) },
  filterChipText: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7),
    color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5, textTransform: 'uppercase',
  },
  filterChipTextActive: { color: '#FFFFFF' },

  // Section Header
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(11),
    color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, textTransform: 'uppercase',
  },
  sectionCount: {
    paddingHorizontal: s(10), paddingVertical: vs(4), borderRadius: ms(8),
  },
  sectionCountText: {
    fontFamily: Fonts.orbitron.bold, fontSize: rf(11), color: TRAINER_COLOR,
  },

  // Empty
  emptyContainer: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: vs(60), gap: vs(12),
  },
  emptyTitle: {
    fontFamily: Fonts.orbitron.semiBold, fontSize: rf(14), color: Colors.zinc[400],
  },
  emptySub: {
    fontFamily: Fonts.rajdhani.regular, fontSize: rf(10),
    color: Colors.zinc[600], textAlign: 'center',
  },

  // Member Card
  memberCard: {
    borderRadius: ms(16), overflow: 'hidden',
    backgroundColor: '#000000', borderWidth: 1, position: 'relative',
  },
  cardBgIcon: {
    position: 'absolute', top: -ms(5), right: -ms(10), opacity: 0.8,
  },
  memberCardInner: {
    paddingLeft: ms(14), paddingRight: ms(12), paddingVertical: ms(12),
  },
  memberTopRow: { flexDirection: 'row', alignItems: 'flex-start' },
  memberAvatar: {
    position: 'relative', marginRight: s(12),
    borderWidth: scale(2), borderRadius: ms(27),
  },
  memberAvatarGrad: {
    width: ms(50), height: ms(50), borderRadius: ms(25),
    alignItems: 'center', justifyContent: 'center',
  },
  memberAvatarText: {
    fontFamily: Fonts.orbitron.bold, fontSize: rf(14), color: '#FFFFFF',
  },
  liveDotWrap: {
    position: 'absolute', bottom: 0, right: 0,
    width: ms(14), height: ms(14), borderRadius: ms(7),
    backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#000000',
  },
  liveDot: {
    width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: '#22C55E',
  },
  memberInfo: { flex: 1 },
  badgeRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: vs(4), justifyContent: 'space-between',
  },
  badgesLeft: {
    flexDirection: 'row', alignItems: 'center', gap: s(6), flexWrap: 'wrap',
  },
  tierBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: s(6), paddingVertical: vs(2),
    borderRadius: ms(5), borderWidth: 1, gap: s(4),
  },
  tierDot: { width: ms(4), height: ms(4), borderRadius: ms(2) },
  tierText: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(6), letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: s(6), paddingVertical: vs(2),
    borderRadius: ms(5), borderWidth: 1, gap: s(3),
  },
  statusText: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(6), letterSpacing: 0.5,
  },
  liveChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(5), gap: s(3),
  },
  liveChipDot: {
    width: ms(4), height: ms(4), borderRadius: ms(2), backgroundColor: '#22C55E',
  },
  liveChipText: {
    fontFamily: Fonts.orbitron.bold, fontSize: rf(5), color: '#22C55E', letterSpacing: 0.5,
  },
  offlineChip: {
    paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(5),
  },
  offlineChipText: {
    fontFamily: Fonts.orbitron.bold, fontSize: rf(5),
    color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5,
  },
  memberName: {
    fontFamily: Fonts.orbitron.bold, fontSize: rf(11),
    color: '#FFFFFF', marginBottom: vs(4),
  },
  workoutBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: s(6), paddingVertical: vs(2),
    borderRadius: ms(4), alignSelf: 'flex-start',
    marginBottom: vs(5), gap: s(4),
  },
  workoutText: {
    fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(6), letterSpacing: 0.5,
  },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeItem: { flexDirection: 'row', alignItems: 'center', gap: s(3) },
  timeText: {
    fontFamily: Fonts.orbitron.regular, fontSize: rf(8), color: '#FFFFFF',
  },
  timeDot: {
    width: ms(3), height: ms(3), borderRadius: ms(1.5),
    backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: s(6),
  },
  memberDivider: { height: 1, marginVertical: vs(10) },
  memberBottomRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  phoneBox: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  phoneIcon: {
    width: ms(32), height: ms(32), borderRadius: ms(10),
    alignItems: 'center', justifyContent: 'center', marginRight: s(8),
  },
  phoneLabel: {
    fontFamily: Fonts.rajdhani.regular, fontSize: rf(6),
    color: 'rgba(255,255,255,0.4)', letterSpacing: 1.2, marginBottom: vs(1),
  },
  phoneNumber: {
    fontFamily: Fonts.orbitron.regular, fontSize: rf(8),
    color: '#FFFFFF', letterSpacing: 0.5,
  },
  actionBtns: { flexDirection: 'row', gap: s(6) },
  actionBtn: { borderRadius: ms(10), overflow: 'hidden' },
  actionBtnGrad: {
    width: ms(36), height: ms(36), alignItems: 'center', justifyContent: 'center',
    borderRadius: ms(10), borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
});

export default AdminAddTrainerScreen;