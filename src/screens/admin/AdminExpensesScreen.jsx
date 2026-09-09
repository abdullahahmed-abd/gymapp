// src/screens/admin/AdminExpensesScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Add01Icon,
  Delete02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ViewIcon,
  ViewOffIcon,
  Analytics02Icon,
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  MoneyReceiveCircleIcon,
  CreditCardIcon,
  Wallet01Icon,
  Target01Icon,
  Search01Icon,
  Note01Icon,
  Calendar03Icon,
  FlashIcon,
  UserGroupIcon,
  Dumbbell01Icon,
  WrenchIcon,
  Building03Icon,
  DropletIcon,
  FileEditIcon,
  NoteEditIcon,
  Loading03Icon,
} from '@hugeicons/core-free-icons';
import Header from '../../components/shared/Header';
import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const s = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS — matching web version
// ═══════════════════════════════════════════════════════════════
const GOLD = '#C5A059';
const GOLD_L = '#C5A059';
const RED = '#EF4444';
const GREEN = '#22C55E';
const BLUE = '#3B82F6';
const CYAN = '#22D3EE';
const PURPLE = '#A855F7';
const ORANGE = '#F97316';
const VIOLET = '#8B5CF6';

// ═══════════════════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════════════════
const CATEGORIES = [
  { id: 'electricity', label: 'Electricity', icon: FlashIcon, color: GOLD_L, emoji: '⚡' },
  { id: 'staff', label: 'Staff Salary', icon: UserGroupIcon, color: GOLD, emoji: '👥' },
  { id: 'trainer', label: 'Trainer Pay', icon: Dumbbell01Icon, color: GOLD, emoji: '🏋️' },
  { id: 'maintenance', label: 'Machine Repair', icon: WrenchIcon, color: RED, emoji: '🔧' },
  { id: 'rent', label: 'Rent', icon: Building03Icon, color: GOLD, emoji: '🏢' },
  { id: 'water', label: 'Water Bill', icon: DropletIcon, color: GOLD, emoji: '💧' },
  { id: 'other', label: 'Other', icon: FileEditIcon, color: GOLD, emoji: '📋' },
  { id: 'custom', label: 'Custom', icon: NoteEditIcon, color: GOLD, emoji: '✏️' },
];

// ═══════════════════════════════════════════════════════════════
// DUMMY DATA
// ═══════════════════════════════════════════════════════════════
const INITIAL_EXPENSES = [
  { id: 'e1', categoryId: 'electricity', label: 'Electricity Bill', amount: 8500, note: 'January 2025', date: '2025-01-15' },
  { id: 'e2', categoryId: 'staff', label: 'Staff Salary', amount: 25000, note: '3 Staff Members', date: '2025-01-01' },
  { id: 'e3', categoryId: 'trainer', label: 'Trainer Salary', amount: 18000, note: '2 Trainers', date: '2025-01-01' },
  { id: 'e4', categoryId: 'maintenance', label: 'Treadmill Repair', amount: 3200, note: 'Belt replacement', date: '2025-01-10' },
  { id: 'e5', categoryId: 'rent', label: 'Gym Rent', amount: 35000, note: 'January', date: '2025-01-01' },
  { id: 'e6', categoryId: 'water', label: 'Water Bill', amount: 1800, note: 'January', date: '2025-01-12' },
  { id: 'e7', categoryId: 'other', label: 'Cleaning Supplies', amount: 1200, note: 'Monthly', date: '2025-01-05' },
  { id: 'e8', categoryId: 'maintenance', label: 'AC Service', amount: 2500, note: 'Annual service', date: '2025-01-08' },
  { id: 'e9', categoryId: 'custom', label: 'Gym Towels Purchase', amount: 4500, note: '50 towels', date: '2025-01-18' },
];

const REVENUE_DATA = {
  monthly: { total: 185000, memberships: 152000, others: 33000 },
  yearly: { total: 2150000, memberships: 1820000, others: 330000 },
};

const CASH_DATA = {
  monthly: { cash: 48000, online: 137000 },
  yearly: { cash: 520000, online: 1630000 },
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const getCat = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[6];
const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ═══════════════════════════════════════════════════════════════
// MASKED AMOUNT
// ═══════════════════════════════════════════════════════════════
const MaskedAmount = ({ value, visible, style, color }) => {
  if (!visible) {
    return (
      <Text style={[style, color && { color }]}>
        ₹●●●●●●●
      </Text>
    );
  }
  return (
    <Text style={[style, color && { color }]}>
      {typeof value === 'number' ? fmt(value) : value}
    </Text>
  );
};

// ═══════════════════════════════════════════════════════════════
// ANIMATED NUMBER
// ═══════════════════════════════════════════════════════════════
const AnimatedNumber = ({ value, visible, style, color, prefix = '₹' }) => {
  const [display, setDisplay] = useState(0);
  const num = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, '')) || 0;

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1200;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * num));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [num, visible]);

  if (!visible) {
    return (
      <Text style={[style, color && { color }]}>
        {prefix}●●●●●●●
      </Text>
    );
  }

  return (
    <Text style={[style, color && { color }]}>
      {prefix}{display.toLocaleString('en-IN')}
    </Text>
  );
};

// ═══════════════════════════════════════════════════════════════
// GLASS PANEL
// ═══════════════════════════════════════════════════════════════
const GlassPanel = ({ children, style: customStyle, borderColor, glow, onPress }) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        gpSt.panel,
        borderColor && { borderColor },
        glow && { shadowColor: glow, shadowOpacity: 0.15, shadowRadius: 16, elevation: 4 },
        customStyle,
      ]}
    >
      {children}
    </Wrapper>
  );
};

