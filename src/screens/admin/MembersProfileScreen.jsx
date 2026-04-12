// src/screens/admin/MembersProfileScreen.js
import React from 'react';
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
import { BlurView } from '@react-native-community/blur';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Call02Icon,
  WhatsappIcon,
  SmartPhone01Icon,
  Clock01Icon,
  Login01Icon,
  Logout01Icon,
  Calendar03Icon,
  Dumbbell01Icon,
  Activity01Icon,
  Edit02Icon,
  Delete02Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Mail01Icon,
  Shield01Icon,
  Timer01Icon,
  SparklesIcon,
  ArrowRight01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import Header from '../../components/shared/Header';
import Fonts from '../../constants/Fonts';
import Colors from '../../constants/Colors';

const s = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const getBlurConfig = () => ({
  blurType: Platform.select({ ios: 'ultraThinMaterialDark', android: 'dark' }),
  blurAmount: Platform.select({ ios: 20, android: 10 }),
});

const TIER_TEMPLATES = {
  'ELITE TIER': {
    badge: 'ELITE',
    iconColor: '#EAB308',
    textColor: '#EAB308',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.35)',
  },
  'LEGENDARY TIER': {
    badge: 'LEGENDARY',
    iconColor: '#a855f7',
    textColor: '#c084fc',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
  },
};

const TRIAL_CONFIG = {
  iconColor: '#3B82F6',
  textColor: '#60A5FA',
  bgColor: 'rgba(59, 130, 246, 0.15)',
  borderColor: 'rgba(59, 130, 246, 0.35)',
  badge: 'TRIAL',
};

