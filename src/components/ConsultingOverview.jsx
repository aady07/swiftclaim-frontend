import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiCode, FiCpu, FiLayers } from 'react-icons/fi';

export default function ConsultingOverview() {
  return <section aria-labelledby="consulting-overview-title" className="relative border-y border-gray-800 bg-gray-950 py-20 sm:py-24">
    <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
        <div className="max-w-2xl">
          <p className="text-green-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">Consulting & engineering</p>
          <h2 id="consulting-overview-title" className="text-3xl sm:text-4xl font-bold text-white leading-tight">Your technology partner,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">from idea to production.</span></h2>
          <p className="mt-5 text-gray-400 leading-relaxed">We build websites, applications, AI systems, and white-label solutions — with consulting and engineering support from architecture through launch.</p>
        </div>
        <Link to="/consulting" className="inline-flex items-center gap-2 text-green-300 hover:text-white font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400">View Services & Technology Stack <FiArrowUpRight aria-hidden="true" /></Link>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {[
          [FiCode, 'Web & App Development', 'Websites, customer portals, and mobile experiences built for your business.'],
          [FiCpu, 'AI & Automation Consulting', 'AI agents, RAG systems, and connected workflows that simplify everyday work.'],
          [FiLayers, 'Product Engineering & White-Label Solutions', 'From your first MVP to technology you can offer under your own brand.'],
        ].map(([Icon, title, description]) => <Link to="/consulting" key={title} className="group rounded-2xl border border-gray-800 bg-gray-900/60 p-7 hover:border-green-500/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400">
          <Icon aria-hidden="true" className="text-green-400 w-7 h-7 mb-6" /><h3 className="text-xl font-semibold text-white mb-3">{title}</h3><p className="text-gray-400 leading-relaxed">{description}</p><FiArrowUpRight aria-hidden="true" className="mt-6 text-gray-500 group-hover:text-green-400" />
        </Link>)}
      </div>
    </div>
  </section>;
}
