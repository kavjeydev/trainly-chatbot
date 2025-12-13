/**
 * ============================================
 * BRANDING CONFIGURATION
 * ============================================
 *
 * Edit these values to customize your chatbot's appearance and branding.
 * After making changes, redeploy your site to see the updates.
 */

export const branding = {
  // ============================================
  // COMPANY INFO
  // ============================================

  /** Your company or client's name */
  companyName: "Trainly Chat",

  /** Short tagline displayed in the header */
  tagline: "Intelligent conversations, instant answers",

  /** Longer description for SEO and about sections */
  description:
    "Experience the power of AI-driven conversations. Get instant, accurate responses to your questions with our advanced chatbot technology.",

  // ============================================
  // CHATBOT SETTINGS
  // ============================================

  /** Name shown in the chat header */
  chatbotName: "Trainly Assistant",

  /** First message the chatbot sends */
  welcomeMessage: "How can I help you today?",

  /** Suggested questions shown to users */
  suggestedQuestions: ["What can you do?", "Tell me more"],

  /** Placeholder text in the input field */
  inputPlaceholder: "Type a message...",

  // ============================================
  // COLORS
  // ============================================
  // Presets: amber, blue, green, purple, red, pink, indigo, cyan, teal, emerald
  // Custom: Any hex color like #ff5733

  /** Primary accent color */
  primaryColor: "#f5680a",

  /** Chat bubble color for user messages */
  userMessageColor: "#f5450a",

  /** Chat button color */
  chatButtonColor: "blue",

  // ============================================
  // LINKS & CONTACT
  // ============================================

  /** Support email address */
  supportEmail: "",

  /** Main website URL */
  websiteUrl: "",

  /** Privacy policy URL */
  privacyPolicyUrl: "",

  /** Terms of service URL */
  termsOfServiceUrl: "",

  // ============================================
  // ADMIN SETTINGS
  // ============================================

  /** Admin dashboard title */
  adminTitle: "Admin Dashboard",

  /** Show "Powered by" footer */
  showPoweredBy: false,

  // ============================================
  // FEATURES (shown on landing page)
  // ============================================

  features: [
    {
      title: "Lightning Fast",
      description:
        "Get instant responses powered by advanced AI models with minimal latency.",
      icon: "bolt",
    },
    {
      title: "Context Aware",
      description:
        "Understands your questions in context and provides relevant, accurate answers.",
      icon: "brain",
    },
    {
      title: "Easy Integration",
      description:
        "Simple setup with your existing workflow. No complex configurations needed.",
      icon: "puzzle",
    },
  ],
} as const;

export type Branding = typeof branding;
