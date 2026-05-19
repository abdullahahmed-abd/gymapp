// src/screens/admin/AdminTrainersScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Dumbbell01Icon,
  UserAdd01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Calendar03Icon,
  UserRemove01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import Header from '../../../components/shared/Header';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import { useTrainer } from '../../../context/TrainerContext';

const s  = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const TRAINER_COLOR = '#22D3EE';

// ═══════════════════════════════════════════════════════════════
// TRAINER CARD
// ═══════════════════════════════════════════════════════════════
const TrainerCard = ({ trainer, onRemove, onPress }) => {
  const daysAsTrainer = trainer.assignedAt
    ? Math.floor(
        (Date.now() - new Date(trainer.assignedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <TouchableOpacity
      style={styles.trainerCard}
      onPress={() => onPress(trainer)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['rgba(34,211,238,0.06)', 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      {/* Top Row */}
      <View style={styles.cardTopRow}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <LinearGradient
            colors={['rgba(34,211,238,0.15)', 'rgba(34,211,238,0.05)']}
            style={styles.avatarGrad}
          >
            <Text style={styles.avatarText}>
              {trainer.name?.slice(0, 2).toUpperCase()}
            </Text>
          </LinearGradient>
          <View style={styles.activeDotWrap}>
            <View style={styles.activeDot} />
          </View>
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <View style={styles.trainerBadge}>
            <View style={styles.trainerBadgeDot} />
            <Text style={styles.trainerBadgeText}>ACTIVE TRAINER</Text>
          </View>

          <Text style={styles.trainerName} numberOfLines={1}>
            {trainer.name}
          </Text>

          <View style={styles.trainerIdRow}>
            <Text style={styles.trainerId}>ID: {trainer.memberId}</Text>
          </View>

          <View style={styles.assignedRow}>
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={ms(10)}
              color={Colors.zinc[600]}
            />
            <Text style={styles.assignedText}>
              Assigned{' '}
              {trainer.assignedAt
                ? new Date(trainer.assignedAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Today'}
            </Text>
          </View>
        </View>

        {/* Right Side */}
        <View style={styles.cardRight}>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={(e) => {
              e.stopPropagation();
              onRemove(trainer);
            }}
            activeOpacity={0.7}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={ms(13)} color="#EF4444" />
          </TouchableOpacity>
          <View style={styles.arrowIcon}>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={ms(13)}
              color="rgba(255,255,255,0.2)"
            />
          </View>
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={ms(12)}
            color={TRAINER_COLOR}
          />
          <Text style={styles.statLabel}>Days Active</Text>
          <Text style={styles.statValue}>{daysAsTrainer}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <HugeiconsIcon
            icon={Clock01Icon}
            size={ms(12)}
            color={Colors.zinc[500]}
          />
          <Text style={styles.statLabel}>Since</Text>
          <Text style={styles.statValue}>
            {trainer.assignedAt
              ? new Date(trainer.assignedAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                })
              : 'Today'}
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={ms(12)}
            color="#22C55E"
          />
          <Text style={styles.statLabel}>Status</Text>
          <Text style={[styles.statValue, { color: '#22C55E' }]}>Active</Text>
        </View>
      </View>

      {/* Tap Hint */}
      <View style={styles.tapHintRow}>
        <Text style={styles.tapHintText}>Tap to view full details</Text>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={ms(11)}
          color={`${TRAINER_COLOR}50`}
        />
      </View>
    </TouchableOpacity>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminTrainersScreen = ({ navigation }) => {
  const { getAllTrainers, removeTrainer } = useTrainer();
  const trainers = getAllTrainers();

  const handleRemove = (trainer) => {
    Alert.alert(
      'Remove Trainer',
      `Remove ${trainer.name} from trainer role?\n\nThey will return to regular member dashboard.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTrainer(trainer.id);
              Alert.alert(
                'Removed ✅',
                `${trainer.name} is no longer a trainer.`
              );
            } catch (e) {
              Alert.alert('Error', 'Failed to remove trainer');
            }
          },
        },
      ]
    );
  };

  const handleTrainerPress = (trainer) => {
    navigation.navigate('TrainerDetail', { trainer });
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('AdminDashboard');
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      }}
      style={styles.background}
      blurRadius={9}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.92)', '#000000']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Header title="TRAINERS" showMenu={false} />

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statsBarItem}>
              <Text style={[styles.statsBarNumber, { color: TRAINER_COLOR }]}>
                {trainers.length}
              </Text>
              <Text style={styles.statsBarLabel}>TOTAL</Text>
            </View>
            <View style={styles.statsBarDivider} />
            <View style={styles.statsBarItem}>
              <Text style={[styles.statsBarNumber, { color: '#22C55E' }]}>
                {trainers.length}
              </Text>
              <Text style={styles.statsBarLabel}>ACTIVE</Text>
            </View>
          </View>

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <View style={styles.backIcon}>
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  size={ms(16)}
                  color="rgba(255,255,255,0.6)"
                />
              </View>
              <Text style={styles.backText}>Back to Dashboard</Text>
            </TouchableOpacity>

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLeft}>
                <HugeiconsIcon
                  icon={Dumbbell01Icon}
                  size={ms(14)}
                  color={TRAINER_COLOR}
                />
                <Text style={styles.sectionTitle}>ACTIVE TRAINERS</Text>
                {trainers.length > 0 && (
                  <View style={styles.sectionCountBadge}>
                    <Text style={styles.sectionCountText}>
                      {trainers.length}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.addTrainerBtn}
                onPress={() => navigation.navigate('AdminAddTrainer')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[TRAINER_COLOR, '#0ea5e9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addTrainerGrad}
                >
                  <HugeiconsIcon
                    icon={UserAdd01Icon}
                    size={ms(13)}
                    color="#fff"
                  />
                  <Text style={styles.addTrainerText}>Add Trainer</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Trainer List or Empty */}
            {trainers.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <HugeiconsIcon
                    icon={UserRemove01Icon}
                    size={ms(40)}
                    color={`${TRAINER_COLOR}40`}
                  />
                </View>

                <Text style={styles.emptyTitle}>No Trainers Yet</Text>
                <Text style={styles.emptySub}>
                  Add trainers by assigning members from your roster
                </Text>

                <TouchableOpacity
                  style={styles.emptyAddBtn}
                  onPress={() => navigation.navigate('AdminAddTrainer')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[TRAINER_COLOR, '#0ea5e9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.emptyAddGrad}
                  >
                    <HugeiconsIcon
                      icon={UserAdd01Icon}
                      size={ms(14)}
                      color="#fff"
                    />
                    <Text style={styles.emptyAddText}>Add First Trainer</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {trainers.map((trainer) => (
                  <TrainerCard
                    key={trainer.id}
                    trainer={trainer}
                    onRemove={handleRemove}
                    onPress={handleTrainerPress}
                  />
                ))}

                {/* Add More Button */}
                <TouchableOpacity
                  style={styles.addMoreBtn}
                  onPress={() => navigation.navigate('AdminAddTrainer')}
                  activeOpacity={0.8}
                >
                  <View style={styles.addMoreInner}>
                    <HugeiconsIcon
                      icon={UserAdd01Icon}
                      size={ms(14)}
                      color={TRAINER_COLOR}
                    />
                    <Text style={styles.addMoreText}>Add Another Trainer</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: s(20),
    paddingBottom: vs(100),
    gap: vs(12),
  },

  // Stats Bar
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: s(20),
    marginBottom: vs(12),
    backgroundColor: '#000000',
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: vs(12),
  },
  statsBarItem: { flex: 1, alignItems: 'center' },
  statsBarNumber: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(18),
    color: Colors.white,
  },
  statsBarLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[500],
    letterSpacing: s(1.2),
    marginTop: vs(2),
  },
  statsBarDivider: {
    width: 1,
    height: vs(28),
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // Back
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(2),
  },
  backIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  backText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(11),
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  sectionTitle: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(10),
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: s(1.5),
    textTransform: 'uppercase',
  },
  sectionCountBadge: {
    backgroundColor: `${TRAINER_COLOR}15`,
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}25`,
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
  },
  sectionCountText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(9),
    color: TRAINER_COLOR,
  },
  addTrainerBtn: {
    borderRadius: ms(10),
    overflow: 'hidden',
  },
  addTrainerGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
  },
  addTrainerText: {
    fontFamily: Fonts.rajdhani.bold,
    fontSize: rf(9),
    color: '#fff',
    letterSpacing: 0.5,
  },

  // Trainer Card
  trainerCard: {
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}30`,
    backgroundColor: '#000000',
    padding: ms(14),
    overflow: 'hidden',
    position: 'relative',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(12),
  },
  avatarWrap: { position: 'relative' },
  avatarGrad: {
    width: ms(54),
    height: ms(54),
    borderRadius: ms(27),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: `${TRAINER_COLOR}50`,
  },
  avatarText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(15),
    color: TRAINER_COLOR,
  },
  activeDotWrap: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: ms(15),
    height: ms(15),
    borderRadius: ms(7.5),
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  activeDot: {
    width: ms(9),
    height: ms(9),
    borderRadius: ms(4.5),
    backgroundColor: '#22C55E',
  },
  cardInfo: { flex: 1 },
  trainerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    backgroundColor: `${TRAINER_COLOR}12`,
    borderRadius: ms(6),
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}25`,
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    alignSelf: 'flex-start',
    marginBottom: vs(5),
  },
  trainerBadgeDot: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(2.5),
    backgroundColor: TRAINER_COLOR,
  },
  trainerBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(6.5),
    color: TRAINER_COLOR,
    letterSpacing: s(1),
  },
  trainerName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(12),
    color: Colors.white,
    marginBottom: vs(4),
  },
  trainerIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  trainerId: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[500],
    letterSpacing: 0.8,
  },
  assignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  assignedText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7.5),
    color: Colors.zinc[600],
  },
  cardRight: {
    alignItems: 'center',
    gap: vs(8),
  },
  removeBtn: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: 'rgba(239,68,68,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  arrowIcon: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDivider: {
    height: 1,
    backgroundColor: `${TRAINER_COLOR}15`,
    marginVertical: vs(12),
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(8),
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  statLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[500],
    flex: 1,
  },
  statValue: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(8.5),
    color: Colors.white,
  },
  statDivider: {
    width: 1,
    height: vs(18),
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: s(6),
  },
  tapHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(4),
    backgroundColor: `${TRAINER_COLOR}05`,
    borderRadius: ms(8),
    paddingVertical: vs(5),
  },
  tapHintText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7.5),
    color: `${TRAINER_COLOR}60`,
    letterSpacing: 0.3,
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(60),
    gap: vs(12),
  },
  emptyIconCircle: {
    width: ms(90),
    height: ms(90),
    borderRadius: ms(45),
    backgroundColor: `${TRAINER_COLOR}08`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}15`,
  },
  emptyTitle: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(14),
    color: Colors.zinc[400],
  },
  emptySub: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[600],
    textAlign: 'center',
    paddingHorizontal: s(20),
  },
  emptyAddBtn: {
    borderRadius: ms(12),
    overflow: 'hidden',
    marginTop: vs(8),
  },
  emptyAddGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    paddingHorizontal: s(24),
    paddingVertical: vs(12),
  },
  emptyAddText: {
    fontFamily: Fonts.rajdhani.bold,
    fontSize: rf(10),
    color: '#fff',
    letterSpacing: 0.5,
  },

  // Add More
  addMoreBtn: {
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}20`,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  addMoreInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    paddingVertical: vs(14),
  },
  addMoreText: {
    fontFamily: Fonts.rajdhani.bold,
    fontSize: rf(10),
    color: TRAINER_COLOR,
    letterSpacing: 0.5,
  },
});

export default AdminTrainersScreen;