import { Helmet } from 'react-helmet';
import { services } from '../../data/consulting';

const marketingMeta = {
  home: {
    title: 'Miraista | IT Consulting, Product Engineering & AI Solutions',
    description: 'Miraista provides IT consulting, website and app development, AI automation, and white-label solutions, alongside LendOS, chatbots, and vehicle damage assessment.',
    path: '/',
  },
  consulting: {
    title: 'IT Consulting & Software Development Services | Miraista',
    description: 'Build websites, web and mobile apps, AI and RAG systems with Miraista. Explore IT consulting, product engineering, white-label solutions, and cloud expertise.',
    path: '/consulting',
  },
};

export default function MarketingSEO(props) {
  // Both routes select from a fixed, internal metadata catalog.
  // eslint-disable-next-line react/prop-types
  const page = props.page || 'home';
  const meta = marketingMeta[page];
  const url = `https://miraista.com${meta.path}`;
  const organization = {
    '@type': 'Organization', '@id': 'https://miraista.com/#organization', name: 'Miraista',
    url: 'https://miraista.com/', logo: 'https://miraista.com/images/logo.png',
    description: 'IT consulting, product engineering, AI solutions, and white-label technology.',
    email: 'ceo@miraista.com', sameAs: ['https://www.linkedin.com/company/miraista'],
  };
  const graph = [organization, {
    '@type': 'WebPage', '@id': `${url}#webpage`, url, name: meta.title, description: meta.description,
    about: { '@id': organization['@id'] },
  }];
  if (page === 'consulting') {
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://miraista.com/' },
      { '@type': 'ListItem', position: 2, name: 'IT Consulting', item: url },
    ] });
    graph.push(...services.map(service => ({
      '@type': 'Service', name: service.title, description: service.description,
      provider: { '@id': organization['@id'] }, url,
    })));
  }
  return <Helmet>
    <title>{meta.title}</title>
    <meta name="description" content={meta.description} />
    <link rel="canonical" href={url} />
    <meta name="robots" content="index, follow" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Miraista" />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={meta.title} />
    <meta property="og:description" content={meta.description} />
    <meta property="og:image" content="https://miraista.com/images/logo.png" />
    <meta property="og:image:alt" content="Miraista" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={meta.title} />
    <meta name="twitter:description" content={meta.description} />
    <meta name="twitter:image" content="https://miraista.com/images/logo.png" />
    <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
  </Helmet>;
}
