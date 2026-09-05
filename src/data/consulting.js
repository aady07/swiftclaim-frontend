export const services = [
  { title: 'Website Development', description: 'Fast, responsive websites and web applications built around your brand, customers, and business goals.', detail: 'Company websites · Customer portals · Headless CMS', icon: 'web' },
  { title: 'Web & Mobile App Development', description: 'Custom web and cross-platform mobile products, from an early MVP to a complete customer experience.', detail: 'Web platforms · iOS & Android · API integrations', icon: 'app' },
  { title: 'AI & Automation Consulting', description: 'Connect language models to your business data and automate repetitive work with practical AI systems.', detail: 'AI agents · RAG knowledge systems · Workflows', icon: 'ai' },
  { title: 'White-Label Tech Solutions', description: 'Adapt ready-to-brand technology into a product you can offer under your own name.', detail: 'Brand customization · Integrations · Deployment', icon: 'layers' },
  { title: 'Product Engineering & MVPs', description: 'Turn an idea into working software with architecture, development, and iteration around real feedback.', detail: 'Technical discovery · MVP builds · Product iteration', icon: 'code' },
  { title: 'Cloud & DevOps Consulting', description: 'Build a reliable foundation for your applications with scalable infrastructure and automated delivery.', detail: 'Cloud architecture · CI/CD · Cost optimization', icon: 'cloud' },
];

export const capabilities = [
  { title: 'Frontend & Mobile', number: '01', description: 'Responsive websites, rich web applications, and cross-platform experiences.', featured: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'React Native', 'Flutter'], groups: [
    ['Frameworks', 'React, Next.js, Vue.js, Nuxt.js, Angular, Svelte/SvelteKit, Remix, Astro, SolidJS, Qwik'],
    ['Language & styling', 'TypeScript, JavaScript ES6+, Tailwind CSS, Sass/SCSS, shadcn/ui, Radix UI, Chakra UI, MUI'],
    ['State, forms & motion', 'Redux Toolkit, Zustand, TanStack Query, React Hook Form, Zod, Apollo Client, Framer Motion, D3.js, Three.js'],
    ['Testing & mobile', 'Jest, Vitest, Cypress, Playwright, React Native, Flutter, Expo, Electron, Tauri'],
  ]},
  { title: 'Backend & Automation', number: '02', description: 'APIs, business logic, integrations, and workflows that connect your operations.', featured: ['Python', 'FastAPI', 'Node.js', 'Java', 'n8n', 'Temporal'], groups: [
    ['Languages & frameworks', 'FastAPI, Django, Flask, Node.js (Express / NestJS), Java (Spring Boot), Go, Rust (Actix / Axum), Ruby on Rails, .NET / C#'],
    ['APIs & messaging', 'REST, GraphQL, gRPC, WebSockets, Kafka, RabbitMQ, AWS SQS/SNS, Celery, BullMQ'],
    ['Workflow orchestration', 'n8n, Zapier, Make.com, Apache Airflow, Temporal, Prefect, UiPath (RPA), Power Automate'],
    ['Testing & authentication', 'Pytest, JUnit, Postman, OAuth2 / JWT, Auth0, Keycloak'],
  ]},
  { title: 'AI, LLMs & RAG', number: '03', description: 'AI assistants and retrieval systems grounded in your own documents and data.', featured: ['OpenAI', 'Claude', 'LangGraph', 'LlamaIndex', 'PyTorch', 'pgvector'], groups: [
    ['Models & providers', 'OpenAI API, Anthropic Claude API, Gemini, Meta Llama, Mistral AI, Cohere, Ollama'],
    ['Agent frameworks', 'LangChain, LangGraph, LlamaIndex, CrewAI, AutoGen, Semantic Kernel, Haystack, DSPy'],
    ['Machine learning', 'PyTorch, TensorFlow, Hugging Face Transformers, scikit-learn, PEFT / LoRA, ONNX'],
    ['Retrieval & evaluation', 'OpenAI text-embedding-3, Cohere Embed, Sentence-Transformers, BGE, Voyage AI, Cohere Rerank, BGE-Reranker, LlamaParse, Unstructured.io, RAGAS, TruLens, LangSmith'],
  ]},
  { title: 'Cloud & DevOps', number: '04', description: 'Cloud infrastructure, automated releases, and visibility into production systems.', featured: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform'], groups: [
    ['Platforms', 'AWS, Microsoft Azure, Google Cloud (GCP), DigitalOcean, Vercel, Netlify, Cloudflare'],
    ['Containers', 'Docker, Kubernetes, Helm, Docker Compose, ECS / EKS'],
    ['Infrastructure & delivery', 'Terraform, Ansible, Pulumi, GitHub Actions, GitLab CI/CD, Jenkins, ArgoCD'],
    ['Monitoring & serverless', 'Prometheus, Grafana, Datadog, ELK Stack, Sentry, AWS Lambda, Cloudflare Workers'],
  ]},
  { title: 'Databases & Data Engineering', number: '05', description: 'Operational storage, vector search, and analytics foundations selected for your workload.', featured: ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase', 'Pinecone', 'Snowflake'], groups: [
    ['Relational & document', 'PostgreSQL, MySQL, MariaDB, SQL Server, Oracle, MongoDB, Couchbase, Firestore'],
    ['Cache & time-series', 'Redis, Memcached, DynamoDB, InfluxDB, TimescaleDB'],
    ['Vector search', 'Pinecone, Chroma, Weaviate, Qdrant, Milvus, pgvector, FAISS, Redis Vector Search'],
    ['Search & graph', 'Elasticsearch, OpenSearch, Algolia, Typesense, Neo4j, Amazon Neptune'],
    ['Backend as a service', 'Supabase, Firebase, AWS Amplify'],
    ['Engineering & analytics', 'Pandas, NumPy, Apache Spark, dbt, Snowflake, BigQuery, Redshift, Databricks, Jupyter'],
  ]},
];

export const consultingFaqs = [
  ['Can you help us choose the right technology stack?', 'Yes. We start with your product goals, existing systems, team, and operating requirements, then recommend the frontend, backend, data, and cloud tools that fit the project.'],
  ['Can you work with our existing software?', 'We can assess an existing application, plan integrations, modernize selected components, or add AI and automation workflows. The scope is agreed after reviewing your current systems.'],
  ['Do you build MVPs as well as complete products?', 'Yes. We support technical discovery, MVP development, and further product engineering, including testing, deployment, and iteration.'],
  ['What does a white-label engagement include?', 'Depending on the product and agreed scope, it can include branding, configuration, integrations, and deployment. Contact us to discuss the product, licensing, and customization you need.'],
  ['How do we get a proposal?', 'Share your idea, current challenges, expected scope, and any timeline with ceo@miraista.com or through our contact page. We will discuss the requirements and define an appropriate approach.'],
];
