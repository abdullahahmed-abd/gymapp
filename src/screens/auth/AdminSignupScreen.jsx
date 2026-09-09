import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GlassButton from '../../components/shared/GlassButton';

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const SelectChip = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const AdminSignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [gymName, setGymName] = useState('');
  const [hasWeekOff, setHasWeekOff] = useState(null); // true / false
  const [weekOffDay, setWeekOffDay] = useState('');

  const handleCreateAdmin = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required', 'Please enter full name');
      return;
    }

    if (!gymName.trim()) {
      Alert.alert('Required', 'Please enter gym name');
      return;
    }

    if (hasWeekOff === null) {
      Alert.alert('Required', 'Please select if gym has week off or not');
      return;
    }

    if (hasWeekOff && !weekOffDay) {
      Alert.alert('Required', 'Please select week off day');
      return;
    }

    const adminData = {
      fullName: fullName.trim(),
      gymName: gymName.trim(),
      hasWeekOff,
      weekOffDay: hasWeekOff ? weekOffDay : null,
    };

    // Agar backend ya AsyncStorage use karna ho to yahan save kar sakte ho

    navigation.replace('AdminDashboard', { adminData });
  };

  return (
    <LinearGradient
      colors={['#000000', '#111111', '#000000']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Admin Account</Text>
        <Text style={styles.subtitle}>
          Apne gym ka basic setup complete karein
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Enter full name"
            placeholderTextColor="#8E8E93"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />

          <Text style={styles.label}>Gym Name</Text>
          <TextInput
            placeholder="Enter gym name"
            placeholderTextColor="#8E8E93"
            value={gymName}
            onChangeText={setGymName}
            style={styles.input}
          />

          <Text style={styles.label}>Week Off Hai?</Text>
          <View style={styles.row}>
            <SelectChip
              label="Yes"
              selected={hasWeekOff === true}
              onPress={() => setHasWeekOff(true)}
            />
            <SelectChip
              label="No"
              selected={hasWeekOff === false}
              onPress={() => {
                setHasWeekOff(false);
                setWeekOffDay('');
              }}
            />
          </View>

          {hasWeekOff === true && (
            <>
              <Text style={styles.label}>Select Week Off Day</Text>
              <View style={styles.daysWrap}>
                {DAYS.map((day) => (
                  <SelectChip
                    key={day}
                    label={day}
                    selected={weekOffDay === day}
                    onPress={() => setWeekOffDay(day)}
                  />
                ))}
              </View>
            </>
          )}

          <View style={{ height: 24 }} />

          <GlassButton variant="primary" onPress={handleCreateAdmin}>
            Continue to Dashboard
          </GlassButton>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    padding: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 24,
  },

  formCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20,
    padding: 18,
  },

  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 12,
  },

  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },

  daysWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    marginBottom: 10,
  },

  chipSelected: {
    backgroundColor: '#FFFFFF',
  },

  chipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  chipTextSelected: {
    color: '#000000',
  },
});

export default AdminSignupScreen;