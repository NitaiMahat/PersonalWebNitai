export type Project = {
  slug: string;
  name: string;
  tagline: string;
  status: "Live" | "Featured" | "Hackathon" | "Research" | "Desktop";
  accent: string;
  summary: string;
  tech: string[];
  tags: string[];
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "earth-twin",
    name: "Earth Twin",
    tagline: "AI-powered environmental planning platform",
    status: "Featured",
    accent: "#3fb6ff",
    summary:
      "Built an AI platform that turns natural-language construction requests into live geospatial simulations and sustainability insights.",
    tech: ["FastAPI", "Python", "PostgreSQL", "Supabase", "Gemini", "React", "Cesium"],
    tags: ["Featured", "Full Stack", "AI/ML", "Python"],
    highlights: [
      "Reduced environmental impact assessment workflows from months to seconds with real-time simulation.",
      "Converted natural-language infrastructure requests into structured planning inputs and AI-generated reports.",
      "Owned backend APIs, ingestion, and persistence for interactive what-if analysis.",
    ],
  },
  {
    slug: "atlas-jobs",
    name: "Atlas Jobs",
    tagline: "Distributed job processing system",
    status: "Featured",
    accent: "#7c83ff",
    summary:
      "Engineered a horizontally scalable worker system focused on reliability, throughput, and safe recovery after crashes.",
    tech: ["Java", "Spring Boot", "PostgreSQL", "Docker", "Flyway", "k6"],
    tags: ["Featured", "Backend", "Java"],
    highlights: [
      "Handled 145+ req/s at 0% failure using PostgreSQL row-level locking and scaled workers.",
      "Improved throughput from 0.67 to 1.64 jobs/s with atomic claim-and-update transitions.",
      "Prevented job loss with stale RUNNING recovery and idempotency-key dedupe for safe re-queues.",
    ],
  },
  {
    slug: "gus-marketplace",
    name: "GUS Marketplace",
    tagline: "Marketplace platform with secure media uploads",
    status: "Live",
    accent: "#36d6c3",
    summary:
      "Shipped a production marketplace with authenticated CRUD, secure image uploads, and a React plus Spring Boot architecture.",
    tech: ["Next.js", "React", "Spring Boot", "MongoDB", "AWS S3", "GCP Cloud Run", "Docker"],
    tags: ["Featured", "Full Stack", "Java"],
    highlights: [
      "Supported 100+ users and 120+ listings with authenticated listing management and protected views.",
      "Integrated JWT auth, owner-based authorization, and presigned S3 uploads for secure image handling.",
      "Deployed with Docker and Cloud Run for zero-downtime releases.",
    ],
  },
  {
    slug: "course-planning-assistant",
    name: "Course Planning Assistant",
    tagline: "Hackathon-built academic planning system",
    status: "Hackathon",
    accent: "#f59e0b",
    summary:
      "Led a hackathon team to build a role-based planning platform for course scheduling, demand forecasting, and graduation tracking.",
    tech: ["Flask", "SQLAlchemy", "SQLite", "JavaScript", "HTML", "CSS"],
    tags: ["Full Stack", "Python", "Hackathon"],
    highlights: [
      "Designed a multi-role system for students, advisors, professors, and department chairs.",
      "Implemented predictive conflict detection and demand forecasting using enrollment overlap and course rarity.",
      "Modeled 8+ interconnected tables and delivered dashboards, exports, and academic progress tracking.",
    ],
  },
  {
    slug: "used-car-price-prediction",
    name: "Used Car Price Prediction",
    tagline: "ML pricing app with API and web UI",
    status: "Featured",
    accent: "#ef5da8",
    summary:
      "Built an end-to-end machine learning app that predicts used car prices from a 100K+ record dataset and serves results through a Flask API.",
    tech: ["Python", "scikit-learn", "pandas", "Flask", "JavaScript", "HTML", "CSS"],
    tags: ["AI/ML", "Python", "Full Stack"],
    highlights: [
      "Trained and compared 4 regression models with cross-validation and achieved an R^2 score of 0.7-0.9.",
      "Engineered derived features like vehicle age and price-per-mile to improve predictive performance.",
      "Connected a responsive frontend to a Flask backend for real-time predictions and model metadata.",
    ],
  },
  {
    slug: "real-time-chat-application",
    name: "Real-Time Chat Application",
    tagline: "WebSocket messaging with Spring Boot",
    status: "Featured",
    accent: "#fb7185",
    summary:
      "Created a multi-user chat app with instant WebSocket messaging, persistent user data, and secure registration.",
    tech: ["Spring Boot", "WebSocket", "STOMP", "SockJS", "MySQL", "JPA", "Bootstrap"],
    tags: ["Full Stack", "Java", "Backend"],
    highlights: [
      "Delivered real-time bidirectional messaging without refresh using WebSocket and STOMP.",
      "Integrated Spring Data JPA with MySQL for persistent user records and fast repository queries.",
      "Secured account creation with BCrypt password hashing and email uniqueness validation.",
    ],
  },
  {
    slug: "expense-tracker-application",
    name: "Expense Tracker Application",
    tagline: "Desktop finance tracker with analytics",
    status: "Desktop",
    accent: "#22c55e",
    summary:
      "Developed a Tkinter desktop app for tracking expenses, visualizing spending, and managing buying-list tasks.",
    tech: ["Python", "Tkinter", "SQLite", "Matplotlib"],
    tags: ["Desktop", "Python"],
    highlights: [
      "Implemented full CRUD, multi-criteria search, totals, and printable reporting for expense records.",
      "Added pie charts and bar graphs for expense visualization directly from SQLite data.",
      "Built a separate persistent buying-list module with completion tracking and responsive UI feedback.",
    ],
  },
  {
    slug: "screen-recorder-project",
    name: "Screen Recorder Project",
    tagline: "Cross-platform screen capture desktop app",
    status: "Desktop",
    accent: "#38bdf8",
    summary:
      "Built a responsive screen recorder with multithreaded capture, hotkeys, and automatic file management.",
    tech: ["Python", "OpenCV", "Tkinter", "NumPy"],
    tags: ["Desktop", "Python"],
    highlights: [
      "Maintained smooth GUI responsiveness during recording with a multithreaded capture pipeline.",
      "Controlled recording at 15 FPS with timing logic to balance video quality and system usage.",
      "Added hotkeys, timestamped file naming, and cross-platform desktop path handling.",
    ],
  },
  {
    slug: "hospital-management-system",
    name: "Hospital Management System",
    tagline: "Spring Boot patient management backend",
    status: "Featured",
    accent: "#a78bfa",
    summary:
      "Architected a hospital management backend with layered Spring Boot services, PostgreSQL persistence, and tested repository logic.",
    tech: ["Java 21", "Spring Boot", "Spring Data JPA", "PostgreSQL", "Hibernate", "JUnit 5"],
    tags: ["Backend", "Java"],
    highlights: [
      "Designed a normalized schema with unique constraints, composite indexes, and foreign-key relationships.",
      "Implemented custom repository queries for date-range search, fuzzy name lookup, and blood-group analytics.",
      "Added unit and integration tests across repository and service layers.",
    ],
  },
  {
    slug: "clustering-research-paper",
    name: "Clustering Algorithms Research Paper",
    tagline: "Comparative analysis of unsupervised methods",
    status: "Research",
    accent: "#f97316",
    summary:
      "Conducted a comparative study of clustering algorithms to evaluate which methods work best across different data scenarios.",
    tech: ["WEKA", "K-Means", "DBSCAN", "BIRCH", "Spectral Clustering"],
    tags: ["Research", "AI/ML"],
    highlights: [
      "Compared K-Means, Agglomerative, Spectral, DBSCAN, and BIRCH on strengths, limits, and dataset fit.",
      "Used the Iris dataset in WEKA alongside literature review to evaluate performance and interpretability.",
      "Documented how parameter choices and data distribution affect clustering outcomes.",
    ],
  },
];

export const projectFilters = [
  "All",
  "Featured",
  "Full Stack",
  "Backend",
  "AI/ML",
  "Java",
  "Python",
  "Desktop",
  "Research",
] as const;

export type ProjectFilter = (typeof projectFilters)[number];
