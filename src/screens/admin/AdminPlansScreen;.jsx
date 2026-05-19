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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  scale,
  moderateScale,
  verticalScale,
} from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import BottomNav from '../../components/shared/BottomNav';

import {
  Add01Icon,
  Delete02Icon,
  Edit02Icon,
  Shield01Icon,
  Activity01Icon,
  Dumbbell01Icon,
  FlashIcon,
  UserMultipleIcon,
  CheckmarkCircle02Icon,
  DollarCircleIcon,
  Calendar03Icon,
} from '@hugeicons/core-free-icons';

import Header from '../../components/shared/Header';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { usePlans } from '../../context/PlansContext';

const s = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

// ═══════════════════════════════════════════════════════════════
// TIER TEMPLATES
// ═══════════════════════════════════════════════════════════════
const TIER_TEMPLATES = {
  'cardio_weights': {
    name: 'ELITE TIER',
    badge: 'ELITE',
    iconColor: Colors.gold,
    textColor: Colors.gold,
    subtitle: 'Cardio + Weight Lifting',
  },
  'weights_only': {
    name: 'LEGENDARY TIER',
    badge: 'LEGENDARY',
    iconColor: '#a855f7',
    textColor: '#c084fc',
    subtitle: 'Weight Lifting Only',
  },
};

