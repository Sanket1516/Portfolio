// Every entry here traces to the resume or to a public repository. Do not add anything that does not.

export type Skill = {
  name: string;
  group: SkillGroup;
  experience: string;
  projects: { slug: string; note: string }[];
};

export type SkillGroup = "Frontend" | "Backend" | "Databases" | "Cloud & DevOps" | "Languages" | "AI & Automation";

export const skillGroups: SkillGroup[] = ["Frontend", "Backend", "Databases", "Cloud & DevOps", "Languages", "AI & Automation"];

export const skills: Skill[] = [
  {
    name: "React",
    group: "Frontend",
    experience: "Role-aware dashboards, live views and multi-page tools.",
    projects: [
      { slug: "smart-campus", note: "React 18 with protected routes and Socket.IO live updates" },
      { slug: "smart-form", note: "React 19 dashboard and the extension's review popup" },
      { slug: "passguard", note: "React 19 attack dashboard fed by WebSocket progress" },
    ],
  },
  {
    name: "Next.js",
    group: "Frontend",
    experience: "App Router, static generation and incremental revalidation.",
    projects: [
      { slug: "site", note: "This site: statically generated, GitHub data revalidated hourly" },
      { slug: "vaakya", note: "Designed and owned the PWA frontend" },
    ],
  },
  {
    name: "TypeScript",
    group: "Frontend",
    experience: "Typed dashboards and browser extension code.",
    projects: [
      { slug: "smart-form", note: "Dashboard and Manifest V3 extension" },
      { slug: "metromind", note: "React frontend" },
    ],
  },
  {
    name: "Tailwind CSS",
    group: "Frontend",
    experience: "Design tokens and responsive layouts.",
    projects: [
      { slug: "smart-campus", note: "Dashboards and the mobile drawer layout" },
      { slug: "passguard", note: "Tailwind 4 interface" },
    ],
  },
  {
    name: "HTML5 / CSS3",
    group: "Frontend",
    experience: "Server-rendered pages and semantic markup.",
    projects: [{ slug: "wanderlust", note: "EJS templates across the booking flow" }],
  },
  {
    name: "Node.js",
    group: "Backend",
    experience: "REST APIs, cron jobs and device protocols.",
    projects: [
      { slug: "smart-campus", note: "Express API plus an ADMS listener for fingerprint terminals" },
      { slug: "wanderlust", note: "MVC monolith covering booking, payments and messaging" },
    ],
  },
  {
    name: "Express.js",
    group: "Backend",
    experience: "Layered routes, middleware and validation.",
    projects: [
      { slug: "smart-campus", note: "20 route modules behind Helmet, rate limiting and validators" },
      { slug: "wanderlust", note: "Routes, controllers and auth middleware" },
    ],
  },
  {
    name: "FastAPI",
    group: "Backend",
    experience: "Async services with background processing.",
    projects: [
      { slug: "smart-form", note: "70+ routes with async document processing" },
      { slug: "metromind", note: "Independently structured services behind a gateway" },
      { slug: "smart-campus", note: "Internal pyzk sidecar, the only client allowed on port 4370" },
    ],
  },
  {
    name: "Flask",
    group: "Backend",
    experience: "Small APIs and WebSocket servers.",
    projects: [
      { slug: "passguard", note: "Flask-SocketIO with blueprints and a service layer" },
      { slug: "claim-fraud", note: "Web UI and upload API" },
      { slug: "dpi-engine", note: "Web dashboard around the C++ engine" },
    ],
  },
  {
    name: "Socket.IO",
    group: "Backend",
    experience: "Live events scoped to the right audience.",
    projects: [
      { slug: "smart-campus", note: "Scan, alert and terminal events pushed to dashboards" },
      { slug: "passguard", note: "Per-session rooms streaming attack progress" },
    ],
  },
  {
    name: "MongoDB",
    group: "Databases",
    experience: "Document modelling and indexing for operational data.",
    projects: [
      { slug: "smart-campus", note: "24 Mongoose models, including a persistent command queue" },
      { slug: "smart-form", note: "Facts stored with source, page and confidence" },
      { slug: "passguard", note: "RockYou dataset scanned in batches" },
      { slug: "wanderlust", note: "Listings, bookings, reviews and messages" },
    ],
  },
  {
    name: "PostgreSQL",
    group: "Databases",
    experience: "Relational store for service data.",
    projects: [{ slug: "metromind", note: "Transactional data for the service layer" }],
  },
  {
    name: "MySQL",
    group: "Databases",
    experience: "Relational schemas and SQL.",
    projects: [],
  },
  {
    name: "Redis",
    group: "Databases",
    experience: "Queues and caching.",
    projects: [
      { slug: "smart-form", note: "Broker for Celery document workers" },
      { slug: "metromind", note: "Used by auth and notification services" },
    ],
  },
  {
    name: "ChromaDB",
    group: "Databases",
    experience: "Vector retrieval scoped per user.",
    projects: [{ slug: "smart-form", note: "Document chunks filtered by user_id on every read and write" }],
  },
  {
    name: "Firebase",
    group: "Databases",
    experience: "Auth, Firestore and storage for a mobile-first product.",
    projects: [{ slug: "vaakya", note: "Owned the Firebase integration in the design" }],
  },
  {
    name: "AWS",
    group: "Cloud & DevOps",
    experience: "Container deployment on ECS Fargate behind a load balancer.",
    projects: [{ slug: "smart-campus", note: "ECR, ECS Fargate and an ALB routing / and /api/*" }],
  },
  {
    name: "Docker",
    group: "Cloud & DevOps",
    experience: "Multi-service Compose stacks and production images.",
    projects: [
      { slug: "smart-campus", note: "Frontend, backend, database and monitoring services" },
      { slug: "smart-form", note: "API, worker, MongoDB, ChromaDB, Redis and dashboard" },
      { slug: "claim-fraud", note: "Packaged for Surya OCR" },
    ],
  },
  {
    name: "GitHub Actions",
    group: "Cloud & DevOps",
    experience: "Test gates and automated deployment.",
    projects: [
      { slug: "smart-campus", note: "Tests gate an ECR build and an ECS rollout" },
      { slug: "smart-form", note: "ruff, black, pytest, Chroma and browser tests" },
    ],
  },
  {
    name: "Prometheus",
    group: "Cloud & DevOps",
    experience: "Service metrics and scraping.",
    projects: [
      { slug: "smart-campus", note: "prom-client metrics exposed at /metrics" },
      { slug: "metromind", note: "Part of the observability setup" },
    ],
  },
  {
    name: "Grafana",
    group: "Cloud & DevOps",
    experience: "Dashboards over Prometheus data.",
    projects: [
      { slug: "smart-campus", note: "Runs in the Compose stack" },
      { slug: "metromind", note: "Part of the observability setup" },
    ],
  },
  {
    name: "Linux",
    group: "Cloud & DevOps",
    experience: "Shell scripting and server work. IBM-certified course in Linux and shell scripting.",
    projects: [],
  },
  {
    name: "C++",
    group: "Languages",
    experience: "Multi-threaded systems code and data structures.",
    projects: [{ slug: "dpi-engine", note: "C++17 pipeline with thread-safe queues" }],
  },
  {
    name: "Python",
    group: "Languages",
    experience: "Backends, document pipelines and evaluation tooling.",
    projects: [
      { slug: "smart-form", note: "Backend and extraction pipeline" },
      { slug: "clause-search", note: "BM25 written in-repo, with an evaluation harness" },
      { slug: "claim-fraud", note: "Rule engine with stdlib-only tests" },
    ],
  },
  {
    name: "JavaScript",
    group: "Languages",
    experience: "The MERN stack, front to back.",
    projects: [
      { slug: "smart-campus", note: "Backend and frontend" },
      { slug: "wanderlust", note: "Server and client code" },
    ],
  },
  {
    name: "SQL",
    group: "Languages",
    experience: "5★ on HackerRank, plus published research on database testing.",
    projects: [],
  },
  {
    name: "RAG",
    group: "AI & Automation",
    experience: "Retrieval that cites its evidence and refuses to guess.",
    projects: [{ slug: "smart-form", note: "Structured facts first, retrieval only when needed, one LLM call to compose" }],
  },
  {
    name: "OCR",
    group: "AI & Automation",
    experience: "Reading scanned and photographed documents.",
    projects: [
      { slug: "smart-form", note: "RapidOCR with deskew, contrast and orientation fixes" },
      { slug: "metromind", note: "Tesseract, EasyOCR and OpenCV" },
      { slug: "claim-fraud", note: "Docling with Surya or RapidOCR" },
    ],
  },
  {
    name: "LangGraph",
    group: "AI & Automation",
    experience: "Explicit state graphs over LLM steps.",
    projects: [{ slug: "smart-form", note: "One batch pipeline for classifying and resolving form fields" }],
  },
  {
    name: "Embeddings",
    group: "AI & Automation",
    experience: "Semantic search with sentence-transformers.",
    projects: [
      { slug: "smart-form", note: "all-MiniLM-L6-v2 at 384 dimensions" },
      { slug: "metromind", note: "Semantic search with FAISS and ChromaDB" },
    ],
  },
  {
    name: "Speech",
    group: "AI & Automation",
    experience: "Voice input and output for accessibility.",
    projects: [{ slug: "vaakya", note: "Voice pipeline with Whisper and Coqui TTS" }],
  },
  {
    name: "Evaluation",
    group: "AI & Automation",
    experience: "Held-out test splits and pre-registered experiments.",
    projects: [{ slug: "clause-search", note: "Character-level recall, abstention metrics and a logged improvement loop" }],
  },
];

