export interface Job {
  id: string;
  company: string;
  role: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  about: string;
  culture: string;
  benefits: string[];
  location: string;
  salary: string;
  type: string; // full-time, part-time, contract, etc.
}

export const Job: Job[] = [
  {
    id: "1",
    company: "TechCorp",
    role: "Frontend Developer",
    summary: "Help build innovative web applications with React",
    description:
      "We're looking for a talented Frontend Developer to join our dynamic team. You'll be working on cutting-edge projects using the latest technologies.",
    responsibilities: [
      "Develop responsive and interactive user interfaces",
      "Work with designers to implement UI/UX designs",
      "Write clean, maintainable code",
      "Optimize web applications for maximum speed and scalability",
    ],
    requirements: [
      "3+ years experience with React",
      "Strong knowledge of JavaScript, HTML5, and CSS3",
      "Experience with state management libraries like Redux",
      "Familiarity with RESTful APIs and GraphQL",
    ],
    about:
      "TechCorp is a leading software development company focusing on innovative solutions for enterprise clients.",
    culture:
      "We value collaboration, innovation, and continuous learning. Our team works in an agile environment with flexible working hours.",
    benefits: [
      "Competitive salary and benefits package",
      "Remote work options",
      "Professional development opportunities",
      "Health and wellness programs",
    ],
    location: "Remote / San Francisco, CA",
    salary: "$100,000 - $130,000",
    type: "Full-time",
  },
  {
    id: "2",
    company: "FinanceFlow",
    role: "Backend Engineer",
    summary: "Build scalable backend systems for financial applications",
    description:
      "Join our engineering team to create robust backend services for our growing financial platform.",
    responsibilities: [
      "Design and implement scalable API services",
      "Work with database systems and optimize queries",
      "Ensure high performance and security of backend services",
      "Collaborate with frontend engineers to integrate user-facing elements",
    ],
    requirements: [
      "5+ years experience with Node.js or Python",
      "Strong knowledge of database systems (SQL and NoSQL)",
      "Experience with microservices architecture",
      "Understanding of financial industry requirements",
    ],
    about:
      "FinanceFlow is revolutionizing how people manage their finances with smart, intuitive tools.",
    culture:
      "We foster a culture of excellence, accountability, and innovation. We work hard but also ensure work-life balance for our team.",
    benefits: [
      "Competitive salary with stock options",
      "Flexible working hours",
      "Comprehensive health coverage",
      "401(k) matching program",
    ],
    location: "New York, NY",
    salary: "$120,000 - $150,000",
    type: "Full-time",
  },
  {
    id: "3",
    company: "HealthTech",
    role: "Full Stack Developer",
    summary: "Create innovative healthcare solutions that improve lives",
    description:
      "We're seeking a skilled Full Stack Developer to help us build technology that transforms healthcare delivery and patient outcomes.",
    responsibilities: [
      "Build end-to-end features across frontend and backend",
      "Integrate with healthcare APIs and data sources",
      "Implement security best practices for sensitive health data",
      "Participate in code reviews and architectural discussions",
    ],
    requirements: [
      "4+ years of full stack development experience",
      "Proficiency in React and Node.js",
      "Experience with healthcare data standards (FHIR, HL7)",
      "Understanding of HIPAA compliance requirements",
    ],
    about:
      "HealthTech is dedicated to improving healthcare access and quality through innovative technology solutions.",
    culture:
      "We're mission-driven and focused on making a positive impact in healthcare. We value diversity, inclusion, and collaborative problem-solving.",
    benefits: [
      "Competitive compensation package",
      "Generous PTO policy",
      "Comprehensive healthcare benefits",
      "Remote-first workplace",
    ],
    location: "Boston, MA / Remote",
    salary: "$110,000 - $140,000",
    type: "Full-time",
  },
  {
    id: "4",
    company: "EduStart",
    role: "UI/UX Designer",
    summary: "Design beautiful, intuitive interfaces for educational products",
    description:
      "Join our creative team to design engaging user experiences for our suite of educational technology products used by millions of students.",
    responsibilities: [
      "Create wireframes, prototypes, and high-fidelity designs",
      "Conduct user research and usability testing",
      "Collaborate with product and engineering teams",
      "Develop and maintain design systems",
    ],
    requirements: [
      "3+ years of UI/UX design experience",
      "Proficiency in Figma and other design tools",
      "Experience designing for educational products a plus",
      "Strong portfolio demonstrating user-centered design approach",
    ],
    about:
      "EduStart is transforming education through innovative technology that makes learning more accessible and engaging.",
    culture:
      "We're passionate about education and believe in creating a supportive environment where everyone can learn and grow.",
    benefits: [
      "Competitive salary",
      "Flexible working arrangements",
      "Educational stipend",
      "Casual, collaborative workplace",
    ],
    location: "Chicago, IL / Remote",
    salary: "$90,000 - $120,000",
    type: "Full-time",
  },
  {
    id: "5",
    company: "GreenEnergy",
    role: "Data Scientist",
    summary: "Use data to optimize renewable energy systems",
    description:
      "Work with our sustainability team to analyze and optimize energy usage patterns for our renewable energy solutions.",
    responsibilities: [
      "Analyze large datasets from energy systems",
      "Build predictive models for energy usage and production",
      "Create visualizations to communicate insights",
      "Collaborate with engineering teams to implement data-driven recommendations",
    ],
    requirements: [
      "MS or PhD in Data Science, Statistics, or related field",
      "Experience with Python, R, and data visualization tools",
      "Knowledge of machine learning algorithms",
      "Experience in energy sector a plus",
    ],
    about:
      "GreenEnergy is committed to accelerating the transition to sustainable energy through innovative technology and data-driven solutions.",
    culture:
      "We're passionate about sustainability and creating a positive environmental impact. We value creativity, analytical thinking, and collaboration.",
    benefits: [
      "Competitive compensation",
      "Hybrid work model",
      "Professional development opportunities",
      "Company sustainability initiatives",
    ],
    location: "Austin, TX",
    salary: "$115,000 - $145,000",
    type: "Full-time",
  },
];

// Saved and applied jobs will be managed in the application state
export interface SavedJob extends Job {
  savedAt: Date;
}

export interface AppliedJob extends Job {
  appliedAt: Date;
  status: "pending" | "reviewed" | "interview" | "rejected" | "offered";
}
