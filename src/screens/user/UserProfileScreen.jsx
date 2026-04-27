import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../components/shared/Header';
import GlassCard from '../../components/shared/GlassCard';
import GlassButton from '../../components/shared/GlassButton';
import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const UserProfileScreen = ({ navigation }) => {
  const profileItems = [
    { icon: 'shield', label: 'Membership', value: 'ELITE TIER', color: Colors.gold },
    { icon: 'clock', label: 'Joined Date', value: '14 Nov 2025', color: Colors.zinc[400] },
    { icon: 'credit-card', label: 'Billing Cycle', value: 'Monthly', color: Colors.zinc[400] },
  ];

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={styles.background}
      blurRadius={20}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.85)', '#000000']}
        style={styles.gradient}
      >
        <Header title="PROFILE" />
        
        <ScrollView 
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Icon name="user" size={32} color={Colors.zinc[500]} />
              </View>
              <View style={styles.statusIndicator}>
                <View style={styles.statusDot} />
              </View>
            </View>
            <Text style={styles.profileName}>MARCUS T.</Text>
            <Text style={styles.profileId}>ID: ATH-84920</Text>
          </View>

          <View style={styles.infoSection}>
            {profileItems.map((item, index) => (
              <GlassCard key={index} style={styles.infoCard}>
                <View style={styles.infoContent}>
                  <Icon name={item.icon} size={18} color={Colors.zinc[400]} />
                  <Text style={styles.infoLabel}>{item.label}</Text>
                </View>
                <Text style={[styles.infoValue, { color: item.color }]}>
                  {item.value}
                </Text>
              </GlassCard>
            ))}
          </View>

          <GlassButton 
            variant="outline" 
            style={styles.signOutButton}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] })}
          >
            Sign Out
          </GlassButton>
        </ScrollView>

      <BottomNav
  activeTab="profile"
  onTabChange={(tab) => {
    if (tab === 'home') navigation.navigate('UserDashboard');
    if (tab === 'profile') {
    }
    if (tab === 'membership') {
      navigation.navigate('UserDashboard', { openPlans: true });
    }
    if (tab === 'friends') navigation.navigate('MembersFriend');
  }}
/>
       
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 4,
    backgroundColor: Colors.zinc[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
  },
  profileName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: 24,
    color: Colors.white,
    letterSpacing: 4.8,
    marginBottom: 4,
  },
  profileId: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: 9,
    color: Colors.zinc[400],
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  infoSection: {
    gap: 12,
    marginBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: 12,
    color: Colors.white,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontFamily: Fonts.montserrat.medium,
    fontSize: 10,
  },
  signOutButton: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
});

export default UserProfileScreen;