// ═══════════════════════════════════════════════════════════════
// PLAN CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
const PlanCard = ({ plan, onEdit, onDelete }) => {
  const template = TIER_TEMPLATES[plan.workoutType] || TIER_TEMPLATES['cardio_weights'];
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    Alert.alert(
      'Delete Plan',
      `Are you sure you want to delete "${plan.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await onDelete(plan.id);
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.planCard}>
      {/* Subtle gradient overlay */}
      <LinearGradient
        colors={[`${template.iconColor}12`, `${template.iconColor}06`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      {/* Background Icon */}
      <View style={styles.planCardBgIcon}>
        <HugeiconsIcon
          icon={Shield01Icon}
          size={ms(80)}
          color={`${template.iconColor}18`}
          strokeWidth={0.5}
        />
      </View>

      {/* Header */}
      <View style={styles.planCardHeader}>
        <View style={{ flex: 1 }}>
          {/* Tier Badge */}
          <View style={[styles.planBadge, { backgroundColor: `${template.iconColor}20` }]}>
            <View style={[styles.planBadgeDot, { backgroundColor: template.iconColor }]} />
            <Text style={[styles.planBadgeText, { color: template.iconColor }]}>
              {template.badge}
            </Text>
          </View>

          {/* Plan Name */}
          <Text style={[styles.planName, { color: template.textColor }]}>
            {plan.name}
          </Text>

          {/* Workout Type */}
          <View style={[styles.planWorkoutBadge, { backgroundColor: `${template.iconColor}15` }]}>
            <HugeiconsIcon
              icon={plan.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
              size={ms(10)}
              color={template.iconColor}
            />
            <Text style={[styles.planWorkoutText, { color: template.iconColor }]}>
              {template.subtitle.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.planActions}>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: `${template.iconColor}30` }]}
            onPress={() => onEdit(plan)}
            activeOpacity={0.7}
          >
            <HugeiconsIcon icon={Edit02Icon} size={ms(14)} color={template.iconColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { borderColor: 'rgba(239, 68, 68, 0.3)' }]}
            onPress={handleDelete}
            disabled={deleting}
            activeOpacity={0.7}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <HugeiconsIcon icon={Delete02Icon} size={ms(14)} color="#ef4444" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.planDivider, { backgroundColor: `${template.iconColor}30` }]} />

      {/* ✅ Info Grid - Row 1: Duration + Price | Row 2: Members */}
      <View style={styles.planInfoGrid}>

        {/* Row 1 */}
        <View style={styles.planInfoRow}>

          {/* Duration */}
          <View style={styles.planInfoItem}>
            <View style={styles.planInfoIcon}>
              <HugeiconsIcon icon={Calendar03Icon} size={ms(14)} color={Colors.zinc[400]} />
            </View>
            <View>
              <Text style={styles.planInfoLabel}>Duration</Text>
              <Text style={styles.planInfoValue}>{plan.duration}</Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.planInfoItem}>
            <View style={styles.planInfoIcon}>
              <HugeiconsIcon icon={DollarCircleIcon} size={ms(14)} color={Colors.zinc[400]} />
            </View>
            <View>
              <Text style={styles.planInfoLabel}>Price</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: s(4) }}>
                {plan.hasOffer && plan.offer ? (
                  <>
                    {/* ✅ $ → ₹ */}
                    <Text style={styles.planInfoValueStrike}>₹{plan.price}</Text>
                    <Text style={[styles.planInfoValue, { color: template.textColor }]}>
                      ₹{plan.finalPrice}
                    </Text>
                  </>
                ) : (
                  // ✅ $ → ₹
                  <Text style={styles.planInfoValue}>₹{plan.price}</Text>
                )}
              </View>
            </View>
          </View>

        </View>

        {/* Row 2 */}
        <View style={styles.planInfoRow}>

          {/* Members */}
          <View style={styles.planInfoItem}>
            <View style={styles.planInfoIcon}>
              <HugeiconsIcon icon={UserMultipleIcon} size={ms(14)} color={Colors.zinc[400]} />
            </View>
            <View>
              <Text style={styles.planInfoLabel}>Members</Text>
              <Text style={styles.planInfoValue}>{plan.memberCount || 0}</Text>
            </View>
          </View>

        </View>

      </View>

      {/* Offer Badge (if exists) */}
      {plan.hasOffer && plan.offer && (
        <View style={styles.planOfferBadge}>
          <HugeiconsIcon icon={FlashIcon} size={ms(10)} color={Colors.gold} />
          <Text style={styles.planOfferText}>{plan.offer.text}</Text>
        </View>
      )}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// EMPTY STATE COMPONENT
// ═══════════════════════════════════════════════════════════════
const EmptyState = ({ onAddPlan }) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <HugeiconsIcon
          icon={Shield01Icon}
          size={ms(80)}
          color={Colors.zinc[800]}
          strokeWidth={1}
        />
      </View>

      <Text style={styles.emptyTitle}>No Plans Created Yet</Text>
      <Text style={styles.emptySubtitle}>
        Create your first membership plan to get started
      </Text>

      <TouchableOpacity
        style={styles.emptyButton}
        onPress={onAddPlan}
        activeOpacity={0.85}
      >
       <LinearGradient
              colors={[Colors.gold, Colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={styles.addButtonGradient}
            >
          <HugeiconsIcon icon={Add01Icon} size={ms(18)} color={Colors.white} />
          <Text style={styles.emptyButtonText}>CREATE FIRST PLAN</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminPlansScreen = ({ navigation }) => {
  const { plans, deletePlan } = usePlans();
  const [filter, setFilter] = useState('all');

  const filteredPlans = plans.filter(plan => {
    if (filter === 'all') return true;
    if (filter === 'elite') return plan.workoutType === 'cardio_weights';
    if (filter === 'legendary') return plan.workoutType === 'weights_only';
    return true;
  });

  const handleAddPlan = () => navigation.navigate('AdminAddPlan');
  const handleEditPlan = (plan) => navigation.navigate('AdminEditPlan', { planId: plan.id });

  const handleDeletePlan = async (planId) => {
    try {
      await deletePlan(planId);
      Alert.alert('Success', 'Plan deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete plan');
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      }}
      style={styles.background}
      blurRadius={10}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)', '#000000']}
        style={styles.gradient}
      >
        <Header title="MEMBERSHIP PLANS" showMenu={false} />

        {/* Top Action Bar */}
        <View style={styles.topBar}>
          <View style={styles.statsContainer}>
            <Text style={styles.statsNumber}>{plans.length}</Text>
            <Text style={styles.statsLabel}>Active Plans</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPlan}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.gold, Colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={styles.addButtonGradient}
            >
              <HugeiconsIcon icon={Add01Icon} size={ms(16)} color={Colors.white} />
              <Text style={styles.addButtonText}>ADD NEW PLAN</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        {plans.length > 0 && (
          <View style={styles.filterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
              <TouchableOpacity
                style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
                onPress={() => setFilter('all')}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
                  All Plans ({plans.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterTab, filter === 'elite' && styles.filterTabActive]}
                onPress={() => setFilter('elite')}
                activeOpacity={0.7}
              >
                <View style={[styles.filterTabDot, { backgroundColor: Colors.gold }]} />
                <Text style={[styles.filterTabText, filter === 'elite' && styles.filterTabTextActive]}>
                  Elite ({plans.filter(p => p.workoutType === 'cardio_weights').length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterTab, filter === 'legendary' && styles.filterTabActive]}
                onPress={() => setFilter('legendary')}
                activeOpacity={0.7}
              >
                <View style={[styles.filterTabDot, { backgroundColor: '#a855f7' }]} />
                <Text style={[styles.filterTabText, filter === 'legendary' && styles.filterTabTextActive]}>
                  Legendary ({plans.filter(p => p.workoutType === 'weights_only').length})
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Content */}
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {plans.length === 0 ? (
            <EmptyState onAddPlan={handleAddPlan} />
          ) : filteredPlans.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No plans in this category</Text>
            </View>
          ) : (
            <View style={styles.plansGrid}>
              {filteredPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={handleEditPlan}
                  onDelete={handleDeletePlan}
                />
              ))}
            </View>
          )}
        </ScrollView>

        <BottomNav
          activeTab="plans"
          onTabChange={(tab) => {
            if (tab === 'dashboard') navigation.navigate('AdminDashboard');
            if (tab === 'plans') navigation.navigate('AdminPlans');
            if (tab === 'members') navigation.navigate('AdminUsersDetail');
            if (tab === 'settings') navigation.navigate('AdminSettings');
          }}
          userType="admin"
        />
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: s(18),
    paddingTop: vs(10),
    paddingBottom: vs(120),
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(18),
    paddingVertical: vs(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  statsContainer: {
    alignItems: 'flex-start',
  },
  statsNumber: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(20),
    color: Colors.gold,
    letterSpacing: 2,
  },
  statsLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[500],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: vs(2),
  },
  addButton: {
    borderRadius: ms(12),
    overflow: 'hidden',
    elevation: 5,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    paddingHorizontal: s(20),
    paddingVertical: vs(12),
  },
  addButtonText: {
    fontFamily: Fonts.rajdhani.bold,
    fontSize: rf(9),
    color: Colors.white,
    letterSpacing: 1.5,
  },

  // Filter Tabs
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingVertical: vs(12),
  },
  filterScrollContent: {
    paddingHorizontal: s(18),
    gap: s(10),
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  filterTabActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  filterTabDot: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
  },
  filterTabText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: Colors.zinc[500],
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  filterTabTextActive: {
    color: Colors.white,
  },

  // Plans Grid
  plansGrid: {
    gap: vs(16),
  },

  // Plan Card
  planCard: {
    borderRadius: ms(16),
    padding: s(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
  },
  planCardBgIcon: {
    position: 'absolute',
    right: -ms(10),
    top: -ms(10),
    opacity: 0.8,
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(12),
    zIndex: 1,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
    marginBottom: vs(4),
  },
  planBadgeDot: {
    width: s(5),
    height: s(5),
    borderRadius: s(3),
  },
  planBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    letterSpacing: 1.5,
  },
  planName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(13),
    letterSpacing: 2,
    marginBottom: vs(6),
  },
  planWorkoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
  },
  planWorkoutText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    letterSpacing: 1,
  },
  planActions: {
    flexDirection: 'row',
    gap: s(8),
    zIndex: 1,
  },
  actionButton: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  planDivider: {
    height: vs(1),
    marginBottom: vs(12),
    zIndex: 1,
  },

  // ✅ Info Grid - column layout (row1 + row2)
  planInfoGrid: {
    flexDirection: 'column',
    gap: vs(10),
    marginBottom: vs(12),
    zIndex: 1,
  },

  // ✅ Each row is horizontal
  planInfoRow: {
    flexDirection: 'row',
    gap: s(24),
  },

  // ✅ Each item same as before
  planInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  planInfoIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  planInfoLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[500],
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  planInfoValue: {
    fontFamily: Fonts.rajdhani.bold,
    fontSize: rf(10),
    color: Colors.white,
    letterSpacing: 0.5,
  },
  planInfoValueStrike: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[600],
    textDecorationLine: 'line-through',
  },
  planOfferBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: 'rgba(234,179,8,0.15)',
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(6),
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.3)',
    zIndex: 1,
  },
  planOfferText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: Colors.gold,
    letterSpacing: 1,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(80),
    paddingHorizontal: s(40),
  },
  emptyIconContainer: {
    width: ms(140),
    height: ms(140),
    borderRadius: ms(70),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: vs(24),
  },
  emptyTitle: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(14),
    color: Colors.white,
    letterSpacing: 2,
    marginBottom: vs(8),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
    letterSpacing: 0.8,
    textAlign: 'center',
    marginBottom: vs(32),
    lineHeight: rf(14),
  },
  emptyButton: {
    borderRadius: ms(12),
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    paddingHorizontal: s(24),
    paddingVertical: vs(16),
  },
  emptyButtonText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(10),
    color: Colors.white,
    letterSpacing: 2,
  },

  // No Results
  noResultsContainer: {
    paddingVertical: vs(60),
    alignItems: 'center',
  },
  noResultsText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[600],
    letterSpacing: 1,
  },
});

export default AdminPlansScreen;