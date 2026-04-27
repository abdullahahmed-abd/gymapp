// src/context/PlansContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlansContext = createContext();

export const usePlans = () => {
  const context = useContext(PlansContext);
  if (!context) {
    throw new Error('usePlans must be used within a PlansProvider');
  }
  return context;
};

export const PlansProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load plans from storage on app start
  useEffect(() => {
    loadPlans();
  }, []);

// loadPlans function mein return add karo:

// src/context/PlansContext.js

const loadPlans = async () => {
  try {
    const storedPlans = await AsyncStorage.getItem('gym_plans');
    if (storedPlans) {                    // ✅ storedPlans (not storedPlants)
      setPlans(JSON.parse(storedPlans));  // ✅ storedPlans (not storedPlants)
    }
  } catch (error) {
    console.error('Error loading plans:', error);
  } finally {
    setLoading(false);
  }
  return Promise.resolve();
};

  const savePlans = async (newPlans) => {
    try {
      await AsyncStorage.setItem('gym_plans', JSON.stringify(newPlans));
    } catch (error) {
      console.error('Error saving plans:', error);
    }
  };

  // Admin deploys a new plan
  const deployPlan = async (planData) => {
    const newPlan = {
      id: Date.now().toString(),
      ...planData,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    
    const updatedPlans = [...plans, newPlan];
    setPlans(updatedPlans);
    await savePlans(updatedPlans);
    return newPlan;
  };

  // Admin updates a plan
  const updatePlan = async (planId, updatedData) => {
    const updatedPlans = plans.map(plan => 
      plan.id === planId ? { ...plan, ...updatedData } : plan
    );
    setPlans(updatedPlans);
    await savePlans(updatedPlans);
  };

  // Admin deletes a plan
  const deletePlan = async (planId) => {
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    setPlans(updatedPlans);
    await savePlans(updatedPlans);
  };

  // Admin toggles plan active status
  const togglePlanStatus = async (planId) => {
    const updatedPlans = plans.map(plan => 
      plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
    );
    setPlans(updatedPlans);
    await savePlans(updatedPlans);
  };

  // Get only active plans (for users)
  const getActivePlans = () => {
    return plans.filter(plan => plan.isActive);
  };

  return (
    <PlansContext.Provider
      value={{
        plans,
        loading,
        deployPlan,
        updatePlan,
        deletePlan,
        togglePlanStatus,
        getActivePlans,
        refreshPlans: loadPlans,
      }}
    >
      {children}
    </PlansContext.Provider>
  );
};

export default PlansContext;