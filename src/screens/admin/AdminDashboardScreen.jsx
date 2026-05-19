// AdminDashboardScreen.js - TRAINER ADDED VERSION

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ImageBackground, 
  TouchableOpacity, 
  Image,
  Platform 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Header from '../../components/shared/Header';
import GlassCard from '../../components/shared/GlassCard';
import GlassButton from '../../components/shared/GlassButton';
import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import gymlogoimg from "../user/gymlogoimg.png";

import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowRight01Icon,
  UserAdd01Icon,
  Package01Icon,
  PercentIcon,
  UserGroupIcon,
  AlertCircleIcon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  MoneyReceiveCircleIcon,
  Dumbbell01Icon,
} from "@hugeicons/core-free-icons";

// ═══════════════════════════════════════════════════════════════
// LIVE ROSTER DATA
// ═══════════════════════════════════════════════════════════════
const LIVE_ROSTER_STATS = {
  totalLive: 15,
  avgSession: '38m',
  eliteCount: 9,
  legendaryCount: 6,
  activeCount: 8,
  expiredCount: 4,
  trialCount: 3,
  trainerCount: 2,
};

// ═══════════════════════════════════════════════════════════════
// ALL MEMBERS STATS
// ═══════════════════════════════════════════════════════════════
const ALL_MEMBERS_STATS = {
  totalMembers: 128,
  trialCount: 18,
  expiredCount: 20,
  eliteCount: 65,
  legendaryCount: 43,
  trainerCount: 8,
};

// ═══════════════════════════════════════════════════════════════
// TIER COLORS
// ═══════════════════════════════════════════════════════════════
const TIER_COLORS = {
  ELITE: '#EAB308',
  LEGENDARY: '#a855f7',
  TRAINER: '#22D3EE',
};

