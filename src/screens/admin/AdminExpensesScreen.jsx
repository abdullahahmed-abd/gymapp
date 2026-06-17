// src/screens/admin/AdminExpensesScreen.js
import React, { useState } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  MoneyReceiveCircleIcon,
  Add01Icon,
  Delete02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import Header from '../../components/shared/Header';
import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const s  = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

// ═══════════════════════════════════════════════════════════════
// CATEGORIES WITH COLORS
// ═══════════════════════════════════════════════════════════════
const CATEGORIES = [
  { id: 'electricity', label: 'Electricity', icon: '⚡', color: '#EAB308', bg: 'rgba(234,179,8,0.10)' },
  { id: 'staff',       label: 'Staff Salary', icon: '👥', color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
  { id: 'trainer',     label: 'Trainer Salary', icon: '🏋️', color: '#22D3EE', bg: 'rgba(34,211,238,0.10)' },
  { id: 'maintenance', label: 'Machine Repair', icon: '🔧', color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  { id: 'rent',        label: 'Rent', icon: '🏢', color: '#a855f7', bg: 'rgba(168,85,247,0.10)' },
  { id: 'water',       label: 'Water Bill', icon: '💧', color: '#06B6D4', bg: 'rgba(6,182,212,0.10)' },
  { id: 'other',       label: 'Other', icon: '📋', color: '#F97316', bg: 'rgba(249,115,22,0.10)' },
  { id: 'custom',      label: 'Custom', icon: '✏️', color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)' },
];

// ═══════════════════════════════════════════════════════════════
// DUMMY DATA
// ═══════════════════════════════════════════════════════════════
const EXPENSES_DATA = [
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
  yearly:  { total: 2150000, memberships: 1820000, others: 330000 },
};

const CASH_DATA = {
  monthly: { cash: 48000, online: 137000 },
  yearly:  { cash: 520000, online: 1630000 },
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

const getCat = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[6];

// ═══════════════════════════════════════════════════════════════
// ADD EXPENSE MODAL
// ═══════════════════════════════════════════════════════════════
const AddExpenseModal = ({ visible, onClose, onAdd }) => {
  const [catId, setCatId]             = useState('electricity');
  const [amount, setAmount]           = useState('');
  const [note, setNote]               = useState('');
  const [customLabel, setCustomLabel] = useState('');

  const handleAdd = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }
    if (catId === 'custom' && !customLabel.trim()) {
      Alert.alert('Error', 'Enter a custom expense name');
      return;
    }

    const cat = getCat(catId);
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
    onClose();
  };

  const selectedCat = getCat(catId);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={mSt.overlay} onPress={onClose}>
        <Pressable style={mSt.sheet} onPress={() => {}}>
          {/* Header */}
          <View style={mSt.header}>
            <View style={mSt.headerLeft}>
              <View style={[mSt.headerIcon, { backgroundColor: `${selectedCat.color}15` }]}>
                <Text style={{ fontSize: rf(16) }}>{selectedCat.icon}</Text>
              </View>
              <View>
                <Text style={mSt.headerTitle}>Add Expense</Text>
                <Text style={mSt.headerSub}>Record a new expense</Text>
              </View>
            </View>
            <TouchableOpacity style={mSt.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <HugeiconsIcon icon={Cancel01Icon} size={ms(14)} color={Colors.zinc[400]} />
            </TouchableOpacity>
          </View>

          <View style={mSt.divider} />

          {/* Category */}
          <Text style={mSt.label}>Category</Text>
          <View style={mSt.catGrid}>
            {CATEGORIES.map((cat) => {
              const sel = catId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    mSt.catChip,
                    sel && { backgroundColor: `${cat.color}15`, borderColor: `${cat.color}40` },
                  ]}
                  onPress={() => setCatId(cat.id)}
                  activeOpacity={0.75}
                >
                  <Text style={mSt.catIcon}>{cat.icon}</Text>
                  <Text style={[mSt.catLabel, sel && { color: cat.color }]}>
                    {cat.label}
                  </Text>
                  {sel && (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={ms(11)} color={cat.color} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Name Input */}
          {catId === 'custom' && (
            <>
              <Text style={mSt.label}>Expense Name</Text>
              <TextInput
                style={mSt.customInput}
                placeholder="e.g. Gym Towels, Paint Work..."
                placeholderTextColor={Colors.zinc[700]}
                value={customLabel}
                onChangeText={setCustomLabel}
              />
            </>
          )}

          {/* Amount */}
          <Text style={mSt.label}>Amount (₹)</Text>
          <View style={mSt.inputWrap}>
            <Text style={[mSt.prefix, { color: selectedCat.color }]}>₹</Text>
            <TextInput
              style={mSt.input}
              placeholder="0"
              placeholderTextColor={Colors.zinc[700]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Note */}
          <Text style={mSt.label}>Note (optional)</Text>
          <TextInput
            style={mSt.noteInput}
            placeholder="Add a note..."
            placeholderTextColor={Colors.zinc[700]}
            value={note}
            onChangeText={setNote}
            multiline
          />

          {/* Add */}
          <TouchableOpacity style={mSt.addBtn} onPress={handleAdd} activeOpacity={0.85}>
            <LinearGradient
              colors={[`${selectedCat.color}`, `${selectedCat.color}80`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={mSt.addBtnGrad}
            >
              <HugeiconsIcon icon={Add01Icon} size={ms(14)} color="#000" />
              <Text style={mSt.addBtnText}>ADD EXPENSE</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const mSt = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#0a0a0a', borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: s(16), paddingBottom: vs(32), paddingTop: vs(20),
    maxHeight: '85%',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(4) },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  headerIcon: {
    width: ms(40), height: ms(40), borderRadius: ms(12),
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(11), color: Colors.white, letterSpacing: 1 },
  headerSub: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(8), color: Colors.zinc[500] },
  closeBtn: {
    width: ms(30), height: ms(30), borderRadius: ms(15),
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: vs(14) },
  label: {
    fontFamily: Fonts.rajdhani?.semiBold || 'System',
    fontSize: rf(8), color: Colors.zinc[500],
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: vs(8),
  },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginBottom: vs(14) },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: s(4),
    paddingHorizontal: s(10), paddingVertical: vs(7),
    borderRadius: ms(10), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  catIcon: { fontSize: rf(12) },
  catLabel: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(7.5), color: Colors.zinc[500] },
  customInput: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: ms(12),
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.2)',
    paddingHorizontal: s(12), paddingVertical: vs(10),
    fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(10),
    color: Colors.white, marginBottom: vs(14),
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: ms(12),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: s(12), marginBottom: vs(14),
  },
  prefix: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(16), marginRight: s(6) },
  input: {
    flex: 1, paddingVertical: vs(12),
    fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(16), color: Colors.white,
  },
  noteInput: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: ms(12),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: s(12), paddingVertical: vs(10),
    fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(10),
    color: Colors.white, minHeight: vs(50), textAlignVertical: 'top',
    marginBottom: vs(16),
  },
  addBtn: { borderRadius: ms(12), overflow: 'hidden' },
  addBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: s(8), paddingVertical: vs(13),
  },
  addBtnText: {
    fontFamily: Fonts.orbitron?.bold || 'System',
    fontSize: rf(10), color: '#000', letterSpacing: 1.5,
  },
});

