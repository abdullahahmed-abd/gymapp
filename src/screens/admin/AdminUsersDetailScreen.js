// src/screens/admin/AdminUsersDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Pressable,
  Platform,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../components/shared/Header';
import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { useMembershipRequests } from '../../context/MembershipRequestsContext';

// ═══════════════════════════════════════════════════════════════
// TAB BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════
const TabButton = ({ title, count, isActive, onPress, color }) => (
  <TouchableOpacity
    style={[styles.tabButton, isActive && styles.tabButtonActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.tabButtonText, isActive && { color: color || Colors.white }]}>
      {title}
    </Text>
    {count > 0 && (
      <View style={[styles.tabBadge, { backgroundColor: color || Colors.gold }]}>
        <Text style={styles.tabBadgeText}>{count}</Text>
      </View>
    )}
  </TouchableOpacity>
);

// ═══════════════════════════════════════════════════════════════
// REQUEST CARD COMPONENT - With Dynamic Plan Colors
// ═══════════════════════════════════════════════════════════════
const RequestCard = ({ request, onApprove, onReject, isProcessing }) => {
  // Get template from request - this comes from the plan user selected
  const template = request.planTemplate || {
    colors: ['rgba(113, 113, 122, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000'],
    iconColor: Colors.gold,
    textColor: Colors.gold,
    badge: 'PLAN',
  };

  const iconColor = template.iconColor || Colors.gold;
  const textColor = template.textColor || Colors.gold;
  const gradientColors = template.colors || ['rgba(113, 113, 122, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000'];

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.requestCardGradient}
    >
      <View style={styles.requestCard}>
        {/* Background Shield Icon */}
        <Icon
          name="shield"
          size={RFValue(80)}
          color={`${iconColor}10`}
          style={styles.cardBgIcon}
        />

        {/* Header */}
        <View style={styles.requestHeader}>
          <View style={styles.userInfo}>
            <View style={[styles.userAvatar, { backgroundColor: `${iconColor}25` }]}>
              <Text style={[styles.userAvatarText, { color: iconColor }]}>
                {request.userName?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{request.userName}</Text>
              <Text style={styles.userPhone}>{request.userPhone}</Text>
            </View>
          </View>
          <View style={[styles.requestStatusBadge, { backgroundColor: `${iconColor}20`, borderColor: `${iconColor}40` }]}>
            <Icon name="clock" size={RFValue(10)} color={iconColor} />
            <Text style={[styles.requestStatusText, { color: iconColor }]}>PENDING</Text>
          </View>
        </View>

        <View style={styles.requestDivider} />

        {/* Plan Info */}
        <View style={styles.planInfoSection}>
          <View style={styles.planInfoHeader}>
            <View style={styles.planBadge}>
              <View style={[styles.planBadgeDot, { backgroundColor: iconColor }]} />
              <Text style={[styles.planBadgeText, { color: iconColor }]}>
                {template.badge || 'PLAN'}
              </Text>
            </View>
            <Text style={[styles.planNameText, { color: textColor }]}>
              {request.planName}
            </Text>
          </View>

          {/* Workout Type */}
          <View style={[styles.workoutTypeBadge, { backgroundColor: `${iconColor}15` }]}>
            <Icon 
              name={request.workoutType === 'cardio_weights' ? 'activity' : 
                    request.workoutType === 'weights_only' ? 'target' : 'heart'} 
              size={RFValue(12)} 
              color={iconColor} 
            />
            <Text style={[styles.workoutTypeText, { color: iconColor }]}>
              {request.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' :
               request.workoutType === 'weights_only' ? 'WEIGHTS ONLY' : 'CARDIO ONLY'}
            </Text>
          </View>

          {/* Price & Duration */}
          <View style={styles.priceRow}>
            <View style={styles.priceInfo}>
              {request.hasOffer && (
                <Text style={styles.originalPrice}>${request.planOriginalPrice}</Text>
              )}
              <Text style={[styles.finalPrice, { color: textColor }]}>${request.planPrice}</Text>
              <Text style={styles.priceDuration}>/ {request.planDuration}</Text>
            </View>
            {request.hasOffer && request.offerText && (
              <View style={[styles.offerTag, { backgroundColor: `${iconColor}20` }]}>
                <Icon name="zap" size={RFValue(8)} color={iconColor} />
                <Text style={[styles.offerTagText, { color: iconColor }]}>{request.offerText}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.requestDivider} />

        {/* Features Preview */}
        {request.planFeatures && request.planFeatures.length > 0 && (
          <>
            <View style={styles.featuresPreview}>
              {request.planFeatures.slice(0, 3).map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Icon name="check" size={RFValue(10)} color={Colors.green} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
              {request.planFeatures.length > 3 && (
                <Text style={styles.moreFeatures}>
                  +{request.planFeatures.length - 3} more features
                </Text>
              )}
            </View>
            <View style={styles.requestDivider} />
          </>
        )}

        {/* Request Time */}
        <View style={styles.requestTimeRow}>
          <Icon name="calendar" size={RFValue(12)} color={Colors.zinc[500]} />
          <Text style={styles.requestTimeText}>
            Requested: {new Date(request.requestedAt).toLocaleString()}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.rejectButton, isProcessing && styles.buttonDisabled]}
            onPress={() => onReject(request)}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color={Colors.red} />
            ) : (
              <>
                <Icon name="x" size={RFValue(14)} color={Colors.red} />
                <Text style={styles.rejectButtonText}>REJECT</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.approveButton, isProcessing && styles.buttonDisabled]}
            onPress={() => onApprove(request)}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.green, 'rgba(34, 197, 94, 0.8)']}
              style={styles.approveButtonGradient}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <>
                  <Icon name="check" size={RFValue(14)} color={Colors.white} />
                  <Text style={styles.approveButtonText}>APPROVE</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

