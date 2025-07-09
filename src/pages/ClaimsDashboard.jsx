import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';

const ClaimsDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all claims from the backend
  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://testing.aadybackend.site/api/claims');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch claims`);
      }
      const data = await response.json();
      setClaims(data);
    } catch (err) {
      console.error('Error fetching claims:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

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

  // Filter claims based on status and search term
  const filteredClaims = claims.filter(claim => {
    const matchesStatus = filterStatus === 'all' || claim.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      claim.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toString().includes(searchTerm);
    
    return matchesStatus && matchesSearch;
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
      const response = await fetch(`https://testing.aadybackend.site/api/claims/${claimId}/original-image`);
      console.log('Status:', response.status);
      console.log('Headers:', [...response.headers.entries()]);
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.startsWith('image/')) {
        const blob = await response.blob();
        console.log('Image Blob:', blob);
        // Optionally, create a URL to preview the image in the console
        const imageUrl = URL.createObjectURL(blob);
        console.log('Image Preview URL:', imageUrl);
      } else {
        const text = await response.text();
        console.log('Non-image response:', text);
      }
    } catch (err) {
      console.error('Error fetching original image:', err);
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
        <title>Claims Dashboard | Miraista</title>
        <meta name="description" content="View and manage all your insurance claims in one comprehensive dashboard." />
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 text-sm font-medium">CLAIMS DASHBOARD</span>
              </motion.span>
              
              <motion.h1 
                className="text-4xl font-bold leading-tight text-white sm:text-5xl"
              >
                Your Claims Overview
              </motion.h1>
              
              <motion.p 
                className="mt-4 text-lg text-gray-300"
              >
                Track and manage all your insurance claims in one place
              </motion.p>
            </div>

            <motion.div
              className="mt-6 md:mt-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/claimupload"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Claim
              </Link>
            </motion.div>
          </div>

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
                  <p className="text-gray-400 text-sm">Total Claims</p>
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
                  <p className="text-gray-400 text-sm">Processed</p>
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
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search claims..."
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
              <h2 className="text-2xl font-bold text-white">All Claims ({filteredClaims.length})</h2>
            </div>

            {filteredClaims.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-white mb-2">No claims found</h3>
                <p className="text-gray-400">Try adjusting your filters or search terms</p>
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
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredClaims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-white">#{claim.id}</td>
                        <td className="px-6 py-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-600 bg-gray-700">
                            <img 
                              src={`https://testing.aadybackend.site/api/claims/${claim.id}/original-image`}
                              alt="Claim image"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="hidden w-full h-full items-center justify-center text-gray-400 text-xs">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
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
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedClaim(claim);
                              logOriginalImageResponse(claim.id);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
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
                <h3 className="text-xl font-bold text-white">Claim Details #{selectedClaim.id}</h3>
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

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Original Image</h4>
                  <img 
                    src={`https://testing.aadybackend.site/api/claims/${selectedClaim.id}/original-image`}
                    alt="Original damage" 
                    className="w-full rounded-lg border border-gray-600"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="hidden p-4 bg-gray-700/50 rounded-lg border border-gray-600 text-center">
                    <p className="text-gray-400">Original image not available</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Processed Image</h4>
                  <img 
                    src={`https://testing.aadybackend.site/api/claims/${selectedClaim.id}/processed-image`}
                    alt="Processed damage" 
                    className="w-full rounded-lg border border-gray-600"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="hidden p-4 bg-gray-700/50 rounded-lg border border-gray-600 text-center">
                    <p className="text-gray-400">Processed image not available</p>
                  </div>
                </div>

                {selectedClaim.errorMessage && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Error Message</h4>
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm">{selectedClaim.errorMessage}</p>
                    </div>
                  </div>
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