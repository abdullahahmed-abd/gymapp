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
  ViewIcon,
  WhatsappIcon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';

import Header from '../../components/shared/Header';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

// Responsive helpers
const s = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

// Platform specific blur
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

// ═══════════════════════════════════════════════════════════════
// DUMMY DATA - 15 LIVE MEMBERS
// ═══════════════════════════════════════════════════════════════
const liveMembers = [
  {
    id: '1',
    name: 'Arjun Sharma',
    membershipType: 'ELITE TIER',
    duration: '45 min',
    checkinTime: '6:30 AM',
    avatar: 'AS',
    memberId: 'GYM001',
    phone: '+919876543210',
  },
  {
    id: '2',
    name: 'Priya Patel',
    membershipType: 'PRO TIER',
    duration: '32 min',
    checkinTime: '6:45 AM',
    avatar: 'PP',
    memberId: 'GYM002',
    phone: '+919876543211',
  },
  {
    id: '3',
    name: 'Rahul Verma',
    membershipType: 'VIP TIER',
    duration: '58 min',
    checkinTime: '6:15 AM',
    avatar: 'RV',
    memberId: 'GYM003',
    phone: '+919876543212',
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    membershipType: 'ELITE TIER',
    duration: '40 min',
    checkinTime: '6:50 AM',
    avatar: 'SG',
    memberId: 'GYM004',
    phone: '+919876543213',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    membershipType: 'PRO TIER',
    duration: '25 min',
    checkinTime: '7:00 AM',
    avatar: 'VS',
    memberId: 'GYM005',
    phone: '+919876543214',
  },
  {
    id: '6',
    name: 'Ananya Reddy',
    membershipType: 'BASIC TIER',
    duration: '50 min',
    checkinTime: '6:20 AM',
    avatar: 'AR',
    memberId: 'GYM006',
    phone: '+919876543215',
  },
  {
    id: '7',
    name: 'Karan Malhotra',
    membershipType: 'VIP TIER',
    duration: '35 min',
    checkinTime: '6:40 AM',
    avatar: 'KM',
    memberId: 'GYM007',
    phone: '+919876543216',
  },
  {
    id: '8',
    name: 'Meera Iyer',
    membershipType: 'ELITE TIER',
    duration: '55 min',
    checkinTime: '6:10 AM',
    avatar: 'MI',
    memberId: 'GYM008',
    phone: '+919876543217',
  },
  {
    id: '9',
    name: 'Aditya Kumar',
    membershipType: 'PRO TIER',
    duration: '28 min',
    checkinTime: '6:55 AM',
    avatar: 'AK',
    memberId: 'GYM009',
    phone: '+919876543218',
  },
  {
    id: '10',
    name: 'Riya Chopra',
    membershipType: 'BASIC TIER',
    duration: '42 min',
    checkinTime: '6:35 AM',
    avatar: 'RC',
    memberId: 'GYM010',
    phone: '+919876543219',
  },
  {
    id: '11',
    name: 'Rohan Desai',
    membershipType: 'VIP TIER',
    duration: '38 min',
    checkinTime: '6:25 AM',
    avatar: 'RD',
    memberId: 'GYM011',
    phone: '+919876543220',
  },
  {
    id: '12',
    name: 'Nisha Joshi',
    membershipType: 'ELITE TIER',
    duration: '22 min',
    checkinTime: '7:05 AM',
    avatar: 'NJ',
    memberId: 'GYM012',
    phone: '+919876543221',
  },
  {
    id: '13',
    name: 'Amit Thakur',
    membershipType: 'PRO TIER',
    duration: '30 min',
    checkinTime: '6:48 AM',
    avatar: 'AT',
    memberId: 'GYM013',
    phone: '+919876543222',
  },
  {
    id: '14',
    name: 'Pooja Nair',
    membershipType: 'BASIC TIER',
    duration: '15 min',
    checkinTime: '7:10 AM',
    avatar: 'PN',
    memberId: 'GYM014',
    phone: '+919876543223',
  },
  {
    id: '15',
    name: 'Sanjay Mehta',
    membershipType: 'VIP TIER',
    duration: '18 min',
    checkinTime: '7:08 AM',
    avatar: 'SM',
    memberId: 'GYM015',
    phone: '+919876543224',
  },
];

