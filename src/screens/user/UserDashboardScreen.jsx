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
import Header from '../../components/shared/Header';
import GlassCard from '../../components/shared/GlassCard';
import GlassButton from '../../components/shared/GlassButton';
import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { HugeiconsIcon } from "@hugeicons/react-native";
import gymlogoimg from "../user/gymlogoimg.png";
import { usePlans } from '../../context/PlansContext';
import { useMembershipRequests } from '../../context/MembershipRequestsContext';
import {
  CheckmarkCircle03Icon,
  Logout02Icon,
  Activity01Icon,
  Clock01Icon,
  ArrowRight01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

// ═══════════════════════════════════════════════════════════════
// REQUEST PENDING CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
const RequestPendingCard = ({ request }) => {
  return (
    <LinearGradient
      colors={['rgba(234, 179, 8, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000']}
      style={styles.membershipGradient}
    >
      <GlassCard style={styles.membershipCard}>
        {/* Pending Icon Background */}
        <View style={styles.trialBgContainer}>
          <Icon
            name="clock"
            size={RFValue(80)}
            color="rgba(234, 179, 8, 0.08)"
            style={styles.trialBgIcon}
          />
        </View>

        <View style={styles.membershipHeader}>
          <View>
            <View style={styles.pendingBadge}>
              <Icon name="loader" size={RFValue(10)} color={Colors.gold} />
              <Text style={styles.pendingBadgeText}>Approval Pending</Text>
            </View>
            <Text style={styles.pendingTierText}>{request.planName}</Text>
            <Text style={styles.pendingSubtext}>Waiting for admin approval</Text>
          </View>
          <View style={styles.daysContainer}>
            <Icon name="hourglass" size={RFValue(30)} color={Colors.gold} />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Request Info */}
        <View style={styles.requestInfoContainer}>
          <View style={styles.requestInfoRow}>
            <Text style={styles.requestInfoLabel}>Requested Plan:</Text>
            <Text style={styles.requestInfoValue}>{request.planName}</Text>
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
          <Icon name="info" size={RFValue(12)} color={Colors.zinc[500]} />
          <Text style={styles.pendingFooterText}>
            You'll be notified once your request is approved
          </Text>
        </View>
      </GlassCard>
    </LinearGradient>
  );
};

