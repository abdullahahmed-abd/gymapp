import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginStep1Screen from '../screens/auth/LoginStep1Screen';
import LoginOTPScreen from '../screens/auth/LoginOTPScreen';
import LoginPasswordScreen from '../screens/auth/LoginPasswordScreen';

// User Screens
import UserDashboardScreen from '../screens/user/UserDashboardScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminAddPlanScreen from '../screens/admin/AdminAddPlanScreen';
// In your navigation file (e.g., AdminStack.js or AppNavigator.js)
import AdminLiveRosterScreen from '../screens/admin/AdminLiveRosterScreen';
import AdminSeeUserProfileScreen from "../screens/admin/AdminSeeUserProfileScreen"
import AdminUsersDetailScreen from '../screens/admin/AdminUsersDetailScreen'; 
// App.js / Navigator file mein
import MembersProfileScreen from '../screens/admin/MembersProfileScreen';
import MembersFriendScreen from '../screens/user/MembersFriendScreen';
// Stack mein
// In your Stack Navigator
import SentRequestsScreen from '../screens/user/SentRequestsScreen';
import ReceivedRequestsScreen from '../screens/user/ReceivedRequestsScreen';
// AppNavigator.js mein
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';

// Stack.Navigator mein add karo
// Inside Stack.Navigator:

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
        
        {/* Auth Flow */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="LoginStep1" component={LoginStep1Screen} />
        <Stack.Screen name="LoginOTP" component={LoginOTPScreen} />
        <Stack.Screen name="LoginPassword" component={LoginPasswordScreen} />

        {/* User Flow */}
        <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />

        {/* Admin Flow */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="AdminAddPlan" component={AdminAddPlanScreen} />
        <Stack.Screen name="AdminSeeUserProfile" component={AdminSeeUserProfileScreen} />
   <Stack.Screen name="AdminUsersDetail" component={AdminUsersDetailScreen} /> 
<Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />

        
<Stack.Screen 
  name="AdminLiveRoster" 
  component={AdminLiveRosterScreen} 
/>
<Stack.Screen name="MembersProfile" component={MembersProfileScreen} />
<Stack.Screen name="MembersFriend" component={MembersFriendScreen} />

<Stack.Screen
  name="SentRequests"
  component={SentRequestsScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen
  name="ReceivedRequests"
  component={ReceivedRequestsScreen}
  options={{ headerShown: false }}
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;