import React, { useState, useEffect } from 'react';
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
import Icon from 'react-native-vector-icons/Feather';
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  CheckmarkCircle03Icon,
  Logout02Icon,
  Activity01Icon,
  Clock01Icon,
  ArrowRight01Icon,
  SparklesIcon,
  Shield01Icon,
  Dumbbell01Icon,
  FlashIcon,
} from "@hugeicons/core-free-icons";

import Header from '../../components/shared/Header';
import GlassCard from '../../components/shared/GlassCard';
import GlassButton from '../../components/shared/GlassButton';
import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import gymlogoimg from "../user/gymlogoimg.png";
import { usePlans } from '../../context/PlansContext';
import { useMembershipRequests } from '../../context/MembershipRequestsContext';

const s = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const DEFAULT_TEMPLATES = {
  'cardio_weights': {
    colors: ['rgba(234, 179, 8, 0.35)', 'rgba(234, 179, 8, 0.15)', 'rgba(0, 0, 0, 0.95)'],
    iconColor: Colors.gold,
    textColor: Colors.gold,
  },
  'weights_only': {
    colors: ['rgba(168, 85, 247, 0.35)', 'rgba(168, 85, 247, 0.15)', 'rgba(0, 0, 0, 0.95)'],
    iconColor: '#a855f7',
    textColor: '#c084fc',
  },
};

