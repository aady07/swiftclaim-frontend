import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCognitoAuth } from '../hooks/useCognitoAuth';
import LoginForm from '../components/common/LoginForm';

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-200">
      <LoginForm />
    </div>
  );
};

export default Login; 