// ═══════════════════════════════════════════════════════════════
// MEMBER CARD COMPONENT - With Dynamic Plan Colors
// ═══════════════════════════════════════════════════════════════
const MemberCard = ({ member }) => {
  // Get template from member - this is the plan they were approved for
  const template = member.template || {
    colors: ['rgba(34, 197, 94, 0.2)', 'rgba(24, 24, 27, 0.8)', '#000000'],
    iconColor: Colors.green,
    textColor: Colors.green,
  };

  const iconColor = template.iconColor || Colors.green;
  const textColor = template.textColor || Colors.green;
  const gradientColors = template.colors || ['rgba(34, 197, 94, 0.2)', 'rgba(24, 24, 27, 0.8)', '#000000'];

  // Calculate if membership is expiring soon (within 7 days)
  const daysLeft = member.daysLeft || 0;
  const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
  const isExpired = daysLeft <= 0;

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.memberCardGradient}
    >
      <View style={styles.memberCard}>
        {/* Background Shield Icon */}
        <Icon
          name="award"
          size={RFValue(80)}
          color={`${iconColor}10`}
          style={styles.cardBgIcon}
        />

        {/* Header */}
        <View style={styles.memberHeader}>
          <View style={styles.userInfo}>
            <View style={[styles.userAvatar, { backgroundColor: `${iconColor}25` }]}>
              <Text style={[styles.userAvatarText, { color: iconColor }]}>
                {member.name?.charAt(0).toUpperCase() || 'M'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{member.name}</Text>
              <Text style={styles.userPhone}>{member.phone}</Text>
            </View>
          </View>
          <View style={[
            styles.memberStatusBadge, 
            { 
              backgroundColor: isExpired 
                ? 'rgba(239, 68, 68, 0.15)' 
                : isExpiringSoon 
                  ? 'rgba(234, 179, 8, 0.15)' 
                  : `${Colors.green}15`,
              borderColor: isExpired 
                ? 'rgba(239, 68, 68, 0.3)' 
                : isExpiringSoon 
                  ? 'rgba(234, 179, 8, 0.3)' 
                  : 'rgba(34, 197, 94, 0.3)',
            }
          ]}>
            <View style={[
              styles.memberStatusDot, 
              { 
                backgroundColor: isExpired 
                  ? Colors.red 
                  : isExpiringSoon 
                    ? Colors.gold 
                    : Colors.green 
              }
            ]} />
            <Text style={[
              styles.memberStatusText, 
              { 
                color: isExpired 
                  ? Colors.red 
                  : isExpiringSoon 
                    ? Colors.gold 
                    : Colors.green 
              }
            ]}>
              {isExpired ? 'EXPIRED' : isExpiringSoon ? 'EXPIRING' : 'ACTIVE'}
            </Text>
          </View>
        </View>

        <View style={styles.requestDivider} />

        {/* Plan Name */}
        <View style={styles.memberPlanRow}>
          <View style={styles.planBadge}>
            <View style={[styles.planBadgeDot, { backgroundColor: iconColor }]} />
            <Text style={[styles.planBadgeText, { color: iconColor }]}>
              {template.badge || 'MEMBER'}
            </Text>
          </View>
          <Text style={[styles.memberTierName, { color: textColor }]}>
            {member.tierName}
          </Text>
        </View>

        {/* Workout Type Badge */}
        <View style={[styles.workoutTypeBadge, { backgroundColor: `${iconColor}15`, alignSelf: 'flex-start' }]}>
          <Icon 
            name={member.workoutType === 'cardio_weights' ? 'activity' : 
                  member.workoutType === 'weights_only' ? 'target' : 'heart'} 
            size={RFValue(10)} 
            color={iconColor} 
          />
          <Text style={[styles.workoutTypeText, { color: iconColor, fontSize: RFValue(8) }]}>
            {member.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' :
             member.workoutType === 'weights_only' ? 'WEIGHTS ONLY' : 'CARDIO ONLY'}
          </Text>
        </View>

        <View style={styles.requestDivider} />

        {/* Member Info Grid */}
        <View style={styles.memberInfoGrid}>
          <View style={styles.memberInfoItem}>
            <Text style={styles.memberInfoLabel}>DAYS LEFT</Text>
            <Text style={[
              styles.memberInfoValue, 
              { 
                color: isExpired 
                  ? Colors.red 
                  : isExpiringSoon 
                    ? Colors.gold 
                    : Colors.white 
              }
            ]}>
              {daysLeft}
            </Text>
          </View>
          <View style={styles.memberInfoItem}>
            <Text style={styles.memberInfoLabel}>PAID</Text>
            <Text style={[styles.memberInfoValue, { color: textColor }]}>
              ${member.paidAmount}
            </Text>
          </View>
          <View style={styles.memberInfoItem}>
            <Text style={styles.memberInfoLabel}>DURATION</Text>
            <Text style={styles.memberInfoValue}>{member.duration}</Text>
          </View>
          <View style={styles.memberInfoItem}>
            <Text style={styles.memberInfoLabel}>JOINED</Text>
            <Text style={styles.memberInfoValue}>
              {new Date(member.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* Features */}
        {member.features && member.features.length > 0 && (
          <>
            <View style={styles.requestDivider} />
            <View style={styles.memberFeatures}>
              {member.features.slice(0, 2).map((feature, idx) => (
                <View key={idx} style={styles.featureChip}>
                  <Icon name="check" size={RFValue(8)} color={iconColor} />
                  <Text style={[styles.featureChipText, { color: Colors.zinc[400] }]}>{feature}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Footer */}
        <View style={styles.memberFooter}>
          <View style={styles.memberFooterLeft}>
            <Icon name="calendar" size={RFValue(10)} color={Colors.zinc[600]} />
            <Text style={styles.memberFooterText}>
              Expires: {new Date(member.expiryDate).toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </Text>
          </View>
          {isExpiringSoon && !isExpired && (
            <View style={styles.renewBadge}>
              <Icon name="alert-circle" size={RFValue(10)} color={Colors.gold} />
              <Text style={styles.renewBadgeText}>Renew Soon</Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

// ═══════════════════════════════════════════════════════════════
// REJECTION MODAL
// ═══════════════════════════════════════════════════════════════
const RejectionModal = ({ visible, onClose, onSubmit, request }) => {
  const [reason, setReason] = useState('');

  const template = request?.planTemplate || {};
  const iconColor = template.iconColor || Colors.gold;

  const handleSubmit = () => {
    onSubmit(request, reason);
    setReason('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.rejectionModalOverlay} onPress={onClose}>
        <Pressable style={styles.rejectionModalContent} onPress={() => {}}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={Platform.OS === 'ios' ? 'ultraThinMaterialDark' : 'dark'}
            blurAmount={20}
            reducedTransparencyFallbackColor="rgba(12,12,16,0.98)"
          />
          
          <View style={styles.rejectionModalInner}>
            <View style={[styles.modalIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Icon name="x-circle" size={RFValue(30)} color={Colors.red} />
            </View>
            
            <Text style={styles.rejectionModalTitle}>Reject Request</Text>
            
            <View style={styles.modalUserInfo}>
              <View style={[styles.modalUserAvatar, { backgroundColor: `${iconColor}25` }]}>
                <Text style={[styles.modalUserAvatarText, { color: iconColor }]}>
                  {request?.userName?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View>
                <Text style={styles.modalUserName}>{request?.userName}</Text>
                <Text style={styles.modalPlanName}>{request?.planName}</Text>
              </View>
            </View>

            <TextInput
              style={styles.rejectionInput}
              placeholder="Reason for rejection (optional)"
              placeholderTextColor={Colors.zinc[600]}
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={3}
            />

            <View style={styles.rejectionButtonsRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmRejectButton} onPress={handleSubmit}>
                <LinearGradient
                  colors={[Colors.red, 'rgba(239, 68, 68, 0.8)']}
                  style={styles.confirmRejectGradient}
                >
                  <Icon name="x" size={RFValue(14)} color={Colors.white} />
                  <Text style={styles.confirmRejectButtonText}>REJECT</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminUsersDetailScreen = ({ navigation }) => {
  const {
    requests,
    loading,
    getPendingRequests,
    getActiveMembers,
    approveRequest,
    rejectRequest,
    refreshData,
  } = useMembershipRequests();

  const [activeTab, setActiveTab] = useState('pending');
  const [processingId, setProcessingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const pendingRequests = getPendingRequests();
  const activeMembers = getActiveMembers();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleApprove = async (request) => {
    const template = request.planTemplate || {};
    const planColor = template.textColor || Colors.gold;

    Alert.alert(
      'Approve Request',
      `Approve ${request.userName}'s request for ${request.planName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            setProcessingId(request.id);
            try {
              await approveRequest(request.id);
              Alert.alert(
                'Success! ✓', 
                `${request.userName} is now a ${request.planName} member!`
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to approve request');
              console.error(error);
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const confirmReject = async (request, reason) => {
    setShowRejectModal(false);
    setProcessingId(request.id);
    try {
      await rejectRequest(request.id, reason);
      Alert.alert('Rejected', `${request.userName}'s request has been rejected.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to reject request');
      console.error(error);
    } finally {
      setProcessingId(null);
      setSelectedRequest(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.white} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'pending':
        return pendingRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Icon name="inbox" size={RFValue(40)} color={Colors.zinc[600]} />
            </View>
            <Text style={styles.emptyTitle}>No Pending Requests</Text>
            <Text style={styles.emptySubtitle}>
              New membership requests will appear here for approval
            </Text>
          </View>
        ) : (
          pendingRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onReject={handleReject}
              isProcessing={processingId === request.id}
            />
          ))
        );

      case 'members':
        return activeMembers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Icon name="users" size={RFValue(40)} color={Colors.zinc[600]} />
            </View>
            <Text style={styles.emptyTitle}>No Active Members</Text>
            <Text style={styles.emptySubtitle}>
              Approved members will appear here with their plan details
            </Text>
          </View>
        ) : (
          activeMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))
        );

      default:
        return null;
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={styles.background}
      blurRadius={10}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)', '#000000']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Header title="MEMBERS" showMenu={false} />

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.gold }]}>
                {pendingRequests.length}
              </Text>
              <Text style={styles.statLabel}>PENDING</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.green }]}>
                {activeMembers.length}
              </Text>
              <Text style={styles.statLabel}>ACTIVE</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{requests.length}</Text>
              <Text style={styles.statLabel}>TOTAL</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TabButton
              title="Pending"
              count={pendingRequests.length}
              isActive={activeTab === 'pending'}
              onPress={() => setActiveTab('pending')}
              color={Colors.gold}
            />
            <TabButton
              title="Members"
              count={activeMembers.length}
              isActive={activeTab === 'members'}
              onPress={() => setActiveTab('members')}
              color={Colors.green}
            />
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={Colors.white}
              />
            }
          >
            {renderContent()}
          </ScrollView>

          <BottomNav
            activeTab="usersdetail"
            onTabChange={(tab) => {
              if (tab === 'dashboard') navigation.navigate('AdminDashboard');
              if (tab === 'membership') navigation.navigate('AdminMembership');
              if (tab === 'profile') navigation.navigate('AdminProfile');
            }}
          />

          {/* Rejection Modal */}
          <RejectionModal
            visible={showRejectModal}
            onClose={() => {
              setShowRejectModal(false);
              setSelectedRequest(null);
            }}
            onSubmit={confirmReject}
            request={selectedRequest}
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
  
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    marginHorizontal: scale(20),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: verticalScale(16),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(22),
    color: Colors.white,
  },
  statLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[500],
    letterSpacing: scale(1.5),
    marginTop: verticalScale(4),
  },
  statDivider: {
    width: 1,
    height: verticalScale(30),
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: scale(20),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: moderateScale(10),
    padding: scale(4),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(8),
    gap: scale(6),
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tabButtonText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(10),
    color: Colors.zinc[500],
    letterSpacing: scale(1),
  },
  tabBadge: {
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(10),
    minWidth: scale(20),
    alignItems: 'center',
  },
  tabBadgeText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(8),
    color: Colors.black,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(100),
    gap: verticalScale(14),
  },

  // Center Container
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(80),
  },
  loadingText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(10),
    color: Colors.zinc[500],
    marginTop: verticalScale(12),
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(60),
  },
  emptyIconCircle: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyTitle: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: RFValue(14),
    color: Colors.zinc[400],
  },
  emptySubtitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(10),
    color: Colors.zinc[600],
    marginTop: verticalScale(8),
    textAlign: 'center',
    paddingHorizontal: scale(20),
  },

  // Card Background Icon
  cardBgIcon: {
    position: 'absolute',
    right: -scale(15),
    top: -scale(15),
  },

  // Request Card
  requestCardGradient: {
    borderRadius: moderateScale(16),
    padding: scale(1),
  },
  requestCard: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: moderateScale(15),
    padding: scale(16),
    overflow: 'hidden',
    position: 'relative',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  userAvatar: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(23),
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(16),
  },
  userDetails: {
    gap: verticalScale(2),
  },
  userName: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: RFValue(12),
    color: Colors.white,
    letterSpacing: scale(1),
  },
  userPhone: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(10),
    color: Colors.zinc[400],
  },
  requestStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(6),
    borderWidth: 1,
  },
  requestStatusText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(8),
    letterSpacing: scale(1),
  },
  requestDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: verticalScale(12),
  },

  // Plan Info
  planInfoSection: {
    gap: verticalScale(10),
  },
  planInfoHeader: {
    gap: verticalScale(4),
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  planBadgeDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
  planBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(8),
    letterSpacing: scale(1.5),
    textTransform: 'uppercase',
  },
  planNameText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(16),
    letterSpacing: scale(2),
  },
  workoutTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(6),
    alignSelf: 'flex-start',
  },
  workoutTypeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(9),
    letterSpacing: scale(1),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: scale(6),
  },
  originalPrice: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(12),
    color: Colors.zinc[500],
    textDecorationLine: 'line-through',
  },
  finalPrice: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(20),
  },
  priceDuration: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(10),
    color: Colors.zinc[500],
  },
  offerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(4),
  },
  offerTagText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(7),
  },

  // Features Preview
  featuresPreview: {
    gap: verticalScale(6),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  featureText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(9),
    color: Colors.zinc[400],
  },
  moreFeatures: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
    color: Colors.zinc[600],
    marginTop: verticalScale(4),
  },

  // Request Time
  requestTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(12),
  },
  requestTimeText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(9),
    color: Colors.zinc[500],
  },

  // Action Buttons
  actionButtonsRow: {
    flexDirection: 'row',
    gap: scale(12),
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  rejectButtonText: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: RFValue(10),
    color: Colors.red,
    letterSpacing: scale(1.5),
  },
  approveButton: {
    flex: 1,
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  approveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    paddingVertical: verticalScale(12),
  },
  approveButtonText: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: RFValue(10),
    color: Colors.white,
    letterSpacing: scale(1.5),
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // Member Card
  memberCardGradient: {
    borderRadius: moderateScale(16),
    padding: scale(1),
  },
  memberCard: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: moderateScale(15),
    padding: scale(16),
    overflow: 'hidden',
    position: 'relative',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(6),
    borderWidth: 1,
  },
  memberStatusDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
  memberStatusText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(8),
    letterSpacing: scale(1),
  },
  memberPlanRow: {
    gap: verticalScale(4),
    marginBottom: verticalScale(10),
  },
  memberTierName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(16),
    letterSpacing: scale(2),
  },
  memberInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberInfoItem: {
    width: '50%',
    paddingVertical: verticalScale(8),
  },
  memberInfoLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(7),
    color: Colors.zinc[600],
    letterSpacing: scale(1),
    marginBottom: verticalScale(4),
  },
  memberInfoValue: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: RFValue(12),
    color: Colors.white,
  },
  memberFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(4),
  },
  featureChipText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(8),
  },
  memberFooter: {
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  memberFooterText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(9),
    color: Colors.zinc[500],
  },
  renewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(4),
  },
  renewBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(8),
    color: Colors.gold,
  },

  // Rejection Modal
  rejectionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  rejectionModalContent: {
    width: '100%',
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  rejectionModalInner: {
    padding: scale(24),
    alignItems: 'center',
  },
  modalIconCircle: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: scale(12),
    borderRadius: moderateScale(12),
    width: '100%',
  },
  modalUserAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalUserAvatarText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(14),
  },
  modalUserName: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: RFValue(11),
    color: Colors.white,
  },
  modalPlanName: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(9),
    color: Colors.zinc[500],
  },
  rejectionModalTitle: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: RFValue(16),
    color: Colors.white,
    marginTop: verticalScale(16),
  },
  rejectionInput: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: scale(14),
    marginTop: verticalScale(10),
    fontFamily: Fonts.rajdhani.regular,
    fontSize: RFValue(10),
    color: Colors.white,
    textAlignVertical: 'top',
    minHeight: verticalScale(80),
  },
  rejectionButtonsRow: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: verticalScale(20),
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cancelButtonText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(10),
    color: Colors.zinc[500],
    letterSpacing: scale(1.5),
  },
  confirmRejectButton: {
    flex: 1,
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  confirmRejectGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    paddingVertical: verticalScale(14),
  },
  confirmRejectButtonText: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: RFValue(10),
    color: Colors.white,
    letterSpacing: scale(1.5),
  },
});

export default AdminUsersDetailScreen;