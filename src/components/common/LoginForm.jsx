import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCognitoAuth } from '../../hooks/useCognitoAuth';

const LoginForm = ({ onLoginSuccess }) => {
  const { signIn, loading, error } = useCognitoAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await signIn(email, password);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigate('/claimupload');
      }
    } catch (err) {
      setFormError(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative bg-gray-900/90 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 backdrop-blur-md">
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2 shadow-lg">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1e293b" /><path d="M8 12l2 2 4-4" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h2 className="text-3xl font-extrabold mb-6 text-center tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">Login to Your Account</h2>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-400">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-200 placeholder-gray-500"
          required
          placeholder="you@email.com"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-400">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-200 placeholder-gray-500"
          required
          placeholder="••••••••"
        />
      </div>
      {(formError || error) && (
        <div className="mb-4 text-red-400 text-center font-semibold animate-pulse">{formError || error}</div>
      )}
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-bold text-lg shadow-lg transition-all duration-200 mb-2"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div className="mt-4 text-center text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-400 hover:underline font-semibold">Sign up</Link>
      </div>
    </form>
  );
};

export default LoginForm; 