// ═══════════════════════════════════════════════════════════════
// TIER CONFIG
// ═══════════════════════════════════════════════════════════════
const getTierConfig = (tier) => {
  switch (tier) {
    case 'ELITE TIER':
      return {
        color: '#F59E0B',
        lightColor: '#FCD34D',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
      };
    case 'VIP TIER':
      return {
        color: '#A855F7',
        lightColor: '#C084FC',
        bgColor: 'rgba(168, 85, 247, 0.1)',
        borderColor: 'rgba(168, 85, 247, 0.3)',
      };
    case 'PRO TIER':
      return {
        color: '#3B82F6',
        lightColor: '#60A5FA',
        bgColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
      };
    case 'BASIC TIER':
      return {
        color: '#71717A',
        lightColor: '#A1A1AA',
        bgColor: 'rgba(113, 113, 122, 0.1)',
        borderColor: 'rgba(113, 113, 122, 0.3)',
      };
    default:
      return {
        color: '#FFFFFF',
        lightColor: '#E4E4E7',
        bgColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
      };
  }
};

// ═══════════════════════════════════════════════════════════════
// FILTER OPTIONS
// ═══════════════════════════════════════════════════════════════
const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Elite', value: 'ELITE TIER' },
  { label: 'VIP', value: 'VIP TIER' },
  { label: 'Pro', value: 'PRO TIER' },
  { label: 'Basic', value: 'BASIC TIER' },
];

