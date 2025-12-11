"use server";

import { promises as fs } from "fs";
import path from "path";

export type BrandingSettings = {
  companyName: string;
  tagline: string;
  description: string;
  chatbotName: string;
  welcomeMessage: string;
  suggestedQuestions: string[];
  inputPlaceholder: string;
  primaryColor: string;
  userMessageColor: string;
  chatButtonColor: string;
  supportEmail: string;
  websiteUrl: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  adminTitle: string;
  showPoweredBy: boolean;
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
};

export type ContentSettings = {
  heroHeading: string;
  heroSubheading: string;
  heroCtaText: string;
  heroCtaLink: string;
  featuresHeading: string;
  featuresSubheading: string;
  showHowItWorks: boolean;
  howItWorksHeading: string;
  howItWorksSteps: {
    step: string;
    title: string;
    description: string;
  }[];
  showBenefits: boolean;
  benefitsHeading: string;
  benefits: string[];
  showBottomCta: boolean;
  bottomCtaHeading: string;
  bottomCtaDescription: string;
  bottomCtaButtonText: string;
  bottomCtaButtonLink: string;
  footerText: string;
  showFooterLinks: boolean;
};

const BRANDING_FILE_PATH = path.join(process.cwd(), "src/config/branding.ts");
const CONTENT_FILE_PATH = path.join(process.cwd(), "src/config/content.ts");

function parseBrandingFile(content: string): BrandingSettings {
  // Extract values from the TypeScript file
  const extract = (key: string, defaultValue: string = ""): string => {
    const regex = new RegExp(`${key}:\\s*['"\`]([^'"\`]*)['"\`]`, "m");
    const match = content.match(regex);
    return match ? match[1] : defaultValue;
  };

  const extractBool = (key: string, defaultValue: boolean = false): boolean => {
    const regex = new RegExp(`${key}:\\s*(true|false)`, "m");
    const match = content.match(regex);
    return match ? match[1] === "true" : defaultValue;
  };

  const extractArray = (key: string): string[] => {
    const regex = new RegExp(`${key}:\\s*\\[([^\\]]*?)\\]`, "ms");
    const match = content.match(regex);
    if (!match) return [];

    const arrayContent = match[1];
    const items: string[] = [];
    const itemRegex = /['"`]([^'"`]*)['"`]/g;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(arrayContent)) !== null) {
      items.push(itemMatch[1]);
    }
    return items;
  };

  // Extract features array
  const extractFeatures = (): {
    title: string;
    description: string;
    icon: string;
  }[] => {
    const featuresMatch = content.match(
      /features:\s*\[([\s\S]*?)\],\s*\n\s*\/\//m,
    );
    if (!featuresMatch) return [];

    const featuresContent = featuresMatch[1];
    const features: { title: string; description: string; icon: string }[] = [];
    const featureRegex =
      /\{\s*title:\s*['"`]([^'"`]*)['"`],\s*description:\s*['"`]([^'"`]*)['"`],\s*icon:\s*['"`]([^'"`]*)['"`]/g;
    let featureMatch;
    while ((featureMatch = featureRegex.exec(featuresContent)) !== null) {
      features.push({
        title: featureMatch[1],
        description: featureMatch[2],
        icon: featureMatch[3],
      });
    }
    return features;
  };

  return {
    companyName: extract("companyName", "Company Name"),
    tagline: extract("tagline", "Your tagline here"),
    description: extract("description", "Your description here"),
    chatbotName: extract("chatbotName", "Assistant"),
    welcomeMessage: extract("welcomeMessage", "How can I help you today?"),
    suggestedQuestions: extractArray("suggestedQuestions"),
    inputPlaceholder: extract("inputPlaceholder", "Type a message..."),
    primaryColor: extract("primaryColor", "amber"),
    userMessageColor: extract("userMessageColor", "amber"),
    chatButtonColor: extract("chatButtonColor", "blue"),
    supportEmail: extract("supportEmail", ""),
    websiteUrl: extract("websiteUrl", ""),
    privacyPolicyUrl: extract("privacyPolicyUrl", ""),
    termsOfServiceUrl: extract("termsOfServiceUrl", ""),
    adminTitle: extract("adminTitle", "Admin Dashboard"),
    showPoweredBy: extractBool("showPoweredBy", true),
    features: extractFeatures(),
  };
}