// ═══════════════════════════════════════════════════════════════
// ✅ REQUEST PENDING CARD - Dynamic tier colors from planTemplate
// ═══════════════════════════════════════════════════════════════
const RequestPendingCard = ({ request }) => {
  // ✅ KEY FIX: context mein 'planTemplate' save hota hai, 'template' nahi
  const template = request.planTemplate
    || DEFAULT_TEMPLATES[request.workoutType]
    || DEFAULT_TEMPLATES['cardio_weights'];

  const accentColor = template.iconColor || Colors.gold;
  const textColor = template.textColor || Colors.gold;

  return (
    <View style={[styles.membershipCard, { borderColor: `${accentColor}40` }]}>
      {/* ✅ Dynamic tier overlay */}
      <LinearGradient
        colors={[`${accentColor}12`, `${accentColor}05`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      {/* Background Icon */}
      <View style={styles.cardBgContainer}>
        <HugeiconsIcon
          icon={Clock01Icon}
          size={ms(100)}
          color={`${accentColor}15`}
          strokeWidth={0.5}
        />
      </View>

      <View style={styles.membershipHeader}>
        <View style={{ flex: 1 }}>
          <View style={[styles.statusBadge, { backgroundColor: `${accentColor}20` }]}>
            <Icon name="loader" size={rf(10)} color={accentColor} />
            <Text style={[styles.statusBadgeText, { color: accentColor }]}>Approval Pending</Text>
          </View>

          <Text style={[styles.tierName, { color: textColor }]}>{request.planName}</Text>
          <Text style={styles.tierSubtext}>Waiting for admin approval</Text>

          {/* ✅ Workout type badge */}
          {request.workoutType && (
            <View style={[styles.workoutBadge, { backgroundColor: `${accentColor}20`, marginTop: vs(4) }]}>
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
          <Icon name="hourglass" size={rf(30)} color={accentColor} />
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: `${accentColor}20` }]} />

      <View style={styles.requestInfoContainer}>
        <View style={styles.requestInfoRow}>
          <Text style={styles.requestInfoLabel}>Requested Plan:</Text>
          <Text style={[styles.requestInfoValue, { color: textColor }]}>{request.planName}</Text>
        </View>
        <View style={styles.requestInfoRow}>
          <Text style={styles.requestInfoLabel}>Duration:</Text>
          <Text style={styles.requestInfoValue}>{request.planDuration}</Text>
        </View>
        <View style={styles.requestInfoRow}>
          <Text style={styles.requestInfoLabel}>Amount:</Text>
          <Text style={styles.requestInfoValue}>${request.planPrice}</Text>
        </View>
        <View style={styles.requestInfoRow}>
          <Text style={styles.requestInfoLabel}>Requested:</Text>
          <Text style={styles.requestInfoValue}>
            {new Date(request.requestedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.pendingFooter}>
        <Icon name="info" size={rf(12)} color={Colors.zinc[500]} />
        <Text style={styles.pendingFooterText}>
          You'll be notified once your request is approved
        </Text>
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// ✅ PLAN CARD COMPONENT - Black background + tier colors
// ═══════════════════════════════════════════════════════════════
const PlanCard = ({ plan, onSelect, submitting }) => {
  const template = plan.template || DEFAULT_TEMPLATES[plan.workoutType] || DEFAULT_TEMPLATES['cardio_weights'];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onSelect(plan)}
      disabled={submitting}
      style={submitting && { opacity: 0.5 }}
    >
      <View style={[styles.planCard, { borderColor: `${template.iconColor}40` }]}>
        {/* ✅ Subtle tier color overlay */}
        <LinearGradient
          colors={[`${template.iconColor}12`, `${template.iconColor}06`, 'transparent']}
          style={StyleSheet.absoluteFill}
        />

        {/* Background Icon */}
        <View style={styles.planBgIconContainer}>
          <HugeiconsIcon
            icon={Shield01Icon}
            size={ms(80)}
            color={`${template.iconColor}18`}
            strokeWidth={0.5}
          />
        </View>

        {/* Plan Header */}
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
              {plan.name}
            </Text>
          </View>

          <View style={styles.planPriceContainer}>
            {plan.hasOffer && plan.offer && (
              <Text style={styles.planOriginalPrice}>${plan.price}</Text>
            )}
            <Text style={[styles.planPrice, { color: template.textColor }]}>
              ${plan.hasOffer && plan.finalPrice
                ? plan.finalPrice.toFixed(2)
                : plan.price}
            </Text>
            <Text style={styles.planDuration}>/{plan.duration}</Text>
          </View>
        </View>

        {/* Workout Type Badge */}
        <View style={[styles.workoutTypeBadge, { backgroundColor: `${template.iconColor}20` }]}>
          <HugeiconsIcon
            icon={plan.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
            size={ms(10)}
            color={template.iconColor}
          />
          <Text style={[styles.workoutTypeText, { color: template.iconColor }]}>
            {plan.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' :
             plan.workoutType === 'weights_only' ? 'WEIGHTS ONLY' : 'CARDIO ONLY'}
          </Text>
        </View>

        {/* Divider */}
        <View style={[styles.planDivider, { backgroundColor: `${template.iconColor}25` }]} />

        {/* Features */}
        <View style={styles.planFeatures}>
          {plan.features?.slice(0, 4).map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              <Icon name="check" size={rf(10)} color={Colors.green} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Offer Badge */}
        {plan.hasOffer && plan.offer && (
          <View style={styles.offerBadge}>
            <HugeiconsIcon icon={FlashIcon} size={ms(10)} color={Colors.gold} />
            <Text style={styles.offerText}>{plan.offer.text}</Text>
          </View>
        )}

        {/* Select Button */}
        <View style={[styles.selectPlanButton, { borderColor: `${template.iconColor}40` }]}>
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Text style={styles.selectPlanText}>REQUEST MEMBERSHIP</Text>
              <Icon name="send" size={rf(12)} color={Colors.white} />
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

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalDragHandle} />
            <Text style={styles.modalTitle}>MEMBERSHIP PLANS</Text>
            <Text style={styles.modalSubtitle}>
              {plans.length > 0
                ? 'Choose your fitness journey'
                : 'No plans available at the moment'}
            </Text>
          </View>

          {/* ✅ ScrollView with proper flex */}
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
            ) : plans.length === 0 ? (
              <View style={styles.noPlansContainer}>
                <Icon name="inbox" size={rf(40)} color={Colors.zinc[600]} />
                <Text style={styles.noPlansText}>No Plans Available</Text>
                <Text style={styles.noPlansSubtext}>
                  Check back later for membership options
                </Text>
              </View>
            ) : (
              plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onSelect={onSelectPlan}
                  submitting={submitting}
                />
              ))
            )}
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalText}>CLOSE</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════
// ✅ TRIAL MEMBERSHIP CARD - Black background
// ═══════════════════════════════════════════════════════════════
const TrialMembershipCard = ({ daysLeft, onViewPlans }) => {
  return (
    <View style={[styles.membershipCard, { borderColor: 'rgba(59, 130, 246, 0.35)' }]}>
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.12)', 'rgba(59, 130, 246, 0.05)', 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.cardBgContainer}>
        <HugeiconsIcon
          icon={Clock01Icon}
          size={ms(100)}
          color="rgba(59, 130, 246, 0.15)"
          strokeWidth={0.5}
        />
      </View>

      <View style={styles.membershipHeader}>
        <View style={{ flex: 1 }}>
          <View style={[styles.statusBadge, { backgroundColor: 'rgba(59, 130, 246, 0.20)' }]}>
            <Icon name="clock" size={rf(10)} color={Colors.blue} />
            <Text style={[styles.statusBadgeText, { color: Colors.blue }]}>Trial Period</Text>
          </View>
          <Text style={[styles.tierName, { color: Colors.blue }]}>TRIAL ACCESS</Text>
          <Text style={styles.tierSubtext}>Limited Features</Text>
        </View>
        <View style={styles.daysContainer}>
          <Text style={[styles.daysNumber, { color: Colors.blue }]}>{daysLeft}</Text>
          <Text style={styles.daysLabel}>Days Left</Text>
        </View>
      </View>

      {/* Trial Progress Bar */}
      <View style={styles.trialProgressContainer}>
        <View style={styles.trialProgressBar}>
          <LinearGradient
            colors={[Colors.blue, 'rgba(59, 130, 246, 0.5)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.trialProgressFill, { width: `${(daysLeft / 7) * 100}%` }]}
          />
        </View>
        <Text style={styles.trialProgressText}>
          {7 - daysLeft} of 7 days used
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: 'rgba(59, 130, 246, 0.20)' }]} />

      {/* Trial Limitations */}
      <View style={styles.trialLimitations}>
        <View style={styles.limitationItem}>
          <Icon name="x-circle" size={rf(10)} color={Colors.red} />
          <Text style={styles.limitationText}>No Personal Training</Text>
        </View>
        <View style={styles.limitationItem}>
          <Icon name="x-circle" size={rf(10)} color={Colors.red} />
          <Text style={styles.limitationText}>Limited Equipment Access</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: 'rgba(59, 130, 246, 0.20)' }]} />

      {/* Upgrade CTA */}
      <View style={styles.trialFooter}>
        <View style={styles.upgradeTextContainer}>
          <HugeiconsIcon icon={SparklesIcon} size={ms(14)} color={Colors.gold} />
          <Text style={styles.upgradePromptText}>Unlock Full Access</Text>
        </View>

        <TouchableOpacity
          style={styles.viewPlansButton}
          onPress={onViewPlans}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.blue, 'rgba(59, 130, 246, 0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.viewPlansGradient}
          >
            <Text style={styles.viewPlansText}>VIEW MEMBERSHIP PLANS</Text>
            <HugeiconsIcon icon={ArrowRight01Icon} size={ms(14)} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// ✅ ELITE/LEGENDARY MEMBERSHIP CARD - Black background + tier colors
