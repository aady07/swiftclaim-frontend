import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCognitoAuth } from '../hooks/useCognitoAuth';

const ForgotPassword = () => {
  const { forgotPassword, loading, error } = useCognitoAuth();
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await forgotPassword(email);
      setSuccess(true);
      // Navigate to reset password page with email
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to send reset code');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-200">
      <div className="relative bg-gray-900/90 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 backdrop-blur-md">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-red-600 rounded-full p-2 shadow-lg">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#1e293b" />
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h2 className="text-3xl font-extrabold mb-6 text-center tracking-tight bg-gradient-to-r from-orange-400 to-red-400 text-transparent bg-clip-text">
          Forgot Password
        </h2>
        
        {success ? (
          <div className="text-center">
            <div className="text-green-400 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-white mb-2">Reset Code Sent!</h3>
            <p className="text-gray-400 mb-4">
              We've sent a verification code to <span className="font-semibold text-white">{email}</span>
            </p>
            <p className="text-gray-400 text-sm">
              Redirecting to reset page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-gray-400 mb-6 text-center">
              Enter your email address and we'll send you a code to reset your password.
            </p>
            
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-600 text-gray-200 placeholder-gray-500"
                required
                placeholder="you@email.com"
              />
            </div>
            
            {(formError || error) && (
              <div className="mb-4 text-red-400 text-center font-semibold animate-pulse">
                {formError || error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg text-white font-bold text-lg shadow-lg transition-all duration-200 mb-4"
              disabled={loading}
            >
              {loading ? 'Sending Code...' : 'Send Reset Code'}
            </button>
            
            <div className="text-center">
              <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 