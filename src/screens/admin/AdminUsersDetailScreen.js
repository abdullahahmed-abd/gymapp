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
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Shield01Icon,
  Activity01Icon,
  Dumbbell01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Timer01Icon,
  Call02Icon,
  WhatsappIcon,
  Clock01Icon,
  Login01Icon,
  SmartPhone01Icon,
  UserRemove01Icon,
  Cancel01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../components/shared/Header';
import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { useMembershipRequests } from '../../context/MembershipRequestsContext';
import { useTrainer } from '../../context/TrainerContext';
import { Linking } from 'react-native';

const s  = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const TRAINER_COLOR = '#22D3EE';

// ═══════════════════════════════════════════════════════════════
// TIER + STATUS CONFIGS
// ═══════════════════════════════════════════════════════════════
const TIER_TEMPLATES = {
  'ELITE TIER': {
    badge: 'ELITE',
    iconColor: '#EAB308',
    textColor: '#EAB308',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.35)',
  },
  'LEGENDARY TIER': {
    badge: 'LEGENDARY',
    iconColor: '#a855f7',
    textColor: '#c084fc',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
  },
};

const TRIAL_CONFIG = {
  iconColor: '#3B82F6',
  textColor: '#60A5FA',
  bgColor: 'rgba(59, 130, 246, 0.15)',
  borderColor: 'rgba(59, 130, 246, 0.35)',
  badge: 'TRIAL',
};

const STATUS_CONFIG = {
  active: {
    label: 'ACTIVE',
    color: '#22C55E',
    bgColor: 'rgba(34,197,94,0.15)',
    borderColor: 'rgba(34,197,94,0.3)',
    icon: CheckmarkCircle02Icon,
  },
  expired: {
    label: 'EXPIRED',
    color: '#EF4444',
    bgColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.3)',
    icon: AlertCircleIcon,
  },
  trial: {
    label: 'TRIAL',
    color: '#3B82F6',
    bgColor: 'rgba(59,130,246,0.15)',
    borderColor: 'rgba(59,130,246,0.3)',
    icon: Timer01Icon,
  },
};