// ═══════════════════════════════════════════════════════════════
const EliteMembershipCard = ({ membershipData, onExtend }) => {
  const template = membershipData.template
    || DEFAULT_TEMPLATES[membershipData.workoutType]
    || DEFAULT_TEMPLATES['cardio_weights'];

  return (
    <View style={[styles.membershipCard, { borderColor: `${template.iconColor}40` }]}>
      <LinearGradient
        colors={[`${template.iconColor}15`, `${template.iconColor}08`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.cardBgContainer}>
        <HugeiconsIcon
          icon={Shield01Icon}
          size={ms(100)}
          color={`${template.iconColor}18`}
          strokeWidth={0.5}
        />
      </View>

      <View style={styles.membershipHeader}>
        <View style={{ flex: 1 }}>
          <View style={[styles.statusBadge, { backgroundColor: `${template.iconColor}20` }]}>
            <View style={[styles.statusDot, { backgroundColor: template.iconColor }]} />
            <Text style={[styles.statusBadgeText, { color: template.iconColor }]}>
              Active Plan
            </Text>
          </View>

          <Text style={[styles.tierName, { color: template.textColor }]}>
            {membershipData.tierName}
          </Text>

          {membershipData.workoutType && (
            <View style={[styles.workoutBadge, { backgroundColor: `${template.iconColor}20` }]}>
              <HugeiconsIcon
                icon={membershipData.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                size={ms(10)}
                color={template.iconColor}
              />
              <Text style={[styles.workoutBadgeText, { color: template.iconColor }]}>
                {membershipData.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHT LIFTING' :
                 membershipData.workoutType === 'weights_only' ? 'WEIGHT LIFTING ONLY' : 'CARDIO ONLY'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.daysContainer}>
          <Text style={[styles.daysNumber, { color: template.textColor }]}>{membershipData.daysLeft}</Text>
          <Text style={styles.daysLabel}>Days Left</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: `${template.iconColor}25` }]} />

      <View style={styles.membershipFooter}>
        <Text style={styles.expiryText}>Exp. {membershipData.expiryDate}</Text>
        <TouchableOpacity
          style={[styles.extendButton, { borderColor: `${template.iconColor}40` }]}
          onPress={onExtend}
          activeOpacity={0.8}
        >
          <Text style={[styles.extendButtonText, { color: template.textColor }]}>Extend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const UserDashboardScreen = ({ navigation }) => {
  const { getActivePlans, loading: plansLoading, refreshPlans } = usePlans();
  const {
    submitRequest,
    getUserRequestStatus,
    getMemberById,
    loading: requestsLoading,
    refreshData,
  } = useMembershipRequests();

  const [activePlans, setActivePlans] = useState([]);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = {
    id: 'user_001',
    name: 'Abdullah Ahmed',
    phone: '+92 300 1234567',
    email: 'abdullah@example.com',
    photo: null,
  };

  const approvedMember = getMemberById(currentUser.id);
  const pendingRequest = getUserRequestStatus(currentUser.id);
  const hasPending = pendingRequest?.status === 'pending';

  const isTrialMember = !approvedMember || !approvedMember.isActive;
  const isPendingApproval = hasPending;

  const trialData = { daysLeft: 5 };

  // ✅ Pending request ka template/colors - planTemplate use karo
  const pendingTemplate = pendingRequest?.planTemplate
    || DEFAULT_TEMPLATES[pendingRequest?.workoutType]
    || DEFAULT_TEMPLATES['cardio_weights'];
  const pendingAccentColor = pendingTemplate?.iconColor || Colors.gold;
  const pendingTextColor = pendingTemplate?.textColor || Colors.gold;

  useEffect(() => {
    const plans = getActivePlans();
    setActivePlans(plans);
  }, []);

  useEffect(() => {
    if (showPlansModal) {
      refreshPlans().then(() => {
        const plans = getActivePlans();
        setActivePlans(plans);
      });
    }
  }, [showPlansModal]);

  const handleSelectPlan = async (plan) => {
    if (hasPending) {
      Alert.alert(
        'Request Pending',
        'You already have a pending membership request. Please wait for admin approval.',
        [{ text: 'OK' }]
      );
      setShowPlansModal(false);
      return;
    }

    Alert.alert(
      'Confirm Request',
      `Do you want to request "${plan.name}" membership for $${plan.hasOffer ? plan.finalPrice?.toFixed(2) : plan.price}/${plan.duration}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit Request',
          onPress: async () => {
            setSubmitting(true);
            try {
              await submitRequest(currentUser, plan);
              setShowPlansModal(false);
              Alert.alert(
                'Request Submitted! 🎉',
                'Your membership request has been sent to the admin for approval.',
                [{ text: 'OK' }]
              );
              await refreshData();
            } catch (error) {
              Alert.alert('Error', 'Failed to submit request. Please try again.');
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
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
        <SafeAreaView style={styles.safeArea} edges={['']}>
          <Header />

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeLabel}>Welcome back</Text>
              <Text style={styles.welcomeName}>{currentUser.name}</Text>

              {/* ✅ Dynamic welcome badge - pending state mein tier ka color */}
              {isPendingApproval ? (
                <View style={[
                  styles.userTypeBadge,
                  {
                    backgroundColor: `${pendingAccentColor}15`,
                    borderColor: `${pendingAccentColor}30`,
                  },
                ]}>
                  <Icon name="loader" size={rf(10)} color={pendingAccentColor} />
                  <Text style={[styles.userTypeBadgeText, { color: pendingTextColor }]}>
                    APPROVAL PENDING
                  </Text>
                </View>
              ) : isTrialMember ? (
                <View style={styles.userTypeBadge}>
                  <Icon name="clock" size={rf(10)} color={Colors.blue} />
                  <Text style={styles.userTypeBadgeText}>TRIAL MEMBER</Text>
                </View>
              ) : (
                <View style={[
                  styles.userTypeBadge,
                  {
                    backgroundColor: `${approvedMember?.template?.iconColor || Colors.gold}15`,
                    borderColor: `${approvedMember?.template?.iconColor || Colors.gold}30`,
                  },
                ]}>
                  <Icon name="award" size={rf(10)} color={approvedMember?.template?.iconColor || Colors.gold} />
                  <Text style={[
                    styles.userTypeBadgeText,
                    { color: approvedMember?.template?.textColor || Colors.gold },
                  ]}>
                    {approvedMember?.tierName || 'PREMIUM MEMBER'}
                  </Text>
                </View>
              )}
            </View>

            {/* ✅ Membership Card - conditional rendering */}
            {isPendingApproval ? (
              <RequestPendingCard request={pendingRequest} />
            ) : isTrialMember ? (
              <TrialMembershipCard
                daysLeft={trialData.daysLeft}
                onViewPlans={() => setShowPlansModal(true)}
              />
            ) : (
              <EliteMembershipCard
                membershipData={{
                  tierName: approvedMember.tierName,
                  daysLeft: approvedMember.daysLeft,
                  expiryDate: new Date(approvedMember.expiryDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }),
                  workoutType: approvedMember.workoutType,
                  template: approvedMember.template,
                }}
                onExtend={() => setShowPlansModal(true)}
              />
            )}

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
                      <Text style={styles.predictionValue}>
                        <Text style={styles.predictionNumber}>4</Text>
                        <Text style={styles.predictionText}> members will leave</Text>
                      </Text>
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

            {/* Check In/Out Buttons */}
            <View style={styles.actionButtons}>
              <GlassButton variant="glass" style={styles.actionButton}>
                <View style={styles.actionButtonContent}>
                  <View style={styles.actionIcon}>
                    <HugeiconsIcon icon={CheckmarkCircle03Icon} size={20} color={Colors.white} />
                  </View>
                  <Text style={styles.actionButtonText}>Check In</Text>
                </View>
              </GlassButton>

              <GlassButton variant="outline" style={styles.actionButton}>
                <View style={styles.actionButtonContent}>
                  <View style={[styles.actionIcon, styles.actionIconInactive]}>
                    <HugeiconsIcon icon={Logout02Icon} size={20} color={Colors.zinc[500]} />
                  </View>
                  <Text style={[styles.actionButtonText, styles.actionButtonTextInactive]}>
                    Check Out
                  </Text>
                </View>
              </GlassButton>
            </View>

            {/* Trial CTA Banner */}
            {isTrialMember && !isPendingApproval && (
              <TouchableOpacity activeOpacity={0.85} onPress={() => setShowPlansModal(true)}>
                <LinearGradient
                  colors={['rgba(234, 179, 8, 0.15)', 'rgba(234, 179, 8, 0.05)', 'transparent']}
                  style={styles.trialCtaBanner}
                >
                  <View style={styles.trialCtaContent}>
                    <Icon name="gift" size={rf(18)} color={Colors.gold} />
                    <View style={styles.trialCtaText}>
                      <Text style={styles.trialCtaTitle}>Upgrade Today!</Text>
                      <Text style={styles.trialCtaSubtitle}>
                        {activePlans.length > 0
                          ? `${activePlans.length} plans available`
                          : 'Check available plans'}
                      </Text>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={rf(16)} color={Colors.gold} />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </ScrollView>

          <BottomNav
            activeTab="dashboard"
            onTabChange={(tab) => {
              if (tab === 'profile') navigation.navigate('UserProfile');
              if (tab === 'membership') setShowPlansModal(true);
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

const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient: { flex: 2 },
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: s(24),
    gap: vs(12),
    paddingBottom: vs(100),
  },
  welcomeSection: { marginBottom: vs(0) },
  welcomeLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[400],
    letterSpacing: s(2),
    textTransform: 'uppercase',
    marginBottom: vs(4),
    fontWeight: '600',
  },
  welcomeName: {
    fontFamily: Fonts.orbitron.extraBold,
    fontSize: rf(18),
    color: Colors.white,
    letterSpacing: s(3.6),
  },

  // User Type Badge
  userTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginTop: vs(8),
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(6),
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  userTypeBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: Colors.blue,
    letterSpacing: s(1.5),
  },

  // ✅ MEMBERSHIP CARD - BLACK BACKGROUND
  membershipCard: {
    borderRadius: ms(16),
    padding: s(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
  },
  cardBgContainer: {
    position: 'absolute',
    top: -ms(10),
    right: -ms(15),
    opacity: 0.8,
  },
  membershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(12),
    zIndex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginBottom: vs(4),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
  },
  statusBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  tierName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(15),
    letterSpacing: 4,
    marginBottom: vs(6),
  },
  tierSubtext: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[500],
    letterSpacing: 1,
    marginTop: vs(2),
  },
  workoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
  },
  workoutBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    letterSpacing: 1,
  },
  daysContainer: {
    alignItems: 'flex-end',
    zIndex: 1,
  },
  daysNumber: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(26),
    lineHeight: rf(36),
  },
  daysLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[400],
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  divider: {
    height: vs(1),
    marginVertical: vs(12),
    zIndex: 1,
  },
  membershipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  expiryText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[400],
  },
  extendButton: {
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: ms(8),
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  extendButtonText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(9),
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Pending Card
  requestInfoContainer: { gap: vs(8), marginBottom: vs(12) },
  requestInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestInfoLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
  },
  requestInfoValue: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(9),
    color: Colors.white,
  },
  pendingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: s(10),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  pendingFooterText: {
    flex: 1,
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[500],
  },

  // Trial Card
  trialProgressContainer: { marginTop: vs(12), marginBottom: vs(4) },
  trialProgressBar: {
    height: vs(6),
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  trialProgressFill: { height: '100%', borderRadius: ms(3) },
  trialProgressText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[500],
    marginTop: vs(6),
    textAlign: 'right',
  },
  trialLimitations: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: vs(8),
  },
  limitationItem: { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  limitationText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[500],
  },
  trialFooter: { marginTop: vs(4) },
  upgradeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginBottom: vs(10),
  },
  upgradePromptText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(9),
    color: Colors.gold,
    letterSpacing: 1,
  },
  viewPlansButton: { borderRadius: ms(10), overflow: 'hidden' },
  viewPlansGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
  },
  viewPlansText: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(9),
    color: Colors.white,
    letterSpacing: 2,
  },

  // Facility Status
  facilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  facilityTitle: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  facilityTitleText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.white,
    letterSpacing: s(2.4),
    textTransform: 'uppercase',
  },
  logoContainer: {
    position: 'absolute',
    top: s(27),
    right: 0,
    bottom: 0,
    left: s(230),
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: s(10),
  },
  gymLogo: { width: ms(150), height: ms(150), opacity: 0.50 },
  facilityStats: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: s(12),
    marginBottom: vs(8),
  },
  facilityNumber: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(36),
    color: Colors.white,
    lineHeight: rf(40),
  },
  facilityLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[500],
    letterSpacing: s(2),
    textTransform: 'uppercase',
    paddingBottom: vs(4),
  },
  progressBar: {
    height: vs(4),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ms(2),
    overflow: 'hidden',
    marginTop: vs(16),
  },
  progressFill: { height: '100%', width: '45%', backgroundColor: Colors.zinc[400] },
  predictionContainer: { marginTop: vs(16) },
  predictionDivider: {
    height: vs(1),
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: vs(16),
  },
  predictionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionLeft: { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  predictionIconWrapper: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictionTextWrapper: { gap: vs(2) },
  predictionLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(6),
    color: Colors.zinc[500],
    letterSpacing: s(1.5),
    textTransform: 'uppercase',
  },
  predictionValue: { flexDirection: 'row', alignItems: 'baseline' },
  predictionNumber: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(14),
    color: Colors.green,
  },
  predictionText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[400],
  },
  predictionRight: { alignItems: 'flex-end' },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(4),
    borderWidth: s(1),
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  trendText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(10),
    color: Colors.green,
  },
  expectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(12),
    paddingTop: vs(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
  },
  expectedLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
    letterSpacing: s(1),
  },
  expectedValue: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(11),
    color: Colors.zinc[300],
  },

  // Action Buttons
  actionButtons: { flexDirection: 'row', gap: s(16) },
  actionButton: { flex: 1, paddingVertical: vs(24) },
  actionButtonContent: { alignItems: 'center', gap: vs(8) },
  actionIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    borderWidth: s(1),
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconInactive: { borderColor: 'rgba(255, 255, 255, 0.1)' },
  actionButtonText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(9),
    color: Colors.white,
    letterSpacing: s(1.8),
    textTransform: 'uppercase',
  },
  actionButtonTextInactive: { color: Colors.zinc[500] },

  // Trial CTA Banner
  trialCtaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: s(16),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.2)',
    marginTop: vs(4),
  },
  trialCtaContent: { flexDirection: 'row', alignItems: 'center', gap: s(12) },
  trialCtaText: { gap: vs(2) },
  trialCtaTitle: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(10),
    color: Colors.gold,
    letterSpacing: s(1),
  },
  trialCtaSubtitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[400],
  },

  // ✅ MODAL - BLACK BACKGROUND + 90% height
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '90%',
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#000000',
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: vs(12),
    paddingBottom: vs(16),
    paddingHorizontal: s(20),
  },
  modalDragHandle: {
    width: s(40),
    height: vs(4),
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: ms(2),
    marginBottom: vs(16),
  },
  modalTitle: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(14),
    color: Colors.white,
    letterSpacing: s(3),
    marginBottom: vs(4),
  },
  modalSubtitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
    letterSpacing: s(1),
    textAlign: 'center',
  },
  plansScrollContent: {
    paddingHorizontal: s(20),
    paddingBottom: vs(20),
    gap: vs(12),
  },

  // Loading & Empty
  loadingContainer: { paddingVertical: vs(60), alignItems: 'center', gap: vs(16) },
  loadingText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[500],
    letterSpacing: s(1),
  },
  noPlansContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(60),
  },
  noPlansText: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(14),
    color: Colors.zinc[400],
    marginTop: vs(16),
  },
  noPlansSubtext: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[600],
    marginTop: vs(8),
    textAlign: 'center',
  },

  // ✅ PLAN CARD - BLACK BACKGROUND + TIER COLORS
  planCard: {
    padding: s(16),
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  planBgIconContainer: {
    position: 'absolute',
    right: -s(15),
    top: -s(10),
    opacity: 0.8,
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(10),
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginBottom: vs(4),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
  },
  planBadgeDot: { width: s(6), height: s(6), borderRadius: s(3) },
  planBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    letterSpacing: s(1.5),
    textTransform: 'uppercase',
  },
  planName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(14),
    letterSpacing: s(2),
  },
  planPriceContainer: { alignItems: 'flex-end' },
  planOriginalPrice: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[500],
    textDecorationLine: 'line-through',
  },
  planPrice: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(20),
  },
  planDuration: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
  },
  workoutTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
    marginBottom: vs(10),
  },
  workoutTypeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    letterSpacing: s(1),
  },
  planDivider: { height: 1, marginVertical: vs(10) },
  planFeatures: { gap: vs(6), marginBottom: vs(10) },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  featureText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[300],
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(6),
    marginBottom: vs(12),
    alignSelf: 'flex-start',
  },
  offerText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: Colors.gold,
    letterSpacing: s(1),
  },
  selectPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: vs(12),
    borderRadius: ms(8),
    borderWidth: 1,
  },
  selectPlanText: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(9),
    color: Colors.white,
    letterSpacing: s(2),
  },
  closeModalButton: {
    alignItems: 'center',
    paddingVertical: vs(16),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  closeModalText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(10),
    color: Colors.zinc[500],
    letterSpacing: s(2),
  },
});

export default UserDashboardScreen;