const STATUS_CONFIG = {
  active: { label: 'ACTIVE', color: '#22C55E', bgColor: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.3)', icon: CheckmarkCircle02Icon },
  expired: { label: 'EXPIRED', color: '#EF4444', bgColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)', icon: AlertCircleIcon },
  trial: { label: 'TRIAL', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.3)', icon: Timer01Icon },
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

const MembersProfileScreen = ({ navigation, route }) => {
  const blurConfig = getBlurConfig();
  const member = route?.params?.member;

  if (!member) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff' }}>Member not found</Text>
      </View>
    );
  }

  const isTrial = member.membershipStatus === 'trial';
  const tierConfig = isTrial ? TRIAL_CONFIG : (TIER_TEMPLATES[member.membershipType] || TIER_TEMPLATES['ELITE TIER']);
  const statusConfig = STATUS_CONFIG[member.membershipStatus] || STATUS_CONFIG.active;
  const cardAccentColor = tierConfig.iconColor;

  const handleGoBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const handleCall = () => {
    Linking.openURL(`tel:${member.phone.replace(/\D/g, '')}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=${member.phone.replace(/\D/g, '')}`);
  };

  const handleEmail = () => {
    if (member.email) Linking.openURL(`mailto:${member.email}`);
  };

  const handleEdit = () => {
    Alert.alert('Edit Member', 'Navigate to edit screen');
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const formatPhone = (phone) => {
    const cleaned = phone?.replace(/\D/g, '') || '';
    if (cleaned.length === 12) return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    return phone;
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={styles.background}
      blurRadius={Platform.OS === 'ios' ? 8 : 12}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.92)', '#000000']}
        style={styles.gradient}
      >
        <Header title="MEMBER PROFILE" showMenu={false} />

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
            <View style={styles.backIconContainer}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={ms(16)} color="rgba(255,255,255,0.6)" />
            </View>
            <Text style={styles.backText}>Back to Members</Text>
          </TouchableOpacity>

          {/* ═══════════ HERO CARD ═══════════ */}
          <View style={[styles.heroCard, { borderColor: `${cardAccentColor}30` }]}>
            {Platform.OS === 'ios' ? (
              <BlurView style={StyleSheet.absoluteFill} blurType={blurConfig.blurType} blurAmount={blurConfig.blurAmount} />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidBlur]} />
            )}

            <LinearGradient
              colors={[`${cardAccentColor}15`, `${cardAccentColor}06`, 'transparent']}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.heroBgIcon}>
              <HugeiconsIcon icon={Shield01Icon} size={ms(100)} color={`${cardAccentColor}15`} strokeWidth={0.5} />
            </View>

            <View style={styles.heroContent}>
              {/* Avatar */}
              <View style={styles.avatarSection}>
                <View style={[styles.avatarOuter, {
                  borderColor: `${cardAccentColor}60`,
                  backgroundColor: `${cardAccentColor}15`,
                }]}>
                  <View style={styles.avatarInner}>
                    <Text style={styles.avatarText}>{member.avatar || member.name?.slice(0, 2).toUpperCase()}</Text>
                  </View>
                </View>
                {/* Live / Offline dot */}
                <View style={[styles.avatarStatusDot, {
                  backgroundColor: member.isLive ? '#22C55E' : 'rgba(255,255,255,0.2)',
                }]} />
              </View>

              {/* Member ID */}
              <Text style={styles.memberId}>{member.memberId}</Text>

              {/* Name */}
              <Text style={styles.memberName}>{member.name}</Text>

              {/* Live / Offline Badge */}
              {member.isLive ? (
                <View style={styles.liveBadge}>
                  <View style={styles.liveBadgeDot} />
                  <Text style={styles.liveBadgeText}>CURRENTLY LIVE</Text>
                </View>
              ) : (
                <View style={styles.offlineBadge}>
                  <Text style={styles.offlineBadgeText}>OFFLINE</Text>
                </View>
              )}

              {/* Tier Badge - only non-trial */}
              {!isTrial && (
                <View style={[styles.tierBadge, {
                  backgroundColor: `${cardAccentColor}20`,
                  borderColor: `${cardAccentColor}40`,
                }]}>
                  <View style={[styles.tierDot, { backgroundColor: cardAccentColor }]} />
                  <Text style={[styles.tierText, { color: cardAccentColor }]}>{tierConfig.badge}</Text>
                </View>
              )}

              {/* Status Badge */}
              <View style={[styles.statusBadge, {
                backgroundColor: statusConfig.bgColor,
                borderColor: statusConfig.borderColor,
              }]}>
                <HugeiconsIcon icon={statusConfig.icon} size={ms(12)} color={statusConfig.color} />
                <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                {member.membershipStatus !== 'expired' && (
                  <Text style={[styles.daysLeftSmall, { color: statusConfig.color }]}>
                    • {member.daysLeft}d
                  </Text>
                )}
              </View>

              {/* Workout Badge - only non-trial */}
              {!isTrial && (
                <View style={[styles.workoutBadge, { backgroundColor: `${cardAccentColor}15` }]}>
                  <HugeiconsIcon
                    icon={member.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                    size={ms(12)}
                    color={cardAccentColor}
                  />
                  <Text style={[styles.workoutBadgeText, { color: 'white' }]}>
                    {member.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' : 'WEIGHTS ONLY'}
                  </Text>
                </View>
              )}

              {/* Quick Actions */}
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickActionBtn} onPress={handleCall} activeOpacity={0.7}>
                  <LinearGradient colors={['rgba(34,197,94,0.2)', 'rgba(34,197,94,0.08)']} style={styles.quickActionGradient}>
                    <HugeiconsIcon icon={Call02Icon} size={ms(18)} color="#22C55E" />
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionBtn} onPress={handleWhatsApp} activeOpacity={0.7}>
                  <LinearGradient colors={['rgba(37,211,102,0.2)', 'rgba(37,211,102,0.08)']} style={styles.quickActionGradient}>
                    <HugeiconsIcon icon={WhatsappIcon} size={ms(18)} color="#25D366" />
                  </LinearGradient>
                </TouchableOpacity>
                {member.email && (
                  <TouchableOpacity style={styles.quickActionBtn} onPress={handleEmail} activeOpacity={0.7}>
                    <LinearGradient colors={['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.08)']} style={styles.quickActionGradient}>
                      <HugeiconsIcon icon={Mail01Icon} size={ms(18)} color="#3B82F6" />
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* ═══════════ CONTACT INFO ═══════════ */}
          <View style={styles.infoCard}>
            {Platform.OS === 'ios' ? (
              <BlurView style={StyleSheet.absoluteFill} blurType={blurConfig.blurType} blurAmount={blurConfig.blurAmount} />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidBlur]} />
            )}
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>CONTACT INFO</Text>

              <TouchableOpacity style={styles.infoRow} onPress={handleCall} activeOpacity={0.7}>
                <View style={[styles.infoIconBox, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
                  <HugeiconsIcon icon={SmartPhone01Icon} size={ms(14)} color="#22C55E" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{formatPhone(member.phone)}</Text>
                </View>
                <HugeiconsIcon icon={ArrowRight01Icon} size={ms(14)} color="rgba(255,255,255,0.3)" />
              </TouchableOpacity>

              {member.email && (
                <TouchableOpacity style={[styles.infoRow, { marginBottom: 0 }]} onPress={handleEmail} activeOpacity={0.7}>
                  <View style={[styles.infoIconBox, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                    <HugeiconsIcon icon={Mail01Icon} size={ms(14)} color="#3B82F6" />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{member.email}</Text>
                  </View>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={ms(14)} color="rgba(255,255,255,0.3)" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ═══════════ LAST ACTIVITY ═══════════ */}
          <View style={styles.infoCard}>
            {Platform.OS === 'ios' ? (
              <BlurView style={StyleSheet.absoluteFill} blurType={blurConfig.blurType} blurAmount={blurConfig.blurAmount} />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidBlur]} />
            )}
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>ACTIVITY</Text>

              <View style={styles.activityGrid}>
                <View style={styles.activityItem}>
                  <View style={[styles.activityIconBox, { backgroundColor: 'rgba(34,197,94,0.15)' }]}>
                    <HugeiconsIcon icon={Login01Icon} size={ms(16)} color="#22C55E" />
                  </View>
                  <View style={styles.activityTextBox}>
                    <Text style={styles.activityLabel}>Check-in</Text>
                    <Text style={styles.activityValue}>{member.checkinTime || '--:--'}</Text>
                    <Text style={styles.activityDate}>{member.isLive ? 'Today' : 'Last visit'}</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={[styles.activityIconBox, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
                    <HugeiconsIcon icon={Logout01Icon} size={ms(16)} color="#EF4444" />
                  </View>
                  <View style={styles.activityTextBox}>
                    <Text style={styles.activityLabel}>Check-out</Text>
                    <Text style={styles.activityValue}>{member.lastCheckout || '--:--'}</Text>
                    <Text style={styles.activityDate}>{member.isLive ? 'In progress' : 'Last visit'}</Text>
                  </View>
                </View>
              </View>

              {member.duration && (
                <View style={styles.sessionRow}>
                  <View style={[styles.sessionIconBox, { backgroundColor: `${cardAccentColor}15` }]}>
                    <HugeiconsIcon icon={Clock01Icon} size={ms(14)} color={cardAccentColor} />
                  </View>
                  <Text style={styles.sessionLabel}>Session Duration</Text>
                  <Text style={[styles.sessionValue, { color: cardAccentColor }]}>{member.duration}</Text>
                </View>
              )}

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{member.totalVisits || 0}</Text>
                  <Text style={styles.statLabel}>Total Visits</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{member.currentStreak || 0}</Text>
                  <Text style={styles.statLabel}>Day Streak 🔥</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ═══════════ MEMBERSHIP DETAILS ═══════════ */}
          <View style={[styles.infoCard, { borderColor: `${cardAccentColor}20` }]}>
            {Platform.OS === 'ios' ? (
              <BlurView style={StyleSheet.absoluteFill} blurType={blurConfig.blurType} blurAmount={blurConfig.blurAmount} />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidBlur]} />
            )}
            <View style={styles.infoCardContent}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.infoCardTitle}>MEMBERSHIP</Text>
                <Text style={[styles.daysLeftText, { color: statusConfig.color }]}>
                  {member.membershipStatus === 'expired' ? 'Expired' :
                   member.membershipStatus === 'trial' ? `${member.daysLeft} days trial left` :
                   `${member.daysLeft} days left`}
                </Text>
              </View>

              {/* Plan - non-trial only */}
              {!isTrial && (
                <View style={styles.membershipRow}>
                  <Text style={styles.membershipLabel}>Plan</Text>
                  <View style={[styles.membershipBadge, {
                    backgroundColor: `${cardAccentColor}20`,
                    borderColor: `${cardAccentColor}40`,
                  }]}>
                    <View style={[styles.membershipBadgeDot, { backgroundColor: cardAccentColor }]} />
                    <Text style={[styles.membershipBadgeText, { color: cardAccentColor }]}>{member.membershipType}</Text>
                  </View>
                </View>
              )}

              {/* Workout - non-trial only */}
              {!isTrial && (
                <View style={styles.membershipRow}>
                  <Text style={styles.membershipLabel}>Workout</Text>
                  <View style={[styles.methodBadge, { backgroundColor: `${cardAccentColor}15` }]}>
                    <HugeiconsIcon
                      icon={member.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                      size={ms(12)}
                      color={cardAccentColor}
                    />
                    <Text style={[styles.methodBadgeText, { color: 'white' }]}>
                      {member.workoutType === 'cardio_weights' ? 'Cardio + Weights' : 'Weights Only'}
                    </Text>
                  </View>
                </View>
              )}

              {/* Status */}
              <View style={styles.membershipRow}>
                <Text style={styles.membershipLabel}>Status</Text>
                <View style={[styles.statusSmallBadge, {
                  backgroundColor: statusConfig.bgColor,
                  borderColor: statusConfig.borderColor,
                }]}>
                  <HugeiconsIcon icon={statusConfig.icon} size={ms(10)} color={statusConfig.color} />
                  <Text style={[styles.statusSmallText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                </View>
              </View>

              {/* Paid Amount */}
              {member.paidAmount > 0 && (
                <View style={styles.membershipRow}>
                  <Text style={styles.membershipLabel}>Paid Amount</Text>
                  <Text style={[styles.paidAmount, { color: cardAccentColor }]}>₹{member.paidAmount}</Text>
                </View>
              )}

              <View style={styles.cardDivider} />

              {/* Dates */}
              <View style={styles.datesRow}>
                <View style={styles.dateItem}>
                  <HugeiconsIcon icon={Calendar03Icon} size={ms(12)} color="#22C55E" />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>Joined</Text>
                    <Text style={styles.dateValue}>{formatDate(member.joinDate)}</Text>
                  </View>
                </View>
                <View style={styles.dateItem}>
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={ms(12)}
                    color={member.membershipStatus === 'expired' ? '#EF4444' : cardAccentColor}
                  />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>
                      {member.membershipStatus === 'expired' ? 'Expired' : 'Expires'}
                    </Text>
                    <Text style={[styles.dateValue, member.membershipStatus === 'expired' && { color: '#EF4444' }]}>
                      {formatDate(member.expiryDate)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Status Bar */}
              <View style={styles.membershipStatusBar}>
                <HugeiconsIcon icon={statusConfig.icon} size={ms(14)} color={statusConfig.color} />
                <Text style={[styles.membershipStatusText, { color: statusConfig.color }]}>
                  {statusConfig.label === 'ACTIVE' ? 'Membership Active' :
                   statusConfig.label === 'EXPIRED' ? 'Membership Expired' : 'Trial Period'}
                </Text>
                {member.membershipStatus === 'active' && (
                  <Text style={[styles.membershipDaysText, { color: statusConfig.color }]}>
                    • {member.daysLeft} days remaining
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* ═══════════ ACTION BUTTONS ═══════════ */}
          <View style={styles.actionButtonsContainer}>
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.editButton} onPress={handleEdit} activeOpacity={0.8}>
                <LinearGradient
                  colors={['rgba(59,130,246,0.15)', 'rgba(59,130,246,0.05)']}
                  style={styles.actionButtonGradient}
                >
                  <HugeiconsIcon icon={Edit02Icon} size={ms(14)} color="#3B82F6" />
                  <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Edit</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={handleRemove} activeOpacity={0.8}>
                <LinearGradient
                  colors={['rgba(239,68,68,0.15)', 'rgba(239,68,68,0.05)']}
                  style={styles.actionButtonGradient}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={ms(14)} color="#EF4444" />
                  <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Remove</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: vs(30) }} />
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
    paddingTop: vs(8),
    paddingBottom: vs(30),
  },
  androidBlur: { backgroundColor: 'rgba(0,0,0,0.92)' },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
    paddingVertical: vs(2),
  },
  backIconContainer: {
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

  // Hero Card
  heroCard: {
    borderRadius: ms(18),
    overflow: 'hidden',
    marginBottom: vs(12),
    borderWidth: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  heroBgIcon: {
    position: 'absolute',
    top: -ms(15),
    right: -ms(20),
    opacity: 0.8,
  },
  heroContent: {
    alignItems: 'center',
    paddingVertical: vs(20),
    paddingHorizontal: s(16),
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: vs(8),
    position: 'relative',
  },
  avatarOuter: {
    width: ms(76),
    height: ms(76),
    borderRadius: ms(38),
    borderWidth: scale(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: ms(68),
    height: ms(68),
    borderRadius: ms(34),
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(18),
    color: '#FFFFFF',
  },
  avatarStatusDot: {
    position: 'absolute',
    bottom: ms(2),
    right: ms(2),
    width: ms(16),
    height: ms(16),
    borderRadius: ms(8),
    borderWidth: 3,
    borderColor: '#000000',
  },

  memberId: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(8),
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.5,
    marginBottom: vs(4),
  },
  memberName: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(16),
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: vs(8),
    letterSpacing: 1,
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,197,94,0.15)',
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(6),
    gap: s(5),
    marginBottom: vs(8),
  },
  liveBadgeDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: '#22C55E',
  },
  liveBadgeText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(7),
    color: '#22C55E',
    letterSpacing: 1.5,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(6),
    marginBottom: vs(8),
  },
  offlineBadgeText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(7),
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1.5,
  },

  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
    borderWidth: 1,
    gap: s(5),
    marginBottom: vs(8),
  },
  tierDot: { width: ms(6), height: ms(6), borderRadius: ms(3) },
  tierText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(9),
    letterSpacing: 1,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
    borderWidth: 1,
    gap: s(5),
    marginBottom: vs(8),
  },
  statusText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(8),
    letterSpacing: 0.8,
  },
  daysLeftSmall: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(8),
  },

  workoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(6),
    gap: s(5),
    marginBottom: vs(12),
  },
  workoutBadgeText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(8),
    letterSpacing: 0.5,
  },

  quickActions: { flexDirection: 'row', gap: s(12) },
  quickActionBtn: { borderRadius: ms(12), overflow: 'hidden' },
  quickActionGradient: {
    width: ms(44),
    height: ms(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  // Info Cards
  infoCard: {
    borderRadius: ms(14),
    overflow: 'hidden',
    marginBottom: vs(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#000000',
  },
  infoCardContent: { padding: ms(14) },
  infoCardTitle: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(9),
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.5,
    marginBottom: vs(12),
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  daysLeftText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(10),
    letterSpacing: 0.5,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  infoIconBox: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  infoTextContainer: { flex: 1 },
  infoLabel: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(9),
    color: 'rgba(255,255,255,0.5)',
    marginBottom: vs(1),
  },
  infoValue: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(12),
    color: '#FFFFFF',
  },

  // Activity
  activityGrid: { flexDirection: 'row', gap: s(10), marginBottom: vs(10) },
  activityItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: ms(12),
    padding: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: s(8),
  },
  activityIconBox: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTextBox: { flex: 1 },
  activityLabel: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(9),
    color: 'rgba(255,255,255,0.6)',
  },
  activityValue: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(12),
    color: '#FFFFFF',
    marginVertical: vs(1),
  },
  activityDate: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(8),
    color: 'rgba(255,255,255,0.4)',
  },

  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: ms(10),
    paddingVertical: vs(8),
    paddingHorizontal: s(10),
    marginBottom: vs(10),
    gap: s(8),
  },
  sessionIconBox: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionLabel: {
    flex: 1,
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(10),
    color: 'rgba(255,255,255,0.6)',
  },
  sessionValue: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(12),
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: ms(12),
    paddingVertical: ms(14),
    paddingHorizontal: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(18),
    color: '#FFFFFF',
  },
  statLabel: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(10),
    color: 'rgba(255,255,255,0.6)',
    marginTop: vs(4),
  },
  statDivider: {
    width: 1,
    height: vs(35),
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  membershipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(10),
  },
  membershipLabel: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(11),
    color: 'rgba(255,255,255,0.6)',
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(6),
    borderWidth: 1,
    gap: s(4),
  },
  membershipBadgeDot: { width: ms(5), height: ms(5), borderRadius: ms(2.5) },
  membershipBadgeText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(9),
    letterSpacing: 0.3,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(6),
    gap: s(4),
  },
  methodBadgeText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(9),
  },
  statusSmallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(6),
    borderWidth: 1,
    gap: s(4),
  },
  statusSmallText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(8),
    letterSpacing: 0.5,
  },
  paidAmount: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(13),
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: vs(10),
  },
  datesRow: { flexDirection: 'row', gap: s(8), marginBottom: vs(10) },
  dateItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: ms(10),
    padding: ms(10),
    gap: s(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  dateInfo: { flex: 1 },
  dateLabel: {
    fontFamily: Fonts.rajdhani?.medium || 'System',
    fontSize: rf(8),
    color: 'rgba(255,255,255,0.5)',
    marginBottom: vs(1),
  },
  dateValue: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(10),
    color: '#FFFFFF',
  },
  membershipStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(4),
    gap: s(6),
  },
  membershipStatusText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(11),
    letterSpacing: 0.3,
  },
  membershipDaysText: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(10),
    opacity: 0.8,
  },

  // Action Buttons
  actionButtonsContainer: { marginTop: vs(4), gap: vs(10) },
  actionButtonsRow: { flexDirection: 'row', gap: s(10) },
  editButton: { flex: 1, borderRadius: ms(10), overflow: 'hidden' },
  deleteButton: { flex: 1, borderRadius: ms(10), overflow: 'hidden' },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(12),
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: s(6),
  },
  actionButtonText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(11),
    letterSpacing: 0.3,
  },
});

export default MembersProfileScreen;