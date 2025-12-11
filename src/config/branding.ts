/**
 * ============================================
 * BRANDING CONFIGURATION
 * ============================================
 *
 * Customize your chatbot's appearance and branding here.
 * All changes will automatically apply across the entire application.
 *
 * This file is the ONLY place you need to edit to white-label
 * this chatbot for your clients.
 */

export const branding = {
  // ============================================
  // COMPANY INFORMATION
  // ============================================

  /** Your company or client's name */
  companyName: 'Trainly Chat',

  /** Tagline shown on the landing page */
  tagline: 'Intelligent conversations, instant answers',

  /** Description for SEO and landing page */
  description: 'Experience the power of AI-driven conversations. Get instant, accurate responses to your questions with our advanced chatbot technology.',

  // ============================================
  // CHATBOT SETTINGS
  // ============================================

  /** Name displayed in the chat widget header */
  chatbotName: 'Trainly Assistant',

  /** Welcome message shown when chat is empty */
  welcomeMessage: 'How can I help you today?',

  /** Suggested questions shown to new users */
  suggestedQuestions: [
    'What can you do?',
    'Tell me more'
  ],

  /** Placeholder text in the chat input */
  inputPlaceholder: 'Type a message...',

  // ============================================
  // LANDING PAGE FEATURES
  // ============================================

  features: [
    {
      title: 'Lightning Fast',
      description: 'Get instant responses powered by advanced AI models with minimal latency.',
      icon: 'bolt',
    },
    {
      title: 'Context Aware',
      description: 'Understands your questions in context and provides relevant, accurate answers.',
      icon: 'brain',
    },
    {
      title: 'Easy Integration',
      description: 'Simple setup with your existing workflow. No complex configurations needed.',
      icon: 'puzzle',
    }
  ],

  // ============================================
  // COLORS
  // ============================================
  // These map to Tailwind CSS colors
  // Options: amber, blue, green, purple, red, pink, indigo, cyan, teal, emerald

  /** Primary accent color */
  primaryColor: 'amber',

  /** Chat bubble color for user messages */
  userMessageColor: 'amber',

  /** Chat button color */
  chatButtonColor: 'blue',

  // ============================================
  // LINKS & CONTACT
  // ============================================

  /** Support email (optional - leave empty to hide) */
  supportEmail: '',

  /** Website URL (optional - leave empty to hide) */
  websiteUrl: '',

  /** Privacy policy URL (optional - leave empty to hide) */
  privacyPolicyUrl: '',

  /** Terms of service URL (optional - leave empty to hide) */
  termsOfServiceUrl: '',

  // ============================================
  // ADMIN DASHBOARD
  // ============================================

  /** Admin dashboard title */
  adminTitle: 'Admin Dashboard',

  /** Show "Powered by Trainly" badge (set to false to remove) */
  showPoweredBy: false,

} as const;

// Type exports for TypeScript support
export type Branding = typeof branding;

