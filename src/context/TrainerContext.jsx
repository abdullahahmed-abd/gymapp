// src/context/TrainerContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const TrainerContext = createContext(null);

export const TrainerProvider = ({ children }) => {
  // trainers: { [memberId]: { id, name, memberId, assignedAt } }
  const [trainers, setTrainers] = useState({});

  // ── Add Trainer (Direct - No request needed) ──
  const addTrainer = useCallback(async (memberId, memberName, memberMemberId) => {
    setTrainers((prev) => ({
      ...prev,
      [memberId]: {
        id: memberId,
        name: memberName,
        memberId: memberMemberId || memberId,
        assignedAt: new Date().toISOString(),
      },
    }));
  }, []);

  // ── Remove Trainer ──
  const removeTrainer = useCallback(async (memberId) => {
    setTrainers((prev) => {
      const updated = { ...prev };
      delete updated[memberId];
      return updated;
    });
  }, []);

  // ── Check if member is a trainer ──
  const isTrainer = useCallback(
    (memberId) => !!trainers[memberId],
    [trainers]
  );

  // ── Get trainer data ──
  const getTrainer = useCallback(
    (memberId) => trainers[memberId] || null,
    [trainers]
  );

  // ── Get ALL trainers as array ──
  const getAllTrainers = useCallback(() => {
    return Object.values(trainers);
  }, [trainers]);

  // ── Get count of trainers ──
  const getTrainerCount = useCallback(() => {
    return Object.keys(trainers).length;
  }, [trainers]);

  return (
    <TrainerContext.Provider
      value={{
        trainers,
        addTrainer,
        removeTrainer,
        isTrainer,
        getTrainer,
        getAllTrainers,
        getTrainerCount,
      }}
    >
      {children}
    </TrainerContext.Provider>
  );
};

export const useTrainer = () => {
  const context = useContext(TrainerContext);
  if (!context) {
    throw new Error('useTrainer must be used within TrainerProvider');
  }
  return context;
};