// ═══════════════════════════════════════════════════════════════
// CALCULATE STATS
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// FILTER CHIP COMPONENT
// ═══════════════════════════════════════════════════════════════
const FilterChip = ({ label, value, isActive, onPress }) => {
  const tierConfig = value !== 'all' ? getTierConfig(value) : null;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.filterChip,
        isActive && styles.filterChipActive,
        isActive && tierConfig && { 
          borderColor: tierConfig.color,
          backgroundColor: tierConfig.bgColor,
        },
      ]}
    >
      {tierConfig && (
        <View style={[styles.filterChipDot, { backgroundColor: tierConfig.color }]} />
      )}
      <Text style={[
        styles.filterChipText,
        isActive && styles.filterChipTextActive,
        isActive && tierConfig && { color: tierConfig.color },
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ═══════════════════════════════════════════════════════════════
// LIVE MEMBER CARD COMPONENT - NEW DESIGN
// ═══════════════════════════════════════════════════════════════
const LiveMemberCard = ({ member, onCall, onWhatsApp, onViewProfile }) => {
  const tierConfig = getTierConfig(member.membershipType);
  const blurConfig = getBlurConfig();

  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
  };

  return (
    <TouchableOpacity 
      style={styles.cardWrapper}
      onPress={() => onViewProfile?.(member)}
      activeOpacity={0.9}
    >
      {/* Background */}
      <View style={styles.cardBackground}>
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={blurConfig.blurType}
            blurAmount={blurConfig.blurAmount}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidBlurFallback]} />
        )}
      </View>

      {/* Top Glow Effect */}
      <LinearGradient
        colors={[`${tierConfig.color}20`, 'transparent']}
        style={styles.cardGlow}
      />

      <View style={styles.cardInner}>
        {/* Left Section - Avatar & Status */}
        <View style={styles.leftSection}>
          {/* Avatar */}
          <View style={[styles.avatarOuter, { borderColor: tierConfig.color }]}>
            <LinearGradient
              colors={[tierConfig.color, tierConfig.lightColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{member.avatar}</Text>
            </LinearGradient>
          </View>
          
          {/* Live Dot */}
          <View style={styles.statusDot}>
            <View style={styles.statusDotPulse} />
            <View style={styles.statusDotCore} />
          </View>
        </View>

        {/* Middle Section - Info */}
        <View style={styles.middleSection}>
          {/* Name & Tier */}
          <View style={styles.nameContainer}>
            <Text style={styles.memberName} numberOfLines={1}>
              {member.name}
            </Text>
            <View style={[styles.tierBadge, { backgroundColor: tierConfig.bgColor }]}>
              <Text style={[styles.tierBadgeText, { color: tierConfig.color }]}>
                {member.membershipType.replace(' TIER', '')}
              </Text>
            </View>
          </View>

          {/* ID */}
          <Text style={styles.memberId}>{member.memberId}</Text>

          {/* Time Info */}
          <View style={styles.timeContainer}>
            <View style={styles.timeItem}>
              <HugeiconsIcon
                icon={Login01Icon}
                size={ms(11)}
                color="#22C55E"
              />
              <Text style={styles.timeText}>{member.checkinTime}</Text>
            </View>
            <View style={styles.timeSeparator} />
            <View style={styles.timeItem}>
              <HugeiconsIcon
                icon={Clock01Icon}
                size={ms(11)}
                color="#F59E0B"
              />
              <Text style={styles.timeText}>{member.duration}</Text>
            </View>
          </View>
        </View>

        {/* Right Section - Actions */}
        <View style={styles.rightSection}>
          {/* Call Button */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onCall?.(member.phone)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(34, 197, 94, 0.2)', 'rgba(34, 197, 94, 0.05)']}
              style={styles.actionBtnGradient}
            >
              <HugeiconsIcon
                icon={Call02Icon}
                size={ms(16)}
                color="#22C55E"
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* WhatsApp Button */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onWhatsApp?.(member.phone)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(37, 211, 102, 0.2)', 'rgba(37, 211, 102, 0.05)']}
              style={styles.actionBtnGradient}
            >
              <HugeiconsIcon
                icon={WhatsappIcon}
                size={ms(16)}
                color="#25D366"
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* Arrow */}
          <View style={styles.arrowContainer}>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={ms(14)}
              color="rgba(255,255,255,0.3)"
            />
          </View>
        </View>
      </View>

      {/* Bottom Border Accent */}
      <LinearGradient
        colors={[tierConfig.color, `${tierConfig.color}00`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardBottomAccent}
      />
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
  const blurConfig = getBlurConfig();

  const filteredMembers = liveMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery);
    
    const matchesFilter = activeFilter === 'all' || member.membershipType === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const clearSearch = () => {
    setSearchQuery('');
  };

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
    console.log('View Profile:', member.name);
    // navigation.navigate('MemberProfile', { memberId: member.id });
  };

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
              colors={['rgba(34, 197, 94, 0.15)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            
            <View style={styles.heroContent}>
              {/* Main Stat */}
              <View style={styles.heroMainStat}>
                <View style={styles.heroPulseContainer}>
                  <View style={styles.heroPulseRing} />
                  <View style={styles.heroPulseDot} />
                </View>
                <Text style={styles.heroNumber}>{liveMembers.length}</Text>
                <Text style={styles.heroLabel}>ACTIVE</Text>
              </View>

              {/* Divider */}
              <View style={styles.heroDivider} />

              {/* Right Stats */}
              <View style={styles.heroRightStats}>
                {/* Avg Session */}
                <View style={styles.avgSessionBox}>
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={ms(14)}
                    color="#F59E0B"
                  />
                  <Text style={styles.avgSessionValue}>{getAverageSession()}</Text>
                  <Text style={styles.avgSessionLabel}>AVG</Text>
                </View>

                {/* Tier Pills */}
                <View style={styles.tierPillsContainer}>
                  {[
                    { tier: 'ELITE TIER', color: '#F59E0B' },
                    { tier: 'VIP TIER', color: '#A855F7' },
                    { tier: 'PRO TIER', color: '#3B82F6' },
                    { tier: 'BASIC TIER', color: '#71717A' },
                  ].map((item) => (
                    <View key={item.tier} style={styles.tierPillSmall}>
                      <View style={[styles.tierPillDot, { backgroundColor: item.color }]} />
                      <Text style={styles.tierPillCount}>{getTierCount(item.tier)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View style={[
            styles.searchContainer,
            isSearchFocused && styles.searchContainerFocused
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
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={ms(14)}
                    color="rgba(255,255,255,0.5)"
                  />
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
                onPress={() => setActiveFilter(filter.value)}
              />
            ))}
          </ScrollView>

          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? 'Search Results' : 'Currently Active'}
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{filteredMembers.length}</Text>
            </View>
          </View>

          {/* No Results Message */}
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
                <HugeiconsIcon
                  icon={UserRemove01Icon}
                  size={ms(48)}
                  color="rgba(255,255,255,0.3)"
                />
                <Text style={styles.noResultsTitle}>No Members Found</Text>
                <Text style={styles.noResultsText}>
                  {searchQuery 
                    ? `No active members match "${searchQuery}"`
                    : 'No members in this category'
                  }
                </Text>
                {(searchQuery || activeFilter !== 'all') && (
                  <TouchableOpacity
                    style={styles.clearFiltersBtn}
                    onPress={() => {
                      clearSearch();
                      setActiveFilter('all');
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

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(10),
    paddingBottom: vs(40),
  },
  androidBlurFallback: {
    backgroundColor: 'rgba(15, 15, 20, 0.9)',
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

  // Hero Stats Card
  heroCard: {
    borderRadius: ms(18),
    overflow: 'hidden',
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  heroContent: {
    flexDirection: 'row',
    paddingVertical: vs(18),
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
    fontSize: rf(28),
    color: '#FFFFFF',
  },
  heroLabel: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(8),
    color: '#22C55E',
    letterSpacing: 2,
  },
  heroDivider: {
    width: 1,
    height: vs(60),
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
    fontSize: rf(16),
    color: '#FFFFFF',
  },
  avgSessionLabel: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(8),
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
  tierPillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  tierPillSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  tierPillDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
  },
  tierPillCount: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(10),
    color: '#FFFFFF',
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
    paddingHorizontal: s(14),
    paddingVertical: vs(11),
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
    paddingHorizontal: s(14),
    paddingVertical: vs(7),
    borderRadius: ms(20),
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: s(5),
  },
  filterChipActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  filterChipDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
  },
  filterChipText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(10),
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.8,
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
  // NEW CARD DESIGN
  // ═══════════════════════════════════════════════════════════════
  cardWrapper: {
    marginBottom: vs(10),
    borderRadius: ms(16),
    overflow: 'hidden',
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ms(16),
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ms(60),
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: ms(16),
  },

  // Left Section
  leftSection: {
    position: 'relative',
    marginRight: s(12),
  },
  avatarOuter: {
    width: ms(52),
    height: ms(52),
    borderRadius: ms(26),
    padding: ms(2),
    borderWidth: 2,
  },
  avatar: {
    flex: 1,
    borderRadius: ms(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(14),
    color: '#FFFFFF',
  },
  statusDot: {
    position: 'absolute',
    bottom: ms(-2),
    right: ms(-2),
    width: ms(16),
    height: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDotPulse: {
    position: 'absolute',
    width: ms(16),
    height: ms(16),
    borderRadius: ms(8),
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
  },
  statusDotCore: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#000000',
  },

  // Middle Section
  middleSection: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginBottom: vs(2),
  },
  memberName: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(14),
    color: '#FFFFFF',
    flex: 1,
  },
  tierBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(6),
  },
  tierBadgeText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(8),
    letterSpacing: 0.5,
  },
  memberId: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(8),
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1,
    marginBottom: vs(6),
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  timeText: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(9),
    color: '#FFFFFF',
  },
  timeSeparator: {
    width: ms(3),
    height: ms(3),
    borderRadius: ms(1.5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: s(8),
  },

  // Right Section
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  actionBtn: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(12),
    overflow: 'hidden',
  },
  actionBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(12),
  },
  arrowContainer: {
    width: ms(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBottomAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '40%',
    height: ms(2),
  },

  // Bottom Spacer
  bottomSpacer: {
    height: vs(30),
  },
});

export default AdminLiveRosterScreen;