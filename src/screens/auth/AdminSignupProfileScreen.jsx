// src/screens/auth/AdminSignupProfileScreen.js

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, StatusBar, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Chip = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.chip, selected && styles.chipSelected]}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

const AdminSignupProfileScreen = ({ navigation, route }) => {
  const { email, password } = route.params;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gymName, setGymName] = useState('');
  const [hasWeekOff, setHasWeekOff] = useState(null);
  const [weekOffDay, setWeekOffDay] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid =
    fullName.trim().length > 0 &&
    phone.trim().length >= 10 &&
    gymName.trim().length > 0 &&
    hasWeekOff !== null &&
    (hasWeekOff === false || (hasWeekOff === true && weekOffDay !== ''));

  const handleFinish = () => {
    if (!isValid) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);

    const adminData = {
      email,
      password,
      fullName: fullName.trim(),
      phone: phone.trim(),
      gymName: gymName.trim(),
      hasWeekOff,
      weekOffDay: hasWeekOff ? weekOffDay : null,
    };

    console.log('Admin Created:', adminData);

    // TODO: Backend API call to save admin data
    // await api.createAdmin(adminData);

    setTimeout(() => {
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminDashboard', params: { adminData } }],
      });
    }, 1500);
  };

  return (
    <LinearGradient colors={['#000000', '#0A0A0A', '#000000']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.stepText}>STEP 4 OF 4</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Setup Your Profile</Text>
        <Text style={styles.subtitle}>Tell us about yourself and your gym</Text>

        <View style={styles.card}>
          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#52525B"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
            />
          </View>

          {/* Phone */}
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              placeholder="9876543210"
              placeholderTextColor="#52525B"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              style={styles.input}
            />
          </View>

          {/* Gym Name */}
          <Text style={styles.label}>Gym Name</Text>
          <View style={styles.inputContainer}>
            <Icon name="barbell-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              placeholder="Enter gym name"
              placeholderTextColor="#52525B"
              value={gymName}
              onChangeText={setGymName}
              style={styles.input}
            />
          </View>

          {/* Week Off */}
          <Text style={styles.label}>Does your gym have a week off?</Text>
          <View style={styles.chipRow}>
            <Chip
              label="✅  Yes"
              selected={hasWeekOff === true}
              onPress={() => setHasWeekOff(true)}
            />
            <Chip
              label="❌  No"
              selected={hasWeekOff === false}
              onPress={() => {
                setHasWeekOff(false);
                setWeekOffDay('');
              }}
            />
          </View>

          {/* Day Select */}
          {hasWeekOff === true && (
            <>
              <Text style={styles.label}>Select Week Off Day</Text>
              <View style={styles.daysWrap}>
                {DAYS.map((day) => (
                  <Chip
                    key={day}
                    label={day}
                    selected={weekOffDay === day}
                    onPress={() => setWeekOffDay(day)}
                  />
                ))}
              </View>
            </>
          )}
        </View>

        {/* Finish Button */}
        <TouchableOpacity
          style={[styles.finishBtn, !isValid && styles.finishBtnDisabled]}
          onPress={handleFinish}
          disabled={!isValid || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Text style={styles.finishBtnText}>Complete Setup</Text>
              <Icon name="arrow-forward" size={20} color="#000" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    paddingTop: 60, paddingBottom: 10,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center',
  },
  stepText: { color: '#71717A', fontSize: 11, letterSpacing: 2, marginLeft: 16 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 50 },
  title: { fontSize: 26, fontWeight: '700', color: '#FFF', marginBottom: 8, marginTop: 10 },
  subtitle: { fontSize: 14, color: '#A1A1AA', marginBottom: 24 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 18,
  },
  label: { color: '#FFF', fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', height: 54, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  countryCode: { color: '#A1A1AA', fontSize: 15, marginRight: 8, fontWeight: '600' },
  input: { flex: 1, color: '#FFF', fontSize: 15 },
  chipRow: { flexDirection: 'row', gap: 12 },
  daysWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)', marginBottom: 6,
  },
  chipSelected: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  chipText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  chipTextSelected: { color: '#000000' },
  finishBtn: {
    height: 56, borderRadius: 16, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', marginTop: 24,
    flexDirection: 'row', gap: 8,
  },
  finishBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.15)' },
  finishBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
});

export default AdminSignupProfileScreen;