function parseContentFile(content: string): ContentSettings {
  const extract = (key: string, defaultValue: string = ""): string => {
    const regex = new RegExp(`${key}:\\s*['"\`]([^'"\`]*)['"\`]`, "m");
    const match = content.match(regex);
    return match ? match[1] : defaultValue;
  };

  const extractBool = (key: string, defaultValue: boolean = false): boolean => {
    const regex = new RegExp(`${key}:\\s*(true|false)`, "m");
    const match = content.match(regex);
    return match ? match[1] === "true" : defaultValue;
  };

  const extractArray = (key: string): string[] => {
    const regex = new RegExp(`${key}:\\s*\\[([^\\]]*?)\\]`, "ms");
    const match = content.match(regex);
    if (!match) return [];

    const arrayContent = match[1];
    const items: string[] = [];
    const itemRegex = /['"`]([^'"`]*)['"`]/g;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(arrayContent)) !== null) {
      items.push(itemMatch[1]);
    }
    return items;
  };

  // Extract howItWorksSteps array
  const extractSteps = (): {
    step: string;
    title: string;
    description: string;
  }[] => {
    const stepsMatch = content.match(
      /howItWorksSteps:\s*\[([\s\S]*?)\],\s*\n\s*\/\//m,
    );
    if (!stepsMatch) return [];

    const stepsContent = stepsMatch[1];
    const steps: { step: string; title: string; description: string }[] = [];
    const stepRegex =
      /\{\s*step:\s*['"`]([^'"`]*)['"`],\s*title:\s*['"`]([^'"`]*)['"`],\s*description:\s*['"`]([^'"`]*)['"`]/g;
    let stepMatch;
    while ((stepMatch = stepRegex.exec(stepsContent)) !== null) {
      steps.push({
        step: stepMatch[1],
        title: stepMatch[2],
        description: stepMatch[3],
      });
    }
    return steps;
  };

  return {
    heroHeading: extract("heroHeading", "Welcome"),
    heroSubheading: extract("heroSubheading", "Your subheading here"),
    heroCtaText: extract("heroCtaText", "Get Started"),
    heroCtaLink: extract("heroCtaLink", ""),
    featuresHeading: extract("featuresHeading", "Why Choose Us"),
    featuresSubheading: extract("featuresSubheading", "Our features"),
    showHowItWorks: extractBool("showHowItWorks", false),
    howItWorksHeading: extract("howItWorksHeading", "How It Works"),
    howItWorksSteps: extractSteps(),
    showBenefits: extractBool("showBenefits", false),
    benefitsHeading: extract("benefitsHeading", "Benefits"),
    benefits: extractArray("benefits"),
    showBottomCta: extractBool("showBottomCta", false),
    bottomCtaHeading: extract("bottomCtaHeading", "Ready to get started?"),
    bottomCtaDescription: extract("bottomCtaDescription", "Get in touch"),
    bottomCtaButtonText: extract("bottomCtaButtonText", "Contact Us"),
    bottomCtaButtonLink: extract("bottomCtaButtonLink", ""),
    footerText: extract("footerText", ""),
    showFooterLinks: extractBool("showFooterLinks", false),
  };
}

function generateBrandingFile(settings: BrandingSettings): string {
  const featuresStr = settings.features
    .map(
      (f) =>
        `    {
      title: '${f.title.replace(/'/g, "\\'")}',
      description: '${f.description.replace(/'/g, "\\'")}',
      icon: '${f.icon}',
    }`,
    )
    .join(",\n");

  const suggestedQuestionsStr = settings.suggestedQuestions
    .map((q) => `    '${q.replace(/'/g, "\\'")}'`)
    .join(",\n");

  return `/**
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
  companyName: '${settings.companyName.replace(/'/g, "\\'")}',

  /** Tagline shown on the landing page */
  tagline: '${settings.tagline.replace(/'/g, "\\'")}',

  /** Description for SEO and landing page */
  description: '${settings.description.replace(/'/g, "\\'")}',

  // ============================================
  // CHATBOT SETTINGS
  // ============================================

  /** Name displayed in the chat widget header */
  chatbotName: '${settings.chatbotName.replace(/'/g, "\\'")}',

  /** Welcome message shown when chat is empty */
  welcomeMessage: '${settings.welcomeMessage.replace(/'/g, "\\'")}',

  /** Suggested questions shown to new users */
  suggestedQuestions: [
${suggestedQuestionsStr}
  ],

  /** Placeholder text in the chat input */
  inputPlaceholder: '${settings.inputPlaceholder.replace(/'/g, "\\'")}',

  // ============================================
  // LANDING PAGE FEATURES
  // ============================================

  features: [
${featuresStr}
  ],

  // ============================================
  // COLORS
  // ============================================
  // These map to Tailwind CSS colors
  // Options: amber, blue, green, purple, red, pink, indigo, cyan, teal, emerald

  /** Primary accent color */
  primaryColor: '${settings.primaryColor}',

  /** Chat bubble color for user messages */
  userMessageColor: '${settings.userMessageColor}',

  /** Chat button color */
  chatButtonColor: '${settings.chatButtonColor}',

  // ============================================
  // LINKS & CONTACT
  // ============================================

  /** Support email (optional - leave empty to hide) */
  supportEmail: '${settings.supportEmail}',

  /** Website URL (optional - leave empty to hide) */
  websiteUrl: '${settings.websiteUrl}',

  /** Privacy policy URL (optional - leave empty to hide) */
  privacyPolicyUrl: '${settings.privacyPolicyUrl}',

  /** Terms of service URL (optional - leave empty to hide) */
  termsOfServiceUrl: '${settings.termsOfServiceUrl}',

  // ============================================
  // ADMIN DASHBOARD
  // ============================================

  /** Admin dashboard title */
  adminTitle: '${settings.adminTitle.replace(/'/g, "\\'")}',

  /** Show "Powered by Trainly" badge (set to false to remove) */
  showPoweredBy: ${settings.showPoweredBy},

} as const;

// Type exports for TypeScript support
export type Branding = typeof branding;

`;
}