const AdminDashboardScreen = ({ navigation }) => {
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
        <SafeAreaView style={styles.safeArea} edges={['']}>
          <Header />
          
          <ScrollView 
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeLabel}>Administrator</Text>
              <Text style={styles.welcomeName}>CONTROL PANEL</Text>
            </View>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ALL MEMBERS STATS CARD */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <LinearGradient
              colors={['rgba(113, 113, 122, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000']}
              style={styles.statsGradient}
            >
              <GlassCard style={styles.liveStatsCard}>
                <View style={styles.liveStatsHeader}>
                  <View>
                    <View style={styles.liveBadge}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveBadgeText}>Overview</Text>
                    </View>
                    <Text style={styles.liveStatsTitle}>MEMBERS</Text>
                  </View>
                  <View style={styles.liveCountContainer}>
                    <Text style={styles.liveCount}>{ALL_MEMBERS_STATS.totalMembers}</Text>
                    <Text style={styles.liveCountLabel}>Total</Text>
                  </View>
                  <View style={styles.allmemberLogo}>
                    <Image
                      source={gymlogoimg}
                      style={styles.allmemberLogoimg}
                    />
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Row 1: Trial, Expired, Elite, Legendary */}
                <View style={styles.statsRow}>
                  {/* Trial */}
                  <View style={styles.statItem}>
                    <View style={[styles.statIconWrapper, styles.trialIconWrapper]}>
                      <View style={styles.trialDot} />
                    </View>
                    <View>
                      <Text style={[styles.statItemValue, styles.trialValue]}>
                        {ALL_MEMBERS_STATS.trialCount}
                      </Text>
                      <Text style={styles.statItemLabel}>Trial</Text>
                    </View>
                  </View>

                  <View style={styles.statDivider} />

                  {/* Expired */}
                  <View style={styles.statItem}>
                    <View style={[styles.statIconWrapper, styles.expiredIconWrapper]}>
                      <HugeiconsIcon
                        icon={AlertCircleIcon}
                        size={moderateScale(14)}
                        color="#EF4444"
                      />
                    </View>
                    <View>
                      <Text style={[styles.statItemValue, styles.expiredValue]}>
                        {ALL_MEMBERS_STATS.expiredCount}
                      </Text>
                      <Text style={[styles.statItemLabel, styles.expiredLabel]}>Expired</Text>
                    </View>
                  </View>

                  <View style={styles.statDivider} />

                  {/* Elite */}
                  <View style={styles.statItem}>
                    <View style={[styles.statIconWrapper, styles.eliteIconWrapper]}>
                      <View style={styles.eliteDot} />
                    </View>
                    <View>
                      <Text style={[styles.statItemValue, styles.eliteValue]}>
                        {ALL_MEMBERS_STATS.eliteCount}
                      </Text>
                      <Text style={styles.statItemLabel}>Elite</Text>
                    </View>
                  </View>

                  <View style={styles.statDivider} />

                  {/* Legendary */}
                  <View style={styles.statItem}>
                    <View style={[styles.statIconWrapper, styles.legendaryIconWrapper]}>
                      <View style={styles.legendaryDot} />
                    </View>
                    <View>
                      <Text style={[styles.statItemValue, styles.legendaryValue]}>
                        {ALL_MEMBERS_STATS.legendaryCount}
                      </Text>
                      <Text style={styles.statItemLabel}>Legendary</Text>
                    </View>
                  </View>
                </View>

                {/* Trainer Row */}
                <View style={styles.trainerRowDivider} />

                <View style={styles.trainerStatRow}>
                  <View style={styles.trainerStatLeft}>
                    <View style={styles.trainerIconWrapper}>
                      <HugeiconsIcon
                        icon={Dumbbell01Icon}
                        size={moderateScale(13)}
                        color={TIER_COLORS.TRAINER}
                      />
                    </View>
                    <View>
                      <Text style={styles.trainerStatLabel}>Trainers</Text>
                      <Text style={styles.trainerStatSub}>On Roster</Text>
                    </View>
                  </View>

                  <View style={styles.trainerStatRight}>
                    <Text style={styles.trainerStatCount}>
                      {ALL_MEMBERS_STATS.trainerCount}
                    </Text>
                    <View style={styles.trainerActivePill}>
                      <View style={styles.trainerActiveDot} />
                      <Text style={styles.trainerActivePillText}>Active</Text>
                    </View>
                  </View>
                </View>

              </GlassCard>
            </LinearGradient>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* LIVE ROSTER HERO CARD */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('AdminLiveRoster')}
            >
              <View style={styles.liveRosterHeroCard}>
                {/* Background Icon */}
                <View style={styles.heroBgIcon}>
                  <HugeiconsIcon
                    icon={UserGroupIcon}
                    size={moderateScale(70)}
                    color="rgba(34, 197, 94, 0.08)"
                    strokeWidth={0.5}
                  />
                </View>

                <View style={styles.heroContent}>
                  {/* Main Stats Row */}
                  <View style={styles.heroMainRow}>
                    {/* Left - Live Count */}
                    <View style={styles.heroLiveSection}>
                      <View style={styles.heroPulseContainer}>
                        <View style={styles.heroPulseRing} />
                        <View style={styles.heroPulseDot} />
                      </View>
                      <View style={styles.heroLiveInfo}>
                        <Text style={styles.heroLiveCount}>{LIVE_ROSTER_STATS.totalLive}</Text>
                        <Text style={styles.heroLiveLabel}>Live Members</Text>
                      </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.heroVerticalDivider} />

                    {/* Right - Stats */}
                    <View style={styles.heroRightSection}>
                      {/* Avg Session */}
                      <View style={styles.heroAvgBox}>
                        <HugeiconsIcon icon={Clock01Icon} size={moderateScale(14)} color="#EAB308" />
                        <Text style={styles.heroAvgValue}>{LIVE_ROSTER_STATS.avgSession}</Text>
                        <Text style={styles.heroAvgLabel}>AVG</Text>
                      </View>

                      {/* Tier Pills */}
                      <View style={styles.heroTierRow}>
                        <View style={styles.heroTierPill}>
                          <View style={[styles.heroTierDot, { backgroundColor: TIER_COLORS.ELITE }]} />
                          <Text style={[styles.heroTierCount, { color: Colors.zinc[500] }]}>
                            {LIVE_ROSTER_STATS.eliteCount}
                          </Text>
                        </View>
                        <View style={styles.heroTierPill}>
                          <View style={[styles.heroTierDot, { backgroundColor: TIER_COLORS.LEGENDARY }]} />
                          <Text style={[styles.heroTierCount, { color: Colors.zinc[500] }]}>
                            {LIVE_ROSTER_STATS.legendaryCount}
                          </Text>
                        </View>
                        <View style={styles.heroTierPill}>
                          <View style={[styles.heroTierDot, { backgroundColor: TIER_COLORS.TRAINER }]} />
                          <Text style={[styles.heroTierCount, { color: Colors.zinc[500] }]}>
                            {LIVE_ROSTER_STATS.trainerCount}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={styles.heroDivider} />

                  {/* Status Row */}
                  <View style={styles.heroStatusRow}>
                    <View style={styles.heroStatusItem}>
                      <View style={[styles.heroStatusDot, { backgroundColor: '#22C55E' }]} />
                      <Text style={styles.heroStatusLabel}>Active</Text>
                      <Text style={[styles.heroStatusCount, { color: Colors.zinc[100] }]}>
                        {LIVE_ROSTER_STATS.activeCount}
                      </Text>
                    </View>

                    <View style={styles.heroStatusDivider} />

                    <View style={styles.heroStatusItem}>
                      <View style={[styles.heroStatusDot, { backgroundColor: '#EF4444' }]} />
                      <Text style={styles.heroStatusLabel}>Expired</Text>
                      <Text style={[styles.heroStatusCount, { color: Colors.zinc[100] }]}>
                        {LIVE_ROSTER_STATS.expiredCount}
                      </Text>
                    </View>

                    <View style={styles.heroStatusDivider} />

                    <View style={styles.heroStatusItem}>
                      <View style={[styles.heroStatusDot, { backgroundColor: '#3B82F6' }]} />
                      <Text style={styles.heroStatusLabel}>Trial</Text>
                      <Text style={[styles.heroStatusCount, { color: Colors.zinc[100] }]}>
                        {LIVE_ROSTER_STATS.trialCount}
                      </Text>
                    </View>

                    <View style={styles.heroStatusDivider} />

                    <View style={styles.heroStatusItem}>
                      <View style={[styles.heroStatusDot, { backgroundColor: TIER_COLORS.TRAINER }]} />
                      <Text style={styles.heroStatusLabel}>Trainer</Text>
                      <Text style={[styles.heroStatusCount, { color: Colors.zinc[100] }]}>
                        {LIVE_ROSTER_STATS.trainerCount}
                      </Text>
                    </View>
                  </View>

                  {/* View All Button */}
                  <View style={styles.heroViewAllRow}>
                    <View style={styles.heroViewAllContent}>
                      <HugeiconsIcon icon={UserGroupIcon} size={moderateScale(14)} color="#22C55E" />
                      <Text style={styles.heroViewAllText}>View All Live Members</Text>
                    </View>
                    <View style={styles.heroViewAllArrow}>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={moderateScale(14)}
                        color="rgba(255,255,255,0.5)"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* REVENUE CARD */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <GlassCard>
              <View style={styles.revenueHeader}>
                <View style={styles.revenueTitle}>
                  <HugeiconsIcon
                    icon={MoneyReceiveCircleIcon}
                    size={moderateScale(16)}
                    color={Colors.gold}
                  />
                  <Text style={styles.revenueTitleText}>Today's Revenue</Text>
                </View>
                <View style={styles.cardLogoContainer}>
                  <Image
                    source={gymlogoimg}
                    style={styles.cardLogo}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <Text style={styles.revenueLabel}>Total Collection</Text>
            
              <View style={styles.revenueStats}>
                <Text style={styles.revenueNumber}>₹45,200</Text>
                <View style={styles.trendBadge}>
                  <Text style={styles.trendText}>+12%</Text>
                </View>
              </View>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '75%' }]} />
              </View>

              <View style={styles.revenueBreakdown}>
                <View style={styles.breakdownDivider} />
                <View style={styles.breakdownContent}>
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownValue}>₹32K</Text>
                    <Text style={styles.breakdownLabel}>Memberships</Text>
                  </View>
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownValue}>₹8K</Text>
                    <Text style={styles.breakdownLabel}>Renewals</Text>
                  </View>
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownValue}>₹5K</Text>
                    <Text style={styles.breakdownLabel}>Others</Text>
                  </View>
                </View>
              </View>
            </GlassCard>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* COMMAND CENTER - UPDATED WITH TRAINERS BUTTON */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Command Center</Text>
              <View style={styles.commandGrid}>

                {/* New Plan */}
                <TouchableOpacity 
                  style={styles.commandCard}
                  onPress={() => navigation.navigate('AdminAddPlan')}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
                    style={styles.commandCardGradient}
                  >
                    <View style={styles.commandIconWrapper}>
                      <HugeiconsIcon
                        icon={Package01Icon}
                        size={moderateScale(22)}
                        color={Colors.white}
                      />
                    </View>
                    <Text style={styles.commandLabel}>New Plan</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* ✅ TRAINERS BUTTON - Replaces Offers */}
                <TouchableOpacity
                  style={styles.commandCard}
                  onPress={() => navigation.navigate('AdminTrainers')}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(34,211,238,0.12)', 'rgba(34,211,238,0.03)']}
                    style={styles.commandCardGradient}
                  >
                    <View style={[
                      styles.commandIconWrapper,
                      { backgroundColor: 'rgba(34,211,238,0.15)' }
                    ]}>
                      <HugeiconsIcon
                        icon={Dumbbell01Icon}
                        size={moderateScale(22)}
                        color={TIER_COLORS.TRAINER}
                      />
                    </View>
                    <Text style={[styles.commandLabel, { color: TIER_COLORS.TRAINER }]}>
                      Trainers
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Add User */}
                <TouchableOpacity
                  style={styles.commandCard}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
                    style={styles.commandCardGradient}
                  >
                    <View style={styles.commandIconWrapper}>
                      <HugeiconsIcon
                        icon={UserAdd01Icon}
                        size={moderateScale(22)}
                        color={Colors.white}
                      />
                    </View>
                    <Text style={styles.commandLabel}>Add User</Text>
                  </LinearGradient>
                </TouchableOpacity>

              </View>
            </View>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* QUICK ACTIONS */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <View style={styles.actionButtons}>
              <GlassButton variant="glass" style={styles.actionButton}>
                <View style={styles.actionButtonContent}>
                  <View style={styles.actionIcon}>
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={moderateScale(20)}
                      color={Colors.white}
                    />
                  </View>
                  <Text style={styles.actionButtonText}>Manual Check-In</Text>
                </View>
              </GlassButton>

              <GlassButton variant="outline" style={styles.actionButton}>
                <View style={styles.actionButtonContent}>
                  <View style={[styles.actionIcon, styles.actionIconInactive]}>
                    <HugeiconsIcon
                      icon={AlertCircleIcon}
                      size={moderateScale(20)}
                      color={Colors.zinc[500]}
                    />
                  </View>
                  <Text style={[styles.actionButtonText, styles.actionButtonTextInactive]}>
                    View Alerts
                  </Text>
                </View>
              </GlassButton>
            </View>

          </ScrollView>

          <BottomNav
            activeTab="dashboard"
            onTabChange={(tab) => {
              if (tab === 'dashboard') navigation.navigate('AdminDashboard');
              if (tab === 'plans') navigation.navigate('AdminPlans');
              if (tab === 'members') navigation.navigate('AdminUsersDetail');
              if (tab === 'settings') navigation.navigate('AdminSettings');
            }}
            userType="admin"
          />
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: scale(24),
    gap: verticalScale(16),
    paddingBottom: verticalScale(100),
  },

  // Welcome
  welcomeSection: { marginBottom: verticalScale(0) },
  welcomeLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[400],
    letterSpacing: scale(2),
    textTransform: 'uppercase',
    marginBottom: verticalScale(4),
    fontWeight: '600',
  },
  welcomeName: {
    fontFamily: Fonts.orbitron.extraBold,
    fontSize: RFValue(18),
    color: Colors.white,
    letterSpacing: scale(3.6),
  },

  // Members Stats Card
  statsGradient: {
    borderRadius: moderateScale(16),
    padding: scale(1),
  },
  liveStatsCard: {
    position: 'relative',
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  liveStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(20),
    zIndex: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginBottom: verticalScale(4),
  },
  liveDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: Colors.gold,
  },
  liveBadgeText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(7),
    color: Colors.gold,
    letterSpacing: scale(1.8),
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  liveStatsTitle: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(15),
    color: Colors.white,
    letterSpacing: scale(4),
  },
  liveCountContainer: {
    alignItems: 'flex-end',
    zIndex: 1,
  },
  liveCount: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: RFValue(26),
    color: Colors.white,
    lineHeight: RFValue(36),
  },
  liveCountLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(9),
    color: Colors.zinc[500],
    letterSpacing: scale(1.8),
    textTransform: 'uppercase',
  },
  divider: {
    height: verticalScale(1),
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: verticalScale(16),
    zIndex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  statIconWrapper: {
    width: moderateScale(15),
    height: moderateScale(15),
    borderRadius: moderateScale(14),
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trialIconWrapper: { backgroundColor: 'rgba(59,130,246,0.15)' },
  trialDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
    backgroundColor: '#3B82F6',
  },
  trialValue: { color: Colors.zinc[100] },
  expiredIconWrapper: { backgroundColor: 'rgba(239,68,68,0.1)' },
  expiredValue: { color: Colors.zinc[100] },
  expiredLabel: { color: Colors.zinc[500] },
  eliteIconWrapper: { backgroundColor: 'rgba(234,179,8,0.15)' },
  eliteDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
    backgroundColor: '#EAB308',
  },
  eliteValue: { color: Colors.zinc[100] },
  legendaryIconWrapper: { backgroundColor: 'rgba(168,85,247,0.15)' },
  legendaryDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
    backgroundColor: '#a855f7',
  },
  legendaryValue: { color: Colors.zinc[100] },
  statItemValue: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(11),
    color: Colors.white,
  },
  statItemLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(6),
    color: Colors.zinc[500],
    textTransform: 'uppercase',
  },
  statDivider: {
    width: scale(1),
    height: verticalScale(30),
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: scale(4),
  },

  // Trainer Row in Members Card
  trainerRowDivider: {
    height: verticalScale(1),
    backgroundColor: 'rgba(34,211,238,0.12)',
    marginTop: verticalScale(14),
    marginBottom: verticalScale(12),
  },
  trainerStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(34,211,238,0.05)',
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.12)',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
  },
  trainerStatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  trainerIconWrapper: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(8),
    backgroundColor: 'rgba(34,211,238,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainerStatLabel: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(9),
    color: TIER_COLORS.TRAINER,
    letterSpacing: scale(1.2),
    textTransform: 'uppercase',
  },
  trainerStatSub: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(6.5),
    color: Colors.zinc[600],
    letterSpacing: scale(0.8),
    textTransform: 'uppercase',
  },
  trainerStatRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  trainerStatCount: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(18),
    color: TIER_COLORS.TRAINER,
  },
  trainerActivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: 'rgba(34,211,238,0.10)',
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.2)',
    paddingHorizontal: scale(7),
    paddingVertical: verticalScale(3),
  },
  trainerActiveDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
    backgroundColor: TIER_COLORS.TRAINER,
  },
  trainerActivePillText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(7),
    color: TIER_COLORS.TRAINER,
    letterSpacing: scale(0.8),
    textTransform: 'uppercase',
  },

  // Live Roster Hero Card
  liveRosterHeroCard: {
    backgroundColor: 'black',
    borderRadius: moderateScale(18),
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
    overflow: 'hidden',
    position: 'relative',
  },
  heroBgIcon: {
    position: 'absolute',
    top: -moderateScale(5),
    right: -moderateScale(15),
    opacity: 1,
  },
  heroContent: { padding: moderateScale(14) },
  heroMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroLiveSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  heroPulseContainer: {
    width: moderateScale(24),
    height: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPulseRing: {
    position: 'absolute',
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  heroPulseDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(2.5),
    backgroundColor: 'rgba(34,197,94,0.45)',
  },
  heroLiveInfo: { alignItems: 'flex-start' },
  heroLiveCount: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(24),
    color: '#FFFFFF',
    lineHeight: RFValue(28),
  },
  heroLiveLabel: {
    fontFamily: Fonts.rajdhani.bold,
    fontSize: RFValue(8),
    color: Colors.zinc[500],
    letterSpacing: scale(1),
    fontWeight: '500',
  },
  heroVerticalDivider: {
    width: 1,
    height: verticalScale(40),
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: scale(14),
  },
  heroRightSection: { flex: 1 },
  heroAvgBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    marginBottom: verticalScale(6),
  },
  heroAvgValue: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(14),
    color: '#FFFFFF',
  },
  heroAvgLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(7),
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: scale(0.8),
  },
  heroTierRow: {
    flexDirection: 'row',
    gap: scale(6),
  },
  heroTierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: scale(4),
  },
  heroTierDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
  },
  heroTierCount: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(10),
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: verticalScale(10),
  },

  // Status Row
  heroStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: verticalScale(10),
  },
  heroStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  heroStatusDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
  },
  heroStatusLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(7.5),
    color: 'rgba(255,255,255,0.5)',
  },
  heroStatusCount: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(9),
  },
  heroStatusDivider: {
    width: 1,
    height: verticalScale(16),
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // View All
  heroViewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'black',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
  },
  heroViewAllContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  heroViewAllText: {
    fontFamily: Fonts.rajdhani.bold,
    fontSize: RFValue(9),
    color: '#FFFFFF',
    letterSpacing: scale(0.8),
    textTransform: 'uppercase',
  },
  heroViewAllArrow: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Revenue Card
  cardLogoContainer: {
    position: 'absolute',
    top: scale(27),
    right: 0,
    bottom: 0,
    left: scale(230),
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: scale(10),
  },
  cardLogo: {
    width: moderateScale(120),
    height: moderateScale(120),
  },
  allmemberLogo: {
    position: 'absolute',
    top: scale(70),
    right: 0,
    bottom: 0,
    left: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: scale(10),
  },
  allmemberLogoimg: {
    width: moderateScale(300),
    height: moderateScale(150),
    opacity: 0.40,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  revenueTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  revenueTitleText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.white,
    letterSpacing: scale(2.4),
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  trendBadge: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(4),
    borderWidth: scale(1),
    borderColor: 'rgba(34,197,94,0.2)',
    marginLeft: moderateScale(45),
  },
  trendText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(9),
    color: Colors.green,
  },
  revenueStats: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: scale(12),
    marginBottom: verticalScale(8),
  },
  revenueNumber: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: RFValue(32),
    color: Colors.gold,
    lineHeight: RFValue(36),
  },
  revenueLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(10),
    color: Colors.zinc[500],
    letterSpacing: scale(2),
    textTransform: 'uppercase',
    paddingBottom: verticalScale(0),
  },
  progressBar: {
    height: verticalScale(4),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: moderateScale(2),
    overflow: 'hidden',
    marginTop: verticalScale(16),
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.gold,
  },
  revenueBreakdown: { marginTop: verticalScale(16) },
  breakdownDivider: {
    height: verticalScale(1),
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: verticalScale(16),
  },
  breakdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    alignItems: 'center',
    gap: verticalScale(4),
  },
  breakdownValue: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(12),
    color: Colors.white,
  },
  breakdownLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(7),
    color: Colors.zinc[500],
    letterSpacing: scale(1),
    textTransform: 'uppercase',
  },

  // Command Center
  section: { gap: verticalScale(12) },
  sectionTitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.white,
    letterSpacing: scale(2),
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  commandGrid: {
    flexDirection: 'row',
    gap: scale(12),
  },
  commandCard: {
    flex: 1,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  commandCardGradient: {
    padding: moderateScale(16),
    alignItems: 'center',
    gap: verticalScale(10),
    borderRadius: moderateScale(12),
    borderWidth: scale(1),
    borderColor: 'rgba(255,255,255,0.1)',
  },
  commandIconWrapper: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commandLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[300],
    letterSpacing: scale(1.8),
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: scale(16),
  },
  actionButton: {
    flex: 1,
    paddingVertical: verticalScale(24),
  },
  actionButtonContent: {
    alignItems: 'center',
    gap: verticalScale(8),
  },
  actionIcon: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    borderWidth: scale(1),
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconInactive: {
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionButtonText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(8),
    color: Colors.white,
    letterSpacing: scale(1.8),
    textTransform: 'uppercase',
  },
  actionButtonTextInactive: {
    color: Colors.zinc[500],
  },
});

export default AdminDashboardScreen;