import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import { FiCheck, FiArrowRight } from "react-icons/fi";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const SectionHeader = ({ label, title, description }) => (
  <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12 max-w-3xl mx-auto">
    {label && (
      <motion.span variants={fadeInUp} className="inline-block text-green-400 uppercase tracking-wider text-sm font-semibold mb-3">
        {label}
      </motion.span>
    )}
    <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
      {title}
    </motion.h2>
    {description && (
      <motion.p variants={fadeInUp} className="text-gray-400 text-lg">
        {description}
      </motion.p>
    )}
    <motion.div variants={fadeInUp} className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-600 mx-auto mt-6" />
  </motion.div>
);

const LENDOS_HERO_IMAGES = [
  "https://d1194rs9ausm91.cloudfront.net/images/lendos/hero.png",
  "https://d1194rs9ausm91.cloudfront.net/images/lendos/hero1.png",
  "https://d1194rs9ausm91.cloudfront.net/images/lendos/hero2.png",
];

const LendOS = () => {
  const navigate = useNavigate();
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % LENDOS_HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const challengeItems = [
    "Long turnaround times",
    "High operational costs",
    "Poor customer experience",
    "Low conversion rates",
    "Difficult integrations",
    "Limited scalability",
  ];

  const solutionItems = [
    "Credit Decisions in Under 10 Seconds",
    "Real-Time Underwriting",
    "Instant Loan Offer Generation",
    "Automated Loan Disbursals",
    "AI-Powered Risk Assessment",
    "Collections & Portfolio Monitoring",
    "Configurable Lending Workflows",
  ];

  const platformCapabilities = [
    {
      title: "Customer Acquisition & Onboarding",
      items: ["Digital Applications", "Lead Management", "eKYC", "OCR", "Document Verification", "Customer Verification"],
    },
    {
      title: "Credit Decisioning Engine",
      items: ["Rule Engine", "AI Risk Models", "Credit Bureau Integration", "Alternative Data", "Affordability Assessment", "Fraud Detection"],
    },
    {
      title: "Loan Origination & Disbursal",
      items: ["Automated Underwriting", "Instant Offer Generation", "Digital Agreements", "Account Validation", "Real-Time Disbursals"],
    },
    {
      title: "Collections & Recovery",
      items: ["Collections Workflows", "Payment Tracking", "Customer Communications", "Delinquency Monitoring", "Recovery Analytics"],
    },
    {
      title: "Portfolio Management",
      items: ["Real-Time Dashboards", "Risk Monitoring", "Portfolio Performance", "Vintage Analysis", "Regulatory Reporting"],
    },
  ];

  const whyLendOS = [
    {
      title: "Credit Decisions in Under 10 Seconds",
      description: "Deliver real-time underwriting and loan decisions using AI-powered risk models and configurable decision engines.",
    },
    {
      title: "End-to-End Automation",
      description: "Automate the entire lending lifecycle from origination to collections.",
    },
    {
      title: "Modular & Configurable",
      description: "Deploy the complete platform or select individual modules based on business needs.",
    },
    {
      title: "Enterprise Ready",
      description: "Built for Banks, NBFCs, Fintechs, and Embedded Finance ecosystems.",
    },
  ];

  const modules = [
    "Digital Onboarding",
    "OCR & Document Processing",
    "Credit Bureau Integration",
    "Account Aggregator",
    "Fraud Detection",
    "AI Decision Engine",
    "Pricing Engine",
    "Loan Origination System",
    "Collections Engine",
    "Portfolio Analytics",
    "Customer 360",
    "AI Assistant",
  ];

  const industries = [
    { name: "Banks", description: "Accelerate digital lending and improve customer acquisition." },
    { name: "NBFCs", description: "Scale originations while maintaining control over risk." },
    { name: "Fintechs", description: "Launch lending products faster with API-first infrastructure." },
    { name: "Embedded Finance Providers", description: "Offer lending directly within your customer journeys." },
  ];

  const techAdvantages = [
    "API First",
    "Microservices Architecture",
    "AI-Powered Decisioning",
    "Real-Time Processing",
    "Enterprise Security",
    "Scalable Infrastructure",
    "Multi-Tenant Support",
    "Role-Based Access Control",
  ];

  const businessImpact = [
    { value: "10 Seconds", label: "Credit Decisioning Time" },
    { value: "80%+", label: "Reduction in Manual Processing" },
    { value: "24x7", label: "Automated Lending Operations" },
    { value: "100%", label: "Configurable Risk Policies" },
  ];

  const trustInstitutions = ["Banks", "NBFCs", "Fintechs", "Embedded Finance Providers", "Lending Marketplaces"];

  return (
    <div className="bg-gray-950 text-gray-200 overflow-hidden">
      <Helmet>
        <title>LendOS | AI-Powered Digital Lending Platform for Banks, NBFCs & Fintechs</title>
        <meta
          name="description"
          content="LendOS is an AI-powered end-to-end digital lending platform that enables Banks, NBFCs, and Fintechs to automate onboarding, underwriting, instant credit decisioning, loan disbursals, collections, and portfolio management through a single configurable infrastructure platform."
        />
        <meta
          name="keywords"
          content="LendOS, digital lending platform, AI lending, credit decisioning, loan disbursal, NBFC lending software, fintech lending, embedded finance, lending marketplace"
        />
        <meta property="og:title" content="LendOS | AI-Powered Digital Lending Platform for Banks, NBFCs & Fintechs" />
        <meta
          property="og:description"
          content="Automate onboarding, underwriting, instant credit decisioning, loan disbursals, collections, and portfolio management through a single configurable platform."
        />
        <meta property="og:image" content="https://d1194rs9ausm91.cloudfront.net/images/lendos/hero2.png" />
        <meta property="og:url" content="https://www.miraista.com/lendos" />
        <link rel="canonical" href="https://www.miraista.com/lendos" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "LendOS",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            description:
              "AI-Powered End-to-End Digital Lending Platform for Instant Credit Decisioning, Disbursals & Collections",
            provider: { "@type": "Organization", name: "Miraista", url: "https://www.miraista.com" },
            image: "https://d1194rs9ausm91.cloudfront.net/images/lendos/hero2.png",
          })}
        </script>
      </Helmet>

      {/* Hero — centered layout, distinct from homepage carousel */}
      <section className="relative overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-green-500/5 via-blue-500/10 to-green-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <span className="text-green-400 font-bold text-lg">Lend</span>
              <span className="text-blue-400 font-bold text-lg">OS</span>
              <span className="text-gray-500 text-sm">| Digital Lending</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-white leading-tight mb-6">
              AI-Powered End-to-End Digital Lending Platform for Instant Credit Decisioning, Disbursals & Collections
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-gray-300 mb-3 max-w-3xl mx-auto leading-relaxed">
              Generate personalized loan offers and complete loan disbursals in under 10 seconds—even for customers with no prior relationship with the lender.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-base text-gray-500 mb-8 max-w-3xl mx-auto leading-relaxed">
              Automate the entire lending lifecycle from customer onboarding and underwriting to disbursals, collections, and portfolio management through a single configurable platform.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-6 mb-10">
              {[
                { value: "<10s", label: "Credit Decisions" },
                { value: "24/7", label: "Automated Ops" },
                { value: "100%", label: "Configurable" },
              ].map((stat) => (
                <div key={stat.label} className="text-center px-4">
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/contacts")}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl text-lg font-semibold shadow-lg shadow-green-500/25"
              >
                Request Demo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/contacts")}
                className="px-8 py-4 bg-gray-800/80 backdrop-blur-sm text-gray-200 rounded-xl text-lg font-semibold border-2 border-blue-500/30 hover:border-blue-500/50"
              >
                Book a Consultation
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Full-width image showcase with auto slideshow */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="p-1.5 rounded-2xl bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 shadow-2xl shadow-blue-500/15">
              <div className="rounded-2xl bg-gray-950/90 p-3 sm:p-4">
                <div className="relative h-[280px] sm:h-[340px] lg:h-[400px] flex items-center justify-center overflow-hidden rounded-xl">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={LENDOS_HERO_IMAGES[heroImageIndex]}
                      src={LENDOS_HERO_IMAGES[heroImageIndex]}
                      alt="LendOS AI-Powered Lending Platform"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full object-contain"
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-5">
              {LENDOS_HERO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroImageIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    heroImageIndex === idx
                      ? "w-8 bg-gradient-to-r from-blue-500 to-green-500"
                      : "w-2 bg-gray-600 hover:bg-gray-500"
                  }`}
                  aria-label={`View LendOS image ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Built for Modern Financial Institutions</p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-6">
            {trustInstitutions.map((item) => (
              <span key={item} className="text-gray-300 font-medium text-sm md:text-base">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeader label="The Challenge" title="Lending Shouldn't Take Days" description="Traditional lending operations rely on fragmented systems, manual processes, and multiple vendors, resulting in:" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {challengeItems.map((item) => (
              <motion.div
                key={item}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-800/40 border border-gray-700/50"
              >
                <FiCheck className="text-green-500 flex-shrink-0" />
                <span className="text-gray-300">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-gray-900/50 to-gray-950">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeader
            label="Our Solution"
            title="One Platform. Entire Lending Lifecycle."
            description="LendOS combines onboarding, underwriting, decisioning, disbursals, collections, and portfolio analytics into a single infrastructure layer."
          />
          <motion.h3
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-2xl font-semibold text-white text-center mb-8"
          >
            Deliver Faster Lending Outcomes
          </motion.h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {solutionItems.map((item) => (
              <motion.div
                key={item}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-green-500/5 to-blue-500/5 border border-green-500/20"
              >
                <span className="text-green-400">✔️</span>
                <span className="text-gray-200 font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeader label="Platform Capabilities" title="End-to-End Lending Infrastructure" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformCapabilities.map((cap) => (
              <motion.div
                key={cap.title}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-green-500/30 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-4">{cap.title}</h3>
                <ul className="space-y-2">
                  {cap.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-400 text-sm">
                      <FiCheck className="text-blue-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why LendOS */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-gray-900/50 to-gray-950">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeader label="Why LendOS" title="Built for Speed, Scale & Intelligence" />
          <div className="grid md:grid-cols-2 gap-6">
            {whyLendOS.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-gray-800/40 border border-gray-700/50"
              >
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Microservices Marketplace */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeader
            label="Microservices Marketplace"
            title="Deploy Only What You Need"
            description="Choose individual services or the complete lending platform."
          />
          <motion.h3 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center text-white font-semibold mb-8">
            Available Modules
          </motion.h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {modules.map((mod) => (
              <motion.div
                key={mod}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/30 border border-gray-700/40 text-gray-300 text-sm"
              >
                <FiCheck className="text-green-500 flex-shrink-0" />
                {mod}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-gray-900/50 to-gray-950">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeader label="Industries We Serve" title="Designed for Every Lending Business" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((ind) => (
              <motion.div
                key={ind.name}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-gray-800/40 border border-gray-700/50 text-center hover:border-blue-500/30 transition-colors"
              >
                <h3 className="text-xl font-bold text-white mb-2">{ind.name}</h3>
                <p className="text-gray-400 text-sm">{ind.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeader label="Technology Advantage" title="Modern Cloud-Native Architecture" />
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {techAdvantages.map((tech) => (
              <motion.div
                key={tech}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-4 rounded-xl bg-gradient-to-br from-green-500/5 to-blue-500/5 border border-gray-700/50 text-center text-gray-300 font-medium"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Impact */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-gray-900/50 to-gray-950">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeader label="Business Impact" title="Transform Lending Performance" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessImpact.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl bg-gray-800/40 border border-gray-700/50"
              >
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-green-500/10" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Ready to Modernize Your Lending Operations?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-gray-400 text-lg mb-8"
          >
            Discover how LendOS can help your institution automate underwriting, accelerate loan approvals, reduce operational costs, and scale lending efficiently.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/contacts")}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl text-lg font-semibold shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
            >
              Request a Demo <FiArrowRight />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/contacts")}
              className="px-8 py-4 bg-gray-800/80 border-2 border-gray-700 text-gray-200 rounded-xl text-lg font-semibold"
            >
              Talk to Our Team
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer Tagline */}
      <section className="py-12 border-t border-gray-800 text-center px-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 mb-2">
          LendOS
        </h2>
        <p className="text-white font-medium mb-2">The Operating System for Instant Digital Lending</p>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
          AI-Powered End-to-End Digital Lending Platform for Instant Credit Decisioning, Disbursals & Collections.
        </p>
      </section>
    </div>
  );
};

export default LendOS;
