import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'ap-south-1_BnYv7pRT9', // updated pool ID
  ClientId: 'n36pk1771v3q4lguasrdgg63j', // updated client ID
};

const userPool = new CognitoUserPool(poolData);

export const cognitoService = {
  signUp: (email, password) => {
    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, [], null, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  confirmSignUp: (email, code) => {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username: email, Pool: userPool });
      user.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  resendConfirmationCode: (email) => {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username: email, Pool: userPool });
      user.resendConfirmationCode((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  signIn: (email, password) => {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username: email, Pool: userPool });
      const authDetails = new AuthenticationDetails({ Username: email, Password: password });
      user.authenticateUser(authDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  },

  forgotPassword: (email) => {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username: email, Pool: userPool });
      user.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  },

  confirmForgotPassword: (email, code, newPassword) => {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username: email, Pool: userPool });
      user.confirmPassword(code, newPassword, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  },

  signOut: () => {
    const user = userPool.getCurrentUser();
    if (user) {
      user.signOut();
    }
  },

  getCurrentUser: () => {
    return userPool.getCurrentUser();
  },

  getSession: () => {
    return new Promise((resolve, reject) => {
      const user = userPool.getCurrentUser();
      if (!user) return resolve(null);
      user.getSession((err, session) => {
        if (err) return reject(err);
        resolve(session);
      });
    });
  },

  // Get the JWT access token for API calls
  getAccessToken: async () => {
    try {
      const session = await cognitoService.getSession();
      if (!session) {
        throw new Error('No active session found');
      }
      return session.getAccessToken().getJwtToken();
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  },

  // Get the JWT ID token (contains user information)
  getIdToken: async () => {
    try {
      const session = await cognitoService.getSession();
      if (!session) {
        throw new Error('No active session found');
      }
      return session.getIdToken().getJwtToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      throw error;
    }
  },

  // Get user ID from the JWT token
  getUserId: async () => {
    try {
      const idToken = await cognitoService.getIdToken();
      if (!idToken) {
        throw new Error('No ID token available');
      }
      
      // Decode the JWT token to get user information
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      return payload.sub; // 'sub' is the user ID in Cognito
    } catch (error) {
      console.error('Error getting user ID:', error);
      throw error;
    }
  },

  // Get user email from the JWT token
  getUserEmail: async () => {
    try {
      const idToken = await cognitoService.getIdToken();
      if (!idToken) {
        throw new Error('No ID token available');
      }
      
      // Decode the JWT token to get user information
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      return payload.email; // 'email' is the user email in Cognito
    } catch (error) {
      console.error('Error getting user email:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const session = await cognitoService.getSession();
      return session && session.isValid();
    } catch (error) {
      return false;
    }
  },
}; 