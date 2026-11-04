// Case studies. Facts come from each repository's code and docs, the resume, or the VAAKYA submission.
// `limits` is required reading before editing: those lines are what keep the claims honest.

export type NodeKind = "client" | "service" | "data" | "external" | "ops";

export type ArchNode = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  kind: NodeKind;
  detail: string;
  evidence?: string;
};

export type ArchView = {
  id: string;
  title: string;
  caption: string;
  height: number;
  nodes: ArchNode[];
  edges: [string, string, string?][];
  trace?: { title: string; steps: { node: string; text: string }[] };
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  kind: string;
  status: string;
  repo: string | null;
  featured: boolean;
  accent: "blue" | "violet" | "green" | "amber" | "rose";
  demo?: "agents" | "scan" | "review" | "entropy" | "flow";
  stack: string[];
  problem: string;
  solution: string;
  role: string;
  metrics: { value: string; label: string }[];
  overview: string[];
  backend: string[];
  data: string[];
  api: string[];
  security: string[];
  deployment: string[];
  decisions: { choice: string; why: string }[];
  challenges: { challenge: string; solution: string }[];
  limits: string[];
  architecture: ArchView[];
};

export const projects: Project[] = [
  {
    slug: "vaakya",
    name: "VAAKYA",
    tagline: "A four-agent financial companion for India, designed voice-first.",
    kind: "Team project · Nomura KakushIN 2026",
    status: "Round 2, Top 6 teams · Design and architecture submission",
    repo: null,
    featured: true,
    accent: "violet",
    demo: "agents",
    stack: ["Next.js", "TypeScript", "Tailwind", "PWA", "Firebase", "Whisper", "Coqui TTS", "PaddleOCR", "LangGraph", "Neo4j", "Qdrant"],
    problem:
      "India has built financial access. Many people still lack the confidence to use it: evaluating an insurance product, surviving irregular income, finding a scheme they qualify for, or doing any of this without a screen.",
    solution:
      "Four specialised agents share one Financial Life Graph, so guidance follows a person's real context. Voice is a first-class input, and progress is measured as a Financial Confidence Score rather than as engagement.",
    role:
      "With Pinak Salunke, as team Invincibles. I owned the frontend, the accessibility-first experience, the voice pipeline, Firebase integration, the OCR workflow and the responsive PWA. Pinak owned agent orchestration, the graph, RAG, the backend and overall architecture.",
    metrics: [
      { value: "Top 6", label: "Advanced to Round 2" },
      { value: "4", label: "Specialised agents" },
      { value: "30", label: "Mobile screens designed" },
      { value: "24 h", label: "Layered build plan" },
    ],
    overview: [
      "VAAKYA was our submission to the Nomura KakushIN Financial Literacy and Agentic AI Hackathon. The brief gave four people with very different needs: a teacher, a gig worker, a farmer and a visually impaired writer.",
      "Our analysis found one shared pattern. Each of them reaches a moment of decision without guidance that fits their life. That led to the thesis behind the design: the next challenge is not access to financial services, it is access to financial confidence.",
      "So the design is not a single chatbot. An Educator teaches, a Strategy Builder plans, a Sentinel checks suspicious offers, and a Connector finds government schemes. All four read from the same model of the user.",
    ],
    backend: [
      "Pinak designed the backend: FastAPI services with LangGraph coordinating the agents, and the model reached through one primary LLM.",
      "A retrieval pipeline over Qdrant and LlamaIndex gives the Educator and Connector their knowledge base.",
    ],
    data: [
      "The Financial Life Graph is a personal knowledge graph in Neo4j. Goals, policies, liabilities and schemes become nodes, joined by relationships such as PURSUES, OWNS and ELIGIBLE_FOR.",
      "A graph suits this because a question like “which scheme fits this person” is a traversal across connected facts, not a lookup in one record.",
    ],
    api: [
      "Each agent has its own flow. Assessment creates the financial profile, and the Educator, Strategy Builder, Sentinel and Connector flows all feed one Financial Confidence Engine, which updates the user's score.",
    ],
    security: [
      "The design used Firebase Authentication, with sensitive data handled on-device where possible and complex reasoning sent to the cloud model.",
      "Sentinel surfaces risk analysis and safety guidance to the user. It advises and leaves the decision with the person.",
    ],
    deployment: [
      "Planned deployment: Docker images on AWS ECS Fargate behind an Application Load Balancer, with CloudFront at the edge, CloudWatch for monitoring and IAM for access control.",
      "This is the submitted design. It has not been run as a production deployment.",
    ],
    decisions: [
      { choice: "Four agents instead of one chatbot", why: "Teaching, planning, fraud checks and scheme matching need different tools and different failure handling." },
      { choice: "Neo4j for the user model", why: "Financial life is relationships. A graph keeps goals, policies and eligibility connected and traversable." },
      { choice: "Voice as a first-class input", why: "For a visually impaired or low-literacy user, voice is not a feature. It is the only way in." },
      { choice: "A confidence score, not engagement", why: "It tracks literacy, savings behaviour, scam awareness and goal progress: outcomes rather than session counts." },
    ],
    challenges: [
      {
        challenge: "Designing one interface for four very different people",
        solution: "Built the screens around voice, large targets and plain language first, then generated 30 mobile screens from one design system with a Figma script so that they stayed consistent.",
      },
      {
        challenge: "Fitting the system into a 24-hour build",
        solution: "Layered the plan: infrastructure and data first, then agents developed in parallel, so that an early foundation unlocked the rest.",
      },
    ],
    limits: [
      "This is a competition design and architecture submission, not a production system.",
      "No public repository exists, so there is no code to link here.",
      "The stack shows the design as submitted. The backend, graph and retrieval work is Pinak Salunke's.",
    ],
    architecture: [
      {
        id: "agents",
        title: "Agent constellation",
        caption: "Team design from the Round 2 submission. Input flows through four agents to one confidence engine.",
        height: 520,
        nodes: [
          { id: "user", label: "User", sub: "Text · voice · image", x: 40, y: 220, kind: "client", detail: "People reach VAAKYA by typing, speaking, or uploading an image such as a scam screenshot or a financial document." },
          { id: "pwa", label: "Next.js PWA", sub: "My work", x: 250, y: 120, kind: "client", detail: "The accessibility-first interface: a responsive progressive web app covering goals, learning, scam checks and scheme discovery." },
          { id: "voice", label: "Voice pipeline", sub: "My work", x: 250, y: 320, kind: "client", detail: "Whisper turns speech into text and Coqui TTS reads answers aloud, so that the product works without a screen." },
          { id: "api", label: "FastAPI + LangGraph", sub: "Orchestration · Pinak", x: 470, y: 220, kind: "service", detail: "Coordinates which agent handles a request. Designed and owned by Pinak Salunke." },
          { id: "educator", label: "Educator", sub: "RAG over Qdrant", x: 730, y: 30, kind: "service", detail: "Retrieves trusted financial knowledge and explains it in simple language." },
          { id: "strategy", label: "Strategy Builder", sub: "Plans from the graph", x: 730, y: 130, kind: "service", detail: "Generates savings plans and roadmaps from the user's goals and profile." },
          { id: "sentinel", label: "Sentinel", sub: "OCR + risk analysis", x: 730, y: 230, kind: "service", detail: "Reads uploaded screenshots with PaddleOCR and analyses them for scams, fraudulent offers and predatory loans." },
          { id: "connector", label: "Connector", sub: "Scheme matching", x: 730, y: 330, kind: "service", detail: "Matches user attributes against scheme knowledge and guides the application." },
          { id: "graph", label: "Financial Life Graph", sub: "Neo4j", x: 470, y: 420, kind: "data", detail: "The shared model of the person. Every agent reads from it, which is why guidance stays personal. Designed by Pinak Salunke." },
          { id: "score", label: "Confidence Engine", sub: "Score + dashboard", x: 730, y: 430, kind: "data", detail: "Consolidates learning, goals, safety and schemes into a Financial Confidence Score shown on the dashboard." },
        ],
        edges: [["user", "pwa"], ["user", "voice"], ["pwa", "api"], ["voice", "api"], ["api", "educator"], ["api", "strategy"], ["api", "sentinel"], ["api", "connector"], ["api", "graph"], ["graph", "score"], ["connector", "score"]],
        trace: {
          title: "Check a suspicious message",
          steps: [
            { node: "user", text: "The user uploads a screenshot of a suspicious loan offer." },
            { node: "pwa", text: "The PWA stores the upload and sends it for analysis." },
            { node: "api", text: "The orchestrator routes the request to the Sentinel agent." },
            { node: "sentinel", text: "PaddleOCR extracts the text and the model scores the risk." },
            { node: "connector", text: "Related guidance is gathered for the response." },
            { node: "score", text: "Scam awareness updates the Financial Confidence Score." },
          ],
        },
      },
      {
        id: "deploy",
        title: "Planned deployment",
        caption: "As proposed in the submission. Not deployed as a production system.",
        height: 240,
        nodes: [
          { id: "docker", label: "Docker", sub: "Images", x: 20, y: 90, kind: "ops", detail: "Services packaged as containers." },
          { id: "ecs", label: "ECS Fargate", sub: "Compute", x: 250, y: 90, kind: "ops", detail: "Serverless container hosting on AWS." },
          { id: "alb", label: "ALB", sub: "Load balancing", x: 480, y: 90, kind: "ops", detail: "Application Load Balancer in front of the services." },
          { id: "cf", label: "CloudFront", sub: "Edge", x: 710, y: 90, kind: "ops", detail: "CDN at the edge. CloudWatch and IAM cover monitoring and access control." },
        ],
        edges: [["docker", "ecs"], ["ecs", "alb"], ["alb", "cf"]],
      },
    ],
  },
  {
    slug: "smart-campus",
    name: "Smart Campus",
    tagline: "Real-time entry and exit tracking that replaces the paper register at the gate.",
    kind: "Full-stack system · 3rd-year academic project",
    status: "Under evaluation for campus-wide deployment",
    repo: "https://github.com/Sanket1516/Smart-Campus-Monitoring-System",
    featured: true,
    accent: "blue",
    demo: "scan",
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.IO", "JWT", "Tailwind", "Chart.js", "Docker", "AWS ECS"],
    problem:
      "A manual register slows the gate at peak hours, gives no live picture of who is on campus, and leaves hostel curfews and parent alerts to whoever remembers.",
    solution:
      "A biometric-first platform with SAP ID entry as the fallback. One scan endpoint decides entry, exit or re-entry from each student's state, and every event reaches dashboards live.",
    role:
      "Engineered the platform end to end: the scan pipeline, RBAC, live dashboards, terminal sync, containers and the AWS deployment workflow. Built as an academic project under the guidance of Prof. Dr. Nitin Choubey.",
    metrics: [
      { value: "60", label: "Students in the pilot" },
      { value: "~5s → <1s", label: "Entry time per student in the pilot" },
      { value: "24", label: "Mongoose models" },
      { value: "~90", label: "Terminals the sync is designed for" },
    ],
    overview: [
      "The system tracks day scholars and hostellers at the campus gate. Fingerprint terminals post scans to the backend, and staff can enter a SAP ID by hand as the fallback.",
      "Around that core sit the operational pieces a real gate needs: unauthorized-attempt logging, curfew flags, warden-approved exit windows, visitor capture, Excel enrollment, parent email and SMS, and a public live view.",
      "According to the project resume, a pilot with 60 students reduced average entry processing from about 5 seconds to under 1 second while automating visitor logging and parent alerts.",
    ],
    backend: [
      "An Express API mounts 20 route modules, with Helmet, CORS, a limit of 200 requests per 15 minutes on /api, and request validation.",
      "The scan controller checks the SAP ID, block status and any warden requirement before deciding direction. Unknown IDs and blocked students are logged and broadcast rather than silently dropped.",
      "Fingerprint terminals use a separate /iclock listener with its own IP allow-list and rate limit, because the ADMS push protocol has no real authentication.",
      "A small FastAPI sidecar built on pyzk is the only component allowed to open TCP 4370 on terminals. It handles bulk loads, template reads, nightly audits and backups.",
    ],
    data: [
      "MongoDB holds 24 Mongoose models. EntryLog records one movement with its date, entry and exit times, status and lateReturn flag.",
      "Terminal commands live in a persistent MongoDB queue with at most one open command per terminal, student and type, enforced by a partial unique index.",
      "Fingerprint templates are encrypted with AES-256-GCM using a key from the environment, and they are never returned by the API or written to logs.",
    ],
    api: [
      "REST over JSON for the dashboards, with Socket.IO pushing scan, alert and terminal events to connected clients.",
      "Notifications are fire-and-forget, so a slow email or SMS provider cannot hold up a scan at the gate.",
      "Prometheus metrics are exposed at /metrics through prom-client, with Prometheus and Grafana in the Compose stack.",
    ],
    security: [
      "JWT Bearer auth with bcrypt at 12 rounds. Roles include admin, security and warden, and the server refuses to start without its required secrets.",
      "Socket connections verify the token before attaching a user, and a test suite covers socket privacy.",
      "Biometric enrollment records consent, including parental consent for under-18s, and de-enrolment erases templates from MongoDB.",
    ],
    deployment: [
      "Frontend (Nginx) and backend ship as separate Docker images. MongoDB, Prometheus and Grafana run alongside them in Compose.",
      "On a push to main, GitHub Actions runs the Jest and Vitest suites. Only then does it build both images, push them to Amazon ECR, render new task definitions and roll them out to ECS Fargate.",
      "The deployment guide places an Application Load Balancer in front: / goes to the frontend and /api/* to the backend, with MongoDB Atlas as the database.",
    ],
    decisions: [
      { choice: "One scan endpoint, driven by state", why: "Guards never choose entry or exit. Direction comes from the day's last log, which removes a whole class of mistakes." },
      { choice: "Software deny stays authoritative", why: "A blocked student is refused at once by the pipeline, even if a terminal has not yet processed the delete." },
      { choice: "Terminals dial out and poll a queue", why: "Offline terminals simply catch up. Commands persist across restarts and retry after 10 minutes without an ack." },
      { choice: "Only the sidecar touches port 4370", why: "It keeps the GPL-licensed pyzk code and the raw device protocol in one small internal service." },
    ],
    challenges: [
      {
        challenge: "Keeping about 90 terminals in sync without paid vendor software",
        solution: "Used the open ADMS push protocol for daily changes and pyzk for bulk work, with a nightly reconciliation that diffs each terminal against the desired state.",
      },
      {
        challenge: "Devices acknowledging a change that may not have happened",
        solution: "Separated the states: FULLY_SYNCHRONIZED needs a read-back, while an ack with no read-back is reported as SYNCHRONIZED_UNVERIFIED.",
      },
      {
        challenge: "Notifications slowing the gate",
        solution: "Dispatched email and SMS asynchronously, so that the scan response returns immediately.",
      },
    ],
    limits: [
      "Terminal sync is implemented and tested against simulated terminals only. The repository states that nothing has been measured on an X990 yet.",
      "Recorded test run: 90 of 91 Jest tests passed, with one known login test failing, plus 17 sidecar and 8 frontend tests. These ran without hardware, against an in-memory model fake.",
      "ADMS push has no real authentication, so the terminals must stay on an isolated VLAN or VPN.",
    ],
    architecture: [
      {
        id: "runtime",
        title: "Runtime",
        caption: "From a fingerprint at the gate to a live dashboard.",
        height: 520,
        nodes: [
          { id: "gate", label: "Gate terminals", sub: "eSSL X990", x: 30, y: 60, kind: "client", detail: "Fingerprint terminals dial out to the backend and poll for commands, so an offline unit simply catches up on reconnect.", evidence: "routes/iclock.js" },
          { id: "desk", label: "React dashboard", sub: "Vite · Tailwind", x: 30, y: 240, kind: "client", detail: "Role-aware pages for gate staff, admins and wardens. SAP ID entry here is the manual fallback.", evidence: "frontend/" },
          { id: "public", label: "Live view", sub: "Public /live", x: 30, y: 420, kind: "client", detail: "A public, read-only view of campus status.", evidence: "routes/live.js" },
          { id: "iclock", label: "/iclock listener", sub: "IP allow-list", x: 280, y: 60, kind: "service", detail: "ADMS has no real authentication, so this listener sits outside /api with its own IP allow-list, registered-serial check and rate limit.", evidence: "routes/iclock.js" },
          { id: "api", label: "Express API", sub: "JWT · RBAC · Helmet", x: 280, y: 240, kind: "service", detail: "20 route modules. The scan endpoint decides entry, exit or re-entry from the student's state for the day.", evidence: "server.js, controllers/scanController.js" },
          { id: "socket", label: "Socket.IO", sub: "Live events", x: 280, y: 420, kind: "service", detail: "Pushes scans, unauthorized attempts, blocked attempts and terminal status to dashboards.", evidence: "socket.js" },
          { id: "queue", label: "Command queue", sub: "MongoDB", x: 530, y: 60, kind: "data", detail: "Persistent per-terminal queue. A partial unique index allows one open command per terminal, student and type. Resent after 10 minutes, failed after 3 attempts.", evidence: "models/TerminalCommand.js" },
          { id: "mongo", label: "MongoDB", sub: "24 models", x: 530, y: 240, kind: "data", detail: "Students, entry logs, unauthorized logs, hostels, requests and audits. Templates are encrypted with AES-256-GCM.", evidence: "backend/models/" },
          { id: "notify", label: "Notifications", sub: "Email · SMS", x: 530, y: 420, kind: "external", detail: "Nodemailer and Fast2SMS, fire-and-forget, so a slow provider never blocks a scan.", evidence: "services/notification.js" },
          { id: "sidecar", label: "pyzk sidecar", sub: "FastAPI · port 4370", x: 770, y: 60, kind: "service", detail: "The only client allowed to open TCP 4370 on terminals: bulk loads, template reads, audits and backups.", evidence: "sidecar/" },
          { id: "metrics", label: "Prometheus", sub: "Grafana", x: 770, y: 240, kind: "ops", detail: "prom-client exposes /metrics, which Prometheus scrapes every 15 seconds.", evidence: "prometheus/prometheus.yml" },
        ],
        edges: [["gate", "iclock", "punch"], ["iclock", "queue"], ["queue", "sidecar"], ["desk", "api", "REST"], ["api", "mongo"], ["iclock", "api"], ["api", "socket"], ["socket", "desk"], ["socket", "public"], ["api", "notify"], ["api", "metrics"]],
        trace: {
          title: "Follow a scan",
          steps: [
            { node: "gate", text: "A student places a finger on the gate terminal, which pushes the punch to the backend." },
            { node: "iclock", text: "The listener checks the source IP and the registered serial before accepting it." },
            { node: "api", text: "The pipeline rejects blocked students, checks warden rules and works out direction from today's last log." },
            { node: "mongo", text: "The movement is stored as an EntryLog with a lateReturn flag if it is past curfew." },
            { node: "socket", text: "The event is broadcast to connected clients at once." },
            { node: "desk", text: "The dashboard updates without a refresh." },
            { node: "notify", text: "A parent alert goes out asynchronously, after the scan has already returned." },
          ],
        },
      },
      {
        id: "deploy",
        title: "Deployment",
        caption: "From git push to ECS Fargate. Taken from deploy.yml and the deployment guide.",
        height: 330,
        nodes: [
          { id: "gh", label: "GitHub", sub: "push to main", x: 20, y: 130, kind: "ops", detail: "A push to main triggers the workflow.", evidence: ".github/workflows/deploy.yml" },
          { id: "gha", label: "GitHub Actions", sub: "Jest · Vitest", x: 210, y: 130, kind: "ops", detail: "The test job must pass before the deploy job runs.", evidence: ".github/workflows/deploy.yml" },
          { id: "dock", label: "Docker build", sub: "frontend · backend", x: 400, y: 130, kind: "ops", detail: "Two images, each tagged with the commit SHA.", evidence: "Dockerfile" },
          { id: "ecr", label: "Amazon ECR", sub: "Registry", x: 590, y: 30, kind: "ops", detail: "Stores the images that ECS pulls." },
          { id: "ecs", label: "ECS Fargate", sub: "Two services", x: 590, y: 230, kind: "ops", detail: "The workflow renders a new task definition and waits for service stability." },
          { id: "alb", label: "ALB", sub: "/ and /api/*", x: 780, y: 230, kind: "ops", detail: "Routes / to the frontend target group and /api/* to the backend." },
        ],
        edges: [["gh", "gha"], ["gha", "dock"], ["dock", "ecr"], ["ecr", "ecs"], ["ecs", "alb"]],
        trace: {
          title: "Follow a deployment",
          steps: [
            { node: "gh", text: "A commit lands on main." },
            { node: "gha", text: "Backend and frontend tests run first. A failure stops everything." },
            { node: "dock", text: "Both images build, tagged with the commit SHA." },
            { node: "ecr", text: "Images are pushed to Amazon ECR." },
            { node: "ecs", text: "New task definitions roll out and the workflow waits for stability." },
            { node: "alb", text: "Traffic reaches the new tasks through the load balancer." },
          ],
        },
      },
    ],
  },
  {
    slug: "smart-form",
    name: "Smart Form Autofill",
    tagline: "An AI agent that fills government and admission forms from your own documents, and never presses submit.",
    kind: "Full-stack AI system",
    status: "End-to-end tests running in CI",
    repo: "https://github.com/Sanket1516/Smart-Form-autofilling",
    featured: true,
    accent: "green",
    demo: "review",
    stack: ["FastAPI", "LangGraph", "MongoDB", "ChromaDB", "RapidOCR", "Celery", "Redis", "React", "TypeScript", "Chrome MV3"],
    problem:
      "People retype the same identity, academic and financial details into admissions, scholarship and government forms, copying by hand from scans. It is slow, error-prone, and leaves no record of where a value came from.",
    solution:
      "Documents become verified facts with their source, page and confidence. A browser extension detects fields, recommends values, and fills only what the user approved, then re-reads the page to prove it worked.",
    role:
      "Built the system: the FastAPI backend, document pipeline, field-classification graph, React dashboard, Chrome extension and test suites.",
    metrics: [
      { value: "70+", label: "API routes" },
      { value: "~150", label: "Canonical profile concepts" },
      { value: "239", label: "Backend tests passing, 15 Oct 2026" },
      { value: "0", label: "Forms ever auto-submitted" },
    ],
    overview: [
      "Three parts work together: a FastAPI backend that turns documents into facts, a React dashboard for managing and correcting those facts, and a Manifest V3 extension that works on whatever form the user opens.",
      "Deterministic rules run first: label matching, validated identifier checksums and table parsing. An optional LLM only fills the gaps, and its output is schema-validated before use.",
      "The review step is the product. Every value shows its source document and page, and sensitive fields need an explicit tick.",
    ],
    backend: [
      "Uploads go through a pipeline of parsing, OCR for scans, deterministic and LLM extraction, then a merge that keeps provenance. Compose runs this with Celery and Redis; local development can run it inline.",
      "Form analysis is one LangGraph pipeline: classify fields, resolve from profile facts, then fall back to document retrieval, ending in a confidence-gated recommendation.",
      "LLM providers are pluggable (Google, OpenAI, Anthropic, Ollama and a mock), and the default test suite runs on the mock.",
    ],
    data: [
      "MongoDB is the source of truth. structured_facts holds sourced values a user can confirm, and discovered_facts keeps every extracted attribute, including tables such as marksheet subjects.",
      "ChromaDB holds document chunks using all-MiniLM-L6-v2 at 384 dimensions. Every read and write is filtered by user_id, and there is deliberately no in-memory fallback.",
      "All values map onto an ontology of about 150 concepts, shared by extraction and form classification.",
    ],
    api: [
      "REST routes cover auth, documents and facts, profile, reviews, form sessions, retrieval, and exam readiness, with OpenAPI docs generated by FastAPI.",
      "POST /forms/sessions/{id}/analyze returns recommendations. POST /forms/sessions/{id}/verify records which values were actually applied and verified.",
      "Ask Documents answers from structured facts first and computes derived values in code. Then it makes one LLM call to compose prose, or returns the evidence alone if the LLM is unavailable.",
    ],
    security: [
      "Bearer JWTs, bcrypt, per-route rate limits, and revocation via jti with a TTL index.",
      "The extension never collects password, hidden, payment or OTP fields, and it never reads a field's current value, only whether one exists.",
      "Web page and document text reaches the LLM wrapped as untrusted content, and a heuristic quarantines likely prompt-injection text.",
    ],
    deployment: [
      "Docker Compose runs MongoDB, ChromaDB, Redis, the API, a Celery worker and an Nginx-served dashboard.",
      "GitHub Actions runs ruff, black, pytest, a real Chroma suite, typechecking and the browser flow on every push.",
    ],
    decisions: [
      { choice: "Rules first, LLM for gaps", why: "A validated checksum beats a model's guess, and the system still works with the LLM turned off." },
      { choice: "Never submit", why: "The extension fills and verifies, but a person always stays in control of the final action." },
      { choice: "Exact values never pass through the LLM", why: "Ask Documents reads facts directly and computes percentages in code, so the model only writes prose." },
      { choice: "No in-memory vector fallback", why: "If Chroma is down the system says so, rather than quietly answering from nothing." },
    ],
    challenges: [
      {
        challenge: "Filling React and Vue inputs that ignore a plain value change",
        solution: "Set values through the native property setter, dispatch input and change events, wait 80 ms, then read the DOM back to verify.",
      },
      {
        challenge: "Ambiguous fields such as date of birth versus issue date",
        solution: "Classified fields semantically against the ontology, with deterministic rules first and one batched LLM call for whatever is left.",
      },
      {
        challenge: "Hostile page content reaching the model",
        solution: "Treated all page and document text as untrusted, with escaped delimiters and quarantine for suspected injection.",
      },
    ],
    limits: [
      "Only the mock and Google LLM paths were exercised in the last documented review. The other providers are implemented but not re-verified.",
      "Scanned documents need the optional OCR models. Without them a document is marked requires_review, not guessed.",
      "Rate limiting is in-process, so a multi-replica deployment would need a shared limiter at the edge.",
      "The dashboard token lives in localStorage, a documented trade-off mitigated by CSP.",
    ],
    architecture: [
      {
        id: "runtime",
        title: "Runtime",
        caption: "Two paths share one store of facts: documents in, and forms out.",
        height: 480,
        nodes: [
          { id: "doc", label: "Upload", sub: "PDF · DOCX · image", x: 20, y: 60, kind: "client", detail: "Users add their own documents through the dashboard.", evidence: "backend/app/api/v1/documents.py" },
          { id: "pipe", label: "Document pipeline", sub: "Celery · OCR", x: 260, y: 60, kind: "service", detail: "pdfplumber, python-docx and RapidOCR with deskew and contrast correction.", evidence: "backend/app/processing/" },
          { id: "extract", label: "Extraction", sub: "Rules, then LLM", x: 500, y: 60, kind: "service", detail: "Deterministic rules first. The LLM only fills gaps, and its output is schema-validated.", evidence: "backend/app/extraction/" },
          { id: "mongo", label: "MongoDB", sub: "Facts + provenance", x: 750, y: 60, kind: "data", detail: "Each value keeps its source document, page, confidence and origin.", evidence: "backend/app/services/facts.py" },
          { id: "chroma", label: "ChromaDB", sub: "Scoped by user_id", x: 750, y: 200, kind: "data", detail: "Document chunks embedded with all-MiniLM-L6-v2 at 384 dimensions.", evidence: "backend/app/db/chroma_client.py" },
          { id: "ext", label: "Chrome extension", sub: "Manifest V3", x: 20, y: 340, kind: "client", detail: "Detects fields but never reads their current value. Injected on demand through activeTab.", evidence: "extension/src/content/detector.ts" },
          { id: "graph", label: "FormFillGraph", sub: "LangGraph", x: 260, y: 340, kind: "service", detail: "Classify, resolve from profile, fall back to retrieval, then gate by confidence.", evidence: "backend/app/agents/graph.py" },
          { id: "review", label: "Review popup", sub: "Human approval", x: 500, y: 340, kind: "client", detail: "Shows source and page for each value. Sensitive concepts need an explicit tick.", evidence: "extension/src/popup/AutofillFlow.tsx" },
          { id: "fill", label: "Fill + verify", sub: "Never submits", x: 750, y: 340, kind: "client", detail: "Uses the native setter, dispatches events, waits 80 ms and reads the DOM back.", evidence: "extension/src/content/autofill.ts" },
        ],
        edges: [["doc", "pipe"], ["pipe", "extract"], ["extract", "mongo"], ["pipe", "chroma"], ["ext", "graph", "fields"], ["graph", "review"], ["review", "fill", "ticked only"], ["mongo", "graph"], ["chroma", "graph"]],
        trace: {
          title: "Follow a form fill",
          steps: [
            { node: "ext", text: "The extension reads labels and structure, never existing values." },
            { node: "graph", text: "Fields are classified: rules first, then one batched LLM call." },
            { node: "mongo", text: "Values resolve from confirmed profile facts." },
            { node: "chroma", text: "If the profile has nothing, retrieval searches the user's own documents." },
            { node: "review", text: "The user sees every value with its source and ticks what to fill." },
            { node: "fill", text: "Approved fields are filled and verified against the live DOM. Nothing is submitted." },
          ],
        },
      },
    ],
  },
  {
    slug: "passguard",
    name: "PassGuard",
    tagline: "Watch a password survive, or not, against real attack techniques.",
    kind: "Security education platform",
    status: "Open source",
    repo: "https://github.com/Sanket1516/Cyber-Sec-Project",
    featured: true,
    accent: "amber",
    demo: "entropy",
    stack: ["Flask-SocketIO", "MongoDB", "React", "Recharts", "Tailwind", "Framer Motion"],
    problem:
      "A coloured strength bar tells people nothing about why a password is weak, or how an attacker would actually break it.",
    solution:
      "PassGuard computes entropy, detects exploitable patterns, then runs dictionary, hybrid and brute-force simulations in that order, streaming progress live to the browser.",
    role: "Built the platform: the analysis engine, attack simulators, Socket.IO streaming and the React dashboard.",
    metrics: [
      { value: "~14M", label: "RockYou passwords supported" },
      { value: "~230", label: "Mutations per word" },
      { value: "200 ms", label: "Progress update interval" },
      { value: "3", label: "Hardware tiers estimated" },
    ],
    overview: [
      "PassGuard teaches through attacks. A user enters a password, sees its entropy and detected patterns, then watches each attack run against it.",
      "The live demo on this site runs the same entropy, pattern and crack-time logic in your browser, so nothing you type leaves the page.",
    ],
    backend: [
      "A Flask app with blueprints for routes and a service per concern: analysis, dictionary, hybrid, brute force, crack time and recommendations.",
      "Each attack runs in a background thread. Attacks run in sequence and stop early on a match.",
      "The hybrid attack takes the top 10,000 passwords and applies about 230 mutations per word: capitalisation, digits, suffixes, leet speak and reversal.",
    ],
    data: [
      "MongoDB stores the password dataset plus attack logs and test history. A loader script imports RockYou, and the repository ships a 496-password sample.",
    ],
    api: [
      "REST for analysis, crack time, visualisation data and recommendations.",
      "Socket.IO streams attack_progress and attack_complete events, throttled to every 200 ms so that the UI stays smooth.",
    ],
    security: [
      "This is an educational tool, built to explain how attacks work. Simulations run only against the password a user enters themselves.",
      "Progress goes to per-session Socket.IO rooms, so that sessions do not see each other's runs.",
    ],
    deployment: ["Runs locally: Vite proxies /api and /socket.io to Flask, and start.bat brings the stack up on Windows."],
    decisions: [
      { choice: "Entropy as H = L × log₂(N)", why: "It is simple, explainable and honest about what it models, which is why pattern detection then applies penalties on top." },
      { choice: "Dictionary, then hybrid, then brute force", why: "It mirrors how a real attacker spends effort: cheapest guess first." },
      { choice: "Background threads with throttled events", why: "A scan over millions of rows cannot block the server, and 200 ms is frequent enough to feel live." },
    ],
    challenges: [
      {
        challenge: "Streaming millions of attempts without flooding the browser",
        solution: "Scanned in batches and throttled progress events to 200 ms.",
      },
      {
        challenge: "High entropy can still mean weak",
        solution: "Pa$$w0rd has 52.56 bits on paper, so the scorer subtracts for each detected pattern, and leet speak is reversed before checking common words.",
      },
    ],
    limits: [
      "Brute force is a mathematical estimate with an animated visualisation, not a real exhaustive search.",
      "The repository ships a 496-password sample. The full ~14M run needs the RockYou file imported separately.",
      "No hosted deployment or Docker setup. It runs locally.",
    ],
    architecture: [
      {
        id: "runtime",
        title: "Runtime",
        caption: "A POST starts an attack. Progress flows back over a socket.",
        height: 320,
        nodes: [
          { id: "ui", label: "React dashboard", sub: "Vite · Recharts", x: 20, y: 120, kind: "client", detail: "Eight routed pages, from password input through attack results to recommendations.", evidence: "frontend/src/pages/" },
          { id: "flask", label: "Flask API", sub: "Blueprints", x: 260, y: 30, kind: "service", detail: "REST routes for analysis, attacks, crack time and recommendations.", evidence: "backend/routes/" },
          { id: "socket", label: "Socket.IO", sub: "Per-session rooms", x: 260, y: 210, kind: "service", detail: "Streams attack_progress and attack_complete events.", evidence: "backend/sockets/attack_events.py" },
          { id: "worker", label: "Attack threads", sub: "Dict · hybrid · brute", x: 510, y: 120, kind: "service", detail: "Background threads, so that a long scan never blocks a request.", evidence: "backend/services/" },
          { id: "mongo", label: "MongoDB", sub: "RockYou dataset", x: 750, y: 120, kind: "data", detail: "Password dataset, attack logs and test history.", evidence: "backend/utils/dataset_loader.py" },
        ],
        edges: [["ui", "flask", "POST"], ["flask", "worker"], ["worker", "mongo"], ["worker", "socket", "progress"], ["socket", "ui"]],
        trace: {
          title: "Follow an attack",
          steps: [
            { node: "ui", text: "The user starts the attacks. The frontend posts the password and session ID." },
            { node: "flask", text: "The route spawns a background thread and returns." },
            { node: "worker", text: "The thread scans in batches and generates mutations." },
            { node: "mongo", text: "Candidates are checked against the dataset." },
            { node: "socket", text: "Progress is emitted every 200 ms to the session's room." },
            { node: "ui", text: "Bars and counters update live, then the next attack begins." },
          ],
        },
      },
    ],
  },
  {
    slug: "dpi-engine",
    name: "DPI Engine",
    tagline: "A multi-threaded C++ packet inspector that names encrypted traffic from a single handshake.",
    kind: "Systems programming",
    status: "Open source",
    repo: "https://github.com/Sanket1516/Packet_analyzer",
    featured: true,
    accent: "rose",
    demo: "flow",
    stack: ["C++17", "Multithreading", "PCAP", "TLS", "Flask"],
    problem:
      "A firewall that only sees IPs and ports cannot tell YouTube from any other HTTPS traffic. The payload is encrypted, but the handshake is not.",
    solution:
      "Parse packets by hand from Ethernet to TCP, then read the domain from the TLS ClientHello's SNI extension or the HTTP Host header. Apply blocking rules per flow across a multi-threaded pipeline.",
    role: "Built the engine: parsers, SNI extraction, the threaded pipeline, the rule manager and a Flask web dashboard.",
    metrics: [
      { value: "2 + 4", label: "LB and worker threads by default" },
      { value: "5", label: "Fields in the flow hash" },
      { value: "0x16", label: "The byte that starts it all" },
      { value: "17", label: "Named applications identified" },
    ],
    overview: [
      "The engine reads a PCAP capture, identifies applications, drops anything matching a rule, and writes a filtered PCAP plus a traffic report.",
      "It comes in two versions: a single-threaded one for learning, and a multi-threaded pipeline of reader, load-balancer, fast-path and writer threads.",
    ],
    backend: [
      "A reader thread hashes each packet's five-tuple to pick a load balancer, which hashes again to pick a fast-path worker.",
      "Each worker owns its flow table, so it needs no lock on the flow lookup. Once one packet of a connection is classified, every packet in that flow is handled the same way.",
      "Stages communicate through a thread-safe queue built on a mutex and condition variables.",
    ],
    data: [
      "Flows are keyed by the five-tuple: source IP, destination IP, source port, destination port and protocol.",
      "Rules block by application, domain or IP.",
    ],
    api: [
      "A small Flask server and HTML dashboard wrap the engine for browser use, with a Procfile for gunicorn.",
    ],
    security: [
      "SNI is readable because it travels in plaintext during the handshake, before encryption starts. The parser checks the record type (0x16), handshake type (0x01) and extension type (0x0000) before trusting any offset.",
    ],
    deployment: ["Compiles to a native binary. The web dashboard runs under Flask or gunicorn."],
    decisions: [
      { choice: "Hash on the five-tuple", why: "Every packet of a flow lands on one worker, so each flow's state stays on one thread." },
      { choice: "One flow table per worker", why: "It avoids a shared lock on the hottest path." },
      { choice: "Parse by hand", why: "Working from raw bytes means understanding every header offset rather than trusting a library." },
    ],
    challenges: [
      {
        challenge: "Keeping a flow's verdict consistent",
        solution: "Tracked state per flow, so that blocking one packet of a connection blocks the rest of it.",
      },
      {
        challenge: "Walking a variable-length ClientHello safely",
        solution: "Stepped through session ID, cipher suites and compression lengths, then searched extensions for type 0x0000 with a bounds check at each step.",
      },
    ],
    limits: [
      "It works on PCAP captures, not on a live network interface.",
      "ECH (Encrypted ClientHello) would hide the SNI this engine relies on.",
      "The two hash stages share one hash and modulus, so with the default 2×2 config two of the four workers receive no packets. The fix is known: derive the second index from different bits.",
    ],
    architecture: [
      {
        id: "runtime",
        title: "Runtime",
        caption: "The multi-threaded pipeline. Each arrow is a thread-safe queue.",
        height: 400,
        nodes: [
          { id: "pcap", label: "PCAP input", sub: "Capture file", x: 20, y: 160, kind: "client", detail: "Packets read from a capture file." },
          { id: "reader", label: "Reader thread", sub: "Parse + hash", x: 200, y: 160, kind: "service", detail: "Parses headers and hashes the five-tuple to pick a load balancer.", evidence: "src/dpi_mt.cpp" },
          { id: "lb0", label: "LB 0", sub: "Load balancer", x: 390, y: 70, kind: "service", detail: "Hashes the tuple to pick a fast-path worker.", evidence: "src/load_balancer.cpp" },
          { id: "lb1", label: "LB 1", sub: "Load balancer", x: 390, y: 250, kind: "service", detail: "Second load balancer, with its own workers.", evidence: "src/load_balancer.cpp" },
          { id: "fp0", label: "FP 0–1", sub: "Fast path", x: 590, y: 70, kind: "service", detail: "Each worker owns a flow table, extracts SNI and checks rules.", evidence: "src/fast_path.cpp" },
          { id: "fp1", label: "FP 2–3", sub: "Fast path", x: 590, y: 250, kind: "service", detail: "Same logic, with independent flow state.", evidence: "src/fast_path.cpp" },
          { id: "out", label: "Writer thread", sub: "Filtered PCAP", x: 780, y: 160, kind: "data", detail: "Writes forwarded packets and the final report.", evidence: "src/dpi_mt.cpp" },
        ],
        edges: [["pcap", "reader"], ["reader", "lb0"], ["reader", "lb1"], ["lb0", "fp0"], ["lb1", "fp1"], ["fp0", "out"], ["fp1", "out"]],
        trace: {
          title: "Follow a packet",
          steps: [
            { node: "pcap", text: "A packet is read from the capture." },
            { node: "reader", text: "Ethernet, IP and TCP headers are parsed, and the five-tuple is hashed." },
            { node: "lb0", text: "The load balancer picks a worker from the same flow hash." },
            { node: "fp0", text: "The worker finds the flow, extracts the SNI and checks the rules." },
            { node: "out", text: "Allowed packets are written. Blocked ones are counted and dropped." },
          ],
        },
      },
    ],
  },
  {
    slug: "metromind",
    name: "MetroMind",
    tagline: "A document platform with OCR, semantic search and workflows behind an API gateway.",
    kind: "Service-oriented backend",
    status: "Open source",
    repo: "https://github.com/Sanket1516/metromind-ai-dms",
    featured: false,
    accent: "violet",
    stack: ["FastAPI", "PostgreSQL", "Redis", "FAISS", "ChromaDB", "React", "TypeScript", "Docker", "Prometheus", "Grafana"],
    problem: "Organisations receive documents from email, portals and scans, where files stay unsearchable and disconnected from the work around them.",
    solution: "Turn raw files into searchable, role-controlled knowledge with OCR, embeddings, notifications and workflows.",
    role: "Built the service layer, the search and OCR pipeline, and the React frontend.",
    metrics: [
      { value: "13", label: "Services behind the gateway" },
      { value: "2", label: "Vector stores supported" },
    ],
    overview: [
      "MetroMind is a microservice-style system in one repository: independently structured FastAPI services behind an API gateway, with a separate React frontend.",
    ],
    backend: ["Services cover auth, documents, OCR, AI/ML, search, notifications, integrations, analytics, tasks, workflows, security, backup and reporting."],
    data: ["PostgreSQL holds transactional data. Redis supports auth and notifications. FAISS and ChromaDB handle similarity search."],
    api: ["The React frontend talks to the gateway, with WebSocket notifications for real-time updates."],
    security: ["JWT authentication and role-based access control."],
    deployment: ["Docker Compose brings up the services, with Prometheus and Grafana for observability."],
    decisions: [
      { choice: "Separate services by domain", why: "OCR and AI are heavy, so keeping them apart leaves room to scale them independently." },
      { choice: "PostgreSQL plus a vector store", why: "Transactions and similarity search have different needs." },
    ],
    challenges: [
      { challenge: "Keeping many services coherent", solution: "One lesson of the project: as services grew, documentation and orchestration needed consolidating too." },
    ],
    limits: [
      "The repository's own notes record gaps: the gateway is partly in transition, some docs drift from the code, and some scripts and ports are inconsistent.",
      "Some modules are more production-ready than others.",
    ],
    architecture: [
      {
        id: "runtime",
        title: "Runtime",
        caption: "A gateway in front of domain services.",
        height: 300,
        nodes: [
          { id: "fe", label: "React frontend", sub: "TypeScript", x: 20, y: 110, kind: "client", detail: "The web dashboard. A browser extension also connects." },
          { id: "gw", label: "API Gateway", sub: "FastAPI", x: 260, y: 110, kind: "service", detail: "The single entry point to the services.", evidence: "services/api_gateway.py" },
          { id: "svc", label: "Domain services", sub: "13 FastAPI apps", x: 510, y: 110, kind: "service", detail: "Auth, documents, OCR, AI/ML, search, notifications, integrations, analytics, tasks, workflows, security, backup and reporting.", evidence: "services/" },
          { id: "pg", label: "PostgreSQL", sub: "Transactions", x: 750, y: 30, kind: "data", detail: "Primary business data." },
          { id: "vec", label: "FAISS / Chroma", sub: "Vector search", x: 750, y: 190, kind: "data", detail: "Semantic search over embeddings." },
        ],
        edges: [["fe", "gw"], ["gw", "svc"], ["svc", "pg"], ["svc", "vec"]],
      },
    ],
  },
  {
    slug: "wanderlust",
    name: "Wanderlust",
    tagline: "A stay-booking marketplace, from search to payment to messaging.",
    kind: "Full-stack web application",
    status: "Open source",
    repo: "https://github.com/Sanket1516/Wanderlust-master",
    featured: false,
    accent: "blue",
    stack: ["Node.js", "Express", "MongoDB", "EJS", "Passport", "Cloudinary", "Mapbox", "Razorpay"],
    problem: "A booking platform needs discovery, trust, payments, messaging and moderation to work together in one product.",
    solution: "An MVC monolith covering the whole journey, with maps, image hosting, payments and AI helpers integrated.",
    role: "Built the full application: data models, routes, auth, payments, integrations and the admin dashboard.",
    metrics: [
      { value: "5", label: "Core data models" },
      { value: "8", label: "Route modules" },
      { value: "3", label: "User roles" },
    ],
    overview: ["Guests browse, save, book, pay, review and message hosts. Hosts manage listings, and admins moderate from a protected dashboard."],
    backend: ["An Express MVC app with routes for listings, bookings, reviews, messages, wishlists, users, admin and AI."],
    data: ["MongoDB models for users, listings, bookings, reviews and messages, related through Mongoose references."],
    api: ["Server-rendered EJS pages, with Razorpay order creation and payment verification on the server."],
    security: ["Passport local authentication, plus middleware for authorization and validation."],
    deployment: ["Runs as one deployable Node application."],
    decisions: [
      { choice: "Monolith", why: "Easier to build, test and reason about at this scope." },
      { choice: "Server-side rendering with EJS", why: "A simple fit for forms and multi-page flows." },
    ],
    challenges: [{ challenge: "Handling payments safely", solution: "Created Razorpay orders on the server and verified each payment before confirming a booking." }],
    limits: ["No automated test suite or Docker setup yet.", "No webhook-based payment reconciliation or refund automation.", "Messaging is not real-time."],
    architecture: [
      {
        id: "runtime",
        title: "Runtime",
        caption: "One Express app, four outside services.",
        height: 300,
        nodes: [
          { id: "b", label: "Browser", sub: "EJS pages", x: 20, y: 110, kind: "client", detail: "Server-rendered pages." },
          { id: "app", label: "Express MVC", sub: "8 route modules", x: 280, y: 110, kind: "service", detail: "Routes, controllers and middleware in one deployable app." },
          { id: "db", label: "MongoDB", sub: "5 models", x: 540, y: 20, kind: "data", detail: "Users, listings, bookings, reviews and messages." },
          { id: "pay", label: "Razorpay", sub: "Payments", x: 540, y: 200, kind: "external", detail: "Orders created and verified on the server." },
          { id: "cdn", label: "Cloudinary", sub: "Images", x: 770, y: 20, kind: "external", detail: "Listing image hosting." },
          { id: "map", label: "Mapbox", sub: "Geocoding", x: 770, y: 200, kind: "external", detail: "Maps and geocoding for listings." },
        ],
        edges: [["b", "app"], ["app", "db"], ["app", "pay"], ["app", "cdn"], ["app", "map"]],
      },
    ],
  },
  {
    slug: "clause-search",
    name: "Clause Search",
    tagline: "Contract retrieval that shows its evidence, and measures itself on held-out data.",
    kind: "Information retrieval",
    status: "Open source",
    repo: "https://github.com/Sanket1516/clause-finder-cuad",
    featured: false,
    accent: "green",
    stack: ["Python", "BM25", "Typer", "Streamlit", "pytest"],
    problem: "Teams read whole contracts to answer questions such as “is there an anti-assignment clause?”.",
    solution: "Return ranked passages with exact character offsets, or abstain when the evidence is too weak. No LLM anywhere.",
    role: "Built the retrieval system, evaluation harness and logged improvement loop.",
    metrics: [
      { value: "0.043 → 0.448", label: "Recall@4 on 54 held-out questions" },
      { value: "15", label: "Pre-registered experiments" },
      { value: "272/272", label: "Gold snippets offset-valid" },
    ],
    overview: ["Built on the CUAD portion of LegalBench-RAG: 194 queries over 29 contracts. BM25 is written in-repo, so every score can be explained."],
    backend: ["Pipeline: route to the named contract, BM25 over chunks, remove overlaps, then an abstention gate."],
    data: ["Chunks are spans over the original text, and document[start:end] == passage is asserted at build time and again before display."],
    api: ["A CLI (search, evaluate, configs) and a Streamlit app share one engine."],
    security: ["Everything runs locally, because contracts are confidential. No API keys or external services at run time."],
    deployment: ["A local Python package, with configuration in YAML."],
    decisions: [
      { choice: "No LLM", why: "Contracts are confidential, and a lexical baseline already gave a measurable signal." },
      { choice: "Pre-registered candidates", why: "Fixing the catalogue first limits over-fitting on 140 training queries." },
    ],
    challenges: [{ challenge: "Improving without peeking", solution: "Used a train-only loop with a guard keeping the test split away from development: 3 candidates accepted, 12 rejected." }],
    limits: ["Abstention is the weak part: it correctly refuses 3 of 10 unanswerable test questions.", "Dense retrieval was not tested, so no claim is made against it."],
    architecture: [
      {
        id: "runtime",
        title: "Runtime",
        caption: "From a question to ranked evidence, or to silence.",
        height: 260,
        nodes: [
          { id: "q", label: "Question", sub: "Natural language", x: 20, y: 90, kind: "client", detail: "A plain-English question about a contract." },
          { id: "r", label: "Router", sub: "Pick the contract", x: 210, y: 90, kind: "service", detail: "Uses the named title to choose the contract, then ranks clauses inside it." },
          { id: "b", label: "BM25", sub: "Written in-repo", x: 400, y: 90, kind: "service", detail: "About 40 lines, and every score is explainable." },
          { id: "g", label: "Abstention gate", sub: "Normalised score", x: 590, y: 90, kind: "service", detail: "Top BM25 score divided by the question's idf mass, thresholded on train." },
          { id: "o", label: "Evidence", sub: "Exact offsets", x: 780, y: 90, kind: "data", detail: "Ranked passages with document and character offsets, or a clear no-answer." },
        ],
        edges: [["q", "r"], ["r", "b"], ["b", "g"], ["g", "o"]],
      },
    ],
  },
  {
    slug: "claim-fraud",
    name: "Claim Fraud Scoring",
    tagline: "Reads patient-claim PDFs and flags inconsistencies for human review.",
    kind: "Document intelligence",
    status: "Open source",
    repo: "https://github.com/Sanket1516/SCAM-and-Fraud-Detection",
    featured: false,
    accent: "amber",
    stack: ["Python", "Flask", "Docling", "OCR", "Docker", "pytest"],
    problem: "Tampered or inconsistent claim documents are hard to catch by reading each page by hand.",
    solution: "Extract structured data with OCR, then run explainable consistency rules that produce a 0–100 risk score.",
    role: "Built the parser, rule engine, Flask UI and tests.",
    metrics: [
      { value: "0–100", label: "Explained risk score" },
      { value: "8", label: "Rule areas" },
    ],
    overview: ["Claims go through OCR and table extraction, then a stdlib-only rule engine that checks identity, dates, IDs, vitals and completeness."],
    backend: ["Flags carry severity weights: high 30, medium 15, low 5, capped at 100."],
    data: ["Outputs Markdown, tables and JSON, with a fraud_analysis block."],
    api: ["A Flask UI, plus POST /api/upload and GET /health."],
    security: ["Flags documents for human review. It does not prove fraud."],
    deployment: ["Docker Compose, needed for Surya OCR, with RapidOCR as the local fallback."],
    decisions: [{ choice: "Rules over a model", why: "Every flag can be explained, and the detector can be tested without OCR models." }],
    challenges: [{ challenge: "Testing without heavy OCR dependencies", solution: "Kept the detector stdlib-only, so that tests run without Docling or models." }],
    limits: ["The score is a prompt for human review, not a verdict."],
    architecture: [
      {
        id: "runtime",
        title: "Runtime",
        caption: "Three stages, each testable alone.",
        height: 240,
        nodes: [
          { id: "pdf", label: "Claim PDF", sub: "Upload", x: 40, y: 80, kind: "client", detail: "A patient claim document." },
          { id: "parse", label: "claim_parser", sub: "Docling + OCR", x: 300, y: 80, kind: "service", detail: "OCR and table extraction into Markdown and JSON." },
          { id: "rules", label: "fraud_detector", sub: "Rule engine", x: 560, y: 80, kind: "service", detail: "Consistency rules producing explained flags." },
          { id: "out", label: "Risk report", sub: "Score + flags", x: 780, y: 80, kind: "data", detail: "risk_score, risk_level and the list of flags." },
        ],
        edges: [["pdf", "parse"], ["parse", "rules"], ["rules", "out"]],
      },
    ],
  },
  {
    slug: "site",
    name: "This site",
    tagline: "The portfolio is a project too. Here is how it works.",
    kind: "Next.js · WebGL2",
    status: "You are looking at it",
    repo: null,
    featured: false,
    accent: "blue",
    stack: ["Next.js", "TypeScript", "Tailwind", "WebGL2", "Motion"],
    problem: "A portfolio has to prove engineering, not just claim it, without becoming slow.",
    solution: "Static pages with hourly-revalidated GitHub data, one hand-written WebGL2 scene, and demos that run real project logic in the browser.",
    role: "Designed and built it.",
    metrics: [
      { value: "368", label: "Real days drawn as towers" },
      { value: "0", label: "3D libraries shipped" },
      { value: "1 h", label: "GitHub revalidation window" },
    ],
    overview: [
      "The skyline in the hero is my real GitHub contribution history: one tower per day, drawn with instanced WebGL2 and no 3D library. Hovering casts a ray through the grid to find the day under the cursor.",
    ],
    backend: [
      "Pages are statically generated. GitHub data is fetched on the server and revalidated hourly.",
      "If GitHub is unreachable, the site falls back to a committed snapshot and labels it as such.",
    ],
    data: ["All content lives in typed data files. The terminal, the constellation and the case studies read from the same source, so they cannot disagree."],
    api: ["POST /api/contact validates input, uses a honeypot and a per-IP limit, and sends through Resend when configured."],
    security: ["GitHub and mail tokens stay on the server. Nothing secret reaches the client bundle."],
    deployment: ["A standard Next.js build."],
    decisions: [
      { choice: "Raw WebGL2 over three.js", why: "The scene needs one instanced mesh and a ground plane, which is not worth a library." },
      { choice: "Server fetch with a snapshot fallback", why: "No loading spinner on first paint, and no fabricated data when the API fails." },
    ],
    challenges: [{ challenge: "Motion without hurting load", solution: "The WebGL scene loads after the page, pauses off-screen, and respects reduced motion." }],
    limits: ["Contribution data comes from GitHub's public calendar page, so a change to that markup triggers the snapshot fallback."],
    architecture: [
      {
        id: "runtime",
        title: "Runtime",
        caption: "How GitHub data reaches the page.",
        height: 260,
        nodes: [
          { id: "gh", label: "GitHub", sub: "REST + calendar", x: 20, y: 90, kind: "external", detail: "Public REST API and the public contribution calendar." },
          { id: "isr", label: "Next.js server", sub: "1 h revalidate", x: 280, y: 20, kind: "service", detail: "Fetches on the server, so tokens stay private and the browser gets finished HTML.", evidence: "lib/github.ts" },
          { id: "snap", label: "Snapshot", sub: "Committed JSON", x: 280, y: 170, kind: "data", detail: "The fallback when GitHub fails. Generated by a script, never hand-edited.", evidence: "data/github-snapshot.json" },
          { id: "page", label: "Static page", sub: "HTML + props", x: 540, y: 90, kind: "service", detail: "Rendered ahead of time and cached." },
          { id: "you", label: "Your browser", sub: "WebGL2 skyline", x: 780, y: 90, kind: "client", detail: "Hydrates the interactive parts and draws the real data." },
        ],
        edges: [["gh", "isr"], ["isr", "page"], ["snap", "page", "on failure"], ["page", "you"]],
      },
    ],
  },
];

export const featured = projects.filter((p) => p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
