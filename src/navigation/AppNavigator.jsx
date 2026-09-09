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
// ADMIN SCREENS
// ═══════════════════════════════════════════════════════════════
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminAddPlanScreen from '../screens/admin/AdminAddPlanScreen';
import AdminLiveRosterScreen from '../screens/admin/AdminLiveRosterScreen';
import AdminUsersDetailScreen from '../screens/admin/AdminUsersDetailScreen';
import AdminSeeUserProfileScreen from '../screens/admin/AdminSeeUserProfileScreen';
import MembersProfileScreen from '../screens/admin/MembersProfileScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';
import AdminAddTrainerScreen from '../screens/admin/trainer/AdminAddTrainerScreen';
import AdminTrainersScreen from '../screens/admin/trainer/AdminTrainersScreen';
import AdminTrainerProfileScreen from '../screens/admin/trainer/AdminTrainerProfileScreen';
import TrainerDetailScreen from '../screens/admin/trainer/TrainerDetailScreen';
import TrainerAttendanceLogScreen from '../screens/admin/trainer/TrainerAttendanceLogScreen';
import TrainerDashboardScreen from '../screens/trainerdashboard/TrainerDashboardScreen';
import AdminExpensesScreen from '../screens/admin/AdminExpensesScreen';
import AdminPlansScreen from "../screens/admin/AdminPlansScreen;"
import AdminSignupScreen from '../screens/auth/AdminSignupScreen';

import AdminLoginScreen from '../screens/auth/AdminLoginScreen';
import AdminSignupEmailScreen from '../screens/auth/AdminSignupEmailScreen';
import AdminSignupOTPScreen from '../screens/auth/AdminSignupOTPScreen';
import AdminSignupPasswordScreen from '../screens/auth/AdminSignupPasswordScreen';
import AdminSignupProfileScreen from '../screens/auth/AdminSignupProfileScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
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
        {/* ADMIN FLOW */}
        {/* ════════════════════════════════════════════════════ */}
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
        />

        {/* Plans Management */}
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
          name="MembersProfile"
          component={MembersProfileScreen}
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

        {/* Trainer Management */}
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
        <Stack.Screen
          name="TrainerAttendanceLog"
          component={TrainerAttendanceLogScreen}
        />
        <Stack.Screen
          name="TrainerDashboard"
          component={TrainerDashboardScreen}
        />

        {/* Expenses */}
        <Stack.Screen
          name="AdminExpenses"
          component={AdminExpensesScreen}
        />

 <Stack.Screen
          name="AdminSignup"
          component={AdminSignupScreen}
        />
  
  <Stack.Screen
          name="AdminSignupProfile"
          component={AdminSignupProfileScreen}
        />

  <Stack.Screen
          name="AdminSignupPassword"
          component={AdminSignupPasswordScreen}
        />


 <Stack.Screen
          name="AdminSignupOTP"
          component={AdminSignupOTPScreen}
        />
 <Stack.Screen
          name="AdminSignupEmail"
          component={AdminSignupEmailScreen}
        />
         <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
        />
<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;