// ═══════════════════════════════════════════════════════════════
// 30 DUMMY MEMBERS
// ═══════════════════════════════════════════════════════════════
const DUMMY_MEMBERS = [
  {
    id: 'm1', name: 'Abdullah Ahmed', avatar: 'AA', memberId: 'GYM001',
    phone: '+918817159218', email: 'abdullah@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'active',
    workoutType: 'cardio_weights', isLive: true,
    checkinTime: '6:30 AM', duration: '45 min', lastCheckout: '8:15 AM',
    joinDate: '2024-01-15', expiryDate: '2025-02-15', daysLeft: 25,
    totalVisits: 156, currentStreak: 12, paidAmount: 2500,
  },
  {
    id: 'm2', name: 'Priya Patel', avatar: 'PP', memberId: 'GYM002',
    phone: '+919876543211', email: 'priya@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'expired',
    workoutType: 'weights_only', isLive: true,
    checkinTime: '6:45 AM', duration: '32 min', lastCheckout: null,
    joinDate: '2024-03-10', expiryDate: '2025-01-10', daysLeft: 0,
    totalVisits: 89, currentStreak: 0, paidAmount: 3500,
  },
  {
    id: 'm3', name: 'Rahul Verma', avatar: 'RV', memberId: 'GYM003',
    phone: '+919876543212', email: 'rahul@example.com',
    membershipType: null, membershipStatus: 'trial',
    workoutType: 'cardio_weights', isLive: true,
    checkinTime: '6:15 AM', duration: '58 min', lastCheckout: null,
    joinDate: '2025-01-15', expiryDate: '2025-01-22', daysLeft: 5,
    totalVisits: 5, currentStreak: 5, paidAmount: 0,
  },
  {
    id: 'm4', name: 'Sneha Gupta', avatar: 'SG', memberId: 'GYM004',
    phone: '+919876543213', email: 'sneha@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'active',
    workoutType: 'weights_only', isLive: true,
    checkinTime: '6:50 AM', duration: '40 min', lastCheckout: null,
    joinDate: '2024-06-01', expiryDate: '2025-03-05', daysLeft: 45,
    totalVisits: 210, currentStreak: 28, paidAmount: 3500,
  },
  {
    id: 'm5', name: 'Vikram Singh', avatar: 'VS', memberId: 'GYM005',
    phone: '+919876543214', email: 'vikram@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'expired',
    workoutType: 'cardio_weights', isLive: true,
    checkinTime: '7:00 AM', duration: '25 min', lastCheckout: null,
    joinDate: '2024-02-20', expiryDate: '2025-01-05', daysLeft: 0,
    totalVisits: 67, currentStreak: 0, paidAmount: 2500,
  },
  {
    id: 'm6', name: 'Ananya Reddy', avatar: 'AR', memberId: 'GYM006',
    phone: '+919876543215', email: 'ananya@example.com',
    membershipType: null, membershipStatus: 'trial',
    workoutType: 'weights_only', isLive: true,
    checkinTime: '6:20 AM', duration: '50 min', lastCheckout: null,
    joinDate: '2025-01-17', expiryDate: '2025-01-24', daysLeft: 3,
    totalVisits: 3, currentStreak: 3, paidAmount: 0,
  },
  {
    id: 'm7', name: 'Karan Malhotra', avatar: 'KM', memberId: 'GYM007',
    phone: '+919876543216', email: 'karan@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'active',
    workoutType: 'cardio_weights', isLive: true,
    checkinTime: '6:40 AM', duration: '35 min', lastCheckout: null,
    joinDate: '2024-05-15', expiryDate: '2025-03-20', daysLeft: 60,
    totalVisits: 178, currentStreak: 22, paidAmount: 2500,
  },
  {
    id: 'm8', name: 'Meera Iyer', avatar: 'MI', memberId: 'GYM008',
    phone: '+919876543217', email: 'meera@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'expired',
    workoutType: 'weights_only', isLive: true,
    checkinTime: '6:10 AM', duration: '55 min', lastCheckout: null,
    joinDate: '2024-04-01', expiryDate: '2025-01-08', daysLeft: 0,
    totalVisits: 134, currentStreak: 0, paidAmount: 3500,
  },
  {
    id: 'm9', name: 'Aditya Kumar', avatar: 'AK', memberId: 'GYM009',
    phone: '+919876543218', email: 'aditya@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'active',
    workoutType: 'cardio_weights', isLive: true,
    checkinTime: '6:55 AM', duration: '28 min', lastCheckout: null,
    joinDate: '2024-08-10', expiryDate: '2025-02-05', daysLeft: 15,
    totalVisits: 95, currentStreak: 8, paidAmount: 2500,
  },
  {
    id: 'm10', name: 'Riya Chopra', avatar: 'RC', memberId: 'GYM010',
    phone: '+919876543219', email: 'riya@example.com',
    membershipType: null, membershipStatus: 'trial',
    workoutType: 'weights_only', isLive: true,
    checkinTime: '6:35 AM', duration: '42 min', lastCheckout: null,
    joinDate: '2025-01-13', expiryDate: '2025-01-20', daysLeft: 7,
    totalVisits: 7, currentStreak: 7, paidAmount: 0,
  },
  {
    id: 'm11', name: 'Rohan Desai', avatar: 'RD', memberId: 'GYM011',
    phone: '+919876543220', email: 'rohan@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'active',
    workoutType: 'cardio_weights', isLive: true,
    checkinTime: '6:25 AM', duration: '38 min', lastCheckout: null,
    joinDate: '2024-07-20', expiryDate: '2025-02-20', daysLeft: 30,
    totalVisits: 145, currentStreak: 15, paidAmount: 2500,
  },
  {
    id: 'm12', name: 'Nisha Joshi', avatar: 'NJ', memberId: 'GYM012',
    phone: '+919876543221', email: 'nisha@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'active',
    workoutType: 'weights_only', isLive: true,
    checkinTime: '7:05 AM', duration: '22 min', lastCheckout: null,
    joinDate: '2024-09-01', expiryDate: '2025-02-10', daysLeft: 20,
    totalVisits: 112, currentStreak: 10, paidAmount: 3500,
  },
  {
    id: 'm13', name: 'Amit Thakur', avatar: 'AT', memberId: 'GYM013',
    phone: '+919876543222', email: 'amit@example.com',
    membershipType: null, membershipStatus: 'trial',
    workoutType: 'cardio_weights', isLive: true,
    checkinTime: '6:48 AM', duration: '30 min', lastCheckout: null,
    joinDate: '2025-01-18', expiryDate: '2025-01-25', daysLeft: 2,
    totalVisits: 2, currentStreak: 2, paidAmount: 0,
  },
  {
    id: 'm14', name: 'Pooja Nair', avatar: 'PN', memberId: 'GYM014',
    phone: '+919876543223', email: 'pooja@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'expired',
    workoutType: 'weights_only', isLive: true,
    checkinTime: '7:10 AM', duration: '15 min', lastCheckout: null,
    joinDate: '2024-05-05', expiryDate: '2025-01-12', daysLeft: 0,
    totalVisits: 78, currentStreak: 0, paidAmount: 3500,
  },
  {
    id: 'm15', name: 'Sanjay Mehta', avatar: 'SM', memberId: 'GYM015',
    phone: '+919876543224', email: 'sanjay@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'active',
    workoutType: 'cardio_weights', isLive: true,
    checkinTime: '7:08 AM', duration: '18 min', lastCheckout: null,
    joinDate: '2024-10-01', expiryDate: '2025-03-01', daysLeft: 40,
    totalVisits: 88, currentStreak: 18, paidAmount: 2500,
  },
  {
    id: 'm16', name: 'Divya Sharma', avatar: 'DS', memberId: 'GYM016',
    phone: '+919876543225', email: 'divya@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'active',
    workoutType: 'cardio_weights', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '5:30 PM',
    joinDate: '2024-03-01', expiryDate: '2025-02-28', daysLeft: 38,
    totalVisits: 167, currentStreak: 20, paidAmount: 2500,
  },
  {
    id: 'm17', name: 'Akash Patel', avatar: 'AP', memberId: 'GYM017',
    phone: '+919876543226', email: 'akash@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'active',
    workoutType: 'weights_only', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '6:00 PM',
    joinDate: '2024-04-15', expiryDate: '2025-04-15', daysLeft: 85,
    totalVisits: 200, currentStreak: 35, paidAmount: 3500,
  },
  {
    id: 'm18', name: 'Kavya Menon', avatar: 'KM', memberId: 'GYM018',
    phone: '+919876543227', email: 'kavya@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'expired',
    workoutType: 'cardio_weights', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '4:45 PM',
    joinDate: '2024-01-10', expiryDate: '2025-01-10', daysLeft: 0,
    totalVisits: 145, currentStreak: 0, paidAmount: 2500,
  },
  {
    id: 'm19', name: 'Suresh Babu', avatar: 'SB', memberId: 'GYM019',
    phone: '+919876543228', email: 'suresh@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'active',
    workoutType: 'weights_only', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '7:00 PM',
    joinDate: '2024-06-20', expiryDate: '2025-06-20', daysLeft: 150,
    totalVisits: 280, currentStreak: 45, paidAmount: 3500,
  },
  {
    id: 'm20', name: 'Preethi Raj', avatar: 'PR', memberId: 'GYM020',
    phone: '+919876543229', email: 'preethi@example.com',
    membershipType: null, membershipStatus: 'trial',
    workoutType: 'cardio_weights', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '5:00 PM',
    joinDate: '2025-01-16', expiryDate: '2025-01-23', daysLeft: 4,
    totalVisits: 4, currentStreak: 4, paidAmount: 0,
  },
  {
    id: 'm21', name: 'Harish Kumar', avatar: 'HK', memberId: 'GYM021',
    phone: '+919876543230', email: 'harish@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'active',
    workoutType: 'cardio_weights', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '8:00 AM',
    joinDate: '2024-09-15', expiryDate: '2025-03-15', daysLeft: 55,
    totalVisits: 120, currentStreak: 14, paidAmount: 2500,
  },
  {
    id: 'm22', name: 'Lakshmi Devi', avatar: 'LD', memberId: 'GYM022',
    phone: '+919876543231', email: 'lakshmi@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'expired',
    workoutType: 'weights_only', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '6:30 AM',
    joinDate: '2024-02-01', expiryDate: '2025-01-01', daysLeft: 0,
    totalVisits: 190, currentStreak: 0, paidAmount: 3500,
  },
  {
    id: 'm23', name: 'Nikhil Jain', avatar: 'NJ', memberId: 'GYM023',
    phone: '+919876543232', email: 'nikhil@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'active',
    workoutType: 'cardio_weights', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '9:00 AM',
    joinDate: '2024-11-01', expiryDate: '2025-04-30', daysLeft: 100,
    totalVisits: 75, currentStreak: 30, paidAmount: 2500,
  },
  {
    id: 'm24', name: 'Swathi Reddy', avatar: 'SR', memberId: 'GYM024',
    phone: '+919876543233', email: 'swathi@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'active',
    workoutType: 'weights_only', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '10:00 AM',
    joinDate: '2024-07-01', expiryDate: '2025-07-01', daysLeft: 161,
    totalVisits: 195, currentStreak: 40, paidAmount: 3500,
  },
  {
    id: 'm25', name: 'Tarun Bhat', avatar: 'TB', memberId: 'GYM025',
    phone: '+919876543234', email: 'tarun@example.com',
    membershipType: null, membershipStatus: 'trial',
    workoutType: 'weights_only', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '11:00 AM',
    joinDate: '2025-01-19', expiryDate: '2025-01-26', daysLeft: 1,
    totalVisits: 1, currentStreak: 1, paidAmount: 0,
  },
  {
    id: 'm26', name: 'Usha Kumari', avatar: 'UK', memberId: 'GYM026',
    phone: '+919876543235', email: 'usha@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'expired',
    workoutType: 'cardio_weights', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '5:00 AM',
    joinDate: '2024-01-20', expiryDate: '2025-01-15', daysLeft: 0,
    totalVisits: 230, currentStreak: 0, paidAmount: 2500,
  },
  {
    id: 'm27', name: 'Venkat Rao', avatar: 'VR', memberId: 'GYM027',
    phone: '+919876543236', email: 'venkat@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'active',
    workoutType: 'weights_only', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '4:30 PM',
    joinDate: '2024-08-20', expiryDate: '2025-08-20', daysLeft: 210,
    totalVisits: 150, currentStreak: 25, paidAmount: 3500,
  },
  {
    id: 'm28', name: 'Waqar Ahmed', avatar: 'WA', memberId: 'GYM028',
    phone: '+919876543237', email: 'waqar@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'active',
    workoutType: 'cardio_weights', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '3:00 PM',
    joinDate: '2024-12-01', expiryDate: '2025-05-31', daysLeft: 130,
    totalVisits: 55, currentStreak: 45, paidAmount: 2500,
  },
  {
    id: 'm29', name: 'Xena Singh', avatar: 'XS', memberId: 'GYM029',
    phone: '+919876543238', email: 'xena@example.com',
    membershipType: 'LEGENDARY TIER', membershipStatus: 'active',
    workoutType: 'weights_only', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '2:00 PM',
    joinDate: '2024-10-15', expiryDate: '2025-10-15', daysLeft: 268,
    totalVisits: 90, currentStreak: 60, paidAmount: 3500,
  },
  {
    id: 'm30', name: 'Yash Trivedi', avatar: 'YT', memberId: 'GYM030',
    phone: '+919876543239', email: 'yash@example.com',
    membershipType: 'ELITE TIER', membershipStatus: 'active',
    workoutType: 'cardio_weights', isLive: false,
    checkinTime: null, duration: null, lastCheckout: '1:00 PM',
    joinDate: '2024-11-20', expiryDate: '2025-05-20', daysLeft: 119,
    totalVisits: 62, currentStreak: 55, paidAmount: 2500,
  },
];

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.active;

