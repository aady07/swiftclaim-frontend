import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const RecognitionUPAward = () => {
  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen">
      <Helmet>
        <title>Government of UP Recognises Miraista | AI Claims Automation</title>
        <meta name="description" content="Miraista was recognised by the Government of Uttar Pradesh and felicitated by Shri Sunil Kumar Sharma at the Start-up Launchpad for AI-driven vehicle insurance claim automation." />
        <meta property="og:title" content="Government of UP Recognises Miraista" />
        <meta property="og:description" content="Recognition for AI-based automation in vehicle insurance claims at Start-up Launchpad." />
        <meta property="og:image" content="/award1.JPG" />
        <link rel="canonical" href="https://www.miraista.com/recognitions/miraista-up-award" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <motion.span 
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/10 to-blue-600/10 rounded-full backdrop-blur-sm border border-green-200/20 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Special moment for Miraista
              </motion.span>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">Government of UP Recognition</h1>
              <p className="mt-3 text-lg text-gray-300">
                Driving the future of vehicle insurance claims with AI based automation.
              </p>
              <p className="mt-4 text-gray-300">
                Excited to share that Miraista has been officially recognised by Govt of UP and was
                felicitated by Shri Sunil Kumar Sharma (Hon’ble Minister, IT & Electronics) at the
                Start-up Launchpad event.
              </p>
            </div>
            <div className="w-full md:w-[360px] overflow-hidden rounded-2xl border border-blue-500/20 bg-gray-900/60 backdrop-blur">
              <img src="/award1.JPG" alt="Miraista felicitation" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {["Recognised by Govt. of UP", "Felicitated at Start-up Launchpad", "AI-driven claims automation"].map((item, idx) => (
              <motion.div
                key={idx}
                className="rounded-xl bg-gray-900/70 border border-gray-800 p-5"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-500 to-blue-600" />
                  <span className="text-gray-200 font-medium">{item}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="py-6">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-4 text-gray-300">
            <p>
              This high-energy event brought together innovators, thought leaders, and partners fostering entrepreneurship.
              This recognition inspires us to drive positive changes and create real impact in the AI ecosystem.
            </p>
            <p>
              Miraista’s innovative approach to automate the vehicle insurance claim process brings efficiency, speed, and transparency to consumers.
            </p>
            <p>
              Grateful for the continued support from IILM Innovation Lab and mentors. We look forward to transforming the vehicle insurance landscape and delivering unmatched value to customers and insurers alike. Here’s to new beginnings and unlocking boundless potential!
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Highlights</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/60">
              <img src="/award1.JPG" alt="Event highlight" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/60">
              <img src="/certi.jpeg" alt="Certificate" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <motion.a
              href="/contacts"
              className="px-6 py-3 rounded-xl text-white bg-gradient-to-r from-green-500 to-blue-600 shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Us
            </motion.a>
            <motion.a
              href="/services"
              className="px-6 py-3 rounded-xl border border-gray-600 text-gray-200 hover:bg-gray-800/60"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn about AI Claims Automation
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecognitionUPAward;


