"use server";

import { branding } from "@/config/branding";
import { content } from "@/config/content";

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

/**
 * Fetch branding settings from the config file
 */
export async function fetchBrandingSettings(): Promise<BrandingSettings> {
  return {
    companyName: branding.companyName,
    tagline: branding.tagline,
    description: branding.description,
    chatbotName: branding.chatbotName,
    welcomeMessage: branding.welcomeMessage,
    suggestedQuestions: [...branding.suggestedQuestions],
    inputPlaceholder: branding.inputPlaceholder,
    primaryColor: branding.primaryColor,
    userMessageColor: branding.userMessageColor,
    chatButtonColor: branding.chatButtonColor,
    supportEmail: branding.supportEmail,
    websiteUrl: branding.websiteUrl,
    privacyPolicyUrl: branding.privacyPolicyUrl,
    termsOfServiceUrl: branding.termsOfServiceUrl,
    adminTitle: branding.adminTitle,
    showPoweredBy: branding.showPoweredBy,
    features: branding.features.map((f) => ({
      title: f.title,
      description: f.description,
      icon: f.icon,
    })),
  };
}

/**
 * Fetch content settings from the config file
 */
export async function fetchContentSettings(): Promise<ContentSettings> {
  return {
    heroHeading: content.heroHeading,
    heroSubheading: content.heroSubheading,
    heroCtaText: content.heroCtaText,
    heroCtaLink: content.heroCtaLink,
    featuresHeading: content.featuresHeading,
    featuresSubheading: content.featuresSubheading,
    showHowItWorks: content.showHowItWorks,
    howItWorksHeading: content.howItWorksHeading,
    howItWorksSteps: content.howItWorksSteps.map((s) => ({
      step: s.step,
      title: s.title,
      description: s.description,
    })),
    showBenefits: content.showBenefits,
    benefitsHeading: content.benefitsHeading,
    benefits: [...content.benefits],
    showBottomCta: content.showBottomCta,
    bottomCtaHeading: content.bottomCtaHeading,
    bottomCtaDescription: content.bottomCtaDescription,
    bottomCtaButtonText: content.bottomCtaButtonText,
    bottomCtaButtonLink: content.bottomCtaButtonLink,
    footerText: content.footerText,
    showFooterLinks: content.showFooterLinks,
  };
}