// ═══════════════════════════════════════════════════════════════
// MEMBERSHIP PLANS MODAL COMPONENT
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

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.plansScrollContent}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.white} />
                <Text style={styles.loadingText}>Loading Plans...</Text>
              </View>
            ) : plans.length === 0 ? (
              <View style={styles.noPlansContainer}>
                <Icon name="inbox" size={RFValue(40)} color={Colors.zinc[600]} />
                <Text style={styles.noPlansText}>No Plans Available</Text>
                <Text style={styles.noPlansSubtext}>
                  Check back later for membership options
                </Text>
              </View>
            ) : (
              plans.map((plan, index) => (
                <TouchableOpacity
                  key={plan.id}
                  activeOpacity={0.85}
                  onPress={() => onSelectPlan(plan)}
                  disabled={submitting}
                  style={[styles.planCardWrapper, submitting && { opacity: 0.5 }]}
                >
                  <LinearGradient
                    colors={plan.template?.colors || ['rgba(113, 113, 122, 0.4)', 'rgba(24, 24, 27, 0.9)', '#000000']}
                    style={styles.planCard}
                  >
                    {/* Background Icon */}
                    <Icon
                      name="shield"
                      size={RFValue(60)}
                      color={`${plan.template?.iconColor || Colors.gold}15`}
                      style={styles.planBgIcon}
                    />

                    {/* Plan Header */}
                    <View style={styles.planCardHeader}>
                      <View>
                        <View style={styles.planBadge}>
                          <View 
                            style={[
                              styles.planBadgeDot, 
                              { backgroundColor: plan.template?.iconColor || Colors.gold }
                            ]} 
                          />
                          <Text style={styles.planBadgeText}>
                            {plan.template?.badge || 'PLAN'}
                          </Text>
                        </View>
                        <Text 
                          style={[
                            styles.planName, 
                            { color: plan.template?.textColor || Colors.gold }
                          ]}
                        >
                          {plan.name}
                        </Text>
                      </View>
                      <View style={styles.planPriceContainer}>
                        {plan.hasOffer && plan.offer && (
                          <Text style={styles.planOriginalPrice}>${plan.price}</Text>
                        )}
                        <Text style={styles.planPrice}>
                          ${plan.hasOffer && plan.finalPrice 
                            ? plan.finalPrice.toFixed(2) 
                            : plan.price}
                        </Text>
                        <Text style={styles.planDuration}>/{plan.duration}</Text>
                      </View>
                    </View>

                    {/* Workout Type Badge */}
                    <View style={styles.workoutTypeBadge}>
                      <Icon 
                        name={plan.workoutType === 'cardio_weights' ? 'activity' : 
                              plan.workoutType === 'weights_only' ? 'target' : 'heart'} 
                        size={RFValue(10)} 
                        color={plan.template?.iconColor || Colors.gold} 
                      />
                      <Text 
                        style={[
                          styles.workoutTypeText, 
                          { color: plan.template?.iconColor || Colors.gold }
                        ]}
                      >
                        {plan.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' :
                         plan.workoutType === 'weights_only' ? 'WEIGHTS ONLY' : 'CARDIO ONLY'}
                      </Text>
                    </View>

                    {/* Divider */}
                    <View style={styles.planDivider} />

                    {/* Features */}
                    <View style={styles.planFeatures}>
                      {plan.features?.map((feature, idx) => (
                        <View key={idx} style={styles.featureItem}>
                          <Icon name="check" size={RFValue(10)} color={Colors.green} />
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Offer Badge */}
                    {plan.hasOffer && plan.offer && (
                      <View style={styles.offerBadge}>
                        <Icon name="zap" size={RFValue(10)} color={Colors.gold} />
                        <Text style={styles.offerText}>{plan.offer.text}</Text>
                      </View>
                    )}

                    {/* Select Button */}
                    <View style={styles.selectPlanButton}>
                      {submitting ? (
                        <ActivityIndicator size="small" color={Colors.white} />
                      ) : (
                        <>
                          <Text style={styles.selectPlanText}>REQUEST MEMBERSHIP</Text>
                          <Icon name="send" size={RFValue(12)} color={Colors.white} />
                        </>
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
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
// TRIAL MEMBERSHIP CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
const TrialMembershipCard = ({ daysLeft, onViewPlans }) => {
  return (
    <LinearGradient
      colors={['rgba(59, 130, 246, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000']}
      style={styles.membershipGradient}
    >
      <GlassCard style={styles.membershipCard}>
        {/* Trial Badge Background */}
        <View style={styles.trialBgContainer}>
          <Icon
            name="clock"
            size={RFValue(80)}
            color="rgba(59, 130, 246, 0.08)"
            style={styles.trialBgIcon}
          />
        </View>

        <View style={styles.membershipHeader}>
          <View>
            <View style={styles.trialBadge}>
              <Icon name="clock" size={RFValue(10)} color={Colors.blue} />
              <Text style={styles.trialBadgeText}>Trial Period</Text>
            </View>
            <Text style={styles.trialTierText}>TRIAL ACCESS</Text>
            <Text style={styles.trialSubtext}>Limited Features</Text>
          </View>
          <View style={styles.daysContainer}>
            <Text style={styles.trialDaysNumber}>{daysLeft}</Text>
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

        <View style={styles.divider} />

        {/* Trial Limitations */}
        <View style={styles.trialLimitations}>
          <View style={styles.limitationItem}>
            <Icon name="x-circle" size={RFValue(10)} color={Colors.red} />
            <Text style={styles.limitationText}>No Personal Training</Text>
          </View>
          <View style={styles.limitationItem}>
            <Icon name="x-circle" size={RFValue(10)} color={Colors.red} />
            <Text style={styles.limitationText}>Limited Equipment Access</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Upgrade CTA */}
        <View style={styles.trialFooter}>
          <View style={styles.upgradeTextContainer}>
            <HugeiconsIcon
              icon={SparklesIcon}
              size={moderateScale(14)}
              color={Colors.gold}
            />
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
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={moderateScale(14)}
                color={Colors.white}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </LinearGradient>
  );
};

// ═══════════════════════════════════════════════════════════════
// ELITE MEMBERSHIP CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
const EliteMembershipCard = ({ membershipData, onExtend }) => {
  const template = membershipData.template || {
    colors: ['rgba(113, 113, 122, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000'],
    iconColor: Colors.gold,
    textColor: Colors.white,
  };

  return (
    <LinearGradient
      colors={template.colors}
      style={styles.membershipGradient}
    >
      <GlassCard style={styles.membershipCard}>
        <View style={styles.membershipHeader}>
          <View>
            <View style={styles.activeBadge}>
              <View style={[styles.activeDot, { backgroundColor: template.iconColor }]} />
              <Text style={[styles.activeBadgeText, { color: template.iconColor }]}>
                Active Plan
              </Text>
            </View>
            <Text style={[styles.membershipTier, { color: template.textColor }]}>
              {membershipData.tierName}
            </Text>
            
            {/* Workout Type */}
            {membershipData.workoutType && (
              <View style={[styles.eliteWorkoutBadge, { backgroundColor: `${template.iconColor}20` }]}>
                <Icon 
                  name={membershipData.workoutType === 'cardio_weights' ? 'activity' : 
                        membershipData.workoutType === 'weights_only' ? 'target' : 'heart'} 
                  size={RFValue(10)} 
                  color={template.iconColor} 
                />
                <Text style={[styles.eliteWorkoutText, { color: template.iconColor }]}>
                  {membershipData.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' :
                   membershipData.workoutType === 'weights_only' ? 'WEIGHTS ONLY' : 'CARDIO ONLY'}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.daysContainer}>
            <Text style={styles.daysNumber}>{membershipData.daysLeft}</Text>
            <Text style={styles.daysLabel}>Days Left</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.membershipFooter}>
          <Text style={styles.expiryText}>Exp. {membershipData.expiryDate}</Text>
          <GlassButton variant="outline" style={styles.extendButton} onPress={onExtend}>
            Extend
          </GlassButton>
        </View>
      </GlassCard>
    </LinearGradient>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const UserDashboardScreen = ({ navigation }) => {
  // Get plans from context
  const { getActivePlans, loading: plansLoading, refreshPlans } = usePlans();
  
  // Get membership requests
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

  // Current user data (would come from auth context)
  const currentUser = {
    id: 'user_001',
    name: 'Abdullah Ahmed',
    phone: '+92 300 1234567',
    email: 'abdullah@example.com',
    photo: null,
  };

  // Check user's membership status
  const approvedMember = getMemberById(currentUser.id);
  const pendingRequest = getUserRequestStatus(currentUser.id);
  const hasPending = pendingRequest?.status === 'pending';
  
  // Determine user type
  const isTrialMember = !approvedMember || !approvedMember.isActive;
  const isPendingApproval = hasPending;

  // Trial member data
  const trialData = {
    daysLeft: 5,
  };

  // Load active plans on mount
  useEffect(() => {
    const plans = getActivePlans();
    setActivePlans(plans);
  }, []);

  // Refresh plans when modal opens
  useEffect(() => {
    if (showPlansModal) {
      refreshPlans().then(() => {
        const plans = getActivePlans();
        setActivePlans(plans);
      });
    }
  }, [showPlansModal]);

  // Handle plan selection - Submit request to admin
  const handleSelectPlan = async (plan) => {
    // Check if already has pending request
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
                'Your membership request has been sent to the admin for approval. You will be notified once approved.',
                [{ text: 'OK' }]
              );
              
              // Refresh data
              await refreshData();
            } catch (error) {
              Alert.alert('Error', 'Failed to submit request. Please try again.');
              console.error('Submit error:', error);
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
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeLabel}>Welcome back</Text>
              <Text style={styles.welcomeName}>{currentUser.name}</Text>
              
              {/* User Type Badge */}
              {isPendingApproval ? (
                <View style={[styles.userTypeBadge, styles.pendingUserBadge]}>
                  <Icon name="loader" size={RFValue(10)} color={Colors.gold} />
                  <Text style={[styles.userTypeBadgeText, styles.pendingUserBadgeText]}>
                    APPROVAL PENDING
                  </Text>
                </View>
              ) : isTrialMember ? (
                <View style={styles.userTypeBadge}>
                  <Icon name="clock" size={RFValue(10)} color={Colors.blue} />
                  <Text style={styles.userTypeBadgeText}>TRIAL MEMBER</Text>
                </View>
              ) : (
                <View style={[styles.userTypeBadge, styles.eliteUserBadge]}>
                  <Icon name="award" size={RFValue(10)} color={approvedMember?.template?.iconColor || Colors.gold} />
                  <Text style={[styles.userTypeBadgeText, styles.eliteUserBadgeText]}>
                    {approvedMember?.tierName || 'PREMIUM MEMBER'}
                  </Text>
                </View>
              )}
            </View>

            {/* Membership Card - Conditional Rendering */}
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
                  <HugeiconsIcon
                    icon={Activity01Icon}
                    size={moderateScale(16)}
                    color={Colors.zinc[400]}
                  />
                  <Text style={styles.facilityTitleText}>Facility Status</Text>
                </View>
                <View style={styles.logoContainer}>
                  <Image
                    source={gymlogoimg}
                    style={styles.gymLogo}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <View style={styles.facilityStats}>
                <Text style={styles.facilityNumber}>42</Text>
                <Text style={styles.facilityLabel}>Members Inside</Text>
              </View>

              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>

              {/* Prediction Section */}
              <View style={styles.predictionContainer}>
                <View style={styles.predictionDivider} />
                
                <View style={styles.predictionContent}>
                  <View style={styles.predictionLeft}>
                    <View style={styles.predictionIconWrapper}>
                      <HugeiconsIcon
                        icon={Clock01Icon}
                        size={moderateScale(14)}
                        color={Colors.zinc[400]}
                      />
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
                    <HugeiconsIcon
                      icon={CheckmarkCircle03Icon}
                      size={20}
                      color={Colors.white}
                    />
                  </View>
                  <Text style={styles.actionButtonText}>Check In</Text>
                </View>
              </GlassButton>

              <GlassButton variant="outline" style={styles.actionButton}>
                <View style={styles.actionButtonContent}>
                  <View style={[styles.actionIcon, styles.actionIconInactive]}>
                    <HugeiconsIcon
                      icon={Logout02Icon}
                      size={20}
                      color={Colors.zinc[500]}
                    />
                  </View>
                  <Text style={[styles.actionButtonText, styles.actionButtonTextInactive]}>
                    Check Out
                  </Text>
                </View>
              </GlassButton>
            </View>

            {/* Trial CTA Banner - Only for Trial Members without pending request */}
            {isTrialMember && !isPendingApproval && (
              <TouchableOpacity 
                activeOpacity={0.85}
                onPress={() => setShowPlansModal(true)}
              >
                <LinearGradient
                  colors={['rgba(234, 179, 8, 0.2)', 'rgba(234, 179, 8, 0.05)', 'transparent']}
                  style={styles.trialCtaBanner}
                >
                  <View style={styles.trialCtaContent}>
                    <Icon name="gift" size={RFValue(18)} color={Colors.gold} />
                    <View style={styles.trialCtaText}>
                      <Text style={styles.trialCtaTitle}>Upgrade Today!</Text>
                      <Text style={styles.trialCtaSubtitle}>
                        {activePlans.length > 0 
                          ? `${activePlans.length} plans available` 
                          : 'Check available plans'}
                      </Text>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={RFValue(16)} color={Colors.gold} />
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

          {/* Membership Plans Modal */}
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
  background: {
    flex: 1,
  },
  gradient: {
    flex: 2,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    gap: verticalScale(12),
    paddingBottom: verticalScale(100),
  },
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
    fontWeight: "600"
  },
  welcomeName: {
    fontFamily: Fonts.orbitron.extraBold,
    fontSize: RFValue(18),
    color: Colors.white,
    letterSpacing: scale(3.6),
  },
  
  // User Type Badge
  userTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginTop: verticalScale(8),
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  eliteUserBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  pendingUserBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  userTypeBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(8),
    color: Colors.blue,
    letterSpacing: scale(1.5),
  },
  eliteUserBadgeText: {
    color: Colors.gold,
  },
  pendingUserBadgeText: {
    color: Colors.gold,
  },

  membershipGradient: {
    borderRadius: moderateScale(16),
    padding: scale(1),
  },
  membershipCard: {
    position: 'relative',
    borderWidth: 0,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  
  // Pending Card Styles
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginBottom: verticalScale(4),
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(4),
    alignSelf: 'flex-start',
  },
  pendingBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(7),
    color: Colors.gold,
    letterSpacing: scale(1.5),
    textTransform: 'uppercase',
  },
  pendingTierText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(15),
    color: Colors.gold,
    letterSpacing: scale(3),
  },
  pendingSubtext: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[500],
    letterSpacing: scale(1),
    marginTop: verticalScale(2),
  },
  requestInfoContainer: {
    gap: verticalScale(8),
    marginBottom: verticalScale(12),
  },
  requestInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestInfoLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(9),
    color: Colors.zinc[500],
  },
  requestInfoValue: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(9),
    color: Colors.white,
  },
  pendingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: scale(10),
    borderRadius: moderateScale(8),
  },
  pendingFooterText: {
    flex: 1,
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[500],
  },
  
  // Trial Card Styles
  trialBgContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: scale(20),
  },
  trialBgIcon: {
    opacity: 0.5,
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginBottom: verticalScale(4),
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(4),
    alignSelf: 'flex-start',
  },
  trialBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(7),
    color: Colors.blue,
    letterSpacing: scale(1.5),
    textTransform: 'uppercase',
  },
  trialTierText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(15),
    color: Colors.blue,
    letterSpacing: scale(3),
  },
  trialSubtext: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[500],
    letterSpacing: scale(1),
    marginTop: verticalScale(2),
  },
  trialDaysNumber: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: RFValue(26),
    color: Colors.blue,
    lineHeight: RFValue(36),
  },
  trialProgressContainer: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(4),
  },
  trialProgressBar: {
    height: verticalScale(6),
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: moderateScale(3),
    overflow: 'hidden',
  },
  trialProgressFill: {
    height: '100%',
    borderRadius: moderateScale(3),
  },
  trialProgressText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(7),
    color: Colors.zinc[500],
    marginTop: verticalScale(6),
    textAlign: 'right',
  },
  trialLimitations: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(8),
  },
  limitationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  limitationText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[500],
  },
  trialFooter: {
    marginTop: verticalScale(4),
  },
  upgradeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginBottom: verticalScale(10),
  },
  upgradePromptText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(9),
    color: Colors.gold,
    letterSpacing: scale(1),
  },
  viewPlansButton: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  viewPlansGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
  },
  viewPlansText: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: RFValue(9),
    color: Colors.white,
    letterSpacing: scale(2),
  },

  // Elite Card Styles
  logoContainer: {
    position: 'absolute',
    top: scale(27),
    right: 0,
    bottom: 0,
    left: scale(230),
    justifyContent: 'center',
    alignItems: "center",
    paddingRight: scale(10),
  },
  gymLogo: {
    width: moderateScale(150),
    height: moderateScale(150),
    opacity: 0.50,
  },
  membershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(9),
    zIndex: 1,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginBottom: verticalScale(4),
  },
  activeDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: Colors.gold,
  },
  activeBadgeText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(7),
    color: Colors.gold,
    letterSpacing: scale(1.8),
    textTransform: 'uppercase',
    fontWeight: "600"
  },
  membershipTier: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(15),
    color: Colors.white,
    letterSpacing: scale(4),
  },
  eliteWorkoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginTop: verticalScale(6),
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(4),
    alignSelf: 'flex-start',
  },
  eliteWorkoutText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(7),
    color: Colors.gold,
    letterSpacing: scale(1),
  },
  daysContainer: {
    alignItems: 'flex-end',
    zIndex: 1,
  },
  daysNumber: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: RFValue(26),
    color: Colors.white,
    lineHeight: RFValue(36),
  },
  daysLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(9),
    color: Colors.zinc[500],
    letterSpacing: scale(1.8),
    textTransform: 'uppercase',
  },
  divider: {
    height: verticalScale(1),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: verticalScale(12),
    zIndex: 1,
  },
  membershipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  expiryText: {
    fontFamily: Fonts.montserrat.regular,
    fontSize: RFValue(10),
    color: Colors.zinc[400],
  },
  extendButton: {
    width: 'auto',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    backgroundColor: "black",
  },

  // Facility Status
  facilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  facilityTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  facilityTitleText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(7),
    color: Colors.white,
    letterSpacing: scale(2.4),
    textTransform: 'uppercase',
  },
  facilityStats: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: scale(12),
    marginBottom: verticalScale(8),
  },
  facilityNumber: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: RFValue(36),
    color: Colors.white,
    lineHeight: RFValue(40),
  },
  facilityLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(10),
    color: Colors.zinc[500],
    letterSpacing: scale(2),
    textTransform: 'uppercase',
    paddingBottom: verticalScale(4),
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
    width: '45%',
    backgroundColor: Colors.zinc[400],
  },
  
  // Prediction Styles
  predictionContainer: {
    marginTop: verticalScale(16),
  },
  predictionDivider: {
    height: verticalScale(1),
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: verticalScale(16),
  },
  predictionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  predictionIconWrapper: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictionTextWrapper: {
    gap: verticalScale(2),
  },
  predictionLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(6),
    color: Colors.zinc[500],
    letterSpacing: scale(1.5),
    textTransform: 'uppercase',
  },
  predictionValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  predictionNumber: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(14),
    color: Colors.green,
  },
  predictionText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(10),
    color: Colors.zinc[400],
  },
  predictionRight: {
    alignItems: 'flex-end',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(4),
    borderWidth: scale(1),
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  trendText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(10),
    color: Colors.green,
  },
  expectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
  },
  expectedLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(9),
    color: Colors.zinc[500],
    letterSpacing: scale(1),
  },
  expectedValue: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: RFValue(11),
    color: Colors.zinc[300],
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
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
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
    fontSize: RFValue(9),
    color: Colors.white,
    letterSpacing: scale(1.8),
    textTransform: 'uppercase',
  },
  actionButtonTextInactive: {
    color: Colors.zinc[500],
  },

  // Trial CTA Banner
  trialCtaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.2)',
    marginTop: verticalScale(4),
  },
  trialCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  trialCtaText: {
    gap: verticalScale(2),
  },
  trialCtaTitle: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: RFValue(10),
    color: Colors.gold,
    letterSpacing: scale(1),
  },
  trialCtaSubtitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[400],
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '85%',
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
    paddingHorizontal: scale(20),
  },
  modalDragHandle: {
    width: scale(40),
    height: verticalScale(4),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: moderateScale(2),
    marginBottom: verticalScale(16),
  },
  modalTitle: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(14),
    color: Colors.white,
    letterSpacing: scale(3),
    marginBottom: verticalScale(4),
  },
  modalSubtitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(9),
    color: Colors.zinc[500],
    letterSpacing: scale(1),
    textAlign: 'center',
  },
  plansScrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
    gap: verticalScale(12),
  },
  
  // Loading & No Plans States
  loadingContainer: {
    paddingVertical: verticalScale(60),
    alignItems: 'center',
    gap: verticalScale(16),
  },
  loadingText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(10),
    color: Colors.zinc[500],
    letterSpacing: scale(1),
  },
  noPlansContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(60),
  },
  noPlansText: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: RFValue(14),
    color: Colors.zinc[400],
    marginTop: verticalScale(16),
  },
  noPlansSubtext: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(10),
    color: Colors.zinc[600],
    marginTop: verticalScale(8),
    textAlign: 'center',
  },

  // Plan Cards
  planCardWrapper: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  planCard: {
    padding: scale(16),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  planBgIcon: {
    position: 'absolute',
    right: -scale(10),
    top: -scale(10),
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(10),
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginBottom: verticalScale(4),
  },
  planBadgeDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
  planBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(7),
    color: Colors.zinc[400],
    letterSpacing: scale(1.5),
    textTransform: 'uppercase',
  },
  planName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(14),
    letterSpacing: scale(2),
  },
  planPriceContainer: {
    alignItems: 'flex-end',
  },
  planOriginalPrice: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(10),
    color: Colors.zinc[500],
    textDecorationLine: 'line-through',
  },
  planPrice: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(20),
    color: Colors.white,
  },
  planDuration: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(9),
    color: Colors.zinc[500],
  },
  workoutTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(4),
    alignSelf: 'flex-start',
    marginBottom: verticalScale(10),
  },
  workoutTypeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(8),
    letterSpacing: scale(1),
  },
  planDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: verticalScale(10),
  },
  planFeatures: {
    gap: verticalScale(6),
    marginBottom: verticalScale(10),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  featureText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(9),
    color: Colors.zinc[300],
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(6),
    marginBottom: verticalScale(12),
    alignSelf: 'flex-start',
  },
  offerText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(8),
    color: Colors.gold,
    letterSpacing: scale(1),
  },
  selectPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  selectPlanText: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: RFValue(9),
    color: Colors.white,
    letterSpacing: scale(2),
  },
  closeModalButton: {
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  closeModalText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(10),
    color: Colors.zinc[500],
    letterSpacing: scale(2),
  },
});

export default UserDashboardScreen;