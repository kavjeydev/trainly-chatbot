/**
 * ============================================
 * CONTENT CONFIGURATION
 * ============================================
 *
 * Customize your landing page content here.
 * All changes will automatically apply across the entire application.
 *
 * This file is the ONLY place you need to edit your marketing content.
 * No coding required — just change the text!
 */

export const content = {
  // ============================================
  // HERO SECTION
  // ============================================

  /** Main hero heading (displayed prominently at the top) */
  heroHeading: 'Intelligent conversations, instant answers',

  /** Hero subheading / description */
  heroSubheading: 'Experience the power of AI-driven conversations. Get instant, accurate responses to your questions with our advanced chatbot technology.',

  /** Call-to-action button text */
  heroCtaText: 'Try it now',

  /** Call-to-action button link (optional - leave empty to hide button) */
  heroCtaLink: '',

  // ============================================
  // FEATURES SECTION
  // ============================================

  /** Section heading */
  featuresHeading: 'Why Choose Us',

  /** Section description */
  featuresSubheading: 'Built with cutting-edge technology to deliver exceptional AI experiences.',

  // Note: Feature cards are managed in branding.ts for easier admin editing

  // ============================================
  // HOW IT WORKS SECTION (optional)
  // ============================================

  /** Show the "How It Works" section */
  showHowItWorks: false,

  /** How it works heading */
  howItWorksHeading: 'How It Works',

  /** Steps - describe your process */
  howItWorksSteps: [
    {
      step: '1',
      title: 'We audit your workflows',
      description: 'We analyze your existing processes and FAQs to understand your needs.',
    },
    {
      step: '2',
      title: 'We train your chatbot',
      description: 'We build a custom AI assistant trained on your specific data and use cases.',
    },
    {
      step: '3',
      title: 'We deploy to your site',
      description: 'Your chatbot goes live on your website in under 48 hours.',
    },
  ],

  // ============================================
  // BENEFITS SECTION (optional)
  // ============================================

  /** Show the benefits section */
  showBenefits: false,

  /** Benefits heading */
  benefitsHeading: 'Why Clients Love This',

  /** List of benefits */
  benefits: [
    '24/7 instant responses for customers',
    'More calls booked without hiring extra staff',
    'Built once, works forever — low overhead',
    'Reduce support tickets by up to 70%',
  ],

  // ============================================
  // CALL TO ACTION SECTION
  // ============================================

  /** Show bottom CTA section */
  showBottomCta: false,

  /** Bottom CTA heading */
  bottomCtaHeading: 'Ready to get started?',

  /** Bottom CTA description */
  bottomCtaDescription: 'Book a free strategy call and see how AI can transform your business.',

  /** Bottom CTA button text */
  bottomCtaButtonText: 'Book a Free Call',

  /** Bottom CTA button link */
  bottomCtaButtonLink: 'https://calendly.com/your-link',

  // ============================================
  // FOOTER
  // ============================================

  /** Footer copyright text */
  footerText: '© 2024 All rights reserved.',

  /** Show footer links */
  showFooterLinks: false,

} as const;

// Type exports for TypeScript support
export type Content = typeof content;

