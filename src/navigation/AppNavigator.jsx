import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ═══════════════════════════════════════════════════════════════
// AUTH SCREENS
// ═══════════════════════════════════════════════════════════════
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginStep1Screen from '../screens/auth/LoginStep1Screen';
import LoginOTPScreen from '../screens/auth/LoginOTPScreen';
import LoginPasswordScreen from '../screens/auth/LoginPasswordScreen';

// ═══════════════════════════════════════════════════════════════
// USER/MEMBER SCREENS
// ═══════════════════════════════════════════════════════════════
import UserDashboardScreen from '../screens/user/UserDashboardScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';
import MembersFriendScreen from '../screens/user/MembersFriendScreen';
import SentRequestsScreen from '../screens/user/SentRequestsScreen';
import ReceivedRequestsScreen from '../screens/user/ReceivedRequestsScreen';

// ═══════════════════════════════════════════════════════════════
// ADMIN SCREENS
// ═══════════════════════════════════════════════════════════════
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminPlansScreen from '../screens/admin/AdminPlansScreen;'; // ✅ NEW: Plans List Screen
import AdminAddPlanScreen from '../screens/admin/AdminAddPlanScreen'; // ✅ Add/Create Plan Screen
import AdminLiveRosterScreen from '../screens/admin/AdminLiveRosterScreen';
import AdminUsersDetailScreen from '../screens/admin/AdminUsersDetailScreen';
import AdminSeeUserProfileScreen from '../screens/admin/AdminSeeUserProfileScreen';
import MembersProfileScreen from '../screens/admin/MembersProfileScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';
import AdminAddTrainerScreen from '../screens/admin/trainer/AdminAddTrainerScreen';
import AdminTrainersScreen from '../screens/admin/trainer/AdminTrainersScreen';
import AdminTrainerProfileScreen from '../screens/admin/trainer/AdminTrainerProfileScreen';
import TrainerDetailScreen from '../screens/admin/trainer/TrainerDetailScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000000' },
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress,
            },
          }),
        }}
      >
        {/* ════════════════════════════════════════════════════ */}
        {/* AUTH FLOW */}
        {/* ════════════════════════════════════════════════════ */}
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
        />
        <Stack.Screen 
          name="LoginStep1" 
          component={LoginStep1Screen} 
        />
        <Stack.Screen 
          name="LoginOTP" 
          component={LoginOTPScreen} 
        />
        <Stack.Screen 
          name="LoginPassword" 
          component={LoginPasswordScreen} 
        />

        {/* ════════════════════════════════════════════════════ */}
        {/* USER/MEMBER FLOW */}
        {/* ════════════════════════════════════════════════════ */}
        <Stack.Screen 
          name="UserDashboard" 
          component={UserDashboardScreen} 
        />
        <Stack.Screen 
          name="UserProfile" 
          component={UserProfileScreen} 
        />
        <Stack.Screen 
          name="MembersFriend" 
          component={MembersFriendScreen} 
        />
        <Stack.Screen 
          name="SentRequests" 
          component={SentRequestsScreen} 
        />
        <Stack.Screen 
          name="ReceivedRequests" 
          component={ReceivedRequestsScreen} 
        />
        <Stack.Screen 
          name="MembersProfile" 
          component={MembersProfileScreen} 
        />

        {/* ════════════════════════════════════════════════════ */}
        {/* ADMIN FLOW */}
        {/* ════════════════════════════════════════════════════ */}
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen} 
        />
        
        {/* ✅ Plans Management */}
        <Stack.Screen 
          name="AdminPlans" 
          component={AdminPlansScreen} 
          options={{
            title: 'Membership Plans',
          }}
        />
        <Stack.Screen 
          name="AdminAddPlan" 
          component={AdminAddPlanScreen} 
          options={{
            title: 'Create New Plan',
          }}
        />

        {/* Members Management */}
        <Stack.Screen 
          name="AdminUsersDetail" 
          component={AdminUsersDetailScreen} 
        />
        <Stack.Screen 
          name="AdminSeeUserProfile" 
          component={AdminSeeUserProfileScreen} 
        />
        <Stack.Screen 
          name="AdminLiveRoster" 
          component={AdminLiveRosterScreen} 
        />

        {/* Settings */}
        <Stack.Screen 
          name="AdminSettings" 
          component={AdminSettingsScreen} 
        />

         <Stack.Screen 
          name="AdminAddTrainer" 
          component={AdminAddTrainerScreen} 
        />
         <Stack.Screen 
          name="AdminTrainers" 
          component={AdminTrainersScreen} 
        />

   <Stack.Screen 
          name="AdminTrainerProfile" 
          component={AdminTrainerProfileScreen} 
        />
        <Stack.Screen 
          name="TrainerDetail" 
          component={TrainerDetailScreen} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;