// ═══════════════════════════════════════════════════════════════
// ADD CASH MODAL
// ═══════════════════════════════════════════════════════════════
const AddCashModal = ({ visible, onClose, onAdd }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote]     = useState('');
  const [type, setType]     = useState('cash');

  const handleAdd = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }
    onAdd({ id: `c_${Date.now()}`, amount: parseFloat(amount), type, note: note.trim(), date: new Date().toISOString().split('T')[0] });
    setAmount(''); setNote(''); setType('cash'); onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={mSt.overlay} onPress={onClose}>
        <Pressable style={mSt.sheet} onPress={() => {}}>
          <View style={mSt.header}>
            <View style={mSt.headerLeft}>
              <View style={[mSt.headerIcon, { backgroundColor: 'rgba(34,197,94,0.10)' }]}>
                <HugeiconsIcon icon={MoneyReceiveCircleIcon} size={ms(16)} color="rgba(34,197,94,0.7)" />
              </View>
              <View>
                <Text style={mSt.headerTitle}>Add Cash Entry</Text>
                <Text style={mSt.headerSub}>Record payment received</Text>
              </View>
            </View>
            <TouchableOpacity style={mSt.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <HugeiconsIcon icon={Cancel01Icon} size={ms(14)} color={Colors.zinc[400]} />
            </TouchableOpacity>
          </View>
          <View style={mSt.divider} />

          <Text style={mSt.label}>Payment Type</Text>
          <View style={cashSt.typeRow}>
            {[
              { id: 'cash', label: '💵 Cash', color: '#22C55E' },
              { id: 'online', label: '📱 Online', color: '#3B82F6' },
            ].map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[cashSt.typeBtn, type === t.id && { backgroundColor: `${t.color}12`, borderColor: `${t.color}40` }]}
                onPress={() => setType(t.id)}
                activeOpacity={0.7}
              >
                <Text style={[cashSt.typeBtnText, type === t.id && { color: t.color }]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={mSt.label}>Amount (₹)</Text>
          <View style={mSt.inputWrap}>
            <Text style={[mSt.prefix, { color: type === 'cash' ? '#22C55E' : '#3B82F6' }]}>₹</Text>
            <TextInput style={mSt.input} placeholder="0" placeholderTextColor={Colors.zinc[700]} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
          </View>

          <Text style={mSt.label}>Note (optional)</Text>
          <TextInput style={mSt.noteInput} placeholder="Member name, plan etc..." placeholderTextColor={Colors.zinc[700]} value={note} onChangeText={setNote} />

          <TouchableOpacity style={mSt.addBtn} onPress={handleAdd} activeOpacity={0.85}>
            <LinearGradient
              colors={type === 'cash' ? ['#22C55E', '#22C55E80'] : ['#3B82F6', '#3B82F680']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={mSt.addBtnGrad}
            >
              <Text style={mSt.addBtnText}>ADD ENTRY</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const cashSt = StyleSheet.create({
  typeRow: { flexDirection: 'row', gap: s(10), marginBottom: vs(14) },
  typeBtn: {
    flex: 1, alignItems: 'center', paddingVertical: vs(10),
    borderRadius: ms(10), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)',
  },
  typeBtnText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(10), color: Colors.zinc[500] },
});

// ═══════════════════════════════════════════════════════════════
// EXPENSE ROW
// ═══════════════════════════════════════════════════════════════
const ExpenseRow = ({ expense, onDelete, isLast }) => {
  const cat = getCat(expense.categoryId);

  return (
    <View style={[rSt.row, isLast && { marginBottom: 0 }]}>
      <View style={[rSt.iconBox, { backgroundColor: cat.bg }]}>
        <Text style={rSt.icon}>{cat.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={rSt.label}>{expense.label}</Text>
        {expense.note ? <Text style={rSt.note}>{expense.note}</Text> : null}
        <Text style={rSt.date}>{formatDate(expense.date)}</Text>
      </View>
      <View style={rSt.right}>
        <Text style={[rSt.amount, { color: cat.color }]}>{fmt(expense.amount)}</Text>
        <TouchableOpacity style={rSt.delBtn} onPress={() => onDelete(expense.id)} activeOpacity={0.7}>
          <HugeiconsIcon icon={Delete02Icon} size={ms(12)} color="rgba(239,68,68,0.5)" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const rSt = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: s(10),
    marginBottom: vs(8), backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: ms(12), padding: ms(10),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
  },
  iconBox: {
    width: ms(38), height: ms(38), borderRadius: ms(10),
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: rf(16) },
  label: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(10), color: Colors.white },
  note: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7.5), color: Colors.zinc[600], marginTop: vs(1) },
  date: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7), color: Colors.zinc[700], marginTop: vs(1) },
  right: { alignItems: 'flex-end', gap: vs(4) },
  amount: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(10) },
  delBtn: {
    width: ms(22), height: ms(22), borderRadius: ms(6),
    backgroundColor: 'rgba(239,68,68,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },
});

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const AdminExpensesScreen = ({ navigation }) => {
  const [expenses, setExpenses]               = useState(EXPENSES_DATA);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCashModal, setShowCashModal]     = useState(false);
  const [period, setPeriod]                   = useState('monthly');
  const [activeFilter, setActiveFilter]       = useState('all');

  const revenue  = REVENUE_DATA[period];
  const cash     = CASH_DATA[period];
  const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);
  const net      = revenue.total - totalExp;

  const catTotals = CATEGORIES.map((c) => ({
    ...c,
    total: expenses.filter((e) => e.categoryId === c.id).reduce((sum, e) => sum + e.amount, 0),
  })).filter((c) => c.total > 0);

  const filteredExp = activeFilter === 'all' ? expenses : expenses.filter((e) => e.categoryId === activeFilter);

  const handleAdd    = (exp) => setExpenses((p) => [exp, ...p]);
  const handleDelete = (id) => {
    Alert.alert('Delete', 'Delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setExpenses((p) => p.filter((e) => e.id !== id)) },
    ]);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={st.background}
      blurRadius={9}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.92)', '#000000']}
        style={st.gradient}
      >
        <SafeAreaView style={st.safeArea} edges={['top']}>
          <Header title="FINANCE" showMenu={false} />

          {/* Period Tabs */}
          <View style={st.periodBar}>
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

          <ScrollView
            style={st.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={st.scrollContent}
          >
            {/* Back */}
            <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <View style={st.backIcon}>
                <HugeiconsIcon icon={ArrowLeft01Icon} size={ms(16)} color="rgba(255,255,255,0.5)" />
              </View>
              <Text style={st.backText}>Dashboard</Text>
            </TouchableOpacity>

            {/* ═══════════════════════════════════════════════════ */}
            {/* OVERVIEW - Revenue / Expenses / Profit */}
            {/* ═══════════════════════════════════════════════════ */}
            <View style={st.overviewCard}>
              <LinearGradient
                colors={['rgba(234,179,8,0.06)', 'rgba(34,197,94,0.03)', 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              <Text style={st.overviewTitle}>
                {period === 'monthly' ? 'THIS MONTH' : 'THIS YEAR'}
              </Text>

              <View style={st.overviewGrid}>
                {[
                  { label: 'Revenue', value: revenue.total, color: '#22C55E', dotColor: 'rgba(34,197,94,0.5)' },
                  { label: 'Expenses', value: totalExp, color: '#EF4444', dotColor: 'rgba(239,68,68,0.5)' },
                  { label: 'Net Profit', value: Math.abs(net), color: net >= 0 ? '#EAB308' : '#EF4444', dotColor: net >= 0 ? 'rgba(234,179,8,0.5)' : 'rgba(239,68,68,0.5)' },
                ].map((item, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <View style={st.overviewDivider} />}
                    <View style={st.overviewItem}>
                      <Text style={st.overviewLabel}>{item.label}</Text>
                      <Text style={[st.overviewValue, { color: item.color }]}>{fmt(item.value)}</Text>
                      <View style={[st.overviewDot, { backgroundColor: item.dotColor }]} />
                    </View>
                  </React.Fragment>
                ))}
              </View>

              {/* Progress Bar */}
              <View style={st.progressTrack}>
                <LinearGradient
                  colors={['rgba(239,68,68,0.5)', 'rgba(239,68,68,0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[st.progressFill, { width: `${Math.min((totalExp / revenue.total) * 100, 100)}%` }]}
                />
              </View>
              <View style={st.progressRow}>
                <Text style={[st.progressText, { color: 'rgba(239,68,68,0.5)' }]}>
                  {Math.round((totalExp / revenue.total) * 100)}% spent
                </Text>
                <Text style={[st.progressText, { color: 'rgba(34,197,94,0.5)' }]}>
                  {Math.round(((revenue.total - totalExp) / revenue.total) * 100)}% remaining
                </Text>
              </View>
            </View>

            {/* ═══════════════════════════════════════════════════ */}
            {/* CASH COLLECTION */}
            {/* ═══════════════════════════════════════════════════ */}
            <View style={st.card}>
              <View style={st.cardTitleRow}>
                <Text style={st.cardLabel}>CASH COLLECTION</Text>
                <TouchableOpacity style={st.addSmallBtn} onPress={() => setShowCashModal(true)} activeOpacity={0.7}>
                  <HugeiconsIcon icon={Add01Icon} size={ms(11)} color={Colors.zinc[300]} />
                  <Text style={st.addSmallBtnText}>Add</Text>
                </TouchableOpacity>
              </View>

              <View style={st.cashRow}>
                {/* Cash */}
                <View style={[st.cashCard, { borderColor: 'rgba(34,197,94,0.15)' }]}>
                  <LinearGradient
                    colors={['rgba(34,197,94,0.06)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={st.cashIcon}>💵</Text>
                  <Text style={[st.cashLabel, { color: 'rgba(34,197,94,0.7)' }]}>CASH</Text>
                  <Text style={st.cashValue}>{fmt(cash.cash)}</Text>
                </View>

                {/* Online */}
                <View style={[st.cashCard, { borderColor: 'rgba(59,130,246,0.15)' }]}>
                  <LinearGradient
                    colors={['rgba(59,130,246,0.06)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={st.cashIcon}>📱</Text>
                  <Text style={[st.cashLabel, { color: 'rgba(59,130,246,0.7)' }]}>ONLINE</Text>
                  <Text style={st.cashValue}>{fmt(cash.online)}</Text>
                </View>
              </View>
            </View>

            {/* ═══════════════════════════════════════════════════ */}
            {/* REVENUE */}
            {/* ═══════════════════════════════════════════════════ */}
            <View style={st.card}>
              <View style={st.cardTitleRow}>
                <Text style={st.cardLabel}>REVENUE</Text>
                <Text style={[st.cardAmount, { color: '#22C55E' }]}>{fmt(revenue.total)}</Text>
              </View>
              {[
                { label: 'Memberships', value: revenue.memberships, color: '#EAB308' },
                { label: 'Others', value: revenue.others, color: '#22D3EE' },
              ].map((item, i) => (
                <View key={i} style={st.breakdownRow}>
                  <View style={[st.breakdownDot, { backgroundColor: item.color }]} />
                  <Text style={st.breakdownLabel}>{item.label}</Text>
                  <Text style={st.breakdownValue}>{fmt(item.value)}</Text>
                  <View style={st.breakdownPercentBox}>
                    <Text style={st.breakdownPercent}>
                      {Math.round((item.value / revenue.total) * 100)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* ═══════════════════════════════════════════════════ */}
            {/* EXPENSES */}
            {/* ═══════════════════════════════════════════════════ */}
            <View style={st.card}>
              <View style={st.cardTitleRow}>
                <Text style={st.cardLabel}>EXPENSES</Text>
                <Text style={[st.cardAmount, { color: 'rgba(239,68,68,0.7)' }]}>{fmt(totalExp)}</Text>
              </View>

              {/* Category Filter Chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={st.catScroll}
              >
                <TouchableOpacity
                  style={[st.catChip, activeFilter === 'all' && st.catChipActive]}
                  onPress={() => setActiveFilter('all')}
                  activeOpacity={0.7}
                >
                  <Text style={[st.catChipText, activeFilter === 'all' && st.catChipTextActive]}>All</Text>
                </TouchableOpacity>
                {catTotals.map((cat) => {
                  const isActive = activeFilter === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        st.catChip,
                        isActive && { backgroundColor: `${cat.color}12`, borderColor: `${cat.color}35` },
                      ]}
                      onPress={() => setActiveFilter(isActive ? 'all' : cat.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={st.catChipIcon}>{cat.icon}</Text>
                      <Text style={[st.catChipText, isActive && { color: cat.color }]}>
                        {fmt(cat.total)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Expense List */}
              {filteredExp.length === 0 ? (
                <View style={st.emptyBox}>
                  <Text style={st.emptyText}>No expenses</Text>
                </View>
              ) : (
                filteredExp.map((exp, i) => (
                  <ExpenseRow key={exp.id} expense={exp} onDelete={handleDelete} isLast={i === filteredExp.length - 1} />
                ))
              )}
            </View>

            {/* ═══════════════════════════════════════════════════ */}
            {/* ADD EXPENSE BUTTON */}
            {/* ═══════════════════════════════════════════════════ */}
            <TouchableOpacity
              style={st.addExpBtn}
              onPress={() => setShowExpenseModal(true)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
                style={st.addExpBtnGrad}
              >
                <HugeiconsIcon icon={Add01Icon} size={ms(14)} color={Colors.white} />
                <Text style={st.addExpBtnText}>ADD EXPENSE</Text>
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

          <AddExpenseModal visible={showExpenseModal} onClose={() => setShowExpenseModal(false)} onAdd={handleAdd} />
          <AddCashModal visible={showCashModal} onClose={() => setShowCashModal(false)} onAdd={(entry) => Alert.alert('Added ✅', `${entry.type === 'cash' ? 'Cash' : 'Online'} ₹${entry.amount} recorded`)} />
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const st = StyleSheet.create({
  background: { flex: 1 },
  gradient:   { flex: 1 },
  safeArea:   { flex: 1 },
  container:  { flex: 1 },
  scrollContent: { paddingHorizontal: s(20), paddingBottom: vs(100), gap: vs(12) },

  // Period
  periodBar: {
    flexDirection: 'row', marginHorizontal: s(20), marginBottom: vs(10),
    backgroundColor: '#000', borderRadius: ms(10), padding: s(3),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  periodTab: { flex: 1, alignItems: 'center', paddingVertical: vs(8), borderRadius: ms(8) },
  periodTabActive: { backgroundColor: 'rgba(255,255,255,0.08)' },
  periodTabText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(10), color: Colors.zinc[500], letterSpacing: 1, textTransform: 'uppercase' },
  periodTabTextActive: { color: Colors.white },

  // Back
  backBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(2) },
  backIcon: { width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center', marginRight: s(8) },
  backText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(10), color: Colors.zinc[600], letterSpacing: 0.8, textTransform: 'uppercase' },

  // Overview
  overviewCard: { borderRadius: ms(16), borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#000', padding: ms(16), overflow: 'hidden' },
  overviewTitle: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(8), color: Colors.zinc[500], letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: vs(12) },
  overviewGrid: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: ms(12), overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: vs(14),
  },
  overviewItem: { flex: 1, alignItems: 'center', paddingVertical: vs(14), gap: vs(3) },
  overviewLabel: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7), color: Colors.zinc[500], letterSpacing: 0.5, textTransform: 'uppercase' },
  overviewValue: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(12) },
  overviewDot: { width: ms(5), height: ms(5), borderRadius: ms(2.5) },
  overviewDivider: { width: 1, height: vs(45), backgroundColor: 'rgba(255,255,255,0.04)' },

  // Progress
  progressTrack: { height: vs(4), backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: ms(2), overflow: 'hidden', marginBottom: vs(6) },
  progressFill: { height: '100%', borderRadius: ms(2) },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(7) },

  // Card
  card: { borderRadius: ms(14), borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', backgroundColor: '#000', padding: ms(14) },
  cardLabel: { fontFamily: Fonts.rajdhani?.bold || 'System', fontSize: rf(8), color: Colors.zinc[500], letterSpacing: 1.5, textTransform: 'uppercase' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(10) },
  cardAmount: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(11) },

  // Cash
  cashRow: { flexDirection: 'row', gap: s(10) },
  cashCard: {
    flex: 1, borderRadius: ms(12), borderWidth: 1,
    padding: ms(12), alignItems: 'center', gap: vs(4),
    overflow: 'hidden',
  },
  cashIcon: { fontSize: rf(20) },
  cashLabel: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(7), letterSpacing: 0.8, textTransform: 'uppercase' },
  cashValue: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(12), color: Colors.white },

  // Add small
  addSmallBtn: {
    flexDirection: 'row', alignItems: 'center', gap: s(4),
    paddingHorizontal: s(10), paddingVertical: vs(4),
    borderRadius: ms(8), backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  addSmallBtnText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(8), color: Colors.zinc[400] },

  // Breakdown
  breakdownRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: vs(8), borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)', gap: s(8),
  },
  breakdownDot: { width: ms(6), height: ms(6), borderRadius: ms(3) },
  breakdownLabel: { flex: 1, fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(9), color: Colors.zinc[400] },
  breakdownValue: { fontFamily: Fonts.orbitron?.regular || 'System', fontSize: rf(9), color: Colors.white, marginRight: s(8) },
  breakdownPercentBox: { backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(4) },
  breakdownPercent: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(7.5), color: Colors.zinc[500] },

  // Category
  catScroll: { gap: s(6), paddingBottom: vs(10) },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: s(4),
    paddingHorizontal: s(10), paddingVertical: vs(5),
    borderRadius: ms(8), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)',
  },
  catChipActive: { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)' },
  catChipIcon: { fontSize: rf(11) },
  catChipText: { fontFamily: Fonts.rajdhani?.semiBold || 'System', fontSize: rf(8), color: Colors.zinc[500] },
  catChipTextActive: { color: Colors.white },

  // Empty
  emptyBox: { alignItems: 'center', paddingVertical: vs(20) },
  emptyText: { fontFamily: Fonts.rajdhani?.regular || 'System', fontSize: rf(9), color: Colors.zinc[700] },

  // Add Expense
  addExpBtn: { borderRadius: ms(12), overflow: 'hidden' },
  addExpBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: s(8), paddingVertical: vs(13),
    borderRadius: ms(12), borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  addExpBtnText: { fontFamily: Fonts.orbitron?.bold || 'System', fontSize: rf(9), color: Colors.white, letterSpacing: 1.5 },
});

export default AdminExpensesScreen;