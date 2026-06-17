// src/screens/user/UserDashboardScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  CheckmarkCircle02Icon,
  LogoutSquare01Icon,
  Activity01Icon,
  Clock01Icon,
  Shield01Icon,
  Dumbbell01Icon,
  Flash01Icon,
  InformationCircleIcon,
  Loading03Icon,
  ArrowRight01Icon,
  GiftIcon,
  Tick02Icon,
  Medal02Icon,
  Time01Icon,
} from '@hugeicons/core-free-icons';
import { useRoute } from '@react-navigation/native';

import Header from '../../components/shared/Header';
import GlassCard from '../../components/shared/GlassCard';
import GlassButton from '../../components/shared/GlassButton';
import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import gymlogoimg from '../user/gymlogoimg.png';
import { usePlans } from '../../context/PlansContext';
import { useMembershipRequests } from '../../context/MembershipRequestsContext';
import { useTrainer } from '../../context/TrainerContext';

const s  = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const TRAINER_COLOR = '#22D3EE';

const DEFAULT_TEMPLATES = {
  cardio_weights: {
    colors: ['rgba(234,179,8,0.35)', 'rgba(234,179,8,0.15)', 'rgba(0,0,0,0.95)'],
    iconColor: Colors.gold,
    textColor: Colors.gold,
  },
  weights_only: {
    colors: ['rgba(168,85,247,0.35)', 'rgba(168,85,247,0.15)', 'rgba(0,0,0,0.95)'],
    iconColor: '#a855f7',
    textColor: '#c084fc',
  },
};