function generateContentFile(settings: ContentSettings): string {
  const stepsStr = settings.howItWorksSteps
    .map(
      (s) =>
        `    {
      step: '${s.step}',
      title: '${s.title.replace(/'/g, "\\'")}',
      description: '${s.description.replace(/'/g, "\\'")}',
    }`,
    )
    .join(",\n");

  const benefitsStr = settings.benefits
    .map((b) => `    '${b.replace(/'/g, "\\'")}'`)
    .join(",\n");

  return `/**
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
  heroHeading: '${settings.heroHeading.replace(/'/g, "\\'")}',

  /** Hero subheading / description */
  heroSubheading: '${settings.heroSubheading.replace(/'/g, "\\'")}',

  /** Call-to-action button text */
  heroCtaText: '${settings.heroCtaText.replace(/'/g, "\\'")}',

  /** Call-to-action button link (optional - leave empty to hide button) */
  heroCtaLink: '${settings.heroCtaLink}',

  // ============================================
  // FEATURES SECTION
  // ============================================

  /** Section heading */
  featuresHeading: '${settings.featuresHeading.replace(/'/g, "\\'")}',

  /** Section description */
  featuresSubheading: '${settings.featuresSubheading.replace(/'/g, "\\'")}',

  /** Feature cards - edit in branding.ts */
  features: [], // Features are managed in branding.ts

  // ============================================
  // HOW IT WORKS SECTION (optional)
  // ============================================

  /** Show the "How It Works" section */
  showHowItWorks: ${settings.showHowItWorks},

  /** How it works heading */
  howItWorksHeading: '${settings.howItWorksHeading.replace(/'/g, "\\'")}',

  /** Steps - describe your process */
  howItWorksSteps: [
${stepsStr}
  ],

  // ============================================
  // BENEFITS SECTION (optional)
  // ============================================

  /** Show the benefits section */
  showBenefits: ${settings.showBenefits},

  /** Benefits heading */
  benefitsHeading: '${settings.benefitsHeading.replace(/'/g, "\\'")}',

  /** List of benefits */
  benefits: [
${benefitsStr}
  ],

  // ============================================
  // CALL TO ACTION SECTION
  // ============================================

  /** Show bottom CTA section */
  showBottomCta: ${settings.showBottomCta},

  /** Bottom CTA heading */
  bottomCtaHeading: '${settings.bottomCtaHeading.replace(/'/g, "\\'")}',

  /** Bottom CTA description */
  bottomCtaDescription: '${settings.bottomCtaDescription.replace(/'/g, "\\'")}',

  /** Bottom CTA button text */
  bottomCtaButtonText: '${settings.bottomCtaButtonText.replace(/'/g, "\\'")}',

  /** Bottom CTA button link */
  bottomCtaButtonLink: '${settings.bottomCtaButtonLink}',

  // ============================================
  // FOOTER
  // ============================================

  /** Footer copyright text */
  footerText: '${settings.footerText.replace(/'/g, "\\'")}',

  /** Show footer links */
  showFooterLinks: ${settings.showFooterLinks},

} as const;

// Type exports for TypeScript support
export type Content = typeof content;
`;
}

export async function fetchBrandingSettings(): Promise<BrandingSettings> {
  try {
    const fileContent = await fs.readFile(BRANDING_FILE_PATH, "utf-8");
    return parseBrandingFile(fileContent);
  } catch (error) {
    console.error("Error reading branding file:", error);
    throw new Error("Failed to read branding settings");
  }
}

export async function fetchContentSettings(): Promise<ContentSettings> {
  try {
    const fileContent = await fs.readFile(CONTENT_FILE_PATH, "utf-8");
    return parseContentFile(fileContent);
  } catch (error) {
    console.error("Error reading content file:", error);
    throw new Error("Failed to read content settings");
  }
}

export async function updateBrandingSettings(
  settings: BrandingSettings,
): Promise<{ success: boolean; error?: string }> {
  try {
    const newContent = generateBrandingFile(settings);
    await fs.writeFile(BRANDING_FILE_PATH, newContent, "utf-8");
    return { success: true };
  } catch (error) {
    console.error("Error writing branding file:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to save branding settings",
    };
  }
}

export async function updateContentSettings(
  settings: ContentSettings,
): Promise<{ success: boolean; error?: string }> {
  try {
    const newContent = generateContentFile(settings);
    await fs.writeFile(CONTENT_FILE_PATH, newContent, "utf-8");
    return { success: true };
  } catch (error) {
    console.error("Error writing content file:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to save content settings",
    };
  }
}