const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

// ═══════════════════════════════════════════════════════════════
// TAB BUTTON
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
// REQUEST CARD
// ═══════════════════════════════════════════════════════════════
const RequestCard = ({ request, onApprove, onReject, isProcessing }) => {
  const template = request.planTemplate || {
    iconColor: Colors.gold,
    textColor: Colors.gold,
    badge: 'PLAN',
  };
  const iconColor = template.iconColor || Colors.gold;
  const textColor = template.textColor || Colors.gold;

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      style={[styles.requestCardWrapper, { borderColor: `${iconColor}30` }]}
    >
      <View style={styles.cardBgIconContainer}>
        <HugeiconsIcon
          icon={Shield01Icon}
          size={ms(70)}
          color={`${iconColor}15`}
          strokeWidth={0.5}
        />
      </View>

      <View style={styles.reqHeader}>
        <View style={styles.reqAvatarRow}>
          <View
            style={[
              styles.reqAvatarContainer,
              {
                borderColor: `${iconColor}60`,
                backgroundColor: `${iconColor}15`,
              },
            ]}
          >
            <LinearGradient
              colors={['black', 'black']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.reqAvatar}
            >
              <Text style={styles.reqAvatarText}>
                {request.userName?.slice(0, 2).toUpperCase() || 'UN'}
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.reqNameBox}>
            <View style={styles.reqBadgeRow}>
              <View style={styles.reqLeftBadges}>
                <View style={[styles.reqTierBadge, { borderColor: `${iconColor}40` }]}>
                  <View style={[styles.reqTierDot, { backgroundColor: iconColor }]} />
                  <Text style={[styles.reqTierText, { color: Colors.zinc[400] }]}>
                    {template.badge || 'PLAN'}
                  </Text>
                </View>
                <View style={[styles.reqStatusBadge, { borderColor: 'rgba(234,179,8,0.3)' }]}>
                  <HugeiconsIcon icon={Clock01Icon} size={ms(10)} color={Colors.gold} />
                  <Text style={[styles.reqStatusText, { color: Colors.zinc[400] }]}>PENDING</Text>
                </View>
              </View>
            </View>

            <Text style={styles.reqName}>{request.userName}</Text>

            <View style={[styles.reqWorkoutBadge, { backgroundColor: `${iconColor}15` }]}>
              <HugeiconsIcon
                icon={request.workoutType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon}
                size={ms(10)}
                color={iconColor}
              />
              <Text style={[styles.reqWorkoutText, { color: 'white' }]}>
                {request.workoutType === 'cardio_weights' ? 'CARDIO + WEIGHTS' : 'WEIGHTS ONLY'}
              </Text>
            </View>

            <View style={styles.reqTimeRow}>
              <HugeiconsIcon icon={Clock01Icon} size={ms(11)} color="rgba(255,255,255,0.4)" />
              <Text style={styles.reqTimeText}>
                {new Date(request.requestedAt).toLocaleString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.reqDivider, { backgroundColor: `${iconColor}25` }]} />

      <View style={styles.reqPlanRow}>
        <View style={styles.reqPlanInfo}>
          <Text style={styles.reqPlanLabel}>PLAN</Text>
          <Text style={[styles.reqPlanName, { color: textColor }]}>{request.planName}</Text>
        </View>
        <View style={styles.reqPriceBox}>
          {request.hasOffer && (
            <Text style={styles.reqOriginalPrice}>${request.planOriginalPrice}</Text>
          )}
          <Text style={[styles.reqFinalPrice, { color: textColor }]}>${request.planPrice}</Text>
          <Text style={styles.reqDuration}>/ {request.planDuration}</Text>
        </View>
      </View>

      <View style={styles.reqBottomRow}>
        <View style={styles.reqPhoneBox}>
          <View style={[styles.reqPhoneIcon, { backgroundColor: `${iconColor}12` }]}>
            <HugeiconsIcon icon={SmartPhone01Icon} size={ms(14)} color={iconColor} />
          </View>
          <View>
            <Text style={styles.memberPhoneLabel}>CONTACT</Text>
            <Text style={styles.reqPhoneText}>{request.userPhone}</Text>
          </View>
        </View>

        <View style={styles.reqActions}>
          <TouchableOpacity
            style={[styles.rejectBtn, isProcessing && { opacity: 0.5 }]}
            onPress={() => onReject(request)}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <Icon name="x" size={rf(14)} color="#EF4444" />
            <Text style={styles.rejectBtnText}>REJECT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.approveBtn, isProcessing && { opacity: 0.5 }]}
            onPress={() => onApprove(request)}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(34,197,94,0.25)', 'rgba(34,197,94,0.10)']}
              style={styles.approveBtnGradient}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#22C55E" />
              ) : (
                <>
                  <Icon name="check" size={rf(14)} color="#22C55E" />
                  <Text style={styles.approveBtnText}>APPROVE</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ═══════════════════════════════════════════════════════════════
// MEMBER CARD
// ✅ Trainer assign logic REMOVED
// ✅ Only shows trainer BADGE if already accepted (read-only)
// ═══════════════════════════════════════════════════════════════
const MemberCard = ({ member, onPress, trainerStatus }) => {
  const isTrial = member.membershipStatus === 'trial';
  const tierConfig = isTrial
    ? TRIAL_CONFIG
    : TIER_TEMPLATES[member.membershipType] || TIER_TEMPLATES['ELITE TIER'];
  const statusConfig = getStatusConfig(member.membershipStatus);
  const cardAccentColor = tierConfig.iconColor;

  const isTrainerPending  = trainerStatus === 'pending';
  const isTrainerAccepted = trainerStatus === 'accepted';

  const handleCall = (e) => {
    e.stopPropagation();
    Linking.openURL(`tel:${member.phone.replace(/\D/g, '')}`);
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    Linking.openURL(`whatsapp://send?phone=${member.phone.replace(/\D/g, '')}`);
  };

  return (
    <TouchableOpacity
      style={[
        styles.memberCardWrapper,
        {
          borderColor: isTrainerAccepted
            ? `${TRAINER_COLOR}40`
            : `${cardAccentColor}30`,
        },
      ]}
      onPress={() => onPress(member)}
      activeOpacity={0.9}
    >
      <View style={styles.cardBgIconContainer}>
        <HugeiconsIcon
          icon={Shield01Icon}
          size={ms(70)}
          color={`${cardAccentColor}15`}
          strokeWidth={0.5}
        />
      </View>

      <View style={styles.memberCardContent}>
        <View style={styles.memberTopSection}>

          {/* Avatar */}
          <View
            style={[
              styles.memberAvatarContainer,
              {
                borderColor: isTrainerAccepted
                  ? `${TRAINER_COLOR}80`
                  : isTrial
                  ? `${TRIAL_CONFIG.iconColor}80`
                  : `${tierConfig.iconColor}60`,
                backgroundColor: isTrainerAccepted
                  ? `${TRAINER_COLOR}15`
                  : isTrial
                  ? TRIAL_CONFIG.bgColor
                  : `${tierConfig.iconColor}15`,
              },
            ]}
          >
            <LinearGradient
              colors={['black', 'black']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.memberAvatarInner}
            >
              <Text style={styles.memberAvatarText}>{member.avatar}</Text>
            </LinearGradient>
            {member.isLive && (
              <View style={styles.liveDotWrapper}>
                <View style={styles.liveDotInner} />
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.memberInfoBox}>
            <View style={styles.memberBadgeRow}>
              <View style={styles.memberLeftBadges}>

                {/* ✅ Show TRAINER badge if accepted (read-only) */}
                {isTrainerAccepted ? (
                  <View style={[styles.memberTierBadge, { borderColor: `${TRAINER_COLOR}40` }]}>
                    <View style={[styles.memberTierDot, { backgroundColor: TRAINER_COLOR }]} />
                    <Text style={[styles.memberTierText, { color: TRAINER_COLOR }]}>
                      TRAINER
                    </Text>
                  </View>
                ) : isTrainerPending ? (
                  <View style={[styles.memberTierBadge, { borderColor: 'rgba(234,179,8,0.4)' }]}>
                    <View style={[styles.memberTierDot, { backgroundColor: '#EAB308' }]} />
                    <Text style={[styles.memberTierText, { color: '#EAB308' }]}>
                      TRAINER PENDING
                    </Text>
                  </View>
                ) : !isTrial ? (
                  <View style={[styles.memberTierBadge, { borderColor: `${cardAccentColor}40` }]}>
                    <View style={[styles.memberTierDot, { backgroundColor: cardAccentColor }]} />
                    <Text style={[styles.memberTierText, { color: Colors.zinc[400] }]}>
                      {tierConfig.badge}
                    </Text>
                  </View>
                ) : null}

                {/* Status Badge */}
                {!isTrainerAccepted && (
                  <View
                    style={[
                      styles.memberStatusBadge,
                      { borderColor: statusConfig.borderColor },
                    ]}
                  >
                    <HugeiconsIcon
                      icon={statusConfig.icon}
                      size={ms(10)}
                      color={statusConfig.color}
                    />
                    <Text style={[styles.memberStatusText, { color: Colors.zinc[400] }]}>
                      {statusConfig.label}
                    </Text>
                  </View>
                )}
              </View>

              {/* Live / Offline chip */}
              {member.isLive ? (
                <View style={styles.liveChip}>
                  <View style={styles.liveChipDot} />
                  <Text style={styles.liveChipText}>LIVE</Text>
                </View>
              ) : (
                <View style={styles.offlineChip}>
                  <Text style={styles.offlineChipText}>OFFLINE</Text>
                </View>
              )}
            </View>

            <Text style={styles.memberName} numberOfLines={1}>
              {member.name}
            </Text>

            {/* Workout Badge */}
            {!isTrial && !isTrainerAccepted && (
              <View
                style={[
                  styles.memberWorkoutBadge,
                  { backgroundColor: `${cardAccentColor}15` },
                ]}
              >
                <HugeiconsIcon
                  icon={
                    member.workoutType === 'cardio_weights'
                      ? Activity01Icon
                      : Dumbbell01Icon
                  }
                  size={ms(10)}
                  color={cardAccentColor}
                />
                <Text style={[styles.memberWorkoutText, { color: 'white' }]}>
                  {member.workoutType === 'cardio_weights'
                    ? 'CARDIO + WEIGHTS'
                    : 'WEIGHTS ONLY'}
                </Text>
              </View>
            )}

            {/* Trainer accepted workout badge */}
            {isTrainerAccepted && (
              <View
                style={[
                  styles.memberWorkoutBadge,
                  { backgroundColor: `${TRAINER_COLOR}15` },
                ]}
              >
                <HugeiconsIcon
                  icon={Dumbbell01Icon}
                  size={ms(10)}
                  color={TRAINER_COLOR}
                />
                <Text style={[styles.memberWorkoutText, { color: TRAINER_COLOR }]}>
                  GYM TRAINER
                </Text>
              </View>
            )}

            {/* Time Row */}
            <View style={styles.memberTimeRow}>
              {member.isLive && member.checkinTime ? (
                <>
                  <View style={styles.memberTimeItem}>
                    <HugeiconsIcon icon={Login01Icon} size={ms(11)} color="#22C55E" />
                    <Text style={styles.memberTimeText}>{member.checkinTime}</Text>
                  </View>
                  <View style={styles.memberTimeDot} />
                  <View style={styles.memberTimeItem}>
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      size={ms(11)}
                      color={cardAccentColor}
                    />
                    <Text style={styles.memberTimeText}>{member.duration}</Text>
                  </View>
                </>
              ) : (
                <View style={styles.memberTimeItem}>
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={ms(11)}
                    color="rgba(255,255,255,0.3)"
                  />
                  <Text style={[styles.memberTimeText, { color: 'rgba(255,255,255,0.4)' }]}>
                    Last: {member.lastCheckout || 'N/A'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View
          style={[
            styles.memberDivider,
            {
              backgroundColor: isTrainerAccepted
                ? `${TRAINER_COLOR}25`
                : `${cardAccentColor}25`,
            },
          ]}
        />

        {/* Bottom Row - Phone + Call/WhatsApp only */}
        <View style={styles.memberBottomRow}>
          <View style={styles.memberPhoneBox}>
            <View
              style={[
                styles.memberPhoneIcon,
                {
                  backgroundColor: isTrainerAccepted
                    ? `${TRAINER_COLOR}12`
                    : `${cardAccentColor}12`,
                },
              ]}
            >
              <HugeiconsIcon
                icon={SmartPhone01Icon}
                size={ms(14)}
                color={isTrainerAccepted ? TRAINER_COLOR : cardAccentColor}
              />
            </View>
            <View style={styles.memberPhoneInfo}>
              <Text style={styles.memberPhoneLabel}>CONTACT</Text>
              <Text style={styles.memberPhoneText}>{formatPhone(member.phone)}</Text>
            </View>
          </View>

          {/* ✅ Only Call & WhatsApp buttons - NO Make Trainer button */}
          <View style={styles.memberActionBtns}>
            <TouchableOpacity
              style={styles.memberActionBtn}
              onPress={handleCall}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['black', 'black']}
                style={styles.memberActionGradient}
              >
                <HugeiconsIcon icon={Call02Icon} size={ms(18)} color="#22C55E" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.memberActionBtn}
              onPress={handleWhatsApp}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['black', 'black']}
                style={styles.memberActionGradient}
              >
                <HugeiconsIcon icon={WhatsappIcon} size={ms(18)} color="#25D366" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={() => {}}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={Platform.OS === 'ios' ? 'ultraThinMaterialDark' : 'dark'}
            blurAmount={20}
          />
          <View style={styles.modalInner}>
            <View style={styles.modalIconCircle}>
              <Icon name="x-circle" size={rf(28)} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>Reject Request</Text>

            <View style={styles.modalUserRow}>
              <View style={[styles.modalAvatar, { backgroundColor: `${iconColor}25` }]}>
                <Text style={[styles.modalAvatarText, { color: iconColor }]}>
                  {request?.userName?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View>
                <Text style={styles.modalUserName}>{request?.userName}</Text>
                <Text style={styles.modalPlanName}>{request?.planName}</Text>
              </View>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Reason for rejection (optional)"
              placeholderTextColor={Colors.zinc[600]}
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalBtnsRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalRejectBtn} onPress={handleSubmit}>
                <LinearGradient
                  colors={['rgba(239,68,68,0.25)', 'rgba(239,68,68,0.10)']}
                  style={styles.modalRejectGradient}
                >
                  <Icon name="x" size={rf(14)} color="#EF4444" />
                  <Text style={styles.modalRejectText}>REJECT</Text>
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

  // ✅ Only getTrainerStatus & getTrainerCount - no sendTrainerRequest
  const { getTrainerStatus, getTrainerCount } = useTrainer();

  const [activeTab, setActiveTab]           = useState('pending');
  const [processingId, setProcessingId]     = useState(null);
  const [refreshing, setRefreshing]         = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery]       = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [memberFilter, setMemberFilter]     = useState('all');

  const pendingRequests = getPendingRequests();
  const activeMembers   = getActiveMembers();
  const trainerCount    = getTrainerCount();

  const filteredMembers = DUMMY_MEMBERS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery);

    const matchesFilter =
      memberFilter === 'all' ||
      (memberFilter === 'live'    && m.isLive) ||
      (memberFilter === 'offline' && !m.isLive) ||
      (memberFilter === 'trial'   && m.membershipStatus === 'trial') ||
      (memberFilter === 'trainer' && getTrainerStatus(m.id) === 'accepted');

    return matchesSearch && matchesFilter;
  });

  const liveCount    = DUMMY_MEMBERS.filter((m) => m.isLive).length;
  const offlineCount = DUMMY_MEMBERS.filter((m) => !m.isLive).length;
  const trialCount   = DUMMY_MEMBERS.filter((m) => m.membershipStatus === 'trial').length;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleApprove = async (request) => {
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
    } finally {
      setProcessingId(null);
      setSelectedRequest(null);
    }
  };

  const handleMemberPress = (member) => {
    navigation.navigate('MembersProfile', { member });
  };

  const renderContent = () => {
    if (loading && activeTab === 'pending') {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.white} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (activeTab === 'pending') {
      return pendingRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Icon name="inbox" size={rf(40)} color={Colors.zinc[600]} />
          </View>
          <Text style={styles.emptyTitle}>No Pending Requests</Text>
          <Text style={styles.emptySubtitle}>
            New membership requests will appear here
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
    }

    if (activeTab === 'members') {
      return (
        <>
          {/* Search Bar */}
          <View
            style={[
              styles.searchBar,
              isSearchFocused && styles.searchBarFocused,
            ]}
          >
            <HugeiconsIcon
              icon={Search01Icon}
              size={ms(18)}
              color={isSearchFocused ? '#fff' : 'rgba(255,255,255,0.4)'}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search name, ID, or phone..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                activeOpacity={0.7}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={ms(14)}
                  color="rgba(255,255,255,0.5)"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Row */}
          <View style={styles.filterRow}>
            {[
              { label: 'All',     value: 'all',     count: DUMMY_MEMBERS.length },
              { label: 'Live',    value: 'live',    count: liveCount,    color: '#22C55E' },
              { label: 'Offline', value: 'offline', count: offlineCount, color: 'rgba(255,255,255,0.4)' },
              { label: 'Trial',   value: 'trial',   count: trialCount,   color: '#3B82F6' },
              { label: 'Trainer', value: 'trainer', count: trainerCount, color: TRAINER_COLOR },
            ].map((f) => (
              <TouchableOpacity
                key={f.value}
                style={[
                  styles.filterChip,
                  memberFilter === f.value && styles.filterChipActive,
                ]}
                onPress={() => setMemberFilter(f.value)}
                activeOpacity={0.7}
              >
                {f.color && (
                  <View style={[styles.filterDot, { backgroundColor: f.color }]} />
                )}
                <Text
                  style={[
                    styles.filterChipText,
                    memberFilter === f.value && styles.filterChipTextActive,
                  ]}
                >
                  {f.label} ({f.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery
                ? 'Search Results'
                : memberFilter === 'live'
                ? 'Live Members'
                : memberFilter === 'offline'
                ? 'Offline Members'
                : memberFilter === 'trial'
                ? 'Trial Members'
                : memberFilter === 'trainer'
                ? 'Trainers'
                : 'All Members'}
            </Text>
            <View style={styles.sectionCount}>
              <Text style={styles.sectionCountText}>{filteredMembers.length}</Text>
            </View>
          </View>

          {/* Member Cards */}
          {filteredMembers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <HugeiconsIcon
                icon={UserRemove01Icon}
                size={ms(48)}
                color="rgba(255,255,255,0.3)"
              />
              <Text style={styles.emptyTitle}>No Members Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filter
              </Text>
            </View>
          ) : (
            filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onPress={handleMemberPress}
                trainerStatus={getTrainerStatus(member.id)}
              />
            ))
          )}
        </>
      );
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

          {/* Stats Top Row */}
          <View style={styles.statsTopRow}>
            <View style={styles.statTopItem}>
              <Text style={[styles.statTopNumber, { color: Colors.gold }]}>
                {pendingRequests.length}
              </Text>
              <Text style={styles.statTopLabel}>PENDING</Text>
            </View>
            <View style={styles.statTopDivider} />
            <View style={styles.statTopItem}>
              <Text style={[styles.statTopNumber, { color: '#22C55E' }]}>
                {liveCount}
              </Text>
              <Text style={styles.statTopLabel}>LIVE</Text>
            </View>
            <View style={styles.statTopDivider} />
            <View style={styles.statTopItem}>
              <Text style={[styles.statTopNumber, { color: TRAINER_COLOR }]}>
                {trainerCount}
              </Text>
              <Text style={styles.statTopLabel}>TRAINERS</Text>
            </View>
            <View style={styles.statTopDivider} />
            <View style={styles.statTopItem}>
              <Text style={styles.statTopNumber}>{DUMMY_MEMBERS.length}</Text>
              <Text style={styles.statTopLabel}>TOTAL</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TabButton
              title="Requests"
              count={pendingRequests.length}
              isActive={activeTab === 'pending'}
              onPress={() => setActiveTab('pending')}
              color={Colors.gold}
            />
            <TabButton
              title="Members"
              count={DUMMY_MEMBERS.length}
              isActive={activeTab === 'members'}
              onPress={() => setActiveTab('members')}
              color="#22C55E"
            />
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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

      <BottomNav
        activeTab="members"
        onTabChange={(tab) => {
          if (tab === 'dashboard') navigation.navigate('AdminDashboard');
          if (tab === 'plans')     navigation.navigate('AdminPlans');
          if (tab === 'members')   navigation.navigate('AdminUsersDetail');
          if (tab === 'settings')  navigation.navigate('AdminSettings');
        }}
        userType="admin"
      />
    </ImageBackground>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient:   { flex: 1 },
  safeArea:   { flex: 1 },

  // Stats Top Row
  statsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: vs(12),
    marginHorizontal: s(20),
    backgroundColor: '#000000',
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: vs(12),
  },
  statTopItem: { alignItems: 'center', flex: 1 },
  statTopNumber: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(18),
    color: Colors.white,
  },
  statTopLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[500],
    letterSpacing: s(1.2),
    marginTop: vs(2),
  },
  statTopDivider: {
    width: 1,
    height: vs(28),
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: s(20),
    backgroundColor: '#000000',
    borderRadius: ms(10),
    padding: s(4),
    marginBottom: vs(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(10),
    borderRadius: ms(8),
    gap: s(6),
  },
  tabButtonActive: { backgroundColor: 'rgba(255,255,255,0.08)' },
  tabButtonText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(10),
    color: Colors.zinc[500],
    letterSpacing: s(1),
  },
  tabBadge: {
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(10),
    minWidth: s(20),
    alignItems: 'center',
  },
  tabBadgeText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(8),
    color: '#000000',
  },

  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: s(20),
    paddingBottom: vs(100),
    gap: vs(12),
  },

  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(80),
  },
  loadingText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[500],
    marginTop: vs(12),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(60),
    gap: vs(12),
  },
  emptyIconCircle: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyTitle: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(14),
    color: Colors.zinc[400],
  },
  emptySubtitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[600],
    textAlign: 'center',
    paddingHorizontal: s(20),
  },

  cardBgIconContainer: {
    position: 'absolute',
    top: -ms(5),
    right: -ms(10),
    opacity: 0.8,
  },

  // ── Request Card ──
  requestCardWrapper: {
    borderRadius: ms(16),
    overflow: 'hidden',
    backgroundColor: '#000000',
    borderWidth: 1,
    position: 'relative',
    padding: ms(14),
  },
  reqHeader: { marginBottom: vs(8) },
  reqAvatarRow: { flexDirection: 'row', alignItems: 'flex-start', gap: s(12) },
  reqAvatarContainer: {
    position: 'relative',
    borderWidth: scale(2),
    borderRadius: ms(27),
  },
  reqAvatar: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqAvatarText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(14),
    color: '#FFFFFF',
  },
  reqNameBox: { flex: 1 },
  reqBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
    justifyContent: 'space-between',
  },
  reqLeftBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    flexWrap: 'wrap',
  },
  reqTierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(5),
    borderWidth: 1,
    gap: s(4),
  },
  reqTierDot: { width: ms(4), height: ms(4), borderRadius: ms(2) },
  reqTierText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(6),
    letterSpacing: 0.5,
  },
  reqStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(5),
    borderWidth: 1,
    gap: s(3),
  },
  reqStatusText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(6),
    letterSpacing: 0.5,
  },
  reqName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(11),
    color: '#FFFFFF',
    marginBottom: vs(4),
  },
  reqWorkoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
    marginBottom: vs(4),
    gap: s(4),
  },
  reqWorkoutText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(6),
    letterSpacing: 0.5,
  },
  reqTimeRow: { flexDirection: 'row', alignItems: 'center', gap: s(4) },
  reqTimeText: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(7),
    color: 'rgba(255,255,255,0.4)',
  },
  reqDivider: { height: 1, marginVertical: vs(10) },
  reqPlanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: vs(12),
  },
  reqPlanInfo: { gap: vs(2) },
  reqPlanLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(6),
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
  reqPlanName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(13),
    letterSpacing: 1,
  },
  reqPriceBox: { alignItems: 'flex-end' },
  reqOriginalPrice: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
    textDecorationLine: 'line-through',
  },
  reqFinalPrice: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(18),
  },
  reqDuration: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[500],
  },
  reqBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reqPhoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    flex: 1,
  },
  reqPhoneIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberPhoneLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(6),
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.2,
    marginBottom: vs(1),
  },
  reqPhoneText: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(8),
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  reqActions: { flexDirection: 'row', gap: s(8) },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    backgroundColor: 'rgba(239,68,68,0.08)',
  },
  rejectBtnText: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(8),
    color: '#EF4444',
    letterSpacing: 1,
  },
  approveBtn: { borderRadius: ms(8), overflow: 'hidden' },
  approveBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.35)',
    borderRadius: ms(8),
  },
  approveBtnText: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(8),
    color: '#22C55E',
    letterSpacing: 1,
  },

  // ── Member Card ──
  memberCardWrapper: {
    borderRadius: ms(16),
    overflow: 'hidden',
    backgroundColor: '#000000',
    borderWidth: 1,
    position: 'relative',
  },
  memberCardContent: {
    paddingLeft: ms(14),
    paddingRight: ms(12),
    paddingVertical: ms(12),
  },
  memberTopSection: { flexDirection: 'row', alignItems: 'flex-start' },
  memberAvatarContainer: {
    position: 'relative',
    marginRight: s(12),
    borderWidth: scale(2),
    borderRadius: ms(27),
  },
  memberAvatarInner: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(14),
    color: '#FFFFFF',
  },
  liveDotWrapper: {
    position: 'absolute',
    bottom: ms(0),
    right: ms(0),
    width: ms(14),
    height: ms(14),
    borderRadius: ms(7),
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  liveDotInner: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: '#22C55E',
  },
  memberInfoBox: { flex: 1 },
  memberBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
    justifyContent: 'space-between',
  },
  memberLeftBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    flexWrap: 'wrap',
  },
  memberTierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(5),
    borderWidth: 1,
    gap: s(4),
  },
  memberTierDot: { width: ms(4), height: ms(4), borderRadius: ms(2) },
  memberTierText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(6),
    letterSpacing: 0.5,
  },
  memberStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(5),
    borderWidth: 1,
    gap: s(3),
  },
  memberStatusText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(6),
    letterSpacing: 0.5,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(5),
    gap: s(3),
  },
  liveChipDot: {
    width: ms(4),
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: '#22C55E',
  },
  liveChipText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(5),
    color: '#22C55E',
    letterSpacing: 0.5,
  },
  offlineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(5),
  },
  offlineChipText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(5),
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 0.5,
  },
  memberName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(11),
    color: '#FFFFFF',
    marginBottom: vs(4),
  },
  memberWorkoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
    marginBottom: vs(5),
    gap: s(4),
  },
  memberWorkoutText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(6),
    letterSpacing: 0.5,
  },
  memberTimeRow: { flexDirection: 'row', alignItems: 'center' },
  memberTimeItem: { flexDirection: 'row', alignItems: 'center', gap: s(3) },
  memberTimeText: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(8),
    color: '#FFFFFF',
  },
  memberTimeDot: {
    width: ms(3),
    height: ms(3),
    borderRadius: ms(1.5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: s(6),
  },
  memberDivider: { height: 1, marginVertical: vs(10) },
  memberBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberPhoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberPhoneIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(8),
  },
  memberPhoneInfo: { flex: 1 },
  memberPhoneLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(6),
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.2,
    marginBottom: vs(1),
  },
  memberPhoneText: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(8),
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  memberActionBtns: { flexDirection: 'row', gap: s(6) },
  memberActionBtn: { borderRadius: ms(10), overflow: 'hidden' },
  memberActionGradient: {
    width: ms(36),
    height: ms(36),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: s(13),
    paddingVertical: vs(6),
    gap: s(10),
  },
  searchBarFocused: { borderColor: 'rgba(255,255,255,0.15)' },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(13),
    color: '#FFFFFF',
    paddingVertical: 0,
  },

  // Filter
  filterRow: { flexDirection: 'row', gap: s(6), flexWrap: 'wrap' },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    paddingVertical: vs(5),
    borderRadius: ms(16),
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: s(4),
  },
  filterChipActive: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  filterDot: { width: ms(5), height: ms(5), borderRadius: ms(2.5) },
  filterChipText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  filterChipTextActive: { color: '#FFFFFF' },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(11),
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionCount: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
  },
  sectionCountText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(11),
    color: '#22C55E',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(20),
  },
  modalContent: {
    width: '100%',
    borderRadius: ms(20),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#000000',
  },
  modalInner: { padding: s(24), alignItems: 'center' },
  modalIconCircle: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(32),
    backgroundColor: 'rgba(239,68,68,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(16),
    color: Colors.white,
    marginTop: vs(14),
    marginBottom: vs(4),
  },
  modalUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    marginTop: vs(16),
    marginBottom: vs(8),
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: s(12),
    borderRadius: ms(12),
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  modalAvatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAvatarText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(14),
  },
  modalUserName: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(11),
    color: Colors.white,
  },
  modalPlanName: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
  },
  modalInput: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: s(14),
    marginTop: vs(8),
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.white,
    textAlignVertical: 'top',
    minHeight: vs(80),
  },
  modalBtnsRow: {
    flexDirection: 'row',
    gap: s(12),
    marginTop: vs(16),
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(12),
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  modalCancelText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(10),
    color: Colors.zinc[500],
    letterSpacing: s(1.5),
  },
  modalRejectBtn: { flex: 1, borderRadius: ms(10), overflow: 'hidden' },
  modalRejectGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(6),
    paddingVertical: vs(12),
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    borderRadius: ms(10),
  },
  modalRejectText: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(10),
    color: '#EF4444',
    letterSpacing: s(1.5),
  },
});

export default AdminUsersDetailScreen;