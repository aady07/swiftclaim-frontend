import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiArrowRight } from "react-icons/fi";

const Blog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Dummy blog data - will be replaced with S3 URLs later
  const blogPosts = [
    {
      id: 1,
      title: "How Vehicle Damage Assessment AI is Revolutionizing Auto Inspection",
      excerpt: "Discover how artificial intelligence is transforming the way we assess vehicle damage, providing instant, accurate analysis that saves time and reduces human error in the inspection process.",
      author: "Miraista Team",
      date: "January 15, 2025",
      readTime: "5 min read",
      category: "AI Technology",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=400&fit=crop",
      slug: "vehicle-damage-assessment-ai-revolution",
      // s3Url: "https://your-s3-bucket.s3.amazonaws.com/blog-1.html" // Will be used later
    },
    {
      id: 2,
      title: "Building Multi-Language Chatbots: Best Practices and Implementation",
      excerpt: "Learn the essential strategies for creating effective multi-language chatbot solutions that provide seamless customer support across different languages and cultural contexts.",
      author: "Miraista Team",
      date: "January 10, 2025",
      readTime: "7 min read",
      category: "Chatbot",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop",
      slug: "multi-language-chatbot-best-practices",
      // s3Url: "https://your-s3-bucket.s3.amazonaws.com/blog-2.html"
    },
    {
      id: 3,
      title: "Automated Motor Damage Detection: The Future of Vehicle Assessment",
      excerpt: "Explore how automated damage detection systems use advanced AI algorithms to identify and evaluate motor damage with unprecedented speed and accuracy, streamlining the entire assessment workflow.",
      author: "Miraista Team",
      date: "January 5, 2025",
      readTime: "6 min read",
      category: "AI Technology",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=400&fit=crop",
      slug: "automated-motor-damage-detection-future",
      // s3Url: "https://your-s3-bucket.s3.amazonaws.com/blog-3.html"
    }
  ];

  const categories = ["all", "AI Technology", "Chatbot"];

  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleBlogClick = (slug) => {
    // For now, just navigate to a detail page or open S3 URL
    // Later: window.open(post.s3Url, '_blank') or navigate to blog detail page
    console.log(`Opening blog: ${slug}`);
    // You can implement blog detail page later or directly open S3 URL
  };

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen">
      <Helmet>
        <title>Blog | Miraista - AI Technology & Chatbot Insights</title>
        <meta name="description" content="Read the latest articles about vehicle damage assessment AI, multi-language chatbots, and automated motor damage detection. Stay updated with Miraista's insights and innovations." />
        <meta name="keywords" content="AI blog, vehicle damage assessment blog, chatbot blog, AI technology articles, motor damage detection insights" />
        <link rel="canonical" href="https://www.miraista.com/blog" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white"
            >
              Blog
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-8"
            >
              Insights, updates, and stories about AI technology, vehicle damage assessment, and chatbot solutions
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 mb-12 justify-center"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                variants={fadeInUp}
                className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600 transition-all duration-300 cursor-pointer group"
                onClick={() => handleBlogClick(post.slug)}
                whileHover={{ y: -5 }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-700">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Author & Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <span className="text-sm text-gray-400">{post.author}</span>
                    <span className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all">
                      Read more
                      <FiArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-gray-400 text-lg">No posts found in this category.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
