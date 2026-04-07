import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { PlansProvider } from './src/context/PlansContext';
import { MembershipRequestsProvider } from './src/context/MembershipRequestsContext';
const App = () => {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#000000" 
        translucent 
      />
 <MembershipRequestsProvider>
       <PlansProvider>
      <AppNavigator />
    </PlansProvider>
      </MembershipRequestsProvider>

    </>
  );
};

export default App;
  