export type TimelineItem = {
  when: string;
  title: string;
  org: string;
  detail: string;
  kind: "education" | "publication" | "experience" | "competition" | "certification";
  highlight?: boolean;
  href?: string;
};

export const timeline: TimelineItem[] = [
  {
    when: "2023 – 2027",
    title: "B.Tech in Computer Science",
    org: "MPSTME, NMIMS University",
    detail: "CGPA 8.68 / 10. Active CSI member since 2023.",
    kind: "education",
    highlight: true,
  },
  {
    when: "2025",
    title: "Advanced Database Testing and Verification Using Automated Tools and Vulnerability Analysis",
    org: "4th IEEE DELCON 2025, Jamia Millia Islamia, New Delhi",
    detail: "Presented at the conference and published in IEEE Xplore.",
    kind: "publication",
    highlight: true,
    href: "https://ieeexplore.ieee.org/abstract/document/11400349",
  },
  {
    when: "Competition",
    title: "Nomura Kakushin Hackathon",
    org: "Round 2, Top 6 teams",
    detail: "Advanced to the second round of the competition.",
    kind: "competition",
    highlight: true,
  },
  {
    when: "Competition",
    title: "Smart India Hackathon",
    org: "Team Leader",
    detail: "Led the team through the competition.",
    kind: "competition",
  },
  {
    when: "Ongoing",
    title: "10+ hackathons",
    org: "Competitions and build events",
    detail: "A habit of building under a deadline.",
    kind: "competition",
  },
  {
    when: "Internship",
    title: "Quiz portal",
    org: "Technook",
    detail: "Built with JavaScript, Hyperlambda and MySQL.",
    kind: "experience",
  },
  {
    when: "2022 – 2023",
    title: "Higher Secondary Certificate",
    org: "R.C. Patel Junior College",
    detail: "HSC: 79.50",
    kind: "education",
  },
  {
    when: "2020 – 2021",
    title: "Secondary School Certificate",
    org: "R.C. Patel English Medium Secondary School",
    detail: "SSC: 86.50",
    kind: "education",
  },
];

