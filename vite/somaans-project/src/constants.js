/**
 * Central constants file for the application
 */

function getApiBaseUrl() {
  // Always use relative URLs in production for API endpoints
  if (window.location.hostname.includes('herokuapp.com') || 
      process.env.NODE_ENV === 'production') {
    return '/api'; 
  }
  
  // In development, use the local server
  return 'http://localhost:5000';
}

const BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/api/login`,
  REGISTER: `${BASE_URL}/api/register`,
  FORGOT_PASSWORD: `${BASE_URL}/api/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/api/reset-password`,
  INVALIDATE_REMEMBER_TOKEN: `${BASE_URL}/api/invalidate-remember-token`,
  GET_USERS: `${BASE_URL}/api/users`,
  GET_USER_LOGIN_HISTORY: `${BASE_URL}/api/users/login-history`,
  GET_USER_QUIZ_HISTORY: `${BASE_URL}/api/users/quiz-history`,
  GET_USER_STREAKS: `${BASE_URL}/api/users/:userId/streaks`,
  COMPLETE_QUIZ: `${BASE_URL}/api/quiz/complete`,
  GET_USER_ACHIEVEMENTS: `${BASE_URL}/api/users/:userId/achievements`,
  GET_QUIZ_QUESTIONS: `${BASE_URL}/api/quiz/questions`, 
  
  // Add a mock API for development
  IS_MOCK_API: false,
  MOCK_DELAY: 500, // milliseconds delay for mock API responses
};

// CAPTCHA configuration - fixed path for images
export const CAPTCHA_CONFIG = {
  // Using relative paths for better compatibility
  busImages: [
    '/assets/images/bus1.jpg',
    '/assets/images/bus2.jpg',
    '/assets/images/bus3.jpg',
    '/assets/images/bus4.jpg',
    '/assets/images/bus5.jpg'
  ],
  // Array to define correct cells in CAPTCHA
  correctCellsMap: [
      new Set([4, 5, 6, 7, 8]), 
      new Set([0, 1, 3, 4]),    
      new Set([2, 3, 4, 5, 8]),  
      new Set([4, 5, 7, 8]),
      new Set([0, 3, 6])
  ]
};

// Form validation configuration
export const FORM_CONFIG = {
  MAX_LENGTH: 20,
  passwordPatterns: {
      minLength: /.{10,}/,
      minNumber: /\d/,
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/
  }
};

// Toast configuration
export const TOAST_CONFIG = {
  success: {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark"
  },
  error: {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark"
  },
  confirmation: {
      position: "top-center",
      autoClose: false,
      closeButton: false,
      draggable: true,
      closeOnClick: false,
      theme: "dark",
      hideProgressBar: true,
      pauseOnHover: true
  }
};

// Quiz configuration
export const QUIZ_CONFIG = {
  // Map difficulty levels to quiz IDs
  QUIZ_IDS: {
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3
  },
  // Time per question in seconds
  QUESTION_TIME: 30,
  // Pass threshold percentage
  PASS_THRESHOLD: 70,
  
  // Mock quiz data for development
  MOCK_QUIZ_DATA: {
    'Beginner': [
      {
        id: 1,
        question: "What is phishing?",
        options: [
          "A type of fish found in oceans",
          "A cybersecurity attack that uses disguised email as a weapon",
          "A software program that protects your computer",
          "A method of encrypting files"
        ],
        correctAnswer: 1,
        explanation: "Phishing is a cybersecurity attack that uses disguised email as a weapon. The goal is to trick the email recipient into believing the message is something they want or need and to click a link or download an attachment."
      },
      {
        id: 2,
        question: "Which of these is a common indicator of a phishing attempt?",
        options: [
          "Emails from known colleagues with their correct email address",
          "Messages that have correct grammar and no spelling mistakes",
          "Emails with urgent calls to action or threats",
          "Communications that address you by your full name"
        ],
        correctAnswer: 2,
        explanation: "Urgent calls to action, threats, or creating a sense of emergency are common tactics in phishing attempts to make users act before thinking critically."
      },
      {
        id: 3,
        question: "What should you do if you suspect an email is a phishing attempt?",
        options: [
          "Open any attachments to check if they're legitimate",
          "Reply directly to ask if it's legitimate",
          "Click links to see where they lead",
          "Don't click links and report it to your IT department"
        ],
        correctAnswer: 3,
        explanation: "Never open attachments or click links in suspicious emails. The safest action is to report the email to your IT department or security team."
      },
      {
        id: 4,
        question: "Which of these email senders is MOST likely to be a phishing attempt?",
        options: [
          "support@yourcompany.com",
          "support@yourcornpany.com",
          "john.smith@colleague-company.com",
          "newsletter@google.com"
        ],
        correctAnswer: 1,
        explanation: "The email address 'support@yourcornpany.com' contains a common spoofing technique where 'company' is misspelled as 'cornpany' which can be hard to notice at a quick glance."
      },
      {
        id: 5,
        question: "What is 'spear phishing'?",
        options: [
          "Sending phishing emails to a large number of random people",
          "Targeted phishing attacks directed at specific individuals or companies",
          "Using phone calls instead of emails for phishing",
          "Phishing attempts made through social media"
        ],
        correctAnswer: 1,
        explanation: "Spear phishing refers to targeted attacks aimed at specific individuals or organizations, often using personalized information to appear more credible."
      }
    ],
    'Intermediate': [
      {
        id: 1,
        question: "Which of these is a sign of a sophisticated phishing attack?",
        options: [
          "Obvious spelling errors in the email",
          "Using threatening language and urgent deadlines",
          "Spoofed domains that look very similar to legitimate ones",
          "Requests sent to multiple recipients in the same email"
        ],
        correctAnswer: 2,
        explanation: "Sophisticated phishing attacks often use domains that look nearly identical to legitimate ones (like microsoft-support.com instead of microsoft.com) to deceive users."
      },
      {
        id: 2,
        question: "What is 'vishing'?",
        options: [
          "Visual phishing using fake images",
          "Voice phishing over phone calls",
          "Video-based phishing using deep fakes",
          "Viral phishing using social media"
        ],
        correctAnswer: 1,
        explanation: "Vishing is voice phishing, which uses phone calls to trick people into revealing sensitive information or making security mistakes."
      },
      {
        id: 3,
        question: "How do attackers commonly trick people in Business Email Compromise (BEC) attacks?",
        options: [
          "By sending mass emails with malware attachments",
          "By impersonating executives and requesting urgent wire transfers",
          "By offering fake promotions and discounts",
          "By sending ransomware through email links"
        ],
        correctAnswer: 1,
        explanation: "In BEC attacks, attackers impersonate executives or trusted partners to request urgent wire transfers or sensitive information from employees."
      },
      {
        id: 4,
        question: "What is DMARC?",
        options: [
          "A type of malware that steals email credentials",
          "An email authentication protocol to prevent spoofing",
          "A phishing simulation tool for security training",
          "A database of known phishing domains"
        ],
        correctAnswer: 1,
        explanation: "DMARC (Domain-based Message Authentication, Reporting & Conformance) is an email authentication protocol that helps prevent email spoofing and phishing attacks."
      },
      {
        id: 5,
        question: "Which of these behaviors increases your risk of falling victim to phishing?",
        options: [
          "Using multi-factor authentication",
          "Reusing the same password across multiple sites",
          "Checking the sender's email address before responding",
          "Hovering over links before clicking them"
        ],
        correctAnswer: 1,
        explanation: "Reusing passwords across multiple sites means that if your credentials are stolen from one site through phishing, attackers can access all your other accounts using the same credentials."
      }
    ],
    'Advanced': [
      {
        id: 1,
        question: "What is a watering hole attack?",
        options: [
          "A phishing attack targeting people with water-related interests",
          "A targeted attack where frequently visited websites are compromised",
          "An attack using water-damage sensors to infiltrate buildings",
          "A DDoS attack that floods servers with requests"
        ],
        correctAnswer: 1,
        explanation: "A watering hole attack targets organizations by infecting websites they frequently visit with malware, rather than attacking them directly."
      },
      {
        id: 2,
        question: "Which of these is an advanced anti-phishing measure?",
        options: [
          "Using basic spam filters",
          "Checking for HTTPS in the URL",
          "Implementing DMARC, SPF, and DKIM email authentication",
          "Installing antivirus software"
        ],
        correctAnswer: 2,
        explanation: "DMARC, SPF, and DKIM are advanced email authentication protocols that work together to prevent email spoofing and verify sender legitimacy."
      },
      {
        id: 3,
        question: "What is 'smishing'?",
        options: [
          "Social media phishing",
          "SMS phishing",
          "Smart device phishing",
          "Smoke-signal phishing (a joke term)"
        ],
        correctAnswer: 1,
        explanation: "Smishing is SMS phishing, which uses text messages to trick recipients into revealing sensitive information or installing malware."
      },
      {
        id: 4,
        question: "In corporate settings, which department is typically most targeted by spear phishing?",
        options: [
          "IT Department",
          "Sales Department",
          "Finance Department",
          "Human Resources"
        ],
        correctAnswer: 2,
        explanation: "Finance departments are often targeted because they have direct access to financial systems and can authorize payments, making them prime targets for BEC and wire fraud attacks."
      },
      {
        id: 5,
        question: "What security feature helps validate that you're on the legitimate website rather than a phishing site?",
        options: [
          "CAPTCHA",
          "HTTPS",
          "Extended Validation (EV) Certificates",
          "Two-factor authentication"
        ],
        correctAnswer: 2,
        explanation: "Extended Validation (EV) Certificates provide the highest level of website verification and display the company name in the browser's address bar, helping users confirm they're on the legitimate site."
      }
    ]
  }
};