const gpSt = StyleSheet.create({
  panel: {
    backgroundColor: '#000000',
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
});

// ═══════════════════════════════════════════════════════════════
// PULSE DOT
// ═══════════════════════════════════════════════════════════════
const PulseDot = ({ color = GREEN, size = 8 }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.8, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ width: size * 3, height: size * 3, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: size * 2,
          height: size * 2,
          borderRadius: size,
          backgroundColor: `${color}30`,
          transform: [{ scale: pulseAnim }],
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// STAT CARD — matching web design
// ═══════════════════════════════════════════════════════════════
const StatCard = ({ icon, label, value, color, sub, change, changeUp, visible }) => (
  <GlassPanel glow={`${color}08`} style={scSt.card}>
    <View style={scSt.inner}>
      {/* Top row */}
      <View style={scSt.topRow}>
        <View style={[scSt.iconBox, { backgroundColor: `${color}15`, borderColor: `${color}20` }]}>
          <HugeiconsIcon icon={icon} size={ms(16)} color={color} />
        </View>
        {change && (
          <View style={[
            scSt.changeBadge,
            {
              backgroundColor: changeUp ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)',
              borderColor: changeUp ? 'rgba(34,197,94,0.20)' : 'rgba(239,68,68,0.20)',
            },
          ]}>
            <HugeiconsIcon
              icon={changeUp ? ArrowUpRight01Icon : ArrowDownRight01Icon}
              size={ms(10)}
              color={changeUp ? GREEN : RED}
            />
            <Text style={[scSt.changeText, { color: changeUp ? GREEN : RED }]}>
              {change}
            </Text>
          </View>
        )}
      </View>

      {/* Amount */}
      <AnimatedNumber
        value={value}
        visible={visible}
        style={[scSt.amount]}
        color={color}
        prefix="₹"
      />

      {/* Label */}
      <Text style={scSt.label}>{label}</Text>

      {/* Sub */}
      {sub && (
        <>
          <View style={scSt.divider} />
          <View style={scSt.subRow}>
            <View style={[scSt.subDot, { backgroundColor: `${color}70` }]} />
            <Text style={scSt.subText}>{sub}</Text>
          </View>
        </>
      )}
    </View>
  </GlassPanel>
);

const scSt = StyleSheet.create({
  card: { flex: 1 },
  inner: { padding: ms(14) },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: vs(12) },
  iconBox: {
    width: ms(40), height: ms(40), borderRadius: ms(14),
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  changeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: s(3),
    paddingHorizontal: s(8), paddingVertical: vs(3),
    borderRadius: ms(10), borderWidth: 1,
  },
  changeText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(7), letterSpacing: 0.5,
  },
  amount: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(15), color: '#fff', marginBottom: vs(4),
  },
  label: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(7.5), color: 'rgba(161,161,170,1)',
    letterSpacing: 1.5, textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: vs(8),
  },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  subDot: { width: ms(4), height: ms(4), borderRadius: ms(2) },
  subText: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7), color: 'rgba(113,113,122,1)',
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
});

// ═══════════════════════════════════════════════════════════════
// AMOUNT TOGGLE BUTTON
// ═══════════════════════════════════════════════════════════════
const AmountToggleBtn = ({ visible, onToggle }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={[
          atSt.btn,
          {
            backgroundColor: visible ? 'rgba(197,160,89,0.08)' : 'rgba(239,68,68,0.08)',
            borderColor: visible ? 'rgba(197,160,89,0.22)' : 'rgba(239,68,68,0.22)',
          },
        ]}
      >
        <HugeiconsIcon
          icon={visible ? ViewIcon : ViewOffIcon}
          size={ms(15)}
          color={visible ? GOLD : RED}
        />
        <Text style={[atSt.text, { color: visible ? GOLD : RED }]}>
          {visible ? 'Hide' : 'Show'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const atSt = StyleSheet.create({
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: s(6),
    height: ms(36), paddingHorizontal: s(12),
    borderRadius: ms(14), borderWidth: 1,
  },
  text: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(7.5), letterSpacing: 1, textTransform: 'uppercase',
  },
});

// ═══════════════════════════════════════════════════════════════
// EXPENSE ROW — matching web
// ═══════════════════════════════════════════════════════════════
const ExpenseRow = ({ expense, onDelete, visible }) => {
  const cat = getCat(expense.categoryId);

  return (
    <View style={erSt.row}>
      {/* Icon */}
      <View style={[erSt.iconBox, { backgroundColor: `${cat.color}12`, borderColor: `${cat.color}20` }]}>
        <HugeiconsIcon icon={cat.icon} size={ms(15)} color={cat.color} />
      </View>

      {/* Content */}
      <View style={erSt.content}>
        <View style={erSt.titleRow}>
          <Text style={erSt.label} numberOfLines={1}>{expense.label}</Text>
          <View style={[erSt.catBadge, { backgroundColor: `${cat.color}10`, borderColor: `${cat.color}18` }]}>
            <Text style={[erSt.catBadgeText, { color: `${cat.color}BB` }]}>{cat.label}</Text>
          </View>
        </View>
        <View style={erSt.metaRow}>
          {expense.note ? (
            <Text style={erSt.note} numberOfLines={1}>{expense.note}</Text>
          ) : null}
          <View style={erSt.dateRow}>
            <HugeiconsIcon icon={Calendar03Icon} size={ms(8)} color="rgba(63,63,70,1)" />
            <Text style={erSt.dateText}>{formatDate(expense.date)}</Text>
          </View>
        </View>
      </View>

      {/* Amount + Delete */}
      <View style={erSt.rightCol}>
        <MaskedAmount
          value={expense.amount}
          visible={visible}
          style={erSt.amount}
          color={cat.color}
        />
        <TouchableOpacity
          style={erSt.delBtn}
          onPress={() => onDelete(expense.id)}
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={Delete02Icon} size={ms(12)} color={`${RED}80`} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const erSt = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: s(10),
    padding: ms(12), borderRadius: ms(16),
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: vs(6),
  },
  iconBox: {
    width: ms(40), height: ms(40), borderRadius: ms(14),
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  content: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(2) },
  label: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(8.5), color: '#fff', letterSpacing: 0.5,
    flexShrink: 1,
  },
  catBadge: {
    paddingHorizontal: s(6), paddingVertical: vs(1),
    borderRadius: ms(6), borderWidth: 1,
  },
  catBadgeText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(5.5), letterSpacing: 1, textTransform: 'uppercase',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  note: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7.5), color: 'rgba(113,113,122,1)', letterSpacing: 0.3,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: s(3) },
  dateText: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7), color: 'rgba(82,82,91,1)', letterSpacing: 0.5,
  },
  rightCol: { alignItems: 'flex-end', gap: vs(4) },
  amount: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(10), letterSpacing: 0.5,
  },
  delBtn: {
    width: ms(26), height: ms(26), borderRadius: ms(8),
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
});

