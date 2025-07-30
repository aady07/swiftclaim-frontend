import { useState, useEffect, useCallback } from 'react';
import { cognitoService } from '../services/cognitoService';

export function useCognitoAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔐 [AUTH] Refreshing user state');
      const currentUser = cognitoService.getCurrentUser();
      console.log('🔐 [AUTH] Current user:', currentUser ? 'Found' : 'Not found');
      if (currentUser) {
        const session = await cognitoService.getSession();
        console.log('🔐 [AUTH] Session:', session ? 'Valid' : 'Invalid');
        setUser({ ...currentUser, session });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('🔐 [AUTH] Error refreshing user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signUp = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const result = await cognitoService.signUp(email, password);
      await refreshUser();
      return result;
    } catch (err) {
      setError(err.message || 'Sign up failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmSignUp = async (email, code) => {
    setError(null);
    setLoading(true);
    try {
      const result = await cognitoService.confirmSignUp(email, code);
      return result;
    } catch (err) {
      setError(err.message || 'Confirmation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationCode = async (email) => {
    setError(null);
    setLoading(true);
    try {
      const result = await cognitoService.resendConfirmationCode(email);
      return result;
    } catch (err) {
      setError(err.message || 'Resend failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setError(null);
    setLoading(true);
    try {
      const result = await cognitoService.forgotPassword(email);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to send reset code');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmForgotPassword = async (email, code, newPassword) => {
    setError(null);
    setLoading(true);
    try {
      const result = await cognitoService.confirmForgotPassword(email, code, newPassword);
      return result;
    } catch (err) {
      setError(err.message || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      console.log('🔐 [AUTH] Starting sign in process');
      const result = await cognitoService.signIn(email, password);
      console.log('🔐 [AUTH] Sign in successful, refreshing user state');
      await refreshUser();
      console.log('🔐 [AUTH] User state refreshed');
      return result;
    } catch (err) {
      console.error('🔐 [AUTH] Sign in failed:', err);
      setError(err.message || 'Sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      cognitoService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Get current user ID from JWT token
  const getUserId = async () => {
    try {
      return await cognitoService.getUserId();
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  // Get current user email from JWT token
  const getUserEmail = async () => {
    try {
      return await cognitoService.getUserEmail();
    } catch (error) {
      console.error('Error getting user email:', error);
      return null;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = async () => {
    try {
      return await cognitoService.isAuthenticated();
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    refreshUser,
    confirmSignUp,
    resendConfirmationCode,
    forgotPassword,
    confirmForgotPassword,
    getUserId,
    getUserEmail,
    isAuthenticated,
  };
} 