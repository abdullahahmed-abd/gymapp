// src/context/MembershipRequestsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MembershipRequestsContext = createContext();

export const useMembershipRequests = () => {
  const context = useContext(MembershipRequestsContext);
  if (!context) {
    throw new Error('useMembershipRequests must be used within a MembershipRequestsProvider');
  }
  return context;
};

export const MembershipRequestsProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [approvedMembers, setApprovedMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data on app start
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedRequests = await AsyncStorage.getItem('membership_requests');
      const storedMembers = await AsyncStorage.getItem('approved_members');
      
      if (storedRequests) {
        setRequests(JSON.parse(storedRequests));
      }
      if (storedMembers) {
        setApprovedMembers(JSON.parse(storedMembers));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveRequests = async (newRequests) => {
    try {
      await AsyncStorage.setItem('membership_requests', JSON.stringify(newRequests));
    } catch (error) {
      console.error('Error saving requests:', error);
    }
  };

  const saveApprovedMembers = async (newMembers) => {
    try {
      await AsyncStorage.setItem('approved_members', JSON.stringify(newMembers));
    } catch (error) {
      console.error('Error saving members:', error);
    }
  };

  // User submits a membership request
  const submitRequest = async (userData, selectedPlan) => {
    const newRequest = {
      id: Date.now().toString(),
      
      // User Info
      userId: userData.id || Date.now().toString(),
      userName: userData.name,
      userPhone: userData.phone,
      userEmail: userData.email || '',
      userPhoto: userData.photo || null,
      
      // Plan Info
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      planPrice: selectedPlan.hasOffer ? selectedPlan.finalPrice : selectedPlan.price,
      planOriginalPrice: selectedPlan.price,
      planDuration: selectedPlan.duration,
      workoutType: selectedPlan.workoutType,
      planTemplate: selectedPlan.template,
      planFeatures: selectedPlan.features,
      hasOffer: selectedPlan.hasOffer,
      offerText: selectedPlan.offer?.text || '',
      
      // Request Status
      status: 'pending', // pending, approved, rejected
      requestedAt: new Date().toISOString(),
      processedAt: null,
      processedBy: null,
      rejectionReason: null,
    };

    const updatedRequests = [newRequest, ...requests];
    setRequests(updatedRequests);
    await saveRequests(updatedRequests);
    
    return newRequest;
  };

  // Admin approves a request
  const approveRequest = async (requestId, adminId = 'admin') => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return null;

    // Calculate expiry date based on duration
    const expiryDate = calculateExpiryDate(request.planDuration);
    const daysLeft = calculateDaysLeft(expiryDate);

    // Create approved member
    const approvedMember = {
      id: request.userId,
      
      // User Info
      name: request.userName,
      phone: request.userPhone,
      email: request.userEmail,
      photo: request.userPhoto,
      
      // Membership Info
      membershipType: 'premium',
      tierName: request.planName,
      planId: request.planId,
      workoutType: request.workoutType,
      template: request.planTemplate,
      features: request.planFeatures,
      
      // Dates
      startDate: new Date().toISOString(),
      expiryDate: expiryDate,
      daysLeft: daysLeft,
      
      // Payment Info
      paidAmount: request.planPrice,
      duration: request.planDuration,
      
      // Status
      isActive: true,
      approvedAt: new Date().toISOString(),
      approvedBy: adminId,
    };

    // Update request status
    const updatedRequests = requests.map(r => 
      r.id === requestId 
        ? { ...r, status: 'approved', processedAt: new Date().toISOString(), processedBy: adminId }
        : r
    );

    // Check if member already exists and update, or add new
    const existingMemberIndex = approvedMembers.findIndex(m => m.id === request.userId);
    let updatedMembers;
    
    if (existingMemberIndex >= 0) {
      updatedMembers = [...approvedMembers];
      updatedMembers[existingMemberIndex] = approvedMember;
    } else {
      updatedMembers = [approvedMember, ...approvedMembers];
    }

    setRequests(updatedRequests);
    setApprovedMembers(updatedMembers);
    
    await saveRequests(updatedRequests);
    await saveApprovedMembers(updatedMembers);

    return approvedMember;
  };

  // Admin rejects a request
  const rejectRequest = async (requestId, reason = '', adminId = 'admin') => {
    const updatedRequests = requests.map(r => 
      r.id === requestId 
        ? { 
            ...r, 
            status: 'rejected', 
            processedAt: new Date().toISOString(), 
            processedBy: adminId,
            rejectionReason: reason,
          }
        : r
    );

    setRequests(updatedRequests);
    await saveRequests(updatedRequests);
  };

  // Delete a request
  const deleteRequest = async (requestId) => {
    const updatedRequests = requests.filter(r => r.id !== requestId);
    setRequests(updatedRequests);
    await saveRequests(updatedRequests);
  };

  // Get pending requests
  const getPendingRequests = () => {
    return requests.filter(r => r.status === 'pending');
  };

  // Get approved requests
  const getApprovedRequests = () => {
    return requests.filter(r => r.status === 'approved');
  };

  // Get rejected requests
  const getRejectedRequests = () => {
    return requests.filter(r => r.status === 'rejected');
  };

  // Get active members
  const getActiveMembers = () => {
    return approvedMembers.filter(m => m.isActive);
  };

  // Get member by userId
  const getMemberById = (userId) => {
    return approvedMembers.find(m => m.id === userId);
  };

  // Check if user has pending request
  const hasPendingRequest = (userId) => {
    return requests.some(r => r.userId === userId && r.status === 'pending');
  };

  // Get user's request status
  const getUserRequestStatus = (userId) => {
    const userRequests = requests.filter(r => r.userId === userId);
    if (userRequests.length === 0) return null;
    
    // Return the most recent request
    return userRequests.sort((a, b) => 
      new Date(b.requestedAt) - new Date(a.requestedAt)
    )[0];
  };

  // Helper: Calculate expiry date
  const calculateExpiryDate = (duration) => {
    const now = new Date();
    let months = 1;
    
    if (duration.includes('3')) months = 3;
    else if (duration.includes('6')) months = 6;
    else if (duration.includes('12') || duration.toLowerCase().includes('year')) months = 12;
    
    now.setMonth(now.getMonth() + months);
    return now.toISOString();
  };

  // Helper: Calculate days left
  const calculateDaysLeft = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Refresh data

const refreshData = async () => {
  setLoading(true);
  try {
    await loadData();
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
  return Promise.resolve();
};

  return (
    <MembershipRequestsContext.Provider
      value={{
        requests,
        approvedMembers,
        loading,
        submitRequest,
        approveRequest,
        rejectRequest,
        deleteRequest,
        getPendingRequests,
        getApprovedRequests,
        getRejectedRequests,
        getActiveMembers,
        getMemberById,
        hasPendingRequest,
        getUserRequestStatus,
        refreshData,
      }}
    >
      {children}
    </MembershipRequestsContext.Provider>
  );
};

export default MembershipRequestsContext;