export const certifications = [
  { name: "Providing Technical Support for AWS Workloads", by: "AWS" },
  { name: "AWS Cloud Technical Essentials", by: "AWS" },
  { name: "Introduction to Information Technology and AWS Cloud", by: "AWS" },
  { name: "Hands-on Introduction to Linux Commands and Shell Scripting", by: "IBM" },
];

// Each principle is backed by a decision that exists in a repository.
export const principles = [
  {
    rule: "Keep a human at the decision",
    proof: "Smart Form fills only the fields a person ticked, re-reads the page to confirm, and never submits.",
    slug: "smart-form",
  },
  {
    rule: "Software stays authoritative",
    proof: "On Smart Campus a blocked student is refused by the scan pipeline at once, even before a terminal processes the delete.",
    slug: "smart-campus",
  },
  {
    rule: "Say nothing rather than guess",
    proof: "Clause Search abstains when evidence is weak, and it reports how often that gate still gets it wrong.",
    slug: "clause-search",
  },
  {
    rule: "Measure, then claim",
    proof: "Terminal sync is documented as tested on simulated devices. The hardware gaps are listed, not hidden.",
    slug: "smart-campus",
  },
];

export const interests = ["Backend systems", "Cloud infrastructure", "DevOps", "Applied AI", "Networking"];
