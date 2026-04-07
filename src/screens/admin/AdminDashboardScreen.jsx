import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Image } from 'react-native';
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
import { HugeiconsIcon } from "@hugeicons/react-native";
import gymlogoimg from "../user/gymlogoimg.png";
import {
  ArrowRight01Icon,
  UserAdd01Icon,
  Search01Icon,
  ChartBarLineIcon,
  Package01Icon,
  PercentIcon,
  UserGroupIcon,
  AlertCircleIcon,
  Activity01Icon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  Logout01Icon,
  MoneyReceiveCircleIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
const AdminDashboardScreen = ({ navigation }) => {
  const roster = [
    { name: "ALEX CHEN", status: "Active", time: "08:42 AM", alert: false },
    { name: "SARAH JENNINGS", status: "Active", time: "09:15 AM", alert: false },
    { name: "DAVID MILLER", status: "Expired", time: "10:05 AM", alert: true }
  ];

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={styles.background}
      blurRadius={20}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.85)', '#000000']}
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

            {/* Live Stats Card */}
            <LinearGradient
              colors={['rgba(113, 113, 122, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000']}
              style={styles.statsGradient}
            >
              <GlassCard style={styles.liveStatsCard}>
                <View style={styles.liveStatsHeader}>
                  <View>
                    <View style={styles.liveBadge}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveBadgeText}>Live Now</Text>
                    </View>
                    <Text style={styles.liveStatsTitle}>GYM TRAFFIC</Text>
                  </View>
                  <View style={styles.liveCountContainer}>
                    <Text style={styles.liveCount}>128</Text>
                    <Text style={styles.liveCountLabel}>Members</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Stats Row */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <View style={styles.statIconWrapper}>
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={moderateScale(14)}
                        color={Colors.green}
                      />
                    </View>
                    <View>
                      <Text style={styles.statItemValue}>24</Text>
                      <Text style={styles.statItemLabel}>Check-ins</Text>
                    </View>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <View style={styles.statIconWrapper}>
                      <HugeiconsIcon
                        icon={Logout01Icon}
                        size={moderateScale(14)}
                        color={Colors.zinc[400]}
                      />
                    </View>
                    <View>
                      <Text style={styles.statItemValue}>12</Text>
                      <Text style={styles.statItemLabel}>Check-outs</Text>
                    </View>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <View style={[styles.statIconWrapper, styles.alertIconWrapper]}>
                      <HugeiconsIcon
                        icon={AlertCircleIcon}
                        size={moderateScale(14)}
                        color="#ef4444"
                      />
                    </View>
                    <View>
                      <Text style={[styles.statItemValue, styles.alertValue]}>03</Text>
                      <Text style={styles.statItemLabel}>Alerts</Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            </LinearGradient>

            {/* Revenue Card */}
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

              {/* Revenue Breakdown */}
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

            {/* Command Center */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Command Center</Text>
              <View style={styles.commandGrid}>
                <TouchableOpacity 
                  style={styles.commandCard}
                  onPress={() => navigation.navigate('AdminAddPlan')}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
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

                <TouchableOpacity 
                  style={styles.commandCard}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
                    style={styles.commandCardGradient}
                  >
                    <View style={styles.commandIconWrapper}>
                      <HugeiconsIcon
                        icon={PercentIcon}
                        size={moderateScale(22)}
                        color={Colors.white}
                      />
                    </View>
                    <Text style={styles.commandLabel}>Offers</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.commandCard}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
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

            {/* Live Roster */}
            <GlassCard>
              <View style={styles.rosterHeader}>
                <View style={styles.rosterTitleSection}>
                  <HugeiconsIcon
                    icon={UserGroupIcon}
                    size={moderateScale(16)}
                    color={Colors.zinc[400]}
                  />
                  <Text style={styles.rosterTitle}>Live Roster</Text>
                </View>
                <View style={styles.rosterActions}>
                  <TouchableOpacity style={styles.rosterActionButton}>
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={moderateScale(14)}
                      color={Colors.zinc[500]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rosterActionButton}>
                    <HugeiconsIcon
                      icon={ChartBarLineIcon}
                      size={moderateScale(14)}
                      color={Colors.zinc[500]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.rosterList}>
                {roster.map((member, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={[
                      styles.rosterCard,
                      member.alert && styles.rosterCardAlert,
                      index !== roster.length - 1 && styles.rosterCardBorder
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.rosterAvatar}>
                      <HugeiconsIcon
                        icon={UserIcon}
                        size={moderateScale(16)}
                        color={member.alert ? '#fca5a5' : Colors.zinc[400]}
                      />
                    </View>
                    <View style={styles.rosterInfo}>
                      <Text style={styles.rosterName}>{member.name}</Text>
                      <View style={styles.rosterMeta}>
                        <View style={styles.statusContainer}>
                          <View style={[
                            styles.statusDot,
                            member.alert ? styles.statusDotAlert : styles.statusDotActive
                          ]} />
                          <Text style={[
                            styles.rosterStatus,
                            member.alert && styles.rosterStatusAlert
                          ]}>
                            {member.status}
                          </Text>
                        </View>
                        <Text style={styles.rosterTime}>In: {member.time}</Text>
                      </View>
                    </View>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={moderateScale(16)}
                      color={Colors.zinc[600]}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* View All Live Roster Button - FIXED */}
              <View style={styles.rosterFooter}>
                <TouchableOpacity
                  style={styles.viewLiveButton}
                  onPress={() => navigation.navigate('AdminLiveRoster')}
                  activeOpacity={0.8}
                >
                  <View style={styles.viewLiveContent}>
                    <HugeiconsIcon
                      icon={UserGroupIcon}
                      size={moderateScale(16)}
                      color={Colors.green}
                    />
                    <Text style={styles.viewLiveText}>View All Live Roster</Text>
                    <View style={styles.liveCountBadge}>
                      <View style={styles.liveCountDot} />
                      <Text style={styles.liveCountBadgeText}>15</Text>
                    </View>
                  </View>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={moderateScale(16)}
                    color={Colors.zinc[500]}
                  />
                </TouchableOpacity>
              </View>
            </GlassCard>

            {/* Quick Actions */}
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
          if (tab === 'membership') navigation.navigate('AdminMembership');
          if (tab === 'profile') navigation.navigate('AdminProfile');
          if (tab === 'usersdetail') navigation.navigate('AdminUsersDetail'); // ✅ Ye add karo
        }} 
      />

        </SafeAreaView>
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
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    gap: verticalScale(16),
    paddingBottom: verticalScale(100),
  },

  // Welcome Section
  welcomeSection: {
    marginBottom: verticalScale(0),
  },
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

  // Live Stats Card
  statsGradient: {
    borderRadius: moderateScale(16),
    padding: scale(1),
  },
  liveStatsCard: {
    position: 'relative',
    borderWidth: 0,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  cardLogoContainer: {
    position: 'absolute',
    top: scale(27),
    right: 0,
    bottom: 0,
    left: scale(230),
    justifyContent: 'center',
    alignItems: "center",
    paddingRight: scale(10),
  },
  cardLogo: {
    width: moderateScale(120),
    height: moderateScale(120),
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
    backgroundColor: Colors.green,
  },
  liveBadgeText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(7),
    color: Colors.green,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    gap: scale(8),
  },
  statIconWrapper: {
    width: moderateScale(21),
    height: moderateScale(21),
    borderRadius: moderateScale(14),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIconWrapper: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statItemValue: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(11),
    color: Colors.white,
  },
  alertValue: {
    color: '#fca5a5',
  },
  statItemLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(6),
    color: Colors.zinc[500],
    letterSpacing: scale(0),
    textTransform: 'uppercase',
  },
  statDivider: {
    width: scale(1),
    height: verticalScale(30),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: scale(8),
  },

  // Revenue Card
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
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(4),
    borderWidth: scale(1),
    borderColor: 'rgba(34, 197, 94, 0.2)',
    marginLeft: moderateScale(45)
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(2),
    overflow: 'hidden',
    marginTop: verticalScale(16),
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.gold,
  },
  revenueBreakdown: {
    marginTop: verticalScale(16),
  },
  breakdownDivider: {
    height: verticalScale(1),
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
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

  // Section
  section: {
    gap: verticalScale(12),
  },
  sectionTitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.white,
    letterSpacing: scale(2),
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  // Command Grid
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
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  commandIconWrapper: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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

  // Roster
  rosterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  rosterTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  rosterTitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.white,
    letterSpacing: scale(2.4),
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  rosterActions: {
    flexDirection: 'row',
    gap: scale(8),
  },
  rosterActionButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(1),
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  rosterList: {
    gap: verticalScale(0),
  },
  rosterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(14),
    gap: scale(12),
  },
  rosterCardBorder: {
    borderBottomWidth: scale(1),
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  rosterCardAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    marginHorizontal: scale(-16),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(8),
  },
  rosterAvatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(1),
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  rosterInfo: {
    flex: 1,
  },
  rosterName: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: RFValue(9),
    color: Colors.white,
    letterSpacing: scale(2),
    marginBottom: verticalScale(4),
  },
  rosterMeta: {
    flexDirection: 'row',
    gap: scale(12),
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  statusDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
  statusDotActive: {
    backgroundColor: Colors.green,
  },
  statusDotAlert: {
    backgroundColor: '#ef4444',
  },
  rosterStatus: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[500],
    letterSpacing: scale(1.8),
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  rosterStatusAlert: {
    color: '#fca5a5',
  },
  rosterTime: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[600],
    letterSpacing: scale(1.8),
    textTransform: 'uppercase',
  },
  rosterFooter: {
    marginTop: verticalScale(16),
    paddingTop: verticalScale(16),
    borderTopWidth: scale(1),
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },

  // View Live Button - NEW STYLES
  viewLiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: scale(1),
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  viewLiveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
  },
  viewLiveText: {
    fontFamily: Fonts.rajdhani.bold,
    fontSize: RFValue(8),
    color: Colors.white,
    letterSpacing: scale(1.5),
    textTransform: 'uppercase',
  },
  liveCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(10),
    gap: scale(5),
  },
  liveCountDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: Colors.green,
  },
  liveCountBadgeText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(10),
    color: Colors.green,
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
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconInactive: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
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