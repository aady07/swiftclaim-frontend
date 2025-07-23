import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from "react-helmet";
import { Link, useNavigate } from 'react-router-dom';
import { authenticatedApiService } from '../services/api/authenticatedApiService';
import { useCognitoAuth } from '../hooks/useCognitoAuth';

const ClaimsDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [originalImageUrls, setOriginalImageUrls] = useState({});
  const [model1ImageUrls, setModel1ImageUrls] = useState({});
  const [model2ImageUrls, setModel2ImageUrls] = useState({});
  const [claimResultsMap, setClaimResultsMap] = useState({}); // claimId -> results
  const [resultsLoadingMap, setResultsLoadingMap] = useState({});
  const [resultsErrorMap, setResultsErrorMap] = useState({});
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'oldest'
  const { signOut } = useCognitoAuth();
  const navigate = useNavigate();

  // Fetch all claims from the backend using authenticated API
  const fetchClaims = async () => {
    try {
      setLoading(true);
      const data = await authenticatedApiService.claims.getAllClaims();
      
      // Handle empty or null response from backend
      if (!data || !Array.isArray(data)) {
        console.log('🔍 [CLAIMS] Backend returned empty or invalid data, setting empty array');
        setClaims([]);
        return;
      }
      
      setClaims(data);
      console.log(`🔍 [CLAIMS] Successfully loaded ${data.length} claims`);
    } catch (err) {
      console.error('Error fetching claims:', err);
      
      // If it's a network error or backend is down, show empty state instead of error
      if (err.message.includes('Failed to fetch') || err.message.includes('Network Error')) {
        console.log('🔍 [CLAIMS] Backend unavailable, showing empty state');
        setClaims([]);
        setError(null); // Don't show error, just empty state
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // Load image URLs when claims change
  useEffect(() => {
    const loadImageUrls = async () => {
      const orig = {}, m1 = {}, m2 = {};
      for (const claim of claims) {
        let tries = 0;
        let success = false;
        while (tries < 3 && !success) {
          try {
            const [o, m1b, m2b] = await Promise.all([
              authenticatedApiService.claims.getOriginalImage(claim.id),
              authenticatedApiService.claims.getModel1Image(claim.id),
              authenticatedApiService.claims.getModel2Image(claim.id)
            ]);
            orig[claim.id] = URL.createObjectURL(o);
            m1[claim.id] = URL.createObjectURL(m1b);
            m2[claim.id] = URL.createObjectURL(m2b);
            success = true;
          } catch (err) {
            tries++;
            if (tries >= 3) {
              orig[claim.id] = null;
              m1[claim.id] = null;
              m2[claim.id] = null;
            }
          }
        }
      }
      setOriginalImageUrls(orig);
      setModel1ImageUrls(m1);
      setModel2ImageUrls(m2);
    };
    if (claims.length > 0) loadImageUrls();
  }, [claims]);

  // Fetch claim results for a specific claim
  const fetchClaimResults = async (claimId) => {
    setResultsLoadingMap((prev) => ({ ...prev, [claimId]: true }));
    setResultsErrorMap((prev) => ({ ...prev, [claimId]: null }));
    try {
      const results = await authenticatedApiService.claims.getClaimResults(claimId);
      setClaimResultsMap((prev) => ({ ...prev, [claimId]: results }));
    } catch (err) {
      setResultsErrorMap((prev) => ({ ...prev, [claimId]: 'Failed to fetch claim results.' }));
    } finally {
      setResultsLoadingMap((prev) => ({ ...prev, [claimId]: false }));
    }
  };

  // Fetch results for all claims after loading claims
  useEffect(() => {
    if (claims.length > 0) {
      claims.forEach((claim) => {
        fetchClaimResults(claim.id);
      });
    }
    // eslint-disable-next-line
  }, [claims]);

  // Calculate statistics
  const getTotalClaims = () => claims.length;
  
  const getClaimsByStatus = () => {
    const statusCount = {
      pending: 0,
      processing: 0,
      processed: 0,
      error: 0,
      approved: 0,
      rejected: 0
    };
    
    claims.forEach(claim => {
      statusCount[claim.status] = (statusCount[claim.status] || 0) + 1;
    });
    
    return statusCount;
  };

  const getClaimsByMake = () => {
    const makeCount = {};
    claims.forEach(claim => {
      makeCount[claim.make] = (makeCount[claim.make] || 0) + 1;
    });
    return makeCount;
  };

  const getRecentClaims = (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return claims.filter(claim => {
      const claimDate = new Date(claim.createdAt);
      return claimDate >= cutoffDate;
    });
  };

  // Filter and sort claims based on status, search term, and sort order
  const filteredClaims = claims
    .filter(claim => {
      const matchesStatus = filterStatus === 'all' || claim.status === filterStatus;
      const matchesSearch = searchTerm === '' || 
        claim.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.id.toString().includes(searchTerm);
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

  const statusCount = getClaimsByStatus();
  const makeCount = getClaimsByMake();
  const recentClaims = getRecentClaims();

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'approved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rejected': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const logOriginalImageResponse = async (claimId) => {
    try {
      const blob = await authenticatedApiService.claims.getOriginalImage(claimId);
      console.log('Image Blob:', blob);
      // Optionally, create a URL to preview the image in the console
      const imageUrl = URL.createObjectURL(blob);
      console.log('Image Preview URL:', imageUrl);
    } catch (err) {
      console.error('Error fetching original image:', err);
    }
  };

  // Function to get authenticated image URL
  const getAuthenticatedImageUrl = async (claimId, imageType = 'original') => {
    try {
      const blob = imageType === 'original' 
        ? await authenticatedApiService.claims.getOriginalImage(claimId)
        : await authenticatedApiService.claims.getProcessedImage(claimId);
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error(`Error getting ${imageType} image:`, err);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-950 text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading your claims dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-950 text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={fetchClaims}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-gray-200 overflow-hidden">
      <Helmet>
        <title>Assessment Dashboard | Miraista</title>
        <meta name="description" content="View and manage all your car damage assessments in one comprehensive dashboard." />
      </Helmet>

      <motion.div
        className="relative min-h-screen overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white opacity-70"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                opacity: [0.7, 0.1, 0.7],
                scale: [1, Math.random() * 1.5, 1]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <motion.span 
                className="mb-1.5 inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/10 to-blue-600/10 rounded-full backdrop-blur-sm border border-green-200/20"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 text-sm font-medium">ASSESSMENT DASHBOARD</span>
              </motion.span>
              
              <motion.h1 
                className="text-4xl font-bold leading-tight text-white sm:text-5xl"
              >
                Assessment Overview
              </motion.h1>
              
              <motion.p 
                className="mt-4 text-lg text-gray-300"
              >
                Track and manage all your car damage assessments in one place
              </motion.p>
            </div>

            <motion.div
              className="mt-6 md:mt-0 flex gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/imageupload"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Upload Car Image
              </Link>
              
              <button
                onClick={fetchClaims}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                <svg className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <button
                onClick={async () => {
                  await signOut();
                  navigate('/login');
                }}
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </motion.div>
          </div>

          {/* Status Indicator */}
          {claims.length === 0 && !loading && (
            <motion.div 
              className="mb-6 p-4 rounded-xl bg-blue-500/10 backdrop-blur-sm border border-blue-500/30"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-400 text-sm font-medium">
                  {error ? 'Backend temporarily unavailable' : 'No assessments found – ready to start'}
                </span>
                {error && (
                  <button
                    onClick={fetchClaims}
                    className="ml-auto text-blue-400 hover:text-blue-300 text-sm underline"
                  >
                    Retry
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Statistics Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-6 rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Assessments</p>
                  <p className="text-3xl font-bold text-white">{getTotalClaims()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-green-400">{statusCount.processed}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Errors</p>
                  <p className="text-3xl font-bold text-red-400">{statusCount.error}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Recent (7 days)</p>
                  <p className="text-3xl font-bold text-blue-400">{recentClaims.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>



          {/* Filters and Search */}
          <motion.div 
            className="mb-8 p-6 rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="processed">Processed</option>
                  <option value="error">Error</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="latest">Sort: Latest</option>
                  <option value="oldest">Sort: Oldest</option>
                </select>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Claims Table */}
          <motion.div 
            className="rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">All Assessments ({filteredClaims.length})</h2>
            </div>

            {filteredClaims.length === 0 ? (
              <div className="p-12 text-center">
                {claims.length === 0 ? (
                  // No claims at all (empty database or backend issue)
                  <>
                    <div className="text-gray-400 text-6xl mb-4">🚀</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Welcome to Your Assessment Dashboard!</h3>
                    <p className="text-gray-400 mb-6">You haven't submitted any car images yet. Start by uploading your first car image.</p>
                    <Link
                      to="/imageupload"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Upload Your First Car Image
                    </Link>
                  </>
                ) : (
                  // Claims exist but filtered out
                  <>
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No assessments match your filters</h3>
                    <p className="text-gray-400 mb-4">Try adjusting your search terms or status filter</p>
                    <button
                      onClick={() => {
                        setFilterStatus('all');
                        setSearchTerm('');
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Clear Filters
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Car</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Created</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">AI Label</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">AI Confidence</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredClaims.map((claim) => {
                      const results = claimResultsMap[claim.id];
                      const loading = resultsLoadingMap[claim.id];
                      const error = resultsErrorMap[claim.id];
                      // Show first model output as summary
                      const firstModel = results && results.modelOutputs && results.modelOutputs[0];
                      return (
                        <tr key={claim.id} className="hover:bg-gray-700/30 transition-colors">
                          <td className="px-6 py-4 text-sm text-white">#{claim.id}</td>
                          <td className="px-6 py-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-600 bg-gray-700">
                              {originalImageUrls[claim.id] ? (
                                <img 
                                  src={originalImageUrls[claim.id]}
                                  alt="Claim image"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{claim.userId}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            <div>
                              <div className="font-medium text-white">{claim.make}</div>
                              <div className="text-gray-400">{claim.model}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                              {claim.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{formatDate(claim.createdAt)}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {loading ? 'Loading...' : error ? 'Error' : firstModel ? firstModel.label : '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {loading ? '...' : error ? '-' : firstModel && firstModel.confidence !== undefined ? `${(firstModel.confidence * 100).toFixed(2)}%` : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setSelectedClaim(claim);
                                // Optionally re-fetch results for modal
                                fetchClaimResults(claim.id);
                              }}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
        {/* Claim Details Modal */}
        {selectedClaim && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Assessment Details #{selectedClaim.id}</h3>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">User ID</h4>
                    <p className="text-white">{selectedClaim.userId}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Status</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedClaim.status)}`}>
                      {selectedClaim.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Car Make</h4>
                    <p className="text-white">{selectedClaim.make}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Car Model</h4>
                    <p className="text-white">{selectedClaim.model}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Created</h4>
                    <p className="text-white">{formatDate(selectedClaim.createdAt)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Updated</h4>
                    <p className="text-white">{formatDate(selectedClaim.updatedAt)}</p>
                  </div>
                </div>

                {resultsLoadingMap[selectedClaim.id] ? (
                  <div className="text-center py-8">Loading AI results...</div>
                ) : resultsErrorMap[selectedClaim.id] ? (
                  <div className="text-center py-8 text-red-400">{resultsErrorMap[selectedClaim.id]}</div>
                ) : claimResultsMap[selectedClaim.id] ? (
                  (() => {
                    const modelOutputs = claimResultsMap[selectedClaim.id].modelOutputs || [];
                    const costings = claimResultsMap[selectedClaim.id].costings || [];
                    const model1 = modelOutputs.find(m => m.modelNumber === 1) || modelOutputs[0] || {};
                    const model2 = modelOutputs.find(m => m.modelNumber === 2) || {};
                    const formatConfidence = (conf) => conf !== undefined && conf !== null ? `${(parseFloat(conf) * 100).toFixed(2)}%` : 'N/A';
                    const formatPartName = (part) => part ? part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';
                    const getLabelColor = (label) => label && label.toLowerCase().includes('dent') ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30';
                    return (
                      <>
                        {/* Main tags at the top */}
                        <div className="flex flex-col items-center gap-2 mb-6">
                          <span className="inline-block px-5 py-2 rounded-full text-lg font-bold border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            Confidence: {formatConfidence(model1.confidence)}
                          </span>
                          <span className={`inline-block px-4 py-1 rounded-full text-base font-bold border ${getLabelColor(model1.label)}`}>
                            Damage Type: {model1.label || 'No Dent'}
                          </span>
                          {model2 && model2.label && (
                            <span className="inline-block px-4 py-1 rounded-full text-base font-medium border bg-blue-500/20 text-blue-400 border-blue-500/30">
                              Damage Part: {formatPartName(model2.label)}
                            </span>
                          )}
                        </div>
                        {/* Images section: processed images side by side, then original */}
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                          <div className="flex-1 flex flex-col items-center">
                            <span className="text-sm text-gray-400 mb-1">Processed Image 1</span>
                            {model1ImageUrls[selectedClaim.id] ? (
                              <img src={model1ImageUrls[selectedClaim.id]} alt="Processed 1" className="w-full max-h-64 object-contain rounded border border-gray-600" />
                            ) : (
                              <div className="w-full h-64 flex items-center justify-center text-gray-500 border border-gray-600 rounded">No image</div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col items-center">
                            <span className="text-sm text-gray-400 mb-1">Processed Image 2</span>
                            {model2ImageUrls[selectedClaim.id] ? (
                              <img src={model2ImageUrls[selectedClaim.id]} alt="Processed 2" className="w-full max-h-64 object-contain rounded border border-gray-600" />
                            ) : (
                              <div className="w-full h-64 flex items-center justify-center text-gray-500 border border-gray-600 rounded">No image</div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-center mb-4">
                          <span className="text-sm text-gray-400 mb-1">Original Image</span>
                          {originalImageUrls[selectedClaim.id] ? (
                            <img src={originalImageUrls[selectedClaim.id]} alt="Original" className="w-full max-h-64 object-contain rounded border border-gray-600" />
                          ) : (
                            <div className="w-full h-64 flex items-center justify-center text-gray-500 border border-gray-600 rounded">No image</div>
                          )}
                        </div>
                        {/* Costings section */}
                        <div className="mb-4">
                          <span className="text-lg font-semibold text-gray-300 mb-2 block">Costings</span>
                          {costings.length === 0 ? (
                            <div className="text-gray-400">No costings available.</div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {costings.map((cost, idx) => (
                                <div key={cost.id || idx} className="bg-gray-800/30 p-4 rounded-lg border border-gray-700 flex flex-col gap-2">
                                  <div className="flex flex-wrap gap-2 items-center mb-2">
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-blue-500/20 text-blue-400 border-blue-500/30">{formatPartName(cost.part)}</span>
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-green-500/20 text-green-400 border-green-500/30">₹{cost.price}</span>
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{cost.confidence || 'N/A'}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Costings and rest of modal ... */}
                      </>
                    );
                  })()
                ) : (
                  <div className="text-center py-8 text-gray-400">No AI results available.</div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ClaimsDashboard; 