// ═══════════════════════════════════════════════════════════════
// ADD EXPENSE MODAL
// ═══════════════════════════════════════════════════════════════
const AddExpenseModal = ({ visible, onClose, onAdd }) => {
  const [catId, setCatId] = useState('electricity');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [adding, setAdding] = useState(false);

  const cat = getCat(catId);

  const handleAdd = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }
    if (catId === 'custom' && !customLabel.trim()) {
      Alert.alert('Error', 'Enter expense name');
      return;
    }
    setAdding(true);
    await new Promise((r) => setTimeout(r, 600));
    onAdd({
      id: `e_${Date.now()}`,
      categoryId: catId,
      label: catId === 'custom' ? customLabel.trim() : cat.label,
      amount: parseFloat(amount),
      note: note.trim(),
      date: new Date().toISOString().split('T')[0],
    });
    setAmount('');
    setNote('');
    setCustomLabel('');
    setCatId('electricity');
    setAdding(false);
    onClose();
  };

  const QUICK_AMOUNTS = [500, 1000, 5000, 10000, 25000];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={mdSt.overlay} onPress={onClose}>
        <Pressable style={mdSt.sheet} onPress={() => {}}>
          {/* Gold top line */}
          <LinearGradient
            colors={['transparent', `${GOLD}60`, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={mdSt.topLine}
          />

          {/* Header */}
          <View style={mdSt.header}>
            <View style={mdSt.headerLeft}>
              <View style={mdSt.headerIconBox}>
                <HugeiconsIcon icon={Add01Icon} size={ms(15)} color={GOLD} />
              </View>
              <View>
                <Text style={mdSt.headerTitle}>ADD EXPENSE</Text>
                <Text style={mdSt.headerSub}>Record new entry</Text>
              </View>
            </View>
            <TouchableOpacity style={mdSt.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <HugeiconsIcon icon={Cancel01Icon} size={ms(13)} color="rgba(113,113,122,1)" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={mdSt.body}>
            {/* Category Grid */}
            <Text style={mdSt.sectionLabel}>CATEGORY</Text>
            <View style={mdSt.catGrid}>
              {CATEGORIES.map((c) => {
                const sel = catId === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      mdSt.catItem,
                      sel && { backgroundColor: 'rgba(197,160,89,0.10)', borderColor: 'rgba(197,160,89,0.35)' },
                    ]}
                    onPress={() => setCatId(c.id)}
                    activeOpacity={0.75}
                  >
                    <View style={[
                      mdSt.catIconBox,
                      {
                        backgroundColor: sel ? 'rgba(197,160,89,0.18)' : 'rgba(255,255,255,0.04)',
                        borderColor: sel ? 'rgba(197,160,89,0.30)' : 'rgba(255,255,255,0.06)',
                      },
                    ]}>
                      <HugeiconsIcon icon={c.icon} size={ms(13)} color={sel ? GOLD : '#52525B'} />
                    </View>
                    <Text style={[mdSt.catItemLabel, sel && { color: GOLD }]} numberOfLines={1}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Name */}
            {catId === 'custom' && (
              <>
                <Text style={mdSt.sectionLabel}>EXPENSE NAME</Text>
                <View style={mdSt.inputRow}>
                  <HugeiconsIcon icon={NoteEditIcon} size={ms(13)} color="#52525B" />
                  <TextInput
                    style={mdSt.inputText}
                    placeholder="e.g. Gym Towels..."
                    placeholderTextColor="rgba(63,63,70,1)"
                    value={customLabel}
                    onChangeText={setCustomLabel}
                  />
                </View>
              </>
            )}

            {/* Amount */}
            <Text style={mdSt.sectionLabel}>AMOUNT</Text>
            <View style={[mdSt.inputRow, { backgroundColor: 'rgba(197,160,89,0.05)', borderColor: 'rgba(197,160,89,0.20)' }]}>
              <View style={mdSt.amountPrefix}>
                <Text style={mdSt.amountPrefixText}>₹</Text>
              </View>
              <TextInput
                style={mdSt.amountInput}
                placeholder="0"
                placeholderTextColor="rgba(39,39,42,1)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
              {amount ? (
                <View style={mdSt.amountBadge}>
                  <Text style={mdSt.amountBadgeText}>{fmt(parseFloat(amount) || 0)}</Text>
                </View>
              ) : null}
            </View>

            {/* Quick amounts */}
            <View style={mdSt.quickRow}>
              {QUICK_AMOUNTS.map((q) => (
                <TouchableOpacity
                  key={q}
                  style={[
                    mdSt.quickBtn,
                    amount === String(q) && { backgroundColor: 'rgba(197,160,89,0.15)', borderColor: 'rgba(197,160,89,0.30)' },
                  ]}
                  onPress={() => setAmount(String(q))}
                  activeOpacity={0.7}
                >
                  <Text style={[mdSt.quickBtnText, amount === String(q) && { color: GOLD }]}>
                    ₹{q >= 1000 ? `${q / 1000}K` : q}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Note */}
            <View style={mdSt.noteLabelRow}>
              <Text style={mdSt.sectionLabel}>NOTE</Text>
              <Text style={mdSt.optionalText}>Optional</Text>
            </View>
            <View style={mdSt.inputRow}>
              <HugeiconsIcon icon={Note01Icon} size={ms(13)} color="#52525B" />
              <TextInput
                style={mdSt.inputText}
                placeholder="Add a note..."
                placeholderTextColor="rgba(63,63,70,1)"
                value={note}
                onChangeText={setNote}
              />
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={mdSt.footer}>
            <TouchableOpacity style={mdSt.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={mdSt.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={mdSt.addBtn}
              onPress={handleAdd}
              disabled={adding}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[GOLD, GOLD_L]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={mdSt.addBtnGrad}
              >
                {adding ? (
                  <HugeiconsIcon icon={Loading03Icon} size={ms(14)} color="#000" />
                ) : (
                  <HugeiconsIcon icon={Add01Icon} size={ms(14)} color="#000" />
                )}
                <Text style={mdSt.addBtnText}>{adding ? 'Adding...' : 'Add Expense'}</Text>
                {amount && !adding ? (
                  <View style={mdSt.addBtnAmountBadge}>
                    <Text style={mdSt.addBtnAmountText}>{fmt(parseFloat(amount) || 0)}</Text>
                  </View>
                ) : null}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const mdSt = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.90)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#000000',
    borderTopLeftRadius: ms(24), borderTopRightRadius: ms(24),
    borderWidth: 1, borderColor: 'rgba(197,160,89,0.22)',
    maxHeight: '88%',
  },
  topLine: { height: 2 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20), paddingVertical: vs(16),
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: s(12) },
  headerIconBox: {
    width: ms(40), height: ms(40), borderRadius: ms(14),
    backgroundColor: 'rgba(197,160,89,0.12)',
    borderWidth: 1, borderColor: 'rgba(197,160,89,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(10), color: '#fff', letterSpacing: 1.2,
  },
  headerSub: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7), color: 'rgba(113,113,122,1)', letterSpacing: 1, textTransform: 'uppercase',
  },
  closeBtn: {
    width: ms(32), height: ms(32), borderRadius: ms(12),
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  body: { paddingHorizontal: s(20), paddingTop: vs(16) },
  sectionLabel: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(7), color: 'rgba(113,113,122,1)',
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: vs(8),
  },
  catGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: s(6), marginBottom: vs(16),
  },
  catItem: {
    width: (SCREEN_WIDTH - s(40) - s(18)) / 4,
    alignItems: 'center', gap: vs(5),
    paddingVertical: vs(10), paddingHorizontal: s(2),
    borderRadius: ms(14), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  catIconBox: {
    width: ms(30), height: ms(30), borderRadius: ms(10),
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  catItemLabel: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(6), color: '#52525B', letterSpacing: 0.5,
    textTransform: 'uppercase', textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: s(10),
    paddingHorizontal: s(14), paddingVertical: vs(10),
    borderRadius: ms(16),
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: vs(12),
  },
  inputText: {
    flex: 1,
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(9.5), color: '#fff', letterSpacing: 0.5,
  },
  amountPrefix: {
    width: ms(34), height: ms(34), borderRadius: ms(10),
    backgroundColor: 'rgba(197,160,89,0.12)',
    borderWidth: 1, borderColor: 'rgba(197,160,89,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },
  amountPrefixText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(12), color: GOLD,
  },
  amountInput: {
    flex: 1,
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(20), color: '#fff', letterSpacing: 1,
  },
  amountBadge: {
    backgroundColor: 'rgba(197,160,89,0.12)',
    paddingHorizontal: s(8), paddingVertical: vs(3),
    borderRadius: ms(8),
  },
  amountBadgeText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(7), color: GOLD,
  },
  quickRow: {
    flexDirection: 'row', gap: s(6),
    marginBottom: vs(16), flexWrap: 'wrap',
  },
  quickBtn: {
    paddingHorizontal: s(10), paddingVertical: vs(5),
    borderRadius: ms(10), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  quickBtnText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(6.5), color: '#52525B',
  },
  noteLabelRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: vs(8),
  },
  optionalText: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(6.5), color: 'rgba(63,63,70,1)', letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row', gap: s(10),
    paddingHorizontal: s(20), paddingVertical: vs(16),
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)',
  },
  cancelBtn: {
    paddingHorizontal: s(16), paddingVertical: vs(12),
    borderRadius: ms(16), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: '#000',
  },
  cancelBtnText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(8.5), color: 'rgba(161,161,170,1)',
    letterSpacing: 1, textTransform: 'uppercase',
  },
  addBtn: { flex: 1, borderRadius: ms(16), overflow: 'hidden' },
  addBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: s(8), paddingVertical: vs(12),
  },
  addBtnText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(8.5), color: '#000', letterSpacing: 1,
  },
  addBtnAmountBadge: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingHorizontal: s(6), paddingVertical: vs(2),
    borderRadius: ms(6),
  },
  addBtnAmountText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(6.5), color: 'rgba(0,0,0,0.65)',
  },
});

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminExpensesScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [period, setPeriod] = useState('monthly');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [amountsVisible, setAmountsVisible] = useState(true);

  const revenue = REVENUE_DATA[period];
  const cash = CASH_DATA[period];
  const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);
  const net = revenue.total - totalExp;
  const spentPct = Math.round((totalExp / revenue.total) * 100);

  const catTotals = CATEGORIES.map((c) => ({
    ...c,
    total: expenses.filter((e) => e.categoryId === c.id).reduce((sum, e) => sum + e.amount, 0),
    count: expenses.filter((e) => e.categoryId === c.id).length,
  })).filter((c) => c.total > 0);

  const filtered = expenses
    .filter((e) => activeFilter === 'all' || e.categoryId === activeFilter)
    .filter((e) =>
      !searchQuery ||
      e.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.note && e.note.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleAdd = (exp) => setExpenses((p) => [exp, ...p]);
  const handleDelete = (id) => {
    Alert.alert('Delete', 'Delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setExpenses((p) => p.filter((e) => e.id !== id)) },
    ]);
  };

  const M = (val) => (amountsVisible ? fmt(val) : '₹●●●●●●●');
  const Mpct = (pct) => (amountsVisible ? `${pct}%` : '••%');

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={st.bg}
      blurRadius={9}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)', '#000000']}
        style={st.gradient}
      >
        <SafeAreaView style={st.safe} edges={['top']}>
          <Header title="FINANCE" showMenu={false} />

          <ScrollView
            style={st.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={st.scrollContent}
          >
            {/* ═══════════════════════════════════ HEADER AREA */}
            <View style={st.headerArea}>
              <View style={st.headerLeft}>
                {/* Back */}
                <TouchableOpacity
                  style={st.backBtn}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={ms(16)} color="rgba(161,161,170,1)" />
                </TouchableOpacity>

                {/* Eye Toggle */}
                <AmountToggleBtn
                  visible={amountsVisible}
                  onToggle={() => setAmountsVisible((v) => !v)}
                />
              </View>

              {/* Period Toggle */}
              <View style={st.periodBox}>
                {['monthly', 'yearly'].map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[st.periodTab, period === p && st.periodTabActive]}
                    onPress={() => setPeriod(p)}
                    activeOpacity={0.7}
                  >
                    <Text style={[st.periodTabText, period === p && st.periodTabTextActive]}>
                      {p === 'monthly' ? 'Monthly' : 'Yearly'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Title */}
            <View style={st.titleArea}>
              <Text style={st.titleSub}>
                Financial Overview • {period === 'monthly' ? 'This Month' : 'This Year'}
              </Text>
              <Text style={st.titleMain}>FINANCE CENTER</Text>
            </View>

            {/* ═══════════════════════════════════ STAT CARDS */}
            <View style={st.statRow}>
              <StatCard
                icon={ArrowUpRight01Icon}
                label="Total Revenue"
                value={revenue.total}
                color={GREEN}
                change="+12%"
                changeUp
                sub="Memberships + Others"
                visible={amountsVisible}
              />
              <StatCard
                icon={ArrowDownRight01Icon}
                label="Total Expenses"
                value={totalExp}
                color={RED}
                change="-5%"
                changeUp={false}
                sub={`${expenses.length} transactions`}
                visible={amountsVisible}
              />
            </View>
            <View style={st.statRow}>
              <StatCard
                icon={MoneyReceiveCircleIcon}
                label="Net Profit"
                value={Math.abs(net)}
                color={GOLD}
                change={net >= 0 ? '+8%' : '-3%'}
                changeUp={net >= 0}
                sub={net >= 0 ? 'Profit this period' : 'Loss recorded'}
                visible={amountsVisible}
              />
              <StatCard
                icon={Target01Icon}
                label="Budget Used"
                value={totalExp}
                color={net >= 0 ? GOLD : RED}
                sub={`${Mpct(spentPct)} of revenue spent`}
                visible={amountsVisible}
              />
            </View>

            {/* ═══════════════════════════════════ OVERVIEW */}
            <GlassPanel borderColor="rgba(197,160,89,0.15)" glow={`${GOLD}08`}>
              <LinearGradient
                colors={[`${GOLD}06`, 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              {/* Gold top accent line */}
              <View style={st.goldTopLine}>
                <LinearGradient
                  colors={['transparent', `${GOLD}45`, 'transparent']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </View>

              <View style={st.sectionPad}>
                {/* Section header */}
                <View style={st.sectionHeader}>
                  <View style={st.goldBar} />
                  <View>
                    <Text style={st.sectionTitle}>OVERVIEW</Text>
                    <Text style={st.sectionSub}>Revenue vs Expenses</Text>
                  </View>
                </View>

                {/* Revenue bar */}
                <View style={st.barSection}>
                  <View style={st.barLabelRow}>
                    <View style={st.barLabelLeft}>
                      <View style={[st.barDot, { backgroundColor: GREEN }]} />
                      <Text style={st.barLabel}>Revenue</Text>
                    </View>
                    <MaskedAmount
                      value={revenue.total}
                      visible={amountsVisible}
                      style={st.barValue}
                      color={GREEN}
                    />
                  </View>
                  <View style={st.barTrack}>
                    <LinearGradient
                      colors={[GREEN, '#16A34A']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={[st.barFill, { width: '100%' }]}
                    />
                  </View>
                </View>

                {/* Expenses bar */}
                <View style={st.barSection}>
                  <View style={st.barLabelRow}>
                    <View style={st.barLabelLeft}>
                      <View style={[st.barDot, { backgroundColor: RED }]} />
                      <Text style={st.barLabel}>Expenses</Text>
                    </View>
                    <MaskedAmount
                      value={totalExp}
                      visible={amountsVisible}
                      style={st.barValue}
                      color={RED}
                    />
                  </View>
                  <View style={st.barTrack}>
                    <LinearGradient
                      colors={[RED, '#DC2626']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={[st.barFill, { width: `${spentPct}%` }]}
                    />
                  </View>
                </View>

                {/* Divider */}
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.08)', 'transparent']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={st.hDivider}
                />

                {/* Net Profit/Loss */}
                <View style={[st.netBox, {
                  backgroundColor: net >= 0 ? 'rgba(197,160,89,0.07)' : 'rgba(239,68,68,0.07)',
                  borderColor: net >= 0 ? 'rgba(197,160,89,0.20)' : 'rgba(239,68,68,0.20)',
                }]}>
                  <View style={st.netLeft}>
                    <View style={[st.netIconBox, {
                      backgroundColor: net >= 0 ? 'rgba(197,160,89,0.15)' : 'rgba(239,68,68,0.12)',
                    }]}>
                      <HugeiconsIcon
                        icon={net >= 0 ? ArrowUpRight01Icon : ArrowDownRight01Icon}
                        size={ms(16)}
                        color={net >= 0 ? GOLD : RED}
                      />
                    </View>
                    <View>
                      <Text style={[st.netLabel, { color: net >= 0 ? GOLD : RED }]}>
                        NET {net >= 0 ? 'PROFIT' : 'LOSS'}
                      </Text>
                      <Text style={st.netMargin}>
                        {amountsVisible ? `${100 - spentPct}% margin` : '••% margin'}
                      </Text>
                    </View>
                  </View>
                  <MaskedAmount
                    value={Math.abs(net)}
                    visible={amountsVisible}
                    style={st.netAmount}
                    color={net >= 0 ? GOLD : RED}
                  />
                </View>
              </View>
            </GlassPanel>

            {/* ═══════════════════════════════════ COLLECTION */}
            <GlassPanel>
              <View style={st.sectionPad}>
                <View style={st.sectionHeader}>
                  <View style={st.goldBar} />
                  <View>
                    <Text style={st.sectionTitle}>COLLECTION</Text>
                    <Text style={st.sectionSub}>Payment breakdown</Text>
                  </View>
                </View>

                <View style={st.collectionRow}>
                  {[
                    { icon: Wallet01Icon, label: 'CASH', value: cash.cash, pct: Math.round((cash.cash / (cash.cash + cash.online)) * 100) },
                    { icon: CreditCardIcon, label: 'ONLINE', value: cash.online, pct: Math.round((cash.online / (cash.cash + cash.online)) * 100) },
                  ].map((item) => (
                    <View key={item.label} style={st.collectionCard}>
                      <View style={st.collectionIconBox}>
                        <HugeiconsIcon icon={item.icon} size={ms(14)} color={GOLD} />
                      </View>
                      <Text style={st.collectionLabel}>{item.label}</Text>
                      <MaskedAmount
                        value={item.value}
                        visible={amountsVisible}
                        style={st.collectionValue}
                        color="#fff"
                      />
                      <View style={st.collectionBarTrack}>
                        <LinearGradient
                          colors={[GOLD, GOLD_L]}
                          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                          style={[st.collectionBarFill, { width: `${item.pct}%` }]}
                        />
                      </View>
                      <Text style={st.collectionPct}>{Mpct(item.pct)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </GlassPanel>

            {/* ═══════════════════════════════════ REVENUE */}
            <GlassPanel borderColor="rgba(197,160,89,0.12)" glow={`${GOLD}04`}>
              <View style={st.goldTopLine}>
                <LinearGradient
                  colors={['transparent', `${GOLD}35`, 'transparent']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </View>
              <View style={st.sectionPad}>
                <View style={st.sectionHeaderSpread}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(8) }}>
                    <View style={st.goldBar} />
                    <View>
                      <Text style={st.sectionTitle}>REVENUE</Text>
                      <Text style={st.sectionSub}>Income sources</Text>
                    </View>
                  </View>
                  <MaskedAmount
                    value={revenue.total}
                    visible={amountsVisible}
                    style={st.revTotalAmount}
                    color={GOLD}
                  />
                </View>

                {[
                  { label: 'Memberships', value: revenue.memberships, icon: CreditCardIcon },
                  { label: 'Others', value: revenue.others, icon: Note01Icon },
                ].map((item, i) => {
                  const pct = Math.round((item.value / revenue.total) * 100);
                  return (
                    <View key={i} style={[st.revRow, i === 0 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }]}>
                      <View style={st.revRowIconBox}>
                        <HugeiconsIcon icon={item.icon} size={ms(13)} color={GOLD} />
                      </View>
                      <View style={st.revRowContent}>
                        <Text style={st.revRowLabel}>{item.label}</Text>
                        <View style={st.revRowBarTrack}>
                          <LinearGradient
                            colors={[GOLD, GOLD_L]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={[st.revRowBarFill, { width: `${pct}%` }]}
                          />
                        </View>
                      </View>
                      <View style={st.revRowRight}>
                        <MaskedAmount
                          value={item.value}
                          visible={amountsVisible}
                          style={st.revRowValue}
                          color="#fff"
                        />
                        <Text style={st.revRowPct}>{Mpct(pct)}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </GlassPanel>

            {/* ═══════════════════════════════════ EXPENSE BREAKDOWN */}
            <GlassPanel borderColor="rgba(239,68,68,0.15)" glow={`${RED}04`}>
              <View style={st.sectionPad}>
                <View style={st.sectionHeaderSpread}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(8) }}>
                    <View style={[st.goldBar, { backgroundColor: RED }]} />
                    <View>
                      <Text style={st.sectionTitle}>EXPENSE BREAKDOWN</Text>
                      <Text style={st.sectionSub}>By category</Text>
                    </View>
                  </View>
                  <MaskedAmount
                    value={totalExp}
                    visible={amountsVisible}
                    style={st.expTotalAmount}
                    color={`${RED}CC`}
                  />
                </View>

                <View style={st.catBreakdownGrid}>
                  {catTotals.map((cat) => {
                    const pct = Math.round((cat.total / totalExp) * 100);
                    const active = activeFilter === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          st.catBreakdownCard,
                          active && {
                            backgroundColor: 'rgba(197,160,89,0.10)',
                            borderColor: 'rgba(197,160,89,0.28)',
                          },
                        ]}
                        onPress={() => setActiveFilter(active ? 'all' : cat.id)}
                        activeOpacity={0.75}
                      >
                        <View style={st.catBreakdownTop}>
                          <View style={[
                            st.catBreakdownIconBox,
                            { backgroundColor: active ? 'rgba(197,160,89,0.18)' : 'rgba(197,160,89,0.08)' },
                          ]}>
                            <HugeiconsIcon
                              icon={cat.icon}
                              size={ms(12)}
                              color={active ? GOLD : `${GOLD}70`}
                            />
                          </View>
                          <Text style={[st.catBreakdownPct, active && { color: GOLD }]}>
                            {Mpct(pct)}
                          </Text>
                        </View>
                        <MaskedAmount
                          value={cat.total}
                          visible={amountsVisible}
                          style={st.catBreakdownAmount}
                          color="#fff"
                        />
                        <Text
                          style={[st.catBreakdownLabel, active && { color: `${GOLD}BB` }]}
                          numberOfLines={1}
                        >
                          {cat.label}
                        </Text>
                        <View style={st.catBreakdownBarTrack}>
                          <LinearGradient
                            colors={[GOLD, GOLD_L]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={[st.catBreakdownBarFill, { width: `${pct}%` }]}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </GlassPanel>

            {/* ═══════════════════════════════════ TRANSACTIONS */}
            <GlassPanel>
              {/* Transactions Header */}
              <View style={st.txHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(8) }}>
                  <View style={[st.goldBar, { backgroundColor: 'rgba(255,255,255,0.40)' }]} />
                  <View>
                    <Text style={st.sectionTitle}>TRANSACTIONS</Text>
                    <Text style={st.sectionSub}>
                      {filtered.length} {activeFilter !== 'all' ? getCat(activeFilter).label : ''} entries
                    </Text>
                  </View>
                </View>
                {activeFilter !== 'all' && (
                  <TouchableOpacity
                    style={st.clearFilterBtn}
                    onPress={() => setActiveFilter('all')}
                    activeOpacity={0.7}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={ms(8)} color="rgba(113,113,122,1)" />
                    <Text style={st.clearFilterText}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Search */}
              <View style={st.searchBox}>
                <HugeiconsIcon icon={Search01Icon} size={ms(13)} color="rgba(82,82,91,1)" />
                <TextInput
                  style={st.searchInput}
                  placeholder="Search expenses..."
                  placeholderTextColor="rgba(63,63,70,1)"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                  <TouchableOpacity
                    style={st.searchClearBtn}
                    onPress={() => setSearchQuery('')}
                    activeOpacity={0.7}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={ms(9)} color="rgba(113,113,122,1)" />
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Transaction List */}
              <View style={st.txList}>
                {filtered.length === 0 ? (
                  <View style={st.emptyState}>
                    <View style={st.emptyIcon}>
                      <HugeiconsIcon icon={Note01Icon} size={ms(22)} color="rgba(39,39,42,1)" />
                    </View>
                    <Text style={st.emptyTitle}>NO EXPENSES FOUND</Text>
                    <Text style={st.emptySub}>
                      {searchQuery ? 'Try a different search' : 'Add your first expense'}
                    </Text>
                  </View>
                ) : (
                  filtered.map((exp) => (
                    <ExpenseRow
                      key={exp.id}
                      expense={exp}
                      onDelete={handleDelete}
                      visible={amountsVisible}
                    />
                  ))
                )}
              </View>

              {/* Footer Total */}
              {filtered.length > 0 && (
                <View style={st.txFooter}>
                  <View style={st.txFooterLeft}>
                    <View style={st.txFooterIconBox}>
                      <HugeiconsIcon icon={Analytics02Icon} size={ms(14)} color={RED} />
                    </View>
                    <View>
                      <Text style={st.txFooterLabel}>
                        {activeFilter !== 'all' ? `${getCat(activeFilter).label} Total` : 'Filtered Total'}
                      </Text>
                      <MaskedAmount
                        value={filtered.reduce((sum, e) => sum + e.amount, 0)}
                        visible={amountsVisible}
                        style={st.txFooterAmount}
                        color={RED}
                      />
                    </View>
                  </View>
                  <View style={st.txFooterRight}>
                    <HugeiconsIcon icon={ViewIcon} size={ms(10)} color="rgba(82,82,91,1)" />
                    <Text style={st.txFooterEntries}>{filtered.length} entries</Text>
                  </View>
                </View>
              )}
            </GlassPanel>

            {/* ═══════════════════════════════════ ADD EXPENSE BUTTON */}
            <TouchableOpacity
              style={st.addExpenseBtn}
              onPress={() => setShowExpenseModal(true)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[GOLD, GOLD_L]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 0 }}
                style={st.addExpenseBtnGrad}
              >
                <View style={st.addExpenseBtnIcon}>
                  <HugeiconsIcon icon={Add01Icon} size={ms(14)} color="#000" />
                </View>
                <Text style={st.addExpenseBtnText}>ADD EXPENSE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>

          <BottomNav
            activeTab="dashboard"
            onTabChange={(tab) => {
              if (tab === 'dashboard') navigation.navigate('AdminDashboard');
              if (tab === 'plans') navigation.navigate('AdminPlans');
              if (tab === 'members') navigation.navigate('AdminUsersDetail');
              if (tab === 'settings') navigation.navigate('AdminSettings');
            }}
            userType="admin"
          />

          <AddExpenseModal
            visible={showExpenseModal}
            onClose={() => setShowExpenseModal(false)}
            onAdd={(exp) => {
              handleAdd(exp);
              setShowExpenseModal(false);
            }}
          />
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const st = StyleSheet.create({
  bg: { flex: 1 },
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: s(16), paddingBottom: vs(120), gap: vs(12) },

  // Header Area
  headerArea: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(4), marginBottom: vs(2),
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  backBtn: {
    width: ms(38), height: ms(38), borderRadius: ms(14),
    backgroundColor: '#000', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  periodBox: {
    flexDirection: 'row', backgroundColor: '#000',
    borderRadius: ms(12), padding: s(3),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  periodTab: {
    paddingHorizontal: s(14), paddingVertical: vs(6),
    borderRadius: ms(10),
  },
  periodTabActive: { backgroundColor: 'rgba(197,160,89,0.12)', borderWidth: 1, borderColor: 'rgba(197,160,89,0.25)' },
  periodTabText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(7.5), color: '#52525B',
    letterSpacing: 1, textTransform: 'uppercase',
  },
  periodTabTextActive: { color: GOLD },

  // Title
  titleArea: { marginBottom: vs(2) },
  titleSub: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(7.5), color: GOLD,
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: vs(2),
  },
  titleMain: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(14), color: '#fff', letterSpacing: 3,
  },

  // Stat rows
  statRow: { flexDirection: 'row', gap: s(10) },

  // Gold accents
  goldTopLine: { height: 2, position: 'absolute', top: 0, left: s(20), right: s(20) },
  goldBar: {
    width: ms(4), height: ms(24), borderRadius: ms(2),
    backgroundColor: GOLD,
  },

  // Section shared
  sectionPad: { padding: ms(16) },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(16) },
  sectionHeaderSpread: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: vs(14),
  },
  sectionTitle: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(10), color: '#fff', letterSpacing: 1.5,
  },
  sectionSub: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7), color: 'rgba(113,113,122,1)',
    letterSpacing: 1, textTransform: 'uppercase',
  },

  // Bars
  barSection: { marginBottom: vs(10) },
  barLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(5) },
  barLabelLeft: { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  barDot: { width: ms(8), height: ms(8), borderRadius: ms(4) },
  barLabel: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(7.5), color: 'rgba(161,161,170,1)',
    letterSpacing: 1, textTransform: 'uppercase',
  },
  barValue: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(9.5),
  },
  barTrack: {
    height: vs(7), backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: ms(4), overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: ms(4) },

  // Divider
  hDivider: { height: 1, marginVertical: vs(12) },

  // Net
  netBox: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(14), paddingVertical: vs(12),
    borderRadius: ms(16), borderWidth: 1,
  },
  netLeft: { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  netIconBox: {
    width: ms(36), height: ms(36), borderRadius: ms(12),
    alignItems: 'center', justifyContent: 'center',
  },
  netLabel: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(8), letterSpacing: 1,
  },
  netMargin: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7), color: 'rgba(82,82,91,1)', letterSpacing: 0.5,
  },
  netAmount: {
    fontFamily: Fonts.orbitron?.extraLight || Fonts.orbitron?.regular || 'System',
    fontSize: rf(16),
  },

  // Collection
  collectionRow: { flexDirection: 'row', gap: s(10) },
  collectionCard: {
    flex: 1, borderRadius: ms(16), padding: ms(14),
    backgroundColor: 'rgba(197,160,89,0.05)',
    borderWidth: 1, borderColor: 'rgba(197,160,89,0.15)',
    alignItems: 'center', gap: vs(4),
  },
  collectionIconBox: {
    width: ms(34), height: ms(34), borderRadius: ms(10),
    backgroundColor: 'rgba(197,160,89,0.12)',
    borderWidth: 1, borderColor: 'rgba(197,160,89,0.22)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: vs(4),
  },
  collectionLabel: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(6.5), color: `${GOLD}80`,
    letterSpacing: 1.5, textTransform: 'uppercase',
  },
  collectionValue: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(13), marginBottom: vs(6),
  },
  collectionBarTrack: {
    height: vs(3), width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: ms(2), overflow: 'hidden',
  },
  collectionBarFill: { height: '100%', borderRadius: ms(2) },
  collectionPct: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(7), color: `${GOLD}80`, marginTop: vs(3),
  },

  // Revenue
  revTotalAmount: {
    fontFamily: Fonts.orbitron?.extraLight || Fonts.orbitron?.regular || 'System',
    fontSize: rf(16),
  },
  revRow: {
    flexDirection: 'row', alignItems: 'center', gap: s(10),
    paddingVertical: vs(10),
  },
  revRowIconBox: {
    width: ms(34), height: ms(34), borderRadius: ms(10),
    backgroundColor: 'rgba(197,160,89,0.10)',
    borderWidth: 1, borderColor: 'rgba(197,160,89,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  revRowContent: { flex: 1 },
  revRowLabel: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(8.5), color: 'rgba(212,212,216,1)',
    letterSpacing: 0.5, marginBottom: vs(5),
  },
  revRowBarTrack: {
    height: vs(3), backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: ms(2), overflow: 'hidden',
  },
  revRowBarFill: { height: '100%', borderRadius: ms(2) },
  revRowRight: { alignItems: 'flex-end' },
  revRowValue: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(9.5),
  },
  revRowPct: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(7), color: `${GOLD}80`, marginTop: vs(2),
  },

  // Expense Breakdown
  expTotalAmount: {
    fontFamily: Fonts.orbitron?.extraLight || Fonts.orbitron?.regular || 'System',
    fontSize: rf(14),
  },
  catBreakdownGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: s(8),
  },
  catBreakdownCard: {
    width: (SCREEN_WIDTH - s(32) - s(32) - s(8)) / 2,
    padding: ms(12), borderRadius: ms(16),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  catBreakdownTop: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: vs(8),
  },
  catBreakdownIconBox: {
    width: ms(28), height: ms(28), borderRadius: ms(8),
    alignItems: 'center', justifyContent: 'center',
  },
  catBreakdownPct: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(6.5), color: '#52525B',
  },
  catBreakdownAmount: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(9.5), marginBottom: vs(2),
  },
  catBreakdownLabel: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(6.5), color: '#52525B',
    letterSpacing: 1, textTransform: 'uppercase',
    marginBottom: vs(8),
  },
  catBreakdownBarTrack: {
    height: vs(2), backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: ms(1), overflow: 'hidden',
  },
  catBreakdownBarFill: { height: '100%', borderRadius: ms(1) },

  // Transactions
  txHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16), paddingTop: ms(16),
    paddingBottom: ms(10),
  },
  clearFilterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: s(4),
    paddingHorizontal: s(10), paddingVertical: vs(4),
    borderRadius: ms(10),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  clearFilterText: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(7), color: 'rgba(161,161,170,1)',
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: s(8),
    marginHorizontal: ms(16), marginBottom: ms(12),
    paddingHorizontal: s(12), paddingVertical: vs(8),
    borderRadius: ms(16),
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  searchInput: {
    flex: 1, fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(9), color: '#fff', letterSpacing: 0.5,
  },
  searchClearBtn: {
    width: ms(24), height: ms(24), borderRadius: ms(8),
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  txList: { paddingHorizontal: ms(16) },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: vs(40) },
  emptyIcon: {
    width: ms(52), height: ms(52), borderRadius: ms(16),
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: vs(12),
  },
  emptyTitle: {
    fontFamily: Fonts.orbitron?.regular || 'System',
    fontSize: rf(9), color: 'rgba(82,82,91,1)',
    letterSpacing: 1.5, marginBottom: vs(4),
  },
  emptySub: {
    fontFamily: Fonts.rajdhani?.regular || 'System',
    fontSize: rf(7.5), color: 'rgba(63,63,70,1)',
    letterSpacing: 0.5,
  },

  // Transaction footer
  txFooter: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16), paddingVertical: ms(12),
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
  },
  txFooterLeft: { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  txFooterIconBox: {
    width: ms(34), height: ms(34), borderRadius: ms(10),
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  txFooterLabel: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(7), color: 'rgba(113,113,122,1)',
    letterSpacing: 1, textTransform: 'uppercase',
  },
  txFooterAmount: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(12),
  },
  txFooterRight: {
    flexDirection: 'row', alignItems: 'center', gap: s(5),
    paddingHorizontal: s(10), paddingVertical: vs(5),
    borderRadius: ms(10),
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  txFooterEntries: {
    fontFamily: Fonts.rajdhani?.bold || 'System',
    fontSize: rf(7.5), color: 'rgba(113,113,122,1)',
    letterSpacing: 1, textTransform: 'uppercase',
  },

  // Add Expense Button
  addExpenseBtn: { borderRadius: ms(16), overflow: 'hidden' },
  addExpenseBtnGrad: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: s(10),
    paddingVertical: vs(14),
  },
  addExpenseBtnIcon: {
    width: ms(28), height: ms(28), borderRadius: ms(8),
    backgroundColor: 'rgba(0,0,0,0.10)',
    alignItems: 'center', justifyContent: 'center',
  },
  addExpenseBtnText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(8.5), color: '#000', letterSpacing: 1.5,
  },
});

export default AdminExpensesScreen;