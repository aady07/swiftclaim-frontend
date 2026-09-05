import { useEffect, useState } from 'react';
import { FiArrowUpRight, FiCloud, FiCode, FiCpu, FiDatabase, FiGlobe, FiLayers, FiZap } from 'react-icons/fi';
import { SiReact, SiNextdotjs, SiPython, SiTypescript, SiDocker, SiPostgresql, SiKubernetes, SiNodedotjs } from 'react-icons/si';

// Content is visible in prerendered HTML. Reveals are a progressive enhancement.
export function ConsultingEffects() {
  useEffect(() => {
    const root = document.querySelector('.consulting-page');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!root || preference.matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.remove('consult-reveal-pending');
        target.classList.add('consult-revealed');
        observer.unobserve(target);
      });
    }, { threshold: 0.08 });
    root.querySelectorAll('.consult-reveal').forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add('consult-reveal-pending');
        observer.observe(element);
      }
    });
    const revealAll = () => {
      if (preference.matches) {
        root.querySelectorAll('.consult-reveal-pending').forEach(element => element.classList.remove('consult-reveal-pending'));
        observer.disconnect();
      }
    };
    let frame;
    const spotlight = event => {
      if (event.pointerType === 'touch' || preference.matches || root.classList.contains('consult-motion-paused')) return;
      const card = event.target.closest('.consult-glow');
      if (!card) return;
      const { left, top } = card.getBoundingClientRect();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.setProperty('--pointer-x', `${event.clientX - left}px`);
        card.style.setProperty('--pointer-y', `${event.clientY - top}px`);
      });
    };
    root.addEventListener('pointermove', spotlight);
    preference.addEventListener('change', revealAll);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      root.removeEventListener('pointermove', spotlight);
      preference.removeEventListener('change', revealAll);
      root.querySelectorAll('.consult-reveal-pending').forEach(element => element.classList.remove('consult-reveal-pending'));
    };
  }, []);
  return null;
}

export function HeroVisual() {
  return <div className="consult-hero-visual">
    <div className="consult-orbit consult-orbit-one" aria-hidden="true" />
    <div className="consult-orbit consult-orbit-two" aria-hidden="true" />
    <img className="consult-core-image" src="/images/consulting/engineering-core.jpg" width="1254" height="1254" fetchPriority="high" alt="A glowing emerald engineering core with connected glass platforms and blue data pathways" />
    <div className="consult-floating-label consult-label-top"><span className="consult-icon-tile"><FiCode aria-hidden="true" /></span><div><span>Crafted for your vision</span><strong>Web & product engineering</strong></div></div>
    <div className="consult-floating-label consult-label-right"><span className="consult-icon-tile consult-icon-blue"><FiCpu aria-hidden="true" /></span><div><span>Intelligence, connected</span><strong>AI & automation</strong></div></div>
    <div className="consult-floating-label consult-label-bottom"><span className="consult-live-dot" aria-hidden="true" /><span>From architecture to launch</span><FiArrowUpRight aria-hidden="true" /></div>
    <span className="consult-visual-caption">THE FOUNDATION FOR WHAT’S NEXT</span>
  </div>;
}

const technologies = [[SiReact, 'React'], [SiNextdotjs, 'Next.js'], [SiPython, 'Python'], [SiTypescript, 'TypeScript'], [SiNodedotjs, 'Node.js'], [SiDocker, 'Docker'], [SiPostgresql, 'PostgreSQL'], [SiKubernetes, 'Kubernetes']];

export function TechnologyRibbon() {
  return <div className="consult-tech-ribbon">
    <p>Ideas powered by a versatile stack</p>
    <div className="consult-marquee-viewport">
      <div className="consult-marquee-track">
        {[0, 1].map(copy => <ul key={copy} aria-hidden={copy === 1 ? 'true' : undefined} className="consult-marquee-group">
          {technologies.map(([Icon, name]) => <li key={name}><Icon aria-hidden="true" /><span>{name}</span></li>)}
        </ul>)}
      </div>
    </div>
  </div>;
}

const systems = [
  { name: 'Web & mobile', icon: FiGlobe, title: 'An experience people love using.', description: 'Connect a thoughtful interface to dependable APIs and the data behind your business.', input: 'Web & mobile apps', core: 'Product APIs', output: 'Business data', tools: ['React / Next.js', 'FastAPI / Node.js', 'PostgreSQL'], caption: 'From the first interaction to the systems behind it.' },
  { name: 'AI & automation', icon: FiCpu, title: 'Your knowledge. Put to work.', description: 'Connect business documents, retrieval, and language models to build assistants and useful automated workflows.', input: 'Your knowledge', core: 'AI & retrieval', output: 'Answers & actions', tools: ['Documents & APIs', 'LangGraph / RAG', 'Agents & workflows'], caption: 'Grounded in your information. Connected to your workflows.' },
  { name: 'Cloud & scale', icon: FiCloud, title: 'A foundation that grows with you.', description: 'Connect automated releases, cloud services, and observability so your team can ship and operate with confidence.', input: 'Code & releases', core: 'Cloud platform', output: 'Monitoring', tools: ['GitHub Actions', 'AWS / Kubernetes', 'Grafana / Sentry'], caption: 'From a code change to a running, observable application.' },
];

export function SystemShowcase() {
  const [active, setActive] = useState(1);
  const system = systems[active];
  const CoreIcon = system.icon;
  return <section className="consult-system-section consult-reveal" aria-labelledby="connected-title">
    <div className="consult-system-shell consult-glow">
      <div className="consult-system-copy">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">The bigger picture</p>
        <h2 id="connected-title" className="text-3xl sm:text-5xl font-bold text-white mt-5 leading-tight">Great technology.<br /><span className="consult-gradient-text">Even better together.</span></h2>
        <p className="text-gray-400 leading-relaxed mt-5">We connect the experience, intelligence, and infrastructure into one complete product.</p>
        <div className="consult-system-switcher" role="group" aria-label="Explore an architecture">
          {systems.map(({ name, icon: Icon }, index) => <button type="button" key={name} aria-pressed={active === index} onClick={() => setActive(index)}><Icon aria-hidden="true" />{name}<FiArrowUpRight aria-hidden="true" /></button>)}
        </div>
      </div>
      <div className="consult-system-demo" aria-live="polite" aria-atomic="true">
        <div key={system.name} className="consult-system-content">
          <div className="consult-diagram" aria-hidden="true">
            <div className="consult-diagram-node"><FiLayers /><span>{system.input}</span></div>
            <div className="consult-wire" />
            <div className="consult-diagram-core"><div className="consult-core-halo" /><CoreIcon /><span>{system.core}</span></div>
            <div className="consult-wire consult-wire-second" />
            <div className="consult-diagram-node"><FiDatabase /><span>{system.output}</span></div>
            <div className="consult-diagram-footnote"><FiZap /> {system.caption}</div>
          </div>
          <h3 className="text-xl sm:text-2xl text-white font-semibold mt-8">{system.title}</h3>
          <p className="text-gray-400 leading-relaxed text-sm mt-3">{system.description}</p>
          <div className="flex flex-wrap gap-2 mt-5">{system.tools.map(tool => <span key={tool} className="rounded-full px-3 py-1.5 border border-gray-700 text-xs text-blue-200 bg-gray-900/70">{tool}</span>)}</div>
        </div>
      </div>
    </div>
  </section>;
}