// ═══════════════════════════════════════════════════════════════
// TRAINER ROLE CARD
// ═══════════════════════════════════════════════════════════════
const TrainerRoleCard = ({ assignedAt }) => {
  const daysSince = assignedAt
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(assignedAt).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  return (
    <View style={trainerCardStyles.card}>
      <View style={trainerCardStyles.bgIcon}>
        <HugeiconsIcon
          icon={Dumbbell01Icon}
          size={ms(90)}
          color={`${TRAINER_COLOR}10`}
          strokeWidth={0.5}
        />
      </View>
      <View style={trainerCardStyles.logoBox}>
        <Image source={gymlogoimg} style={trainerCardStyles.logoImg} />
      </View>

      <View style={trainerCardStyles.header}>
        <View style={{ flex: 1 }}>
          <View style={trainerCardStyles.badge}>
            <View style={trainerCardStyles.badgeDot} />
            <Text style={trainerCardStyles.badgeText}>Active Role</Text>
          </View>
          <Text style={trainerCardStyles.title}>GYM TRAINER</Text>
          <View style={trainerCardStyles.workoutBadge}>
            <HugeiconsIcon
              icon={Dumbbell01Icon}
              size={ms(10)}
              color={TRAINER_COLOR}
            />
            <Text style={trainerCardStyles.workoutText}>
              PERSONAL TRAINER
            </Text>
          </View>
        </View>
        <View style={trainerCardStyles.daysBox}>
          <Text style={trainerCardStyles.daysNumber}>{daysSince}</Text>
          <Text style={trainerCardStyles.daysLabel}>Days Active</Text>
        </View>
      </View>

      <View style={trainerCardStyles.divider} />

      <View style={trainerCardStyles.footer}>
        <Text style={trainerCardStyles.footerText}>
          Joined{' '}
          {assignedAt
            ? new Date(assignedAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : 'Today'}
        </Text>
        <View style={trainerCardStyles.activeChip}>
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={ms(12)}
            color={TRAINER_COLOR}
          />
          <Text style={trainerCardStyles.activeChipText}>ACTIVE</Text>
        </View>
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// TRIAL MEMBERSHIP CARD
// ═══════════════════════════════════════════════════════════════
const TrialMembershipCard = ({ daysLeft, onViewPlans }) => (
  <View style={styles.membershipCard}>
    <View style={styles.allmemberLogo}>
      <Image source={gymlogoimg} style={styles.allmemberLogoimg} />
    </View>
    <View style={styles.membershipHeader}>
      <View style={{ flex: 1 }}>
        <View style={styles.liveBadge}>
          <View style={[styles.liveDot, { backgroundColor: Colors.blue }]} />
          <Text style={[styles.liveBadgeText, { color: Colors.blue }]}>
            Trial Period
          </Text>
        </View>
        <Text style={styles.membershipTitle}>TRIAL ACCESS</Text>
        <View
          style={[
            styles.workoutBadge,
            { backgroundColor: 'rgba(255,255,255,0.06)' },
          ]}
        >
          <HugeiconsIcon
            icon={Clock01Icon}
            size={ms(10)}
            color={Colors.zinc[500]}
          />
          <Text style={[styles.workoutBadgeText, { color: Colors.zinc[200] }]}>
            LIMITED FEATURES
          </Text>
        </View>
      </View>
      <View style={styles.daysContainer}>
        <Text style={[styles.daysNumber, { color: Colors.white }]}>
          {daysLeft}
        </Text>
        <Text style={styles.daysLabel}>Days Left</Text>
      </View>
    </View>
    <View style={styles.cardDivider} />
    <View style={styles.membershipFooter}>
      <Text style={styles.expiryText}>{7 - daysLeft} of 7 days used</Text>
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onViewPlans}
        activeOpacity={0.8}
      >
        <Text style={styles.actionBtnText}>View Plans</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ═══════════════════════════════════════════════════════════════
// REQUEST PENDING CARD
// ═══════════════════════════════════════════════════════════════
const RequestPendingCard = ({ request }) => {
  const template =
    request?.planTemplate ||
    DEFAULT_TEMPLATES[request?.workoutType] ||
    DEFAULT_TEMPLATES['cardio_weights'];
  const accentColor = template?.iconColor || Colors.gold;
  const textColor   = template?.textColor || Colors.gold;

  return (
    <View style={[styles.membershipCard, { borderColor: `${accentColor}35` }]}>
      <View style={styles.allmemberLogo}>
        <Image source={gymlogoimg} style={styles.allmemberLogoimg} />
      </View>
      <View style={styles.membershipHeader}>
        <View style={{ flex: 1 }}>
          <View style={styles.liveBadge}>
            <HugeiconsIcon icon={Loading03Icon} size={ms(15)} color={accentColor} />
            <Text style={[styles.liveBadgeText, { color: accentColor }]}>
              Approval Pending
            </Text>
          </View>
          <Text style={[styles.membershipTitle, { color: textColor }]}>
            {request?.planName || 'Plan'}
          </Text>
          {request?.workoutType && (
            <View style={[styles.workoutBadge, { backgroundColor: `${accentColor}15` }]}>
              <HugeiconsIcon
                icon={request.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                size={ms(10)}
                color={accentColor}
              />
              <Text style={[styles.workoutBadgeText, { color: accentColor }]}>
                {request.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' : 'WEIGHTS ONLY'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.daysContainer}>
          <HugeiconsIcon icon={Time01Icon} size={ms(28)} color={accentColor} />
        </View>
      </View>
      <View style={[styles.cardDivider, { backgroundColor: `${accentColor}20` }]} />
      <View style={styles.infoRows}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Duration</Text>
          <Text style={styles.infoValue}>{request?.planDuration || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Amount</Text>
          <Text style={[styles.infoValue, { color: textColor }]}>
            ${request?.planPrice || '0'}
          </Text>
        </View>
      </View>
      <View style={[styles.cardDivider, { backgroundColor: `${accentColor}20` }]} />
      <View style={styles.membershipFooter}>
        <HugeiconsIcon icon={InformationCircleIcon} size={ms(15)} color={Colors.zinc[300]} />
        <Text style={styles.pendingNote}>You'll be notified once approved</Text>
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// ELITE MEMBERSHIP CARD
// ═══════════════════════════════════════════════════════════════
const EliteMembershipCard = ({ membershipData, onExtend }) => {
  const template =
    membershipData?.template ||
    DEFAULT_TEMPLATES[membershipData?.workoutType] ||
    DEFAULT_TEMPLATES['cardio_weights'];

  return (
    <View style={[styles.membershipCard, { borderColor: `${template.iconColor}40` }]}>
      <View style={styles.allmemberLogo}>
        <Image source={gymlogoimg} style={styles.allmemberLogoimg} />
      </View>
      <View style={styles.membershipHeader}>
        <View style={{ flex: 1 }}>
          <View style={styles.liveBadge}>
            <View style={[styles.liveDot, { backgroundColor: template.iconColor }]} />
            <Text style={[styles.liveBadgeText, { color: template.iconColor }]}>
              Active Plan
            </Text>
          </View>
          <Text style={[styles.membershipTitle, { color: template.textColor }]}>
            {membershipData?.tierName || 'Premium'}
          </Text>
          {membershipData?.workoutType && (
            <View style={[styles.workoutBadge, { backgroundColor: `${template.iconColor}15` }]}>
              <HugeiconsIcon
                icon={membershipData.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                size={ms(10)}
                color={template.iconColor}
              />
              <Text style={[styles.workoutBadgeText, { color: template.iconColor }]}>
                {membershipData.workoutType === 'cardio_weights'
                  ? 'CARDIO + WEIGHT LIFTING'
                  : 'WEIGHT LIFTING ONLY'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.daysContainer}>
          <Text style={[styles.daysNumber, { color: template.textColor }]}>
            {membershipData?.daysLeft || 0}
          </Text>
          <Text style={styles.daysLabel}>Days Left</Text>
        </View>
      </View>
      <View style={[styles.cardDivider, { backgroundColor: `${template.iconColor}25` }]} />
      <View style={styles.membershipFooter}>
        <Text style={styles.expiryText}>
          Exp. {membershipData?.expiryDate || '-'}
        </Text>
        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: `${template.iconColor}40` }]}
          onPress={onExtend}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionBtnText, { color: template.textColor }]}>
            Extend
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// PLAN CARD
// ═══════════════════════════════════════════════════════════════
const PlanCard = ({ plan, onSelect, submitting }) => {
  const template =
    plan?.template ||
    DEFAULT_TEMPLATES[plan?.workoutType] ||
    DEFAULT_TEMPLATES['cardio_weights'];
  if (!plan) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onSelect(plan)}
      disabled={submitting}
      style={submitting && { opacity: 0.5 }}
    >
      <View style={[styles.planCard, { borderColor: `${template.iconColor}40` }]}>
        <LinearGradient
          colors={[`${template.iconColor}12`, `${template.iconColor}06`, 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.planBgIconContainer}>
          <HugeiconsIcon
            icon={Shield01Icon}
            size={ms(80)}
            color={`${template.iconColor}18`}
            strokeWidth={0.5}
          />
        </View>
        <View style={styles.planCardHeader}>
          <View style={{ flex: 1, marginRight: s(12) }}>
            <View style={[styles.planBadge, { backgroundColor: `${template.iconColor}20` }]}>
              <View style={[styles.planBadgeDot, { backgroundColor: template.iconColor }]} />
              <Text style={[styles.planBadgeText, { color: template.iconColor }]}>
                {plan.template?.badge || 'PLAN'}
              </Text>
            </View>
            <Text
              style={[styles.planName, { color: template.textColor }]}
              numberOfLines={2}
            >
              {plan.name || 'Plan'}
            </Text>
          </View>
          <View style={styles.planPriceContainer}>
            {plan.hasOffer && plan.offer && (
              <Text style={styles.planOriginalPrice}>${plan.price}</Text>
            )}
            <Text style={[styles.planPrice, { color: template.textColor }]}>
              ${plan.hasOffer && plan.finalPrice
                ? plan.finalPrice.toFixed(2)
                : plan.price || '0'}
            </Text>
            <Text style={styles.planDuration}>/{plan.duration || 'month'}</Text>
          </View>
        </View>
        <View style={[styles.workoutTypeBadge, { backgroundColor: `${template.iconColor}20` }]}>
          <HugeiconsIcon
            icon={plan.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
            size={ms(10)}
            color={template.iconColor}
          />
          <Text style={[styles.workoutTypeText, { color: template.iconColor }]}>
            {plan.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' : 'WEIGHTS ONLY'}
          </Text>
        </View>
        <View style={[styles.planDivider, { backgroundColor: `${template.iconColor}25` }]} />
        {Array.isArray(plan.features) && plan.features.length > 0 && (
          <View style={styles.planFeatures}>
            {plan.features.slice(0, 4).map((feature, idx) => (
              <View key={idx} style={styles.featureItem}>
                <HugeiconsIcon icon={Tick02Icon} size={ms(10)} color={Colors.green} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        )}
        {plan.hasOffer && plan.offer?.text ? (
          <View style={styles.offerBadge}>
            <HugeiconsIcon icon={Flash01Icon} size={ms(10)} color={Colors.gold} />
            <Text style={styles.offerText}>{plan.offer.text}</Text>
          </View>
        ) : null}
        <View style={[styles.selectPlanButton, { borderColor: `${template.iconColor}40` }]}>
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Text style={styles.selectPlanText}>REQUEST MEMBERSHIP</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={ms(12)} color={Colors.white} />
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ═══════════════════════════════════════════════════════════════
// MEMBERSHIP PLANS MODAL
// ═══════════════════════════════════════════════════════════════
const MembershipPlansModal = ({
  visible,
  onClose,
  plans,
  onSelectPlan,
  loading,
  submitting,
}) => {
  const safePlans = Array.isArray(plans) ? plans.filter(Boolean) : [];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={() => {}}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={Platform.OS === 'ios' ? 'ultraThinMaterialDark' : 'dark'}
            blurAmount={20}
            reducedTransparencyFallbackColor="rgba(12,12,16,0.98)"
          />
          <View style={styles.modalHeader}>
            <View style={styles.modalDragHandle} />
            <Text style={styles.modalTitle}>MEMBERSHIP PLANS</Text>
            <Text style={styles.modalSubtitle}>
              {safePlans.length > 0 ? 'Choose your fitness journey' : 'No plans available'}
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.plansScrollContent}
            bounces={false}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.white} />
                <Text style={styles.loadingText}>Loading Plans...</Text>
              </View>
            ) : safePlans.length === 0 ? (
              <View style={styles.noPlansContainer}>
                <Text style={styles.noPlansEmoji}>📦</Text>
                <Text style={styles.noPlansText}>No Plans Available</Text>
                <Text style={styles.noPlansSubtext}>Check back later</Text>
              </View>
            ) : (
              safePlans.map((plan, index) => (
                <PlanCard
                  key={plan?.id || index}
                  plan={plan}
                  onSelect={onSelectPlan}
                  submitting={submitting}
                />
              ))
            )}
          </ScrollView>
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalText}>CLOSE</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const UserDashboardScreen = ({ navigation }) => {
  const route = useRoute();
  const { getActivePlans, loading: plansLoading, refreshPlans } = usePlans();
  const {
    submitRequest,
    getUserRequestStatus,
    getMemberById,
    refreshData,
  } = useMembershipRequests();

  // ✅ Simplified trainer context
  const { isTrainer, getTrainer } = useTrainer();

  const currentUser = {
    id: 'user_001',
    name: 'Abdullah Ahmed',
    phone: '+92 300 1234567',
    email: 'abdullah@example.com',
    photo: null,
  };

  const [activePlans, setActivePlans]     = useState([]);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [submitting, setSubmitting]       = useState(false);

  const approvedMember = getMemberById(currentUser.id);
  const pendingRequest = getUserRequestStatus(currentUser.id);
  const hasPending     = pendingRequest?.status === 'pending';

  // ✅ Trainer check
  const isMemberTrainer = isTrainer(currentUser.id);
  const trainerData     = getTrainer(currentUser.id);

  const isTrialMember    = !approvedMember || !approvedMember.isActive;
  const isPendingApproval = hasPending;
  const trialData        = { daysLeft: 5 };

  const pendingTemplate    = pendingRequest?.planTemplate || DEFAULT_TEMPLATES[pendingRequest?.workoutType] || DEFAULT_TEMPLATES['cardio_weights'];
  const pendingAccentColor = pendingTemplate?.iconColor || Colors.gold;
  const pendingTextColor   = pendingTemplate?.textColor || Colors.gold;

  const safeLoadPlans = useCallback(() => {
    try {
      const plans = getActivePlans();
      setActivePlans(Array.isArray(plans) ? plans.filter(Boolean) : []);
    } catch (e) {
      setActivePlans([]);
    }
  }, [getActivePlans]);

  useEffect(() => { safeLoadPlans(); }, [safeLoadPlans]);

  useEffect(() => {
    if (showPlansModal) {
      refreshPlans().then(() => safeLoadPlans()).catch(() => setActivePlans([]));
    }
  }, [showPlansModal, safeLoadPlans, refreshPlans]);

  useEffect(() => {
    if (route.params?.openPlans) {
      setShowPlansModal(true);
      navigation.setParams({ openPlans: false });
    }
  }, [route.params?.openPlans, navigation]);

  // ✅ Auto redirect to TrainerDashboard when assigned as trainer
  useEffect(() => {
    if (isMemberTrainer) {
      navigation.replace('TrainerDashboard');
    }
  }, [isMemberTrainer, navigation]);

  const handleSelectPlan = async (plan) => {
    if (!plan) return;
    if (hasPending) {
      Alert.alert('Request Pending', 'You already have a pending request.');
      setShowPlansModal(false);
      return;
    }
    const price = plan.hasOffer ? plan.finalPrice?.toFixed(2) : plan.price;
    Alert.alert(
      'Confirm Request',
      `Request "${plan.name}" for $${price}/${plan.duration || 'month'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit Request',
          onPress: async () => {
            setSubmitting(true);
            try {
              await submitRequest(currentUser, plan);
              setShowPlansModal(false);
              Alert.alert('Request Submitted! 🎉', 'Sent to admin for approval.');
              await refreshData();
            } catch (error) {
              Alert.alert('Error', 'Failed to submit request.');
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  // ✅ Membership card based on state
  const renderMembershipCard = () => {
    if (isMemberTrainer) {
      return <TrainerRoleCard assignedAt={trainerData?.assignedAt} />;
    }
    if (isPendingApproval) {
      return <RequestPendingCard request={pendingRequest} />;
    }
    if (isTrialMember) {
      return (
        <TrialMembershipCard
          daysLeft={trialData.daysLeft}
          onViewPlans={() => setShowPlansModal(true)}
        />
      );
    }
    return (
      <EliteMembershipCard
        membershipData={{
          tierName: approvedMember?.tierName,
          daysLeft: approvedMember?.daysLeft,
          expiryDate: approvedMember?.expiryDate
            ? new Date(approvedMember.expiryDate).toLocaleDateString('en-US', {
                day: 'numeric', month: 'short', year: 'numeric',
              })
            : '-',
          workoutType: approvedMember?.workoutType,
          template: approvedMember?.template,
        }}
        onExtend={() => setShowPlansModal(true)}
      />
    );
  };

  // ✅ Welcome badge
  const renderWelcomeBadge = () => {
    if (isMemberTrainer) {
      return (
        <View style={[styles.userTypeBadge, { backgroundColor: `${TRAINER_COLOR}15`, borderColor: `${TRAINER_COLOR}30` }]}>
          <HugeiconsIcon icon={Dumbbell01Icon} size={ms(10)} color={TRAINER_COLOR} />
          <Text style={[styles.userTypeBadgeText, { color: TRAINER_COLOR }]}>GYM TRAINER</Text>
        </View>
      );
    }
    if (isPendingApproval) {
      return (
        <View style={[styles.userTypeBadge, { backgroundColor: `${pendingAccentColor}15`, borderColor: `${pendingAccentColor}30` }]}>
          <HugeiconsIcon icon={Loading03Icon} size={ms(10)} color={pendingAccentColor} />
          <Text style={[styles.userTypeBadgeText, { color: pendingTextColor }]}>APPROVAL PENDING</Text>
        </View>
      );
    }
    if (isTrialMember) {
      return (
        <View style={styles.userTypeBadge}>
          <HugeiconsIcon icon={Clock01Icon} size={ms(10)} color={Colors.blue} />
          <Text style={styles.userTypeBadgeText}>TRIAL MEMBER</Text>
        </View>
      );
    }
    return (
      <View style={[styles.userTypeBadge, {
        backgroundColor: `${approvedMember?.template?.iconColor || Colors.gold}15`,
        borderColor: `${approvedMember?.template?.iconColor || Colors.gold}30`,
      }]}>
        <HugeiconsIcon icon={Medal02Icon} size={ms(10)} color={approvedMember?.template?.iconColor || Colors.gold} />
        <Text style={[styles.userTypeBadgeText, { color: approvedMember?.template?.textColor || Colors.gold }]}>
          {approvedMember?.tierName || 'PREMIUM MEMBER'}
        </Text>
      </View>
    );
  };

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
          <Header />

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Welcome */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeLabel}>Welcome back</Text>
              <Text style={styles.welcomeName}>{currentUser.name}</Text>
              {renderWelcomeBadge()}
            </View>

            {/* Membership Card */}
            {renderMembershipCard()}

            {/* ✅ TEST BUTTON - Remove after testing */}
            <TouchableOpacity
              onPress={() => navigation.navigate('TrainerDashboard')}
              style={styles.testBtn}
              activeOpacity={0.8}
            >
              <HugeiconsIcon icon={Dumbbell01Icon} size={ms(16)} color="#000" />
              <Text style={styles.testBtnText}>
                🧪 TEST: View Trainer Dashboard
              </Text>
            </TouchableOpacity>

            {/* Facility Status */}
            <GlassCard>
              <View style={styles.facilityHeader}>
                <View style={styles.facilityTitle}>
                  <HugeiconsIcon icon={Activity01Icon} size={ms(16)} color={Colors.zinc[400]} />
                  <Text style={styles.facilityTitleText}>Facility Status</Text>
                </View>
                <View style={styles.logoContainer}>
                  <Image source={gymlogoimg} style={styles.gymLogo} resizeMode="contain" />
                </View>
              </View>
              <View style={styles.facilityStats}>
                <Text style={styles.facilityNumber}>42</Text>
                <Text style={styles.facilityLabel}>Members Inside</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <View style={styles.predictionContainer}>
                <View style={styles.predictionDivider} />
                <View style={styles.predictionContent}>
                  <View style={styles.predictionLeft}>
                    <View style={styles.predictionIconWrapper}>
                      <HugeiconsIcon icon={Clock01Icon} size={ms(14)} color={Colors.zinc[400]} />
                    </View>
                    <View style={styles.predictionTextWrapper}>
                      <Text style={styles.predictionLabel}>ESTIMATED IN 15 MIN</Text>
                      <View style={styles.predictionValue}>
                        <Text style={styles.predictionNumber}>4</Text>
                        <Text style={styles.predictionText}> members will leave</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.predictionRight}>
                    <View style={styles.trendBadge}>
                      <Text style={styles.trendText}>-4</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.expectedContainer}>
                  <Text style={styles.expectedLabel}>Expected count:</Text>
                  <Text style={styles.expectedValue}>38 members</Text>
                </View>
              </View>
            </GlassCard>

            {/* Check In / Out */}
            <View style={styles.actionButtons}>
              <GlassButton variant="glass" style={styles.actionButton}>
                <View style={styles.actionButtonContent}>
                  <View style={styles.actionIcon}>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color={Colors.white} />
                  </View>
                  <Text style={styles.actionButtonText}>Check In</Text>
                </View>
              </GlassButton>
              <GlassButton variant="outline" style={styles.actionButton}>
                <View style={styles.actionButtonContent}>
                  <View style={[styles.actionIcon, styles.actionIconInactive]}>
                    <HugeiconsIcon icon={LogoutSquare01Icon} size={20} color={Colors.zinc[500]} />
                  </View>
                  <Text style={[styles.actionButtonText, styles.actionButtonTextInactive]}>
                    Check Out
                  </Text>
                </View>
              </GlassButton>
            </View>

            {/* Trial CTA */}
            {isTrialMember && !isPendingApproval && !isMemberTrainer && (
              <TouchableOpacity activeOpacity={0.85} onPress={() => setShowPlansModal(true)}>
                <LinearGradient
                  colors={['rgba(234,179,8,0.12)', 'rgba(234,179,8,0.04)', 'transparent']}
                  style={styles.trialCtaBanner}
                >
                  <View style={styles.trialCtaContent}>
                    <HugeiconsIcon icon={GiftIcon} size={ms(18)} color={Colors.gold} />
                    <View style={styles.trialCtaText}>
                      <Text style={styles.trialCtaTitle}>Upgrade Today!</Text>
                      <Text style={styles.trialCtaSubtitle}>
                        {activePlans.length > 0
                          ? `${activePlans.length} plans available`
                          : 'Check available plans'}
                      </Text>
                    </View>
                  </View>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={ms(16)} color={Colors.gold} />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </ScrollView>

          <BottomNav
            activeTab="home"
            onTabChange={(tab) => {
              if (tab === 'home') {}
              if (tab === 'profile') navigation.navigate('UserProfile');
              if (tab === 'membership') setShowPlansModal(true);
              if (tab === 'friends') navigation.navigate('MembersFriend');
            }}
          />

          <MembershipPlansModal
            visible={showPlansModal}
            onClose={() => setShowPlansModal(false)}
            plans={activePlans}
            onSelectPlan={handleSelectPlan}
            loading={plansLoading}
            submitting={submitting}
          />
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

// ═══════════════════════════════════════════════════════════════
// TRAINER ROLE CARD STYLES
// ═══════════════════════════════════════════════════════════════
const trainerCardStyles = StyleSheet.create({
  card: {
    borderRadius: ms(16), padding: s(16), borderWidth: 1,
    borderColor: `${TRAINER_COLOR}40`, overflow: 'hidden',
    position: 'relative', backgroundColor: '#0a0a0a',
  },
  bgIcon: { position: 'absolute', top: -ms(10), right: -ms(15), opacity: 0.8 },
  logoBox: {
    position: 'absolute', top: scale(10), right: 0, bottom: 0, left: scale(10),
    justifyContent: 'center', alignItems: 'center', paddingRight: scale(10),
  },
  logoImg: { width: moderateScale(300), height: moderateScale(150), opacity: 0.15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(12), zIndex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(4), alignSelf: 'flex-start' },
  badgeDot: { width: s(6), height: s(6), borderRadius: s(3), backgroundColor: TRAINER_COLOR },
  badgeText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7), color: TRAINER_COLOR, letterSpacing: s(1.5), textTransform: 'uppercase' },
  title: { fontFamily: Fonts.orbitron.bold, fontSize: rf(15), color: TRAINER_COLOR, letterSpacing: s(3.5), marginBottom: vs(6) },
  workoutBadge: { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(4), alignSelf: 'flex-start', backgroundColor: `${TRAINER_COLOR}15` },
  workoutText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7), letterSpacing: s(1), color: TRAINER_COLOR },
  daysBox: { alignItems: 'flex-end', zIndex: 1 },
  daysNumber: { fontFamily: Fonts.orbitron.regular, fontSize: rf(28), lineHeight: rf(36), color: TRAINER_COLOR },
  daysLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(8), color: Colors.zinc[500], letterSpacing: s(1.5), textTransform: 'uppercase', textAlign: 'right' },
  divider: { height: vs(1), backgroundColor: `${TRAINER_COLOR}25`, marginVertical: vs(12), zIndex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 },
  footerText: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[500] },
  activeChip: { flexDirection: 'row', alignItems: 'center', gap: s(4), paddingHorizontal: s(10), paddingVertical: vs(5), borderRadius: ms(6), borderWidth: 1, borderColor: `${TRAINER_COLOR}40`, backgroundColor: `${TRAINER_COLOR}10` },
  activeChipText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(8), color: TRAINER_COLOR, letterSpacing: s(1) },
});

// ═══════════════════════════════════════════════════════════════
// MAIN STYLES
// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: s(24), gap: vs(12), paddingBottom: vs(100) },

  welcomeSection: { marginBottom: vs(0) },
  welcomeLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(8), color: Colors.zinc[400], letterSpacing: s(2), textTransform: 'uppercase', marginBottom: vs(4), fontWeight: '600' },
  welcomeName: { fontFamily: Fonts.orbitron.extraBold, fontSize: rf(18), color: Colors.white, letterSpacing: s(3.6) },
  userTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: s(6), marginTop: vs(8), backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: s(10), paddingVertical: vs(4), borderRadius: ms(6), alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  userTypeBadgeText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(8), color: Colors.blue, letterSpacing: s(1.5) },

  // ✅ TEST BUTTON STYLE
  testBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: s(8), backgroundColor: TRAINER_COLOR, padding: vs(14),
    borderRadius: ms(12),
  },
  testBtnText: {
    fontFamily: Fonts.rajdhani.bold, fontSize: rf(11),
    color: '#000', letterSpacing: 0.5,
  },

  membershipCard: { borderRadius: ms(16), padding: s(16), borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', position: 'relative', backgroundColor: '#0a0a0a' },
  allmemberLogo: { position: 'absolute', top: scale(10), right: 0, bottom: 0, left: scale(10), justifyContent: 'center', alignItems: 'center', paddingRight: scale(10) },
  allmemberLogoimg: { width: moderateScale(300), height: moderateScale(150), opacity: 0.15 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(4), alignSelf: 'flex-start' },
  liveDot: { width: s(6), height: s(6), borderRadius: s(3), backgroundColor: Colors.zinc[400] },
  liveBadgeText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7), color: Colors.zinc[400], letterSpacing: s(1.5), textTransform: 'uppercase' },
  membershipTitle: { fontFamily: Fonts.orbitron.bold, fontSize: rf(15), color: Colors.white, letterSpacing: s(3.5), marginBottom: vs(6) },
  workoutBadge: { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(4), alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.06)' },
  workoutBadgeText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7), letterSpacing: s(1), color: Colors.zinc[500] },
  membershipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(12), zIndex: 1 },
  daysContainer: { alignItems: 'flex-end', zIndex: 1 },
  daysNumber: { fontFamily: Fonts.orbitron.regular, fontSize: rf(28), lineHeight: rf(36), color: Colors.white },
  daysLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(8), color: Colors.zinc[500], letterSpacing: s(1.5), textTransform: 'uppercase', textAlign: 'right' },
  cardDivider: { height: vs(1), backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: vs(12), zIndex: 1 },
  membershipFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 },
  expiryText: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[500] },
  actionBtn: { paddingHorizontal: s(16), paddingVertical: vs(7), borderRadius: ms(8), borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)' },
  actionBtnText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(9), color: Colors.white, letterSpacing: s(1.2) },
  infoRows: { gap: vs(6), marginBottom: vs(4), zIndex: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[500] },
  infoValue: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(9), color: Colors.white },
  pendingNote: { flex: 1, fontFamily: Fonts.rajdhani.regular, fontSize: rf(8), color: Colors.zinc[300], marginLeft: s(6) },

  facilityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(16) },
  facilityTitle: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  facilityTitleText: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(7), color: Colors.white, letterSpacing: s(2.4), textTransform: 'uppercase' },
  logoContainer: { position: 'absolute', top: s(27), right: 0, bottom: 0, left: s(230), justifyContent: 'center', alignItems: 'center', paddingRight: s(10) },
  gymLogo: { width: ms(150), height: ms(150), opacity: 0.5 },
  facilityStats: { flexDirection: 'row', alignItems: 'flex-end', gap: s(12), marginBottom: vs(8) },
  facilityNumber: { fontFamily: Fonts.orbitron.regular, fontSize: rf(36), color: Colors.white, lineHeight: rf(40) },
  facilityLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(10), color: Colors.zinc[500], letterSpacing: s(2), textTransform: 'uppercase', paddingBottom: vs(4) },
  progressBar: { height: vs(4), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(2), overflow: 'hidden', marginTop: vs(16) },
  progressFill: { height: '100%', width: '45%', backgroundColor: Colors.zinc[400] },
  predictionContainer: { marginTop: vs(16) },
  predictionDivider: { height: vs(1), backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: vs(16) },
  predictionContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  predictionLeft: { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  predictionIconWrapper: { width: ms(28), height: ms(28), borderRadius: ms(14), backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  predictionTextWrapper: { gap: vs(2) },
  predictionLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(6), color: Colors.zinc[500], letterSpacing: s(1.5), textTransform: 'uppercase' },
  predictionValue: { flexDirection: 'row', alignItems: 'baseline' },
  predictionNumber: { fontFamily: Fonts.orbitron.bold, fontSize: rf(14), color: Colors.green },
  predictionText: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(10), color: Colors.zinc[400] },
  predictionRight: { alignItems: 'flex-end' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: s(4), backgroundColor: 'rgba(34,197,94,0.1)', paddingHorizontal: s(8), paddingVertical: vs(4), borderRadius: ms(4), borderWidth: s(1), borderColor: 'rgba(34,197,94,0.2)' },
  trendText: { fontFamily: Fonts.orbitron.bold, fontSize: rf(10), color: Colors.green },
  expectedContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(12), paddingTop: vs(12), borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)' },
  expectedLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[500], letterSpacing: s(1) },
  expectedValue: { fontFamily: Fonts.orbitron.regular, fontSize: rf(11), color: Colors.zinc[300] },

  actionButtons: { flexDirection: 'row', gap: s(16) },
  actionButton: { flex: 1, paddingVertical: vs(24) },
  actionButtonContent: { alignItems: 'center', gap: vs(8) },
  actionIcon: { width: ms(32), height: ms(32), borderRadius: ms(16), borderWidth: s(1), borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  actionIconInactive: { borderColor: 'rgba(255,255,255,0.1)' },
  actionButtonText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(9), color: Colors.white, letterSpacing: s(1.8), textTransform: 'uppercase' },
  actionButtonTextInactive: { color: Colors.zinc[500] },

  trialCtaBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: s(16), borderRadius: ms(12), borderWidth: 1, borderColor: 'rgba(234,179,8,0.18)' },
  trialCtaContent: { flexDirection: 'row', alignItems: 'center', gap: s(12) },
  trialCtaText: { gap: vs(2) },
  trialCtaTitle: { fontFamily: Fonts.orbitron.semiBold, fontSize: rf(10), color: Colors.gold, letterSpacing: s(1) },
  trialCtaSubtitle: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(8), color: Colors.zinc[400] },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { maxHeight: '90%', borderTopLeftRadius: ms(24), borderTopRightRadius: ms(24), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#000000' },
  modalHeader: { alignItems: 'center', paddingTop: vs(12), paddingBottom: vs(16), paddingHorizontal: s(20) },
  modalDragHandle: { width: s(40), height: vs(4), backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: ms(2), marginBottom: vs(16) },
  modalTitle: { fontFamily: Fonts.orbitron.bold, fontSize: rf(14), color: Colors.white, letterSpacing: s(3), marginBottom: vs(4) },
  modalSubtitle: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[500], letterSpacing: s(1), textAlign: 'center' },
  plansScrollContent: { paddingHorizontal: s(20), paddingBottom: vs(20), gap: vs(12) },
  loadingContainer: { paddingVertical: vs(60), alignItems: 'center', gap: vs(16) },
  loadingText: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(10), color: Colors.zinc[500], letterSpacing: s(1) },
  noPlansContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: vs(60) },
  noPlansEmoji: { fontSize: rf(36), marginBottom: vs(12), textAlign: 'center' },
  noPlansText: { fontFamily: Fonts.orbitron.semiBold, fontSize: rf(14), color: Colors.zinc[400], marginTop: vs(4) },
  noPlansSubtext: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(10), color: Colors.zinc[600], marginTop: vs(8), textAlign: 'center' },
  closeModalButton: { alignItems: 'center', paddingVertical: vs(16), borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  closeModalText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(10), color: Colors.zinc[500], letterSpacing: s(2) },

  planCard: { padding: s(16), borderRadius: ms(16), borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden', backgroundColor: '#000000' },
  planBgIconContainer: { position: 'absolute', right: -s(15), top: -s(10), opacity: 0.8 },
  planCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(10) },
  planBadge: { flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(4), paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(4), alignSelf: 'flex-start' },
  planBadgeDot: { width: s(6), height: s(6), borderRadius: s(3) },
  planBadgeText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7), letterSpacing: s(1.5), textTransform: 'uppercase' },
  planName: { fontFamily: Fonts.orbitron.bold, fontSize: rf(14), letterSpacing: s(2) },
  planPriceContainer: { alignItems: 'flex-end' },
  planOriginalPrice: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(10), color: Colors.zinc[500], textDecorationLine: 'line-through' },
  planPrice: { fontFamily: Fonts.orbitron.bold, fontSize: rf(20) },
  planDuration: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[500] },
  workoutTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: s(6), paddingHorizontal: s(8), paddingVertical: vs(4), borderRadius: ms(4), alignSelf: 'flex-start', marginBottom: vs(10) },
  workoutTypeText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(8), letterSpacing: s(1) },
  planDivider: { height: 1, marginVertical: vs(10) },
  planFeatures: { gap: vs(6), marginBottom: vs(10) },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  featureText: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[300] },
  offerBadge: { flexDirection: 'row', alignItems: 'center', gap: s(6), backgroundColor: 'rgba(234,179,8,0.15)', paddingHorizontal: s(10), paddingVertical: vs(6), borderRadius: ms(6), marginBottom: vs(12), alignSelf: 'flex-start' },
  offerText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(8), color: Colors.gold, letterSpacing: s(1) },
  selectPlanButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(8), backgroundColor: 'rgba(255,255,255,0.06)', paddingVertical: vs(12), borderRadius: ms(8), borderWidth: 1 },
  selectPlanText: { fontFamily: Fonts.orbitron.semiBold, fontSize: rf(9), color: Colors.white, letterSpacing: s(2) },
});

export default UserDashboardScreen;