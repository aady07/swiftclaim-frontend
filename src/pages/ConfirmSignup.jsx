import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useCognitoAuth } from '../hooks/useCognitoAuth';

const ConfirmSignup = () => {
  const { confirmSignUp, resendConfirmationCode, loading, error } = useCognitoAuth();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState('');
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [resent, setResent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await confirmSignUp(email, code);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setFormError(err.message || 'Confirmation failed');
    }
  };

  const handleResend = async () => {
    setFormError(null);
    setResent(false);
    try {
      await resendConfirmationCode(email);
      setResent(true);
    } catch (err) {
      setFormError(err.message || 'Resend failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-200">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Confirm Signup</h2>
        <p className="mb-4 text-center text-gray-400">Enter the code sent to <span className="font-semibold">{email}</span></p>
        <div className="mb-4">
          <label className="block mb-2">Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
            required
          />
        </div>
        {(formError || error) && (
          <div className="mb-4 text-red-400 text-center">{formError || error}</div>
        )}
        {resent && (
          <div className="mb-4 text-green-400 text-center">Code resent to your email.</div>
        )}
        {success ? (
          <div className="mb-4 text-green-400 text-center">Confirmed! Redirecting to login...</div>
        ) : (
          <>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition-colors mb-2"
              disabled={loading}
            >
              {loading ? 'Confirming...' : 'Confirm'}
            </button>
            <button
              type="button"
              onClick={handleResend}
              className="w-full py-2 bg-gray-700 hover:bg-gray-800 rounded text-white font-semibold transition-colors"
              disabled={loading}
            >
              Resend Code
            </button>
          </>
        )}
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-400 hover:underline">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ConfirmSignup; 