"use client";

import { useState, useEffect } from "react";
import ChatWidget from "@/components/ChatWidget";
import { branding } from "@/config/branding";
import { content } from "@/config/content";
import { getColor, getColorWithAlpha } from "@/lib/colors";

const featureIcons = {
  bolt: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  brain: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  puzzle: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    </svg>
  ),
  chat: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  ),
  shield: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  clock: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

export default function Home() {
  const [showPulse, setShowPulse] = useState(true);

  // Get dynamic colors from branding
  const primaryColor = getColor(branding.primaryColor, 500);
  const primaryColorLight = getColor(branding.primaryColor, 400);
  const primaryColorAlpha10 = getColorWithAlpha(
    branding.primaryColor,
    500,
    0.1,
  );
  const primaryColorAlpha20 = getColorWithAlpha(
    branding.primaryColor,
    500,
    0.2,
  );
  const primaryColorAlpha30 = getColorWithAlpha(
    branding.primaryColor,
    500,
    0.3,
  );
  const chatButtonColor = getColor(branding.chatButtonColor, 500);

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Split hero heading for styling (first part normal, second part highlighted)
  const headingParts = content.heroHeading.includes(",")
    ? content.heroHeading.split(",")
    : [content.heroHeading];

  return (
    <main className="gradient-bg grid-pattern min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              backgroundColor: primaryColorAlpha10,
              border: `1px solid ${primaryColorAlpha20}`,
              color: primaryColorLight,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: primaryColorLight }}
            />
            {branding.companyName}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tighter">
            {headingParts[0]}
            {headingParts[1] && (
              <>
                ,{" "}
                <span style={{ color: primaryColorLight }}>
                  {headingParts[1].trim()}
                </span>
              </>
            )}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            {content.heroSubheading}
          </p>

          {/* CTA Button or Chat pointer */}
          <div className="flex flex-col items-center gap-6">
            {content.heroCtaLink ? (
              <a
                href={content.heroCtaLink}
                className="px-8 py-4 text-black font-semibold rounded-xl transition-colors"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: `0 10px 15px -3px ${primaryColorAlpha20}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColorLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColor;
                }}
              >
                {content.heroCtaText}
              </a>
            ) : (
              <>
                <div
                  className="flex items-center gap-3"
                  style={{ color: chatButtonColor }}
                >
                  <span className="text-sm font-medium">
                    {content.heroCtaText}
                  </span>
                  <svg
                    className="w-5 h-5 animate-bounce"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  Click the chat button in the bottom right corner
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tighter">
              {content.featuresHeading || `Why Choose ${branding.companyName}`}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              {content.featuresSubheading}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branding.features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl transition-colors group"
                style={{ ["--hover-border" as string]: primaryColorAlpha30 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = primaryColorAlpha30;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                  style={{
                    backgroundColor: primaryColorAlpha10,
                    border: `1px solid ${primaryColorAlpha20}`,
                    color: primaryColorLight,
                  }}
                >
                  {featureIcons[feature.icon as keyof typeof featureIcons] ||
                    featureIcons.bolt}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 tracking-tighter">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {content.showHowItWorks && (
        <section id="how-it-works" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tighter">
                {content.howItWorksHeading}
              </h2>
            </div>
            <div className="space-y-8">
              {content.howItWorksSteps.map((step, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div
                    className="w-12 h-12 rounded-full text-black font-bold flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {content.showBenefits && (
        <section id="benefits" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-3xl">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-tighter">
                {content.benefitsHeading}
              </h2>
              <ul className="space-y-4">
                {content.benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: primaryColorLight }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA Section */}
      {content.showBottomCta && (
        <section id="cta" className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tighter">
              {content.bottomCtaHeading}
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              {content.bottomCtaDescription}
            </p>
            <a
              href={content.bottomCtaButtonLink}
              className="inline-flex px-8 py-4 text-black font-semibold rounded-xl transition-colors"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 10px 15px -3px ${primaryColorAlpha20}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryColorLight;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor;
              }}
            >
              {content.bottomCtaButtonText}
            </a>
          </div>
        </section>
      )}

      {/* About Section */}
      {branding.showPoweredBy && (
        <section id="about" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div
              className="p-8 md:p-12 rounded-3xl"
              style={{
                backgroundColor: primaryColorAlpha10,
                border: `1px solid ${primaryColorAlpha20}`,
              }}
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <svg
                    className="w-10 h-10 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 tracking-tighter">
                    Powered by Trainly
                  </h2>
                  <p className="text-gray-400 leading-relaxed">
                    Our AI assistant is built on Trainly&apos;s advanced natural
                    language processing technology, enabling intelligent,
                    context-aware conversations that understand your needs and
                    deliver accurate, helpful responses every time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {content.footerText && (
        <footer className="py-8 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
            {content.footerText}
          </div>
        </footer>
      )}

      {/* Floating indicator pointing to chat */}
      {showPulse && (
        <div className="fixed bottom-24 right-6 z-40 flex items-center gap-2 animate-fade-in">
          <div
            className="px-3 py-2 text-white text-sm font-medium rounded-lg shadow-lg"
            style={{ backgroundColor: chatButtonColor }}
          >
            Chat with us!
          </div>
          <div
            className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8"
            style={{ borderLeftColor: chatButtonColor }}
          />
        </div>
      )}

      {/* Chat Widget */}
      <ChatWidget />
    </main>
  );
}
