import { useState, useEffect } from 'react';

interface OnboardingState {
  isFirstVisit: boolean;
  hasCompletedTutorial: boolean;
  currentStep: number;
  completedSteps: number[];
  isOnboardingActive: boolean;
}

export function useOnboarding() {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isFirstVisit: true,
    hasCompletedTutorial: false,
    currentStep: 0,
    completedSteps: [],
    isOnboardingActive: false
  });

  useEffect(() => {
    // Check localStorage for existing onboarding state
    const savedState = localStorage.getItem('neural-web-labs-onboarding');
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setOnboardingState(prev => ({
          ...prev,
          ...parsed,
          isFirstVisit: false
        }));
      } catch (error) {
        console.warn('Failed to parse onboarding state from localStorage');
      }
    } else {
      // First visit - activate onboarding
      setOnboardingState(prev => ({
        ...prev,
        isOnboardingActive: true
      }));
    }
  }, []);

  const saveOnboardingState = (newState: Partial<OnboardingState>) => {
    const updatedState = { ...onboardingState, ...newState };
    setOnboardingState(updatedState);
    localStorage.setItem('neural-web-labs-onboarding', JSON.stringify(updatedState));
  };

  const completeOnboarding = () => {
    saveOnboardingState({
      hasCompletedTutorial: true,
      isOnboardingActive: false,
      isFirstVisit: false
    });
  };

  const skipOnboarding = () => {
    saveOnboardingState({
      isOnboardingActive: false,
      isFirstVisit: false
    });
  };

  const resetOnboarding = () => {
    localStorage.removeItem('neural-web-labs-onboarding');
    setOnboardingState({
      isFirstVisit: true,
      hasCompletedTutorial: false,
      currentStep: 0,
      completedSteps: [],
      isOnboardingActive: true
    });
  };

  const shouldShowOnboarding = () => {
    return onboardingState.isFirstVisit && onboardingState.isOnboardingActive;
  };

  return {
    onboardingState,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    shouldShowOnboarding,
    saveOnboardingState
  };
}