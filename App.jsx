// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { PlansProvider } from './src/context/PlansContext';
import { MembershipRequestsProvider } from './src/context/MembershipRequestsContext';
import { TrainerProvider } from './src/context/TrainerContext';

const App = () => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000000"
        translucent
      />
      <TrainerProvider>
        <MembershipRequestsProvider>
          <PlansProvider>
            <AppNavigator />
          </PlansProvider>
        </MembershipRequestsProvider>
      </TrainerProvider>
    </>
  );
};

export default App;