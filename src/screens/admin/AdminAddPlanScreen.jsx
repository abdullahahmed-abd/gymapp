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
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  scale,
  moderateScale,
  verticalScale,
} from 'react-native-size-matters';

import Header from '../../components/shared/Header';
import GlassCard from '../../components/shared/GlassCard';
import GlassInput from '../../components/shared/GlassInput';
import GlassButton from '../../components/shared/GlassButton';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { usePlans } from '../../context/PlansContext';

// Responsive helpers
const s = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

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
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={Platform.OS === 'ios' ? 'ultraThinMaterialDark' : 'dark'}
          blurAmount={16}
          reducedTransparencyFallbackColor="rgba(20,20,24,0.96)"
        />
        <View style={styles.dropdownTriggerInner}>
          <Text style={styles.dropdownTriggerText}>{selectedLabel}</Text>
          <Icon name={visible ? 'chevron-up' : 'chevron-down'} size={rf(16)} color={Colors.white} />
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
            <BlurView
              style={styles.dropdownModalCard}
              blurType={Platform.OS === 'ios' ? 'ultraThinMaterialDark' : 'dark'}
              blurAmount={20}
              reducedTransparencyFallbackColor="rgba(12,12,16,0.98)"
            >
              {!!label && (
                <Text style={styles.dropdownModalTitle}>{label}</Text>
              )}

              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
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
                        <Icon
                          name="check-circle"
                          size={rf(15)}
                          color={Colors.white}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </BlurView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// WORKOUT TYPE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
const WorkoutTypeCard = ({ type, isSelected, onSelect }) => {
  const workoutData = {
    'cardio_weights': {
      title: 'CARDIO + WEIGHTS',
      subtitle: 'Complete Training',
      icon: 'activity',
      secondIcon: 'target',
      color: Colors.green,
      description: 'Full body workout with cardio and strength training',
    },
    'weights_only': {
      title: 'WEIGHTS ONLY',
      subtitle: 'Strength Focus',
      icon: 'target',
      secondIcon: null,
      color: Colors.red,
      description: 'Pure weight lifting and muscle building',
    },
    'cardio_only': {
      title: 'CARDIO ONLY',
      subtitle: 'Endurance Focus',
      icon: 'activity',
      secondIcon: null,
      color: Colors.blue,
      description: 'Cardiovascular and endurance training',
    },
  };

  const data = workoutData[type];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onSelect(type)}
      style={styles.workoutCardWrapper}
    >
      <LinearGradient
        colors={
          isSelected
            ? [`${data.color}40`, `${data.color}15`, 'rgba(24,24,27,0.9)']
            : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)', 'rgba(24,24,27,0.8)']
        }
        style={[
          styles.workoutCard,
          isSelected && { borderColor: `${data.color}60` },
        ]}
      >
        {/* Background Icon */}
        <Icon
          name={data.icon}
          size={rf(50)}
          color={isSelected ? `${data.color}15` : 'rgba(255,255,255,0.03)'}
          style={styles.workoutCardBgIcon}
        />

        {/* Header */}
        <View style={styles.workoutCardHeader}>
          <View style={styles.workoutIconsRow}>
            <View
              style={[
                styles.workoutIconContainer,
                { backgroundColor: isSelected ? `${data.color}30` : 'rgba(255,255,255,0.1)' },
              ]}
            >
              <Icon
                name={data.icon}
                size={rf(16)}
                color={isSelected ? data.color : Colors.zinc[400]}
              />
            </View>
            {data.secondIcon && (
              <>
                <Text style={styles.workoutPlusText}>+</Text>
                <View
                  style={[
                    styles.workoutIconContainer,
                    { backgroundColor: isSelected ? `${data.color}30` : 'rgba(255,255,255,0.1)' },
                  ]}
                >
                  <Icon
                    name={data.secondIcon}
                    size={rf(16)}
                    color={isSelected ? data.color : Colors.zinc[400]}
                  />
                </View>
              </>
            )}
          </View>

          {isSelected && (
            <View style={[styles.selectedBadge, { backgroundColor: data.color }]}>
              <Icon name="check" size={rf(10)} color={Colors.white} />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.workoutCardContent}>
          <Text style={[styles.workoutCardTitle, isSelected && { color: data.color }]}>
            {data.title}
          </Text>
          <Text style={styles.workoutCardSubtitle}>{data.subtitle}</Text>
        </View>

        {/* Footer */}
        <View style={styles.workoutCardFooter}>
          <View style={[styles.workoutDivider, isSelected && { backgroundColor: `${data.color}40` }]} />
          <Text style={styles.workoutCardDesc}>{data.description}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminAddPlanScreen = ({ navigation }) => {
  const { deployPlan } = usePlans();
  
  const [nameOption, setNameOption] = useState('ELITE TIER');
  const [customName, setCustomName] = useState('');
  const [durationOption, setDurationOption] = useState('1 Month');
  const [customDuration, setCustomDuration] = useState('');
  const [price, setPrice] = useState('');
  const [hasOffer, setHasOffer] = useState(false);
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('elite');
  const [workoutType, setWorkoutType] = useState('cardio_weights');
  const [isDeploying, setIsDeploying] = useState(false);

  const nameOptions = [
    { label: 'ELITE TIER', value: 'ELITE TIER' },
    { label: 'PRO TIER', value: 'PRO TIER' },
    { label: 'VIP TIER', value: 'VIP TIER' },
    { label: 'BASIC TIER', value: 'BASIC TIER' },
    { label: 'GUEST TIER', value: 'GUEST TIER' },
    { label: '-- CUSTOM NAME --', value: 'custom' },
  ];

  const durationOptions = [
    { label: '1 Month', value: '1 Month' },
    { label: '3 Months', value: '3 Months' },
    { label: '6 Months', value: '6 Months' },
    { label: '12 Months', value: '12 Months' },
    { label: '-- CUSTOM DURATION --', value: 'custom' },
  ];

  const discountOptions = [
    { label: 'PERCENTAGE (%)', value: 'percentage' },
    { label: 'FIXED AMOUNT ($)', value: 'fixed' },
  ];

  const templates = [
    {
      id: 'elite',
      name: 'Elite Gold',
      colors: ['rgba(113, 113, 122, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000'],
      iconColor: Colors.gold,
      textColor: Colors.gold,
      badge: 'PREMIUM',
    },
    {
      id: 'blood',
      name: 'Bloodline',
      colors: ['rgba(127, 29, 29, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000'],
      iconColor: Colors.red,
      textColor: '#fca5a5',
      badge: 'INTENSE',
    },
    {
      id: 'void',
      name: 'The Void',
      colors: ['rgba(24, 24, 27, 0.3)', 'rgba(9, 9, 11, 0.8)', '#000000'],
      iconColor: Colors.white,
      textColor: Colors.zinc[300],
      badge: 'MINIMAL',
    },
    {
      id: 'neon',
      name: 'Cyber Blue',
      colors: ['rgba(30, 58, 138, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000'],
      iconColor: Colors.blue,
      textColor: '#93c5fd',
      badge: 'STARTER',
    },
    {
      id: 'venom',
      name: 'Toxic',
      colors: ['rgba(20, 83, 45, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000'],
      iconColor: Colors.green,
      textColor: '#86efac',
      badge: 'POPULAR',
    },
    {
      id: 'royal',
      name: 'Imperial',
      colors: ['rgba(88, 28, 135, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000'],
      iconColor: '#a855f7',
      textColor: '#c084fc',
      badge: 'EXCLUSIVE',
    },
    {
      id: 'iron',
      name: 'Ironclad',
      colors: ['rgba(113, 113, 122, 0.3)', 'rgba(63, 63, 70, 0.8)', '#000000'],
      iconColor: Colors.zinc[300],
      textColor: Colors.white,
      badge: 'STRENGTH',
    },
    {
      id: 'solar',
      name: 'Solar Flare',
      colors: ['rgba(154, 52, 18, 0.3)', 'rgba(24, 24, 27, 0.8)', '#000000'],
      iconColor: '#f97316',
      textColor: '#fb923c',
      badge: 'ENERGY',
    },
  ];

  const getSelectedTemplate = () => {
    return templates.find(t => t.id === selectedTemplate) || templates[0];
  };

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

  const getFeaturesByWorkoutType = (type) => {
    const features = {
      'cardio_weights': [
        'Full Gym Access',
        'Cardio + Weight Training',
        'All Equipment Access',
        'Fitness Assessment',
      ],
      'weights_only': [
        'Weight Zone Access',
        'Free Weights & Machines',
        'Strength Programs',
        'Progress Tracking',
      ],
      'cardio_only': [
        'Cardio Zone Access',
        'Treadmills & Cycles',
        'Group Classes',
        'Heart Rate Monitoring',
      ],
    };
    return features[type] || features['cardio_weights'];
  };

  const handleDeployPlan = async () => {
    // Validation
    const planName = nameOption === 'custom' ? customName : nameOption;
    const planDuration = durationOption === 'custom' ? customDuration : durationOption;

    if (!planName.trim()) {
      Alert.alert('Error', 'Please enter a plan name');
      return;
    }

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
      const template = getSelectedTemplate();
      const finalPrice = calculateFinalPrice();
      
      const planData = {
        name: planName,
        duration: planDuration,
        price: parseFloat(price),
        finalPrice: finalPrice || parseFloat(price),
        workoutType: workoutType,
        template: {
          id: selectedTemplate,
          name: template.name,
          colors: template.colors,
          iconColor: template.iconColor,
          textColor: template.textColor,
          badge: template.badge,
        },
        hasOffer: hasOffer,
        offer: hasOffer ? {
          type: discountType,
          value: parseFloat(discountValue) || 0,
          text: discountType === 'percentage' 
            ? `${discountValue}% OFF` 
            : `$${discountValue} OFF`,
        } : null,
        features: getFeaturesByWorkoutType(workoutType),
      };

      await deployPlan(planData);

      Alert.alert(
        'Success! 🎉',
        `"${planName}" has been deployed successfully!\n\nMembers can now see this plan.`,
        [
          {
            text: 'View All Plans',
            onPress: () => navigation.navigate('AdminPlans'),
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to deploy plan. Please try again.');
      console.error('Deploy error:', error);
    } finally {
      setIsDeploying(false);
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
        <Header title="NEW PLAN" showMenu={false} />

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <View style={styles.backIconContainer}>
              <Icon name="chevron-left" size={rf(14)} color={Colors.zinc[400]} />
            </View>
            <Text style={styles.backText}>Back to Control</Text>
          </TouchableOpacity>

          {/* Form Section */}
          <View style={styles.formSection}>
            <BlurDropdown
              label="Plan Designation"
              value={nameOption}
              onChange={setNameOption}
              options={nameOptions}
            />

            {nameOption === 'custom' && (
              <GlassInput
                placeholder="Enter Custom Name"
                value={customName}
                onChangeText={setCustomName}
              />
            )}

            <BlurDropdown
              label="Lifecycle Duration"
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
              label="Value / Price ($)"
              placeholder="0.00"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Workout Type Section */}
          <View style={styles.workoutTypeSection}>
            <View style={styles.sectionHeader}>
              <Icon name="activity" size={rf(14)} color={Colors.zinc[400]} />
              <Text style={styles.sectionTitleWithIcon}>Workout Program Type</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Select the training program included in this plan
            </Text>

            <View style={styles.workoutCardsContainer}>
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
              <WorkoutTypeCard
                type="cardio_only"
                isSelected={workoutType === 'cardio_only'}
                onSelect={setWorkoutType}
              />
            </View>

            {/* Selected Summary */}
            <View style={styles.workoutSummary}>
              <Icon name="info" size={rf(12)} color={Colors.zinc[500]} />
              <Text style={styles.workoutSummaryText}>
                Members will have access to:{' '}
                <Text style={styles.workoutSummaryHighlight}>
                  {workoutType === 'cardio_weights' && 'Cardio Equipment + Weight Machines + Free Weights'}
                  {workoutType === 'weights_only' && 'Weight Machines + Free Weights + Strength Zone'}
                  {workoutType === 'cardio_only' && 'Treadmills + Cycles + Cardio Zone'}
                </Text>
              </Text>
            </View>
          </View>

          {/* Promotional Offer Section */}
          <View style={styles.offerSection}>
            <View style={styles.offerHeader}>
              <Text style={styles.offerTitle}>Promotional Offer</Text>
              <Switch
                value={hasOffer}
                onValueChange={setHasOffer}
                trackColor={{
                  false: 'rgba(255,255,255,0.1)',
                  true: Colors.white,
                }}
                thumbColor={hasOffer ? (Colors.background || '#000000') : 'rgba(255,255,255,0.4)'}
              />
            </View>

            {hasOffer && (
              <GlassCard style={styles.offerCard}>
                <BlurDropdown
                  label="Discount Protocol"
                  value={discountType}
                  onChange={setDiscountType}
                  options={discountOptions}
                />

                <GlassInput
                  label={
                    discountType === 'percentage'
                      ? 'Percentage Off (%)'
                      : 'Amount Deducted ($)'
                  }
                  placeholder={discountType === 'percentage' ? '20' : '15.00'}
                  value={discountValue}
                  onChangeText={setDiscountValue}
                  keyboardType="decimal-pad"
                />

                <View style={styles.calculationRow}>
                  <Icon name="zap" size={rf(11)} color={Colors.zinc[500]} />
                  <Text style={styles.calculationText}>
                    Live calculation: ${calculateFinalPrice()?.toFixed(2) || 'N/A'}
                  </Text>
                </View>
              </GlassCard>
            )}
          </View>

          {/* Template Selection */}
          <View style={styles.templateSection}>
            <Text style={styles.sectionTitle}>Aesthetic Template</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.templateScroll}
            >
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  onPress={() => setSelectedTemplate(template.id)}
                  activeOpacity={0.85}
                  style={styles.templateItem}
                >
                  <LinearGradient
                    colors={
                      selectedTemplate === template.id
                        ? [
                            'rgba(255,255,255,0.4)',
                            'rgba(255,255,255,0.1)',
                            'transparent',
                          ]
                        : [
                            'rgba(255,255,255,0.05)',
                            'rgba(255,255,255,0.05)',
                            'rgba(255,255,255,0.05)',
                          ]
                    }
                    style={[
                      styles.templateCardOuter,
                      selectedTemplate === template.id &&
                        styles.templateCardSelected,
                    ]}
                  >
                    <LinearGradient
                      colors={template.colors}
                      style={styles.templateCard}
                    >
                      <Icon
                        name="shield"
                        size={rf(62)}
                        color={`${template.iconColor}1A`}
                        style={styles.templateShield}
                      />

                      <View style={styles.templateHeader}>
                        <View
                          style={[
                            styles.templateDot,
                            { backgroundColor: template.iconColor },
                          ]}
                        />
                        <Text style={styles.templateName}>{template.name}</Text>
                      </View>

                      <View style={styles.templateFooter}>
                        <View style={styles.templateDivider} />
                        <View style={styles.templateFooterContent}>
                          <Text
                            style={[
                              styles.templatePreview,
                              { color: template.textColor },
                            ]}
                          >
                            PREVIEW
                          </Text>
                          {selectedTemplate === template.id && (
                            <Icon
                              name="check-circle"
                              size={rf(13)}
                              color={Colors.white}
                            />
                          )}
                        </View>
                      </View>
                    </LinearGradient>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Preview Card */}
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Plan Preview</Text>
            <LinearGradient
              colors={getSelectedTemplate().colors}
              style={styles.previewCard}
            >
              <View style={styles.previewHeader}>
                <View>
                  <View style={styles.previewBadge}>
                    <View style={[styles.previewBadgeDot, { backgroundColor: getSelectedTemplate().iconColor }]} />
                    <Text style={styles.previewBadgeText}>{getSelectedTemplate().badge}</Text>
                  </View>
                  <Text style={[styles.previewName, { color: getSelectedTemplate().textColor }]}>
                    {nameOption === 'custom' ? (customName || 'CUSTOM PLAN') : nameOption}
                  </Text>
                </View>
                <View style={styles.previewPriceContainer}>
                  {hasOffer && calculateFinalPrice() !== null ? (
                    <>
                      <Text style={styles.previewOriginalPrice}>${price}</Text>
                      <Text style={styles.previewPrice}>${calculateFinalPrice()?.toFixed(2)}</Text>
                    </>
                  ) : (
                    <Text style={styles.previewPrice}>${price || '0'}</Text>
                  )}
                  <Text style={styles.previewDuration}>
                    /{durationOption === 'custom' ? (customDuration || 'duration') : durationOption}
                  </Text>
                </View>
              </View>

              <View style={styles.previewWorkoutBadge}>
                <Icon 
                  name={workoutType === 'cardio_weights' ? 'activity' : 
                        workoutType === 'weights_only' ? 'target' : 'heart'} 
                  size={rf(10)} 
                  color={getSelectedTemplate().iconColor} 
                />
                <Text style={[styles.previewWorkoutText, { color: getSelectedTemplate().iconColor }]}>
                  {workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' :
                   workoutType === 'weights_only' ? 'WEIGHTS ONLY' : 'CARDIO ONLY'}
                </Text>
              </View>

              {hasOffer && (
                <View style={styles.previewOfferBadge}>
                  <Icon name="zap" size={rf(10)} color={Colors.gold} />
                  <Text style={styles.previewOfferText}>
                    {discountType === 'percentage' ? `${discountValue}% OFF` : `$${discountValue} OFF`}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.deployButton, isDeploying && styles.deployButtonDisabled]}
              onPress={handleDeployPlan}
              disabled={isDeploying}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.deployButtonGradient}
              >
                {isDeploying ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <>
                    <Icon name="upload-cloud" size={rf(16)} color={Colors.white} />
                    <Text style={styles.deployButtonText}>DEPLOY PLAN</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.buttonSpacer} />

            <GlassButton
              variant="outline"
              onPress={() => navigation.goBack()}
            >
              Cancel
            </GlassButton>
          </View>
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
    paddingHorizontal: s(18),
    paddingTop: vs(10),
    paddingBottom: vs(34),
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(20),
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

  formSection: {
    marginBottom: vs(26),
  },
  fieldBlock: {
    marginBottom: vs(8),
  },
  fieldLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[400],
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: vs(6),
    paddingHorizontal: s(3),
  },

  dropdownTrigger: {
    height: vs(35),
    borderRadius: ms(13),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  dropdownTriggerInner: {
    flex: 1,
    paddingHorizontal: s(13),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownTriggerText: {
    flex: 1,
    marginRight: s(10),
    color: Colors.white,
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  dropdownModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: s(20),
  },
  dropdownModalCenter: {
    width: '100%',
  },
  dropdownModalCard: {
    borderRadius: ms(16),
    overflow: 'hidden',
    paddingVertical: vs(7),
    paddingHorizontal: s(9),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    maxHeight: vs(300),
  },
  dropdownModalTitle: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(8),
    color: Colors.zinc[300],
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    paddingHorizontal: s(7),
    paddingTop: vs(6),
    paddingBottom: vs(8),
  },
  dropdownOption: {
    minHeight: vs(42),
    borderRadius: ms(11),
    paddingHorizontal: s(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(5),
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  dropdownOptionLast: {
    marginBottom: 0,
  },
  dropdownOptionSelected: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.18)',
  },
  dropdownOptionText: {
    flex: 1,
    color: Colors.zinc[200],
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  dropdownOptionTextSelected: {
    color: Colors.white,
  },

  // Workout Type Section
  workoutTypeSection: {
    marginBottom: vs(26),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  sectionTitleWithIcon: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[400],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginLeft: s(8),
  },
  sectionTitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[400],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: vs(12),
  },
  sectionSubtitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7.5),
    color: Colors.zinc[600],
    letterSpacing: 0.8,
    marginBottom: vs(14),
    paddingLeft: s(2),
  },
  workoutCardsContainer: {
    gap: vs(10),
  },
  workoutCardWrapper: {
    width: '100%',
  },
  workoutCard: {
    borderRadius: ms(14),
    padding: ms(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    minHeight: vs(100),
  },
  workoutCardBgIcon: {
    position: 'absolute',
    right: -ms(10),
    bottom: -ms(10),
    opacity: 0.5,
  },
  workoutCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(10),
  },
  workoutIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutIconContainer: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutPlusText: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(14),
    color: Colors.zinc[500],
    marginHorizontal: s(8),
  },
  selectedBadge: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutCardContent: {
    marginBottom: vs(10),
  },
  workoutCardTitle: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(11),
    color: Colors.white,
    letterSpacing: 1.5,
    marginBottom: vs(2),
  },
  workoutCardSubtitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[500],
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  workoutCardFooter: {
    zIndex: 1,
  },
  workoutDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: vs(8),
  },
  workoutCardDesc: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7.5),
    color: Colors.zinc[500],
    letterSpacing: 0.5,
  },
  workoutSummary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: vs(14),
    paddingHorizontal: s(4),
    paddingVertical: vs(10),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  workoutSummaryText: {
    flex: 1,
    marginLeft: s(8),
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7.5),
    color: Colors.zinc[500],
    lineHeight: rf(12),
  },
  workoutSummaryHighlight: {
    color: Colors.zinc[300],
    fontFamily: Fonts.rajdhani.semiBold,
  },

  offerSection: {
    marginBottom: vs(26),
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
    paddingHorizontal: s(3),
  },
  offerTitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.white,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  offerCard: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  calculationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
    paddingHorizontal: s(3),
  },
  calculationText: {
    marginLeft: s(6),
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8.5),
    color: Colors.zinc[500],
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  templateSection: {
    marginBottom: vs(28),
  },
  templateScroll: {
    paddingRight: s(12),
  },
  templateItem: {
    marginRight: s(10),
  },
  templateCardOuter: {
    width: ms(145),
    height: vs(110),
    borderRadius: ms(13),
    padding: 1,
  },
  templateCardSelected: {
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
  },
  templateCard: {
    flex: 1,
    borderRadius: ms(13),
    padding: ms(12),
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  templateShield: {
    position: 'absolute',
    right: -ms(8),
    top: -ms(8),
  },
  templateHeader: {
    zIndex: 1,
  },
  templateDot: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(2.5),
    marginBottom: vs(6),
  },
  templateName: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.white,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  templateFooter: {
    zIndex: 1,
  },
  templateDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: vs(8),
  },
  templateFooterContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templatePreview: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(8),
    letterSpacing: 1.2,
  },

  // Preview Section
  previewSection: {
    marginBottom: vs(20),
  },
  previewCard: {
    padding: s(16),
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(10),
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginBottom: vs(4),
  },
  previewBadgeDot: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
  },
  previewBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    color: Colors.zinc[400],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  previewName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(14),
    letterSpacing: 2,
  },
  previewPriceContainer: {
    alignItems: 'flex-end',
  },
  previewOriginalPrice: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[500],
    textDecorationLine: 'line-through',
  },
  previewPrice: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(18),
    color: Colors.white,
  },
  previewDuration: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
  },
  previewWorkoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
    marginBottom: vs(8),
  },
  previewWorkoutText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    letterSpacing: 1,
  },
  previewOfferBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(6),
    alignSelf: 'flex-start',
  },
  previewOfferText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: Colors.gold,
    letterSpacing: 1,
  },

  actionButtons: {
    marginTop: vs(8),
    marginBottom: vs(16),
  },
  deployButton: {
    borderRadius: ms(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  deployButtonDisabled: {
    opacity: 0.6,
  },
  deployButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(10),
    paddingVertical: vs(16),
  },
  deployButtonText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(11),
    color: Colors.white,
    letterSpacing: 2,
  },
  buttonSpacer: {
    height: vs(10),
  },
});

export default AdminAddPlanScreen;