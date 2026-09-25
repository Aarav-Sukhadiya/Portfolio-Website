export const portfolio = {
  name: "Aarav Sukhadiya",
  role: "Software Engineering Student",
  bio: "First-year Computer Science undergraduate at Scaler School of Technology, concurrently pursuing a BS in Data Science and Applications from IIT Madras.",
  about: {
    intro: "I'm drawn to problems that sit between systems, model architectures, and learning — working primarily across LLMs, supervised learning pipelines, and computer vision (like DFdetect). I prepare thoroughly before I build—researching, prototyping, and defending design choices—and I'm most engaged by engineering work where the models measurably affect the people using them. Oh, and I use Arch btw.",
    focus: "LLMs, Supervised Learning, Deepfake Detection",
    location: "Bengaluru, Karnataka, India",
    experience: "Student Developer",
    interests: "Local LLMs, Model Compression, Machine Learning",
  },
  skills: {
    languages: ["Python", "C++", "CUDA", "SQL"],
    frontend: ["HTML", "Tailwind CSS", "React", "Gradio"],
    backend: ["PyTorch", "FastAPI", "SQLite"],
    tools: ["Git", "Docker", "Linux", "MCP"]
  },
  projects: [
    {
      id: "project-1",
      name: "LLM From Scratch",
      description: "An educational project implementing a Generative Pre-trained Transformer (GPT) language model from scratch using PyTorch.",
      technologies: ["Python 3.11", "PyTorch", "CUDA", "tiktoken"],
      challenge: "Building a highly optimized, fully vectorized Multi-Head Attention layer and custom BPE tokenization pipeline.",
      outcome: "Successfully implemented Token Embeddings, Positional Embeddings, and Causal Masking, running on a small text corpus.",
      github: "https://github.com/Aarav-Sukhadiya/llm-from-scratch",
    },
    {
      id: "featured",
      name: "CleanFlowEnv",
      description: "OpenEnv-Compliant Environment for AI Data-Cleaning Agents. Built an environment that benchmarks AI agents on real-world data-cleaning and ETL tasks.",
      technologies: ["Python", "FastAPI", "Docker", "Pydantic v2", "MCP"],
      challenge: "Designing 11 structured actions, 6 difficulty-tiered tasks, and a robust 5-component grading system.",
      outcome: "Successfully created a rule-based baseline achieving a 0.906 average score.",
      github: "https://github.com/Aarav-Sukhadiya/CleanFlowEnv",
    },
    {
      id: "project-2",
      name: "HTTP Load Balancer",
      description: "A Layer 7 (HTTP) load balancer built from scratch in pure Python using only the standard library.",
      technologies: ["Python", "Threading", "Sockets", "JSON"],
      challenge: "Implementing concurrent request handling with ThreadingMixIn and maintaining a live health-check state across active nodes.",
      outcome: "Features 3 routing algorithms (round-robin, random, least-connections), failover retries, and a live metrics dashboard.",
      github: "https://github.com/Aarav-Sukhadiya/load_balancer",
    },
    {
      id: "project-3",
      name: "DFdetect",
      description: "Local-First Deepfake Detection Pipeline. A fully offline deepfake detection tool for images and videos with batch processing.",
      technologies: ["Python", "PyTorch", "timm", "OpenCV", "Gradio", "SQLite"],
      challenge: "Implementing probability calibration and per-identity face tracking for multi-face videos.",
      outcome: "Shipped with a CLI, Gradio UI, and SQLite-backed history store with schema migrations. Uses EfficientNet-B4 backbone.",
      github: "https://github.com/Aarav-Sukhadiya/Deepfake_Detection",
    },
    {
      id: "project-4",
      name: "OSC-Tracker",
      description: "Open Source Contribution Dashboard. A personal command center unifying a contributor's GitHub workflow alongside personal data.",
      technologies: ["React 19", "Vite", "Firebase Auth", "Firestore", "GitHub REST API"],
      challenge: "Integrating real-time GitHub REST API data (assigned issues, open PRs) with a 365-day heatmap.",
      outcome: "Successfully delivered as the end-term project for the 'Building Web Applications with React' course.",
      github: "https://github.com/Aarav-Sukhadiya/OSC-Tracker",
    },
    {
      id: "project-5",
      name: "Airbnb Clone",
      description: "A full-stack web application replicating the core booking and listing functionality of Airbnb.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
      challenge: "Handling complex date availability queries and responsive image galleries.",
      outcome: "Created a polished, responsive booking experience with user authentication and property management.",
      github: "https://github.com/Aarav-Sukhadiya/airbnb-clone",
    }
  ],
  experience: [
    {
      id: "exp-1",
      year: "2024 — Present",
      role: "Computer Science Undergraduate",
      company: "Scaler School of Technology",
      description: "Engaging in hands-on computer science coursework, focusing on practical software engineering and full-stack development."
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science in Data Science and Applications",
      institution: "Indian Institute of Technology (IIT) Madras",
      year: "Expected 2029",
      coursework: "Python, Data Structures, Algorithms, Mathematics for Data Science"
    },
    {
      id: "edu-2",
      degree: "Undergraduate Studies",
      institution: "Studying at Scaler School of Technology",
      year: "Expected 2029",
      coursework: "Full-Stack Development, React, Database Management, Systems Architecture"
    }
  ],
  social: {
    github: "https://github.com/Aarav-Sukhadiya",
    linkedin: "https://linkedin.com/in/aarav-sukhadiya-09b712374",
    email: "aaravsukhadiya6@gmail.com"
  }
};
