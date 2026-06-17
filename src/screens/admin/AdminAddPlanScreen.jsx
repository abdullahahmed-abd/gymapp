// src/screens/admin/AdminAddPlanScreen.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Switch,
  Modal,
  Pressable,
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
  Dumbbell01Icon,
  Activity01Icon,
  CheckmarkCircle02Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Upload04Icon,
  Cancel01Icon,
  ArrowLeft01Icon,
  FlashIcon,
  DollarCircleIcon,
  ViewIcon,
  Layers01Icon,
  Shield01Icon,
} from '@hugeicons/core-free-icons';

import Header from '../../components/shared/Header';
import GlassInput from '../../components/shared/GlassInput';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { usePlans } from '../../context/PlansContext';

const s  = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

// ═══════════════════════════════════════════════════════════════
// TIER TEMPLATES
// ═══════════════════════════════════════════════════════════════
const TIER_TEMPLATES = {
  cardio_weights: {
    name: 'ELITE TIER',
    badge: 'ELITE',
    colors: ['rgba(234,179,8,0.35)', 'rgba(234,179,8,0.15)', 'rgba(0,0,0,0.95)'],
    iconColor: Colors.gold,
    textColor: Colors.gold,
    subtitle: 'Cardio + Weight Lifting',
    description: 'Complete training with cardio and strength',
    features: [
      'Full Gym Access',
      'Cardio + Weight Training',
      'All Equipment Access',
      'Fitness Assessment',
      'Personal Locker',
    ],
  },
  weights_only: {
    name: 'LEGENDARY TIER',
    badge: 'LEGENDARY',
    colors: ['rgba(168,85,247,0.35)', 'rgba(168,85,247,0.15)', 'rgba(0,0,0,0.95)'],
    iconColor: '#a855f7',
    textColor: '#c084fc',
    subtitle: 'Weight Lifting Only',
    description: 'Pure strength and muscle building',
    features: [
      'Weight Zone Access',
      'Free Weights & Machines',
      'Strength Programs',
      'Progress Tracking',
      'Personal Trainer Support',
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// CUSTOM BLUR DROPDOWN
// ═══════════════════════════════════════════════════════════════
const BlurDropdown = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
}) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel = useMemo(() => {
    const found = options.find(item => item.value === value);
    return found?.label || placeholder;
  }, [value, options, placeholder]);

  return (
    <View style={styles.fieldBlock}>
      {!!label && <Text style={styles.fieldLabel}>{label}</Text>}

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setVisible(true)}
        style={styles.dropdownTrigger}
      >
        <View style={styles.dropdownTriggerInner}>
          <Text style={styles.dropdownTriggerText}>{selectedLabel}</Text>
          <HugeiconsIcon
            icon={visible ? ArrowUp01Icon : ArrowDown01Icon}
            size={ms(16)}
            color={Colors.white}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.dropdownModalOverlay}
          onPress={() => setVisible(false)}
        >
          <Pressable style={styles.dropdownModalCenter} onPress={() => {}}>
            <View style={styles.dropdownModalCard}>
              {!!label && (
                <Text style={styles.dropdownModalTitle}>{label}</Text>
              )}
              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {options.map((item, index) => {
                  const selected = item.value === value;
                  return (
                    <TouchableOpacity
                      key={`${item.value}_${index}`}
                      activeOpacity={0.8}
                      style={[
                        styles.dropdownOption,
                        selected && styles.dropdownOptionSelected,
                        index === options.length - 1 && styles.dropdownOptionLast,
                      ]}
                      onPress={() => {
                        onChange(item.value);
                        setVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          selected && styles.dropdownOptionTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {selected && (
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={ms(16)}
                          color={Colors.white}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// WORKOUT TYPE CARD - ✅ Side by side horizontal layout
// ═══════════════════════════════════════════════════════════════
const WorkoutTypeCard = ({ type, isSelected, onSelect }) => {
  const template = TIER_TEMPLATES[type];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onSelect(type)}
      style={styles.workoutCardWrapper}
    >
      <View
        style={[
          styles.workoutCard,
          isSelected && { borderColor: `${template.iconColor}50` },
        ]}
      >
        {isSelected && (
          <LinearGradient
            colors={[`${template.iconColor}12`, `${template.iconColor}06`, 'transparent']}
            style={StyleSheet.absoluteFill}
          />
        )}

        <HugeiconsIcon
          icon={Shield01Icon}
          size={ms(55)}
          color={isSelected ? `${template.iconColor}18` : 'rgba(255,255,255,0.03)'}
          style={styles.workoutCardBgIcon}
          strokeWidth={0.5}
        />

        {/* Icons Row */}
        <View style={styles.workoutCardHeader}>
          <View style={styles.workoutIconsRow}>
            {type === 'cardio_weights' ? (
              <>
                <View style={[
                  styles.workoutIconContainer,
                  { backgroundColor: isSelected ? `${template.iconColor}20` : 'rgba(255,255,255,0.06)' },
                ]}>
                  <HugeiconsIcon
                    icon={Activity01Icon}
                    size={ms(14)}
                    color={isSelected ? template.iconColor : Colors.zinc[400]}
                  />
                </View>
                <Text style={[
                  styles.workoutPlusText,
                  isSelected && { color: template.iconColor },
                ]}>+</Text>
                <View style={[
                  styles.workoutIconContainer,
                  { backgroundColor: isSelected ? `${template.iconColor}20` : 'rgba(255,255,255,0.06)' },
                ]}>
                  <HugeiconsIcon
                    icon={Dumbbell01Icon}
                    size={ms(14)}
                    color={isSelected ? template.iconColor : Colors.zinc[400]}
                  />
                </View>
              </>
            ) : (
              <View style={[
                styles.workoutIconContainer,
                { backgroundColor: isSelected ? `${template.iconColor}20` : 'rgba(255,255,255,0.06)' },
              ]}>
                <HugeiconsIcon
                  icon={Dumbbell01Icon}
                  size={ms(14)}
                  color={isSelected ? template.iconColor : Colors.zinc[400]}
                />
              </View>
            )}
          </View>

          {/* Selected checkmark */}
          {isSelected && (
            <View style={[styles.selectedBadge, { backgroundColor: template.iconColor }]}>
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={ms(11)}
                color={Colors.white}
              />
            </View>
          )}
        </View>

        {/* Tier Badge */}
        <View style={[
          styles.tierBadgeContainer,
          isSelected && { backgroundColor: `${template.iconColor}15` },
        ]}>
          <View style={[styles.tierBadgeDot, { backgroundColor: template.iconColor }]} />
          <Text style={[
            styles.tierBadgeText,
            isSelected && { color: template.iconColor },
          ]}>
            {template.badge}
          </Text>
        </View>

        {/* Title */}
        <Text style={[
          styles.workoutCardTitle,
          isSelected && { color: template.textColor },
        ]}>
          {template.name}
        </Text>

        {/* Subtitle */}
        <Text style={[
          styles.workoutCardSubtitle,
          isSelected && { color: `${template.iconColor}90` },
        ]}>
          {template.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminAddPlanScreen = ({ navigation }) => {
  const { deployPlan } = usePlans();

  const [durationOption, setDurationOption] = useState('1 Month');
  const [customDuration, setCustomDuration]   = useState('');
  const [price, setPrice]                     = useState('');
  const [hasOffer, setHasOffer]               = useState(false);
  const [discountType, setDiscountType]       = useState('percentage');
  const [discountValue, setDiscountValue]     = useState('');
  const [workoutType, setWorkoutType]         = useState('cardio_weights');
  const [isDeploying, setIsDeploying]         = useState(false);

  const currentTemplate = TIER_TEMPLATES[workoutType];

  const durationOptions = [
    { label: '1 Month',  value: '1 Month'  },
    { label: '3 Months', value: '3 Months' },
    { label: '6 Months', value: '6 Months' },
    { label: '12 Months', value: '12 Months' },
    { label: '-- CUSTOM DURATION --', value: 'custom' },
  ];

  const discountOptions = [
    { label: 'PERCENTAGE (%)',   value: 'percentage' },
    { label: 'FIXED AMOUNT (₹)', value: 'fixed' },
  ];

  const calculateFinalPrice = () => {
    if (!price) return null;
    const priceNum = parseFloat(price);
    const discount = parseFloat(discountValue) || 0;
    if (isNaN(priceNum)) return null;
    const final =
      discountType === 'percentage'
        ? priceNum - priceNum * (discount / 100)
        : priceNum - discount;
    return Math.max(final, 0);
  };

  const handleDeployPlan = async () => {
    const planDuration = durationOption === 'custom' ? customDuration : durationOption;

    if (!planDuration.trim()) {
      Alert.alert('Error', 'Please select or enter a duration');
      return;
    }
    if (!price || isNaN(parseFloat(price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    setIsDeploying(true);

    try {
      const finalPrice = calculateFinalPrice();

      const planData = {
        name:       currentTemplate.name,
        duration:   planDuration,
        price:      parseFloat(price),
        finalPrice: finalPrice || parseFloat(price),
        workoutType,
        template: {
          id:        workoutType,
          name:      currentTemplate.name,
          colors:    currentTemplate.colors,
          iconColor: currentTemplate.iconColor,
          textColor: currentTemplate.textColor,
          badge:     currentTemplate.badge,
        },
        hasOffer,
        offer: hasOffer
          ? {
              type:  discountType,
              value: parseFloat(discountValue) || 0,
              text:
                discountType === 'percentage'
                  ? `${discountValue}% OFF`
                  : `₹${discountValue} OFF`,
            }
          : null,
        features: currentTemplate.features,
      };

      await deployPlan(planData);

      Alert.alert(
        'Deployed! 🎉',
        `"${currentTemplate.name}" is now live!\nMembers can see this plan.`,
        [
          {
            text: 'Add Another',
            onPress: () => {
              setPrice('');
              setHasOffer(false);
              setDiscountValue('');
              setDurationOption('1 Month');
            },
          },
          {
            text: 'View Plans',
            onPress: () => navigation.navigate('AdminPlans'),
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to deploy plan.');
    } finally {
      setIsDeploying(false);
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
        <Header title="CREATE NEW PLAN" showMenu={false} />

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Back Button ── */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('AdminPlans')}
            activeOpacity={0.8}
          >
            <View style={styles.backIconContainer}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={ms(14)} color={Colors.zinc[400]} />
            </View>
            <Text style={styles.backText}>Back to Plans</Text>
          </TouchableOpacity>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* SELECT TIER */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HugeiconsIcon
                icon={Layers01Icon}
                size={ms(14)}
                color={currentTemplate.iconColor}
              />
              <Text style={[styles.sectionTitle, { color: currentTemplate.iconColor }]}>
                Select Membership Tier
              </Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Choose the tier type — design auto-assigned
            </Text>

            {/* ✅ Side by side cards */}
            <View style={styles.workoutCardsRow}>
              <WorkoutTypeCard
                type="cardio_weights"
                isSelected={workoutType === 'cardio_weights'}
                onSelect={setWorkoutType}
              />
              <WorkoutTypeCard
                type="weights_only"
                isSelected={workoutType === 'weights_only'}
                onSelect={setWorkoutType}
              />
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PRICING */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HugeiconsIcon
                icon={DollarCircleIcon}
                size={ms(14)}
                color={currentTemplate.iconColor}
              />
              <Text style={[styles.sectionTitle, { color: currentTemplate.iconColor }]}>
                Pricing & Duration
              </Text>
            </View>

            <View style={styles.card}>
              <LinearGradient
                colors={[`${currentTemplate.iconColor}12`, 'transparent']}
                style={styles.cardTopGlow}
              />

              <BlurDropdown
                label="Duration"
                value={durationOption}
                onChange={setDurationOption}
                options={durationOptions}
              />

              {durationOption === 'custom' && (
                <GlassInput
                  placeholder="e.g. 14 Days"
                  value={customDuration}
                  onChangeText={setCustomDuration}
                />
              )}

              <GlassInput
                label="Price (₹)"
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PROMOTIONAL OFFER */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.offerHeader}>
              <View style={styles.offerHeaderLeft}>
                <HugeiconsIcon icon={FlashIcon} size={ms(14)} color={Colors.gold} />
                <Text style={styles.offerTitle}>Promotional Offer</Text>
              </View>
              <Switch
                value={hasOffer}
                onValueChange={setHasOffer}
                trackColor={{
                  false: 'rgba(255,255,255,0.1)',
                  true: currentTemplate.iconColor,
                }}
                thumbColor={hasOffer ? Colors.white : 'rgba(255,255,255,0.4)'}
              />
            </View>

            {hasOffer && (
              <View style={styles.offerCard}>
                <BlurDropdown
                  label="Discount Type"
                  value={discountType}
                  onChange={setDiscountType}
                  options={discountOptions}
                />

                <GlassInput
                  label={
                    discountType === 'percentage'
                      ? 'Percentage Off (%)'
                      : 'Amount Deducted (₹)'
                  }
                  placeholder={discountType === 'percentage' ? '20' : '150'}
                  value={discountValue}
                  onChangeText={setDiscountValue}
                  keyboardType="decimal-pad"
                />

                {/* Final Price Calc */}
                <View style={styles.calculationRow}>
                  <HugeiconsIcon icon={FlashIcon} size={ms(13)} color={Colors.gold} />
                  <Text style={styles.calculationText}>
                    Final Price:{' '}
                    <Text style={styles.calculationHighlight}>
                      ₹{calculateFinalPrice()?.toFixed(2) || '0.00'}
                    </Text>
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* LIVE PREVIEW */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HugeiconsIcon icon={ViewIcon} size={ms(14)} color={Colors.zinc[400]} />
              <Text style={styles.sectionTitle}>Live Preview</Text>
            </View>

            <View style={styles.previewCard}>
              <LinearGradient
                colors={[`${currentTemplate.iconColor}18`, `${currentTemplate.iconColor}08`, 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.previewBgIcon}>
                <HugeiconsIcon
                  icon={Shield01Icon}
                  size={ms(90)}
                  color={`${currentTemplate.iconColor}18`}
                  strokeWidth={0.5}
                />
              </View>

              <View style={styles.previewHeader}>
                <View style={{ flex: 1 }}>
                  <View style={[styles.activeBadge, { backgroundColor: `${currentTemplate.iconColor}20` }]}>
                    <View style={[styles.activeDot, { backgroundColor: currentTemplate.iconColor }]} />
                    <Text style={[styles.activeBadgeText, { color: currentTemplate.iconColor }]}>
                      Active Plan
                    </Text>
                  </View>
                  <Text style={[styles.previewTier, { color: currentTemplate.textColor }]}>
                    {currentTemplate.name}
                  </Text>
                  <View style={[styles.previewWorkoutBadge, { backgroundColor: `${currentTemplate.iconColor}20` }]}>
                    <HugeiconsIcon
                      icon={workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                      size={ms(10)}
                      color={currentTemplate.iconColor}
                    />
                    <Text style={[styles.previewWorkoutText, { color: currentTemplate.iconColor }]}>
                      {currentTemplate.subtitle.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.previewDaysBox}>
                  <Text style={[styles.previewDaysNumber, { color: currentTemplate.textColor }]}>25</Text>
                  <Text style={styles.previewDaysLabel}>Days Left</Text>
                </View>
              </View>

              <View style={[styles.previewDivider, { backgroundColor: `${currentTemplate.iconColor}30` }]} />

              <View style={styles.previewFooter}>
                <Text style={styles.previewExpiry}>
                  Exp.{' '}
                  {new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toLocaleDateString(
                    'en-US', { day: 'numeric', month: 'short', year: 'numeric' }
                  )}
                </Text>
                <View style={[styles.previewExtendBtn, { borderColor: `${currentTemplate.iconColor}40` }]}>
                  <Text style={[styles.previewExtendText, { color: currentTemplate.textColor }]}>
                    Extend
                  </Text>
                </View>
              </View>

              {(price || hasOffer) && (
                <>
                  <View style={[styles.previewDivider, { backgroundColor: `${currentTemplate.iconColor}30` }]} />
                  <View style={styles.previewPriceRow}>
                    <Text style={styles.previewPriceLabel}>Plan Price:</Text>
                    <View style={styles.previewPriceRight}>
                      {hasOffer && calculateFinalPrice() !== null && price ? (
                        <>
                          <Text style={styles.previewOriginalPrice}>₹{price}</Text>
                          <Text style={[styles.previewFinalPrice, { color: currentTemplate.textColor }]}>
                            ₹{calculateFinalPrice()?.toFixed(2)}
                          </Text>
                        </>
                      ) : (
                        <Text style={[styles.previewFinalPrice, { color: currentTemplate.textColor }]}>
                          ₹{price || '0'}
                        </Text>
                      )}
                      <Text style={styles.previewPriceDuration}>
                        /{durationOption === 'custom' ? customDuration || 'duration' : durationOption}
                      </Text>
                    </View>
                  </View>
                  {hasOffer && discountValue && (
                    <View style={styles.previewOfferBadge}>
                      <HugeiconsIcon icon={FlashIcon} size={ms(10)} color={Colors.gold} />
                      <Text style={styles.previewOfferText}>
                        {discountType === 'percentage'
                          ? `${discountValue}% OFF`
                          : `₹${discountValue} OFF`}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* ✅ ACTION BUTTONS - Compact inline row */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <View style={styles.actionRow}>
            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.navigate('AdminPlans')}
              activeOpacity={0.8}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={ms(13)} color={Colors.zinc[500]} />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            {/* Deploy Button */}
            <TouchableOpacity
              style={[styles.deployButton, isDeploying && { opacity: 0.6 }]}
              onPress={handleDeployPlan}
              disabled={isDeploying}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[currentTemplate.iconColor, `${currentTemplate.iconColor}90`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.deployButtonGradient}
              >
                {isDeploying ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <>
                    <HugeiconsIcon icon={Upload04Icon} size={ms(14)} color={Colors.white} />
                    <Text style={styles.deployButtonText}>DEPLOY</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
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

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient:   { flex: 1 },
  container:  { flex: 1 },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(8),
    paddingBottom: vs(120),
    gap: vs(20),
  },

  // ── Back Button ──
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIconContainer: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(7),
  },
  backText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[400],
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },

  // ── Section ──
  section: { gap: vs(10) },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  sectionTitle: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(9),
    color: Colors.zinc[400],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[600],
    letterSpacing: 0.8,
  },

  // ── Workout Cards - Side by side ──
  workoutCardsRow: {
    flexDirection: 'row',
    gap: s(10),
  },
  workoutCardWrapper: {
    flex: 1,
  },
  workoutCard: {
    borderRadius: ms(14),
    padding: ms(12),
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    backgroundColor: '#000000',
    position: 'relative',
    minHeight: vs(130),
  },
  workoutCardBgIcon: {
    position: 'absolute',
    right: -ms(8),
    top: -ms(6),
  },
  workoutCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(8),
  },
  workoutIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutIconContainer: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutPlusText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(10),
    color: Colors.zinc[500],
    marginHorizontal: s(3),
  },
  selectedBadge: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
    marginBottom: vs(4),
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tierBadgeDot: { width: s(4), height: s(4), borderRadius: s(2) },
  tierBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(6),
    color: Colors.zinc[500],
    letterSpacing: 1,
  },
  workoutCardTitle: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(9),
    color: Colors.white,
    letterSpacing: 1,
    marginBottom: vs(2),
  },
  workoutCardSubtitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[500],
    letterSpacing: 0.5,
  },

  // ── Card (Pricing) ──
  card: {
    borderRadius: ms(14),
    padding: ms(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
  },
  cardTopGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: vs(50),
  },

  // ── Field ──
  fieldBlock: { marginBottom: vs(10) },
  fieldLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[400],
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: vs(5),
    paddingHorizontal: s(3),
  },

  // ── Dropdown ──
  dropdownTrigger: {
    height: vs(36),
    borderRadius: ms(10),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  dropdownTriggerInner: {
    flex: 1,
    paddingHorizontal: s(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownTriggerText: {
    flex: 1,
    marginRight: s(8),
    color: Colors.white,
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  dropdownModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: s(20),
  },
  dropdownModalCenter: { width: '100%' },
  dropdownModalCard: {
    borderRadius: ms(14),
    overflow: 'hidden',
    paddingVertical: vs(8),
    paddingHorizontal: s(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: '#000000',
    maxHeight: vs(280),
  },
  dropdownModalTitle: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(8),
    color: Colors.zinc[300],
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    paddingHorizontal: s(8),
    paddingTop: vs(4),
    paddingBottom: vs(8),
  },
  dropdownOption: {
    minHeight: vs(40),
    borderRadius: ms(8),
    paddingHorizontal: s(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(4),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  dropdownOptionLast: { marginBottom: 0 },
  dropdownOptionSelected: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.18)',
  },
  dropdownOptionText: {
    flex: 1,
    color: Colors.zinc[300],
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dropdownOptionTextSelected: { color: Colors.white },

  // ── Offer ──
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  offerTitle: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(9),
    color: Colors.gold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  offerCard: {
    borderRadius: ms(14),
    padding: ms(14),
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.15)',
    backgroundColor: '#000000',
    gap: vs(2),
  },
  calculationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: vs(8),
    backgroundColor: 'rgba(234,179,8,0.06)',
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.12)',
    marginTop: vs(4),
  },
  calculationText: {
    marginLeft: s(6),
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[400],
    letterSpacing: 0.8,
  },
  calculationHighlight: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(10),
    color: Colors.gold,
  },

  // ── Preview Card ──
  previewCard: {
    borderRadius: ms(14),
    padding: s(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
  },
  previewBgIcon: {
    position: 'absolute',
    top: -ms(8),
    right: -ms(12),
    opacity: 0.8,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(10),
    zIndex: 1,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    marginBottom: vs(4),
    paddingHorizontal: s(7),
    paddingVertical: vs(2),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
  },
  activeDot: { width: s(5), height: s(5), borderRadius: s(3) },
  activeBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(6.5),
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  previewTier: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(13),
    letterSpacing: 3,
    marginBottom: vs(5),
  },
  previewWorkoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(7),
    paddingVertical: vs(2),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
  },
  previewWorkoutText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(6.5),
    letterSpacing: 0.8,
  },
  previewDaysBox: { alignItems: 'flex-end', zIndex: 1 },
  previewDaysNumber: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(22),
    lineHeight: rf(28),
  },
  previewDaysLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[400],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  previewDivider: {
    height: vs(1),
    marginVertical: vs(10),
    zIndex: 1,
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  previewExpiry: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8.5),
    color: Colors.zinc[400],
  },
  previewExtendBtn: {
    paddingHorizontal: s(12),
    paddingVertical: vs(5),
    borderRadius: ms(6),
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  previewExtendText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  previewPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  previewPriceLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[400],
    letterSpacing: 0.8,
  },
  previewPriceRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: s(4),
  },
  previewOriginalPrice: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
    textDecorationLine: 'line-through',
  },
  previewFinalPrice: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(13),
  },
  previewPriceDuration: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[500],
  },
  previewOfferBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    backgroundColor: 'rgba(234,179,8,0.12)',
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(5),
    alignSelf: 'flex-start',
    marginTop: vs(8),
    zIndex: 1,
  },
  previewOfferText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7.5),
    color: Colors.gold,
    letterSpacing: 0.8,
  },

  // ✅ ACTION ROW - Compact inline buttons
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginBottom: vs(10),
  },

  // ✅ Cancel - Small compact
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(5),
    paddingVertical: vs(10),
    paddingHorizontal: s(16),
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  cancelButtonText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8.5),
    color: Colors.zinc[500],
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ✅ Deploy - Compact flex button
  deployButton: {
    flex: 1,
    borderRadius: ms(10),
    overflow: 'hidden',
  },
  deployButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    paddingVertical: vs(11),
  },
  deployButtonText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(9),
    color: Colors.white,
    letterSpacing: 2,
  },
});

export default AdminAddPlanScreen;