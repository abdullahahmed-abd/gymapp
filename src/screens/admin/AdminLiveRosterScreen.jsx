import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Platform,
  TextInput,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  scale,
  moderateScale,
  verticalScale,
} from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Search01Icon,
  Cancel01Icon,
  Clock01Icon,
  Login01Icon,
  UserRemove01Icon,
  Call02Icon,
  WhatsappIcon,
  SmartPhone01Icon,
  Activity01Icon,
  Dumbbell01Icon,
  Shield01Icon,
  AlertCircleIcon,
  Timer01Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';

import Header from '../../components/shared/Header';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const s = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const getBlurConfig = () => ({
  blurType: Platform.select({
    ios: 'ultraThinMaterialDark',
    android: 'dark',
  }),
  blurAmount: Platform.select({
    ios: 20,
    android: 10,
  }),
});

const TIER_TEMPLATES = {
  'ELITE TIER': {
    name: 'ELITE TIER',
    // ✅ PREMIUM → ELITE
    badge: 'ELITE',
    iconColor: '#EAB308',
    textColor: '#EAB308',
    lightColor: '#FCD34D',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.35)',
    subtitle: 'Cardio + Weight Lifting',
    workoutType: 'cardio_weights',
  },
  'LEGENDARY TIER': {
    name: 'LEGENDARY TIER',
    badge: 'LEGENDARY',
    iconColor: '#a855f7',
    textColor: '#c084fc',
    lightColor: '#c084fc',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
    subtitle: 'Weight Lifting Only',
    workoutType: 'weights_only',
  },
};

// ✅ TRIAL config - koi tier nahi liya
const TRIAL_CONFIG = {
  iconColor: '#3B82F6',
  bgColor: 'rgba(59, 130, 246, 0.15)',
  borderColor: 'rgba(59, 130, 246, 0.35)',
};

const MEMBERSHIP_STATUS = {
  active: {
    label: 'ACTIVE',
    color: '#22C55E',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    icon: CheckmarkCircle02Icon,
  },
  expired: {
    label: 'EXPIRED',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    icon: AlertCircleIcon,
  },
  trial: {
    label: 'TRIAL',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    icon: Timer01Icon,
  },
};

const getTierConfig = (tier) => {
  return TIER_TEMPLATES[tier] || TIER_TEMPLATES['ELITE TIER'];
};

const getStatusConfig = (status) => {
  return MEMBERSHIP_STATUS[status] || MEMBERSHIP_STATUS.active;
};

const liveMembers = [
  {
    id: '1',
    name: 'Abdullah Ahmed',
    membershipType: 'ELITE TIER',
    membershipStatus: 'active',
    workoutType: 'cardio_weights',
    duration: '45 min',
    checkinTime: '6:30 AM',
    avatar: 'AA',
    memberId: 'GYM001',
    phone: '+918817159218',
    daysLeft: 25,
    expiryDate: '2025-02-15',
  },
  {
    id: '2',
    name: 'Priya Patel',
    membershipType: 'LEGENDARY TIER',
    membershipStatus: 'expired',
    workoutType: 'weights_only',
    duration: '32 min',
    checkinTime: '6:45 AM',
    avatar: 'PP',
    memberId: 'GYM002',
    phone: '+919876543211',
    daysLeft: 0,
    expiryDate: '2025-01-10',
  },
  {
    id: '3',
    name: 'Rahul Verma',
    membershipType: null,
    membershipStatus: 'trial',
    workoutType: 'cardio_weights',
    duration: '58 min',
    checkinTime: '6:15 AM',
    avatar: 'RV',
    memberId: 'GYM003',
    phone: '+919876543212',
    daysLeft: 5,
    expiryDate: '2025-01-25',
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    membershipType: 'LEGENDARY TIER',
    membershipStatus: 'active',
    workoutType: 'weights_only',
    duration: '40 min',
    checkinTime: '6:50 AM',
    avatar: 'SG',
    memberId: 'GYM004',
    phone: '+919876543213',
    daysLeft: 45,
    expiryDate: '2025-03-05',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    membershipType: 'ELITE TIER',
    membershipStatus: 'expired',
    workoutType: 'cardio_weights',
    duration: '25 min',
    checkinTime: '7:00 AM',
    avatar: 'VS',
    memberId: 'GYM005',
    phone: '+919876543214',
    daysLeft: 0,
    expiryDate: '2025-01-05',
  },
  {
    id: '6',
    name: 'Ananya Reddy',
    membershipType: null,
    membershipStatus: 'trial',
    workoutType: 'weights_only',
    duration: '50 min',
    checkinTime: '6:20 AM',
    avatar: 'AR',
    memberId: 'GYM006',
    phone: '+919876543215',
    daysLeft: 3,
    expiryDate: '2025-01-23',
  },
  {
    id: '7',
    name: 'Karan Malhotra',
    membershipType: 'ELITE TIER',
    membershipStatus: 'active',
    workoutType: 'cardio_weights',
    duration: '35 min',
    checkinTime: '6:40 AM',
    avatar: 'KM',
    memberId: 'GYM007',
    phone: '+919876543216',
    daysLeft: 60,
    expiryDate: '2025-03-20',
  },
  {
    id: '8',
    name: 'Meera Iyer',
    membershipType: 'LEGENDARY TIER',
    membershipStatus: 'expired',
    workoutType: 'weights_only',
    duration: '55 min',
    checkinTime: '6:10 AM',
    avatar: 'MI',
    memberId: 'GYM008',
    phone: '+919876543217',
    daysLeft: 0,
    expiryDate: '2025-01-08',
  },
  {
    id: '9',
    name: 'Aditya Kumar',
    membershipType: 'ELITE TIER',
    membershipStatus: 'active',
    workoutType: 'cardio_weights',
    duration: '28 min',
    checkinTime: '6:55 AM',
    avatar: 'AK',
    memberId: 'GYM009',
    phone: '+919876543218',
    daysLeft: 15,
    expiryDate: '2025-02-05',
  },
  {
    id: '10',
    name: 'Riya Chopra',
    membershipType: null,
    membershipStatus: 'trial',
    workoutType: 'weights_only',
    duration: '42 min',
    checkinTime: '6:35 AM',
    avatar: 'RC',
    memberId: 'GYM010',
    phone: '+919876543219',
    daysLeft: 7,
    expiryDate: '2025-01-27',
  },
  {
    id: '11',
    name: 'Rohan Desai',
    membershipType: 'ELITE TIER',
    membershipStatus: 'active',
    workoutType: 'cardio_weights',
    duration: '38 min',
    checkinTime: '6:25 AM',
    avatar: 'RD',
    memberId: 'GYM011',
    phone: '+919876543220',
    daysLeft: 30,
    expiryDate: '2025-02-20',
  },
  {
    id: '12',
    name: 'Nisha Joshi',
    membershipType: 'LEGENDARY TIER',
    membershipStatus: 'active',
    workoutType: 'weights_only',
    duration: '22 min',
    checkinTime: '7:05 AM',
    avatar: 'NJ',
    memberId: 'GYM012',
    phone: '+919876543221',
    daysLeft: 20,
    expiryDate: '2025-02-10',
  },
  {
    id: '13',
    name: 'Amit Thakur',
    membershipType: null,
    membershipStatus: 'trial',
    workoutType: 'cardio_weights',
    duration: '30 min',
    checkinTime: '6:48 AM',
    avatar: 'AT',
    memberId: 'GYM013',
    phone: '+919876543222',
    daysLeft: 2,
    expiryDate: '2025-01-22',
  },
  {
    id: '14',
    name: 'Pooja Nair',
    membershipType: 'LEGENDARY TIER',
    membershipStatus: 'expired',
    workoutType: 'weights_only',
    duration: '15 min',
    checkinTime: '7:10 AM',
    avatar: 'PN',
    memberId: 'GYM014',
    phone: '+919876543223',
    daysLeft: 0,
    expiryDate: '2025-01-12',
  },
  {
    id: '15',
    name: 'Sanjay Mehta',
    membershipType: 'ELITE TIER',
    membershipStatus: 'active',
    workoutType: 'cardio_weights',
    duration: '18 min',
    checkinTime: '7:08 AM',
    avatar: 'SM',
    memberId: 'GYM015',
    phone: '+919876543224',
    daysLeft: 40,
    expiryDate: '2025-03-01',
  },
];

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Elite', value: 'ELITE TIER' },
  { label: 'Legendary', value: 'LEGENDARY TIER' },
  { label: 'Active', value: 'status_active' },
  { label: 'Expired', value: 'status_expired' },
  { label: 'Trial', value: 'status_trial' },
];

const getAverageSession = () => {
  const durations = liveMembers.map(member => {
    const minutes = parseInt(member.duration.replace(/[^0-9]/g, ''));
    return minutes;
  });
  const total = durations.reduce((sum, duration) => sum + duration, 0);
  const average = Math.round(total / durations.length);
  return `${average}m`;
};

const getTierCount = (tier) => {
  return liveMembers.filter(m => m.membershipType === tier).length;
};

const getStatusCount = (status) => {
  return liveMembers.filter(m => m.membershipStatus === status).length;
};

// ═══════════════════════════════════════════════════════════════
// FILTER CHIP COMPONENT
// ═══════════════════════════════════════════════════════════════
const FilterChip = ({ label, value, isActive, onPress }) => {
  const tierConfig = value !== 'all' && !value.startsWith('status_') ? getTierConfig(value) : null;
  const statusConfig = value.startsWith('status_') ? getStatusConfig(value.replace('status_', '')) : null;
  const config = tierConfig || statusConfig;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.filterChip,
        isActive && styles.filterChipActive,
        isActive && config && {
          borderColor: config.iconColor || config.color,
          backgroundColor: config.bgColor,
        },
      ]}
    >
      {config && (
        <View style={[styles.filterChipDot, { backgroundColor: config.iconColor || config.color }]} />
      )}
      <Text style={[
        styles.filterChipText,
        isActive && styles.filterChipTextActive,
        isActive && config && { color: config.iconColor || config.color },
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ═══════════════════════════════════════════════════════════════
// LIVE MEMBER CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
const LiveMemberCard = ({ member, onCall, onWhatsApp, onViewProfile }) => {
  const statusConfig = getStatusConfig(member.membershipStatus);
  const isTrial = member.membershipStatus === 'trial';
  const tierConfig = isTrial ? null : getTierConfig(member.membershipType);
  const cardAccentColor = isTrial ? TRIAL_CONFIG.iconColor : tierConfig.iconColor;

  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
  };

  return (
    <TouchableOpacity
      style={[styles.cardWrapper, { borderColor: `${cardAccentColor}30` }]}
      onPress={() => onViewProfile?.(member)}
      activeOpacity={0.9}
    >
      <View style={styles.cardBgIconContainer}>
        <HugeiconsIcon
          icon={Shield01Icon}
          size={ms(70)}
          color={`${cardAccentColor}15`}
          strokeWidth={0.5}
        />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.topSection}>
          <View
            style={[
              styles.avatarContainer,
              {
                borderColor: isTrial
                  ? `${TRIAL_CONFIG.iconColor}80`
                  : `${tierConfig.iconColor}60`,
                backgroundColor: isTrial
                  ? TRIAL_CONFIG.bgColor
                  : `${tierConfig.iconColor}15`,
              },
            ]}
          >
            <LinearGradient
              colors={['black', 'black']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{member.avatar}</Text>
            </LinearGradient>
            <View style={styles.liveIndicator}>
              <View style={styles.liveIndicatorInner} />
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.badgeRow}>
              {!isTrial && tierConfig && (
                <View
                  style={[
                    styles.tierBadge,
                    {
                      backgroundColor: `${tierConfig.iconColor}20`,
                      borderColor: `${tierConfig.iconColor}40`,
                    },
                  ]}
                >
                  <View style={[styles.tierDot, { backgroundColor: tierConfig.iconColor }]} />
                  <Text style={[styles.tierText, { color: tierConfig.iconColor }]}>
                    {tierConfig.badge}
                  </Text>
                </View>
              )}

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: statusConfig.bgColor,
                    borderColor: statusConfig.borderColor,
                  },
                ]}
              >
                <HugeiconsIcon icon={statusConfig.icon} size={ms(10)} color={statusConfig.color} />
                <Text style={[styles.statusBadgeText, { color: statusConfig.color }]}>
                  {statusConfig.label}
                </Text>
              </View>

              <View style={styles.liveBadge}>
                <View style={styles.liveBadgeDot} />
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
            </View>

            <Text style={styles.memberName} numberOfLines={1}>
              {member.name}
            </Text>

            {/* ✅ Trial ke liye workout badge HATA DIYA */}
            {!isTrial && (
              <View style={[styles.workoutBadge, { backgroundColor: `${cardAccentColor}15` }]}>
                <HugeiconsIcon
                  icon={member.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                  size={ms(10)}
                  color={cardAccentColor}
                />
                <Text style={[styles.workoutBadgeText, { color: 'white' }]}>
                  {member.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' : 'WEIGHTS ONLY'}
                </Text>
              </View>
            )}

            <View style={styles.timeRow}>
              <View style={styles.timeItem}>
                <HugeiconsIcon icon={Login01Icon} size={ms(11)} color="#22C55E" />
                <Text style={styles.timeText}>{member.checkinTime}</Text>
              </View>
              <View style={styles.timeDot} />
              <View style={styles.timeItem}>
                <HugeiconsIcon icon={Clock01Icon} size={ms(11)} color={cardAccentColor} />
                <Text style={styles.timeText}>{member.duration}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: `${cardAccentColor}25` }]} />

        <View style={styles.bottomSection}>
          <View style={styles.phoneContainer}>
            <View style={[styles.phoneIconBox, { backgroundColor: `${cardAccentColor}12` }]}>
              <HugeiconsIcon icon={SmartPhone01Icon} size={ms(14)} color={cardAccentColor} />
            </View>
            <View style={styles.phoneInfo}>
              <Text style={styles.phoneLabel}>CONTACT</Text>
              <Text style={styles.phoneNumber}>{formatPhone(member.phone)}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onCall?.(member.phone)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(34, 197, 94, 0.20)', 'rgba(34, 197, 94, 0.08)']}
                style={styles.actionButtonGradient}
              >
                <HugeiconsIcon icon={Call02Icon} size={ms(18)} color="#22C55E" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onWhatsApp?.(member.phone)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(37, 211, 102, 0.20)', 'rgba(37, 211, 102, 0.08)']}
                style={styles.actionButtonGradient}
              >
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
const AdminLiveRosterScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState(null);

  const blurConfig = getBlurConfig();

  const filteredMembers = liveMembers.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery);

    let matchesFilter = true;
    if (activeFilter === 'all') {
      matchesFilter = true;
    } else if (activeFilter.startsWith('status_')) {
      matchesFilter = member.membershipStatus === activeFilter.replace('status_', '');
    } else {
      // ✅ Trial members ka membershipType null hai - filter mein nahi aayenge tier filter pe
      matchesFilter = member.membershipType === activeFilter;
    }

    let matchesStatusCard = true;
    if (activeStatusFilter) {
      matchesStatusCard = member.membershipStatus === activeStatusFilter;
    }

    return matchesSearch && matchesFilter && matchesStatusCard;
  });

  const clearSearch = () => setSearchQuery('');

  const handleGoBack = () => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    } else if (navigation) {
      navigation.navigate('AdminDashboard');
    }
  };

  const handleCall = (phone) => {
    const phoneNumber = phone.replace(/\D/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = (phone) => {
    const phoneNumber = phone.replace(/\D/g, '');
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
  };

  const handleViewProfile = (member) => {
    navigation.navigate('AdminSeeUserProfile', { member });
  };

  const handleStatusCardPress = (status) => {
    if (activeStatusFilter === status) {
      setActiveStatusFilter(null);
      setActiveFilter('all');
    } else {
      setActiveStatusFilter(status);
      setActiveFilter(`status_${status}`);
    }
  };

  const eliteCount = getTierCount('ELITE TIER');
  const legendaryCount = getTierCount('LEGENDARY TIER');
  const expiredCount = getStatusCount('expired');
  const trialCount = getStatusCount('trial');

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      }}
      style={styles.background}
      blurRadius={Platform.OS === 'ios' ? 8 : 12}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.92)', '#000000']}
        style={styles.gradient}
      >
        <Header title="LIVE ROSTER" showMenu={false} />

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <View style={styles.backIconContainer}>
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={ms(16)}
                color="rgba(255,255,255,0.6)"
              />
            </View>
            <Text style={styles.backText}>Back to Dashboard</Text>
          </TouchableOpacity>

          {/* Hero Stats Card */}
          <View style={styles.heroCard}>
            {Platform.OS === 'ios' ? (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType={blurConfig.blurType}
                blurAmount={blurConfig.blurAmount}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidBlurFallback]} />
            )}
            <LinearGradient
              colors={['black', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroMainStat}>
                <View style={styles.heroPulseContainer}>
                  <View style={styles.heroPulseRing} />
                  <View style={styles.heroPulseDot} />
                </View>
                <Text style={styles.heroNumber}>{liveMembers.length}</Text>
                <Text style={styles.heroLabel}>ACTIVE NOW</Text>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroRightStats}>
                <View style={styles.avgSessionBox}>
                  <HugeiconsIcon icon={Clock01Icon} size={ms(14)} color="#EAB308" />
                  <Text style={styles.avgSessionValue}>{getAverageSession()}</Text>
                  <Text style={styles.avgSessionLabel}>AVG</Text>
                </View>
                <View style={styles.tierPillsContainer}>
                  <View style={[styles.tierPillBox, { backgroundColor: 'rgba(234, 179, 8, 0.15)', borderColor: 'rgba(234, 179, 8, 0.3)' }]}>
                    <View style={[styles.tierPillDot, { backgroundColor: '#EAB308' }]} />
                    <Text style={[styles.tierPillLabel, { color: '#EAB308' }]}>ELITE</Text>
                    <Text style={[styles.tierPillCount, { color: '#EAB308' }]}>{eliteCount}</Text>
                  </View>
                  <View style={[styles.tierPillBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.3)' }]}>
                    <View style={[styles.tierPillDot, { backgroundColor: '#a855f7' }]} />
                    <Text style={[styles.tierPillLabel, { color: '#c084fc' }]}>LEGENDARY</Text>
                    <Text style={[styles.tierPillCount, { color: '#c084fc' }]}>{legendaryCount}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Status Stats Card - Expired + Trial Only */}
          <View style={styles.statusStatsCard}>
            {Platform.OS === 'ios' ? (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType={blurConfig.blurType}
                blurAmount={blurConfig.blurAmount}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidBlurFallback]} />
            )}
            <View style={styles.statusStatsContent}>
              {/* Expired */}
              <TouchableOpacity
                style={[
                  styles.statusStatItem,
                  styles.statusStatClickable,
                  activeStatusFilter === 'expired' && styles.statusStatItemActiveExpired,
                ]}
                onPress={() => handleStatusCardPress('expired')}
                activeOpacity={0.75}
              >
                <View style={[
                  styles.statusStatIconBox,
                  { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
                  activeStatusFilter === 'expired' && { backgroundColor: 'rgba(239, 68, 68, 0.25)' },
                ]}>
                  <HugeiconsIcon icon={AlertCircleIcon} size={ms(16)} color="#EF4444" />
                </View>
                <View style={styles.statusStatInfo}>
                  <Text style={[styles.statusStatCount, { color: '#EF4444' }]}>{expiredCount}</Text>
                  <Text style={styles.statusStatLabel}>EXPIRED</Text>
                </View>
                {activeStatusFilter === 'expired' && (
                  <View style={styles.activeFilterDot} />
                )}
              </TouchableOpacity>

              <View style={styles.statusStatDivider} />

              {/* Trial */}
              <TouchableOpacity
                style={[
                  styles.statusStatItem,
                  styles.statusStatClickable,
                  activeStatusFilter === 'trial' && styles.statusStatItemActiveTrial,
                ]}
                onPress={() => handleStatusCardPress('trial')}
                activeOpacity={0.75}
              >
                <View style={[
                  styles.statusStatIconBox,
                  { backgroundColor: 'rgba(59, 130, 246, 0.15)' },
                  activeStatusFilter === 'trial' && { backgroundColor: 'rgba(59, 130, 246, 0.25)' },
                ]}>
                  <HugeiconsIcon icon={Timer01Icon} size={ms(16)} color="#3B82F6" />
                </View>
                <View style={styles.statusStatInfo}>
                  <Text style={[styles.statusStatCount, { color: '#3B82F6' }]}>{trialCount}</Text>
                  <Text style={styles.statusStatLabel}>TRIAL</Text>
                </View>
                {activeStatusFilter === 'trial' && (
                  <View style={[styles.activeFilterDot, { backgroundColor: '#3B82F6' }]} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={[
            styles.searchContainer,
            isSearchFocused && styles.searchContainerFocused,
          ]}>
            {Platform.OS === 'ios' ? (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType={blurConfig.blurType}
                blurAmount={blurConfig.blurAmount}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidBlurFallback]} />
            )}
            <View style={styles.searchContent}>
              <HugeiconsIcon
                icon={Search01Icon}
                size={ms(18)}
                color={isSearchFocused ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}
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
                  onPress={clearSearch}
                  style={styles.clearButton}
                  activeOpacity={0.7}
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={ms(14)} color="rgba(255,255,255,0.5)" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {filterOptions.map((filter) => (
              <FilterChip
                key={filter.value}
                label={filter.label}
                value={filter.value}
                isActive={activeFilter === filter.value}
                onPress={() => {
                  setActiveFilter(filter.value);
                  if (filter.value === 'status_expired') {
                    setActiveStatusFilter('expired');
                  } else if (filter.value === 'status_trial') {
                    setActiveStatusFilter('trial');
                  } else {
                    setActiveStatusFilter(null);
                  }
                }}
              />
            ))}
          </ScrollView>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? 'Search Results' : 'Currently Active'}
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{filteredMembers.length}</Text>
            </View>
          </View>

          {/* No Results */}
          {filteredMembers.length === 0 && (
            <View style={styles.noResultsContainer}>
              {Platform.OS === 'ios' ? (
                <BlurView
                  style={StyleSheet.absoluteFill}
                  blurType={blurConfig.blurType}
                  blurAmount={blurConfig.blurAmount}
                />
              ) : (
                <View style={[StyleSheet.absoluteFill, styles.androidBlurFallback]} />
              )}
              <View style={styles.noResultsContent}>
                <HugeiconsIcon icon={UserRemove01Icon} size={ms(48)} color="rgba(255,255,255,0.3)" />
                <Text style={styles.noResultsTitle}>No Members Found</Text>
                <Text style={styles.noResultsText}>
                  {searchQuery
                    ? `No active members match "${searchQuery}"`
                    : 'No members in this category'
                  }
                </Text>
                {(searchQuery || activeFilter !== 'all' || activeStatusFilter) && (
                  <TouchableOpacity
                    style={styles.clearFiltersBtn}
                    onPress={() => {
                      clearSearch();
                      setActiveFilter('all');
                      setActiveStatusFilter(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.clearFiltersText}>Clear All Filters</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Member Cards */}
          {filteredMembers.map((member) => (
            <LiveMemberCard
              key={member.id}
              member={member}
              onCall={handleCall}
              onWhatsApp={handleWhatsApp}
              onViewProfile={handleViewProfile}
            />
          ))}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(10),
    paddingBottom: vs(40),
  },
  androidBlurFallback: {
    // backgroundColor: 'rgba(15, 15, 20, 0.92)',
    // backgroundColor:"black"
  },

  // Back Button
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(16),
    paddingVertical: vs(4),
  },
  backIconContainer: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  backText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(11),
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Hero Card
  heroCard: {
    borderRadius: ms(18),
    overflow: 'hidden',
    marginBottom: vs(12),
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  heroContent: {
    flexDirection: 'row',
    paddingVertical: vs(16),
    paddingHorizontal: s(16),
    alignItems: 'center',
  },
  heroMainStat: {
    alignItems: 'center',
    paddingRight: s(16),
  },
  heroPulseContainer: {
    width: ms(24),
    height: ms(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(4),
  },
  heroPulseRing: {
    position: 'absolute',
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  heroPulseDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    backgroundColor: '#22C55E',
  },
  heroNumber: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(26),
    color: '#FFFFFF',
  },
  heroLabel: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(7),
    color: '#22C55E',
    letterSpacing: 1.5,
  },
  heroDivider: {
    width: 1,
    height: vs(55),
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroRightStats: {
    flex: 1,
    paddingLeft: s(16),
  },
  avgSessionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
    gap: s(6),
  },
  avgSessionValue: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(14),
    color: '#FFFFFF',
  },
  avgSessionLabel: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7),
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
  tierPillsContainer: {
    flexDirection: 'row',
    gap: s(8),
  },
  tierPillBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(6),
    borderWidth: 1,
    gap: s(4),
  },
  tierPillDot: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(2.5),
  },
  tierPillLabel: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(6),
    letterSpacing: 0.5,
  },
  tierPillCount: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(9),
  },

  // Status Stats Card
  statusStatsCard: {
    borderRadius: ms(14),
    overflow: 'hidden',
    marginBottom: vs(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statusStatsContent: {
    flexDirection: 'row',
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statusStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    flex: 1,
    justifyContent: 'center',
    paddingVertical: vs(6),
    paddingHorizontal: s(8),
    borderRadius: ms(10),
    position: 'relative',
  },
  statusStatClickable: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusStatItemActiveExpired: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  statusStatItemActiveTrial: {
    borderColor: 'rgba(59, 130, 246, 0.4)',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  statusStatIconBox: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusStatInfo: {
    alignItems: 'flex-start',
  },
  statusStatCount: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(14),
  },
  statusStatLabel: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(6),
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
  statusStatDivider: {
    width: 1,
    height: vs(30),
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: s(8),
  },
  activeFilterDot: {
    position: 'absolute',
    top: vs(4),
    right: s(6),
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: '#EF4444',
  },

  // Search Bar
  searchContainer: {
    borderRadius: ms(12),
    overflow: 'hidden',
    marginBottom: vs(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  searchContainerFocused: {
    borderColor: 'rgba(255,255,255,0.15)',
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(13),
    paddingVertical: vs(6),
  },
  searchInput: {
    flex: 1,
    marginLeft: s(10),
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(13),
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  clearButton: {
    width: ms(26),
    height: ms(26),
    borderRadius: ms(13),
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Filter Row
  filterRow: {
    paddingBottom: vs(12),
    gap: s(8),
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(16),
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: s(5),
  },
  filterChipActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  filterChipDot: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(2.5),
  },
  filterChipText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(8),
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  sectionTitle: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(11),
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  countBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
  },
  countText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(11),
    color: '#22C55E',
  },

  // No Results
  noResultsContainer: {
    borderRadius: ms(18),
    overflow: 'hidden',
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  noResultsContent: {
    alignItems: 'center',
    paddingVertical: vs(50),
    paddingHorizontal: s(24),
  },
  noResultsTitle: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(14),
    color: '#FFFFFF',
    marginTop: vs(16),
  },
  noResultsText: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(11),
    color: 'rgba(255,255,255,0.4)',
    marginTop: vs(6),
    textAlign: 'center',
  },
  clearFiltersBtn: {
    marginTop: vs(20),
    paddingHorizontal: s(20),
    paddingVertical: vs(10),
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(10),
  },
  clearFiltersText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(10),
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ═══════════════════════════════════════════════════════════════
  // CARD STYLES
  // ═══════════════════════════════════════════════════════════════
  cardWrapper: {
    marginBottom: vs(12),
    borderRadius: ms(16),
    overflow: 'hidden',
    backgroundColor: '#000000',
    borderWidth: 1,
    position: 'relative',
  },
  cardBgIconContainer: {
    position: 'absolute',
    top: -ms(5),
    right: -ms(10),
    opacity: 0.8,
  },
  cardContent: {
    paddingLeft: ms(14),
    paddingRight: ms(12),
    paddingVertical: ms(12),
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // ✅ Avatar - static, dynamic via inline
  avatarContainer: {
    position: 'relative',
    marginRight: s(12),
    borderWidth: scale(2),
    borderRadius: ms(27),
  },
  avatar: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(14),
    color: '#FFFFFF',
  },
  liveIndicator: {
    position: 'absolute',
    bottom: ms(0),
    right: ms(0),
    width: ms(14),
    height: ms(14),
    borderRadius: ms(7),
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  liveIndicatorInner: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: '#22C55E',
  },

  infoContainer: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
    gap: s(6),
    flexWrap: 'wrap',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(5),
    borderWidth: 1,
    gap: s(4),
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(5),
    borderWidth: 1,
    gap: s(3),
  },
  statusBadgeText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(6),
    letterSpacing: 0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(5),
    gap: s(3),
  },
  liveBadgeDot: {
    width: ms(4),
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: '#22C55E',
  },
  liveBadgeText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(5),
    color: '#22C55E',
    letterSpacing: 0.5,
  },
  memberName: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(11),
    color: '#FFFFFF',
    marginBottom: vs(4),
  },
  workoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
    marginBottom: vs(5),
    gap: s(4),
  },
  workoutBadgeText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(6),
    letterSpacing: 0.5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
  },
  timeText: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(8),
    color: '#FFFFFF',
  },
  timeDot: {
    width: ms(3),
    height: ms(3),
    borderRadius: ms(1.5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: s(6),
  },

  divider: {
    height: 1,
    marginVertical: vs(10),
  },

  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  phoneIconBox: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(8),
  },
  phoneInfo: {
    flex: 1,
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
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: s(6),
  },
  actionButton: {
    borderRadius: ms(10),
    overflow: 'hidden',
  },
  actionButtonGradient: {
    width: ms(36),
    height: ms(36),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  bottomSpacer: {
    height: vs(30),
  },
});

export default AdminLiveRosterScreen;