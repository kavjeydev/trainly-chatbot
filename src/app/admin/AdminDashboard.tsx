"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { branding } from "@/config/branding";
import {
  fetchChatSettings,
  updateChatSettings,
  listTrainlyFiles,
  uploadTrainlyFile,
  deleteTrainlyFile,
  type TrainlyFile,
} from "@/app/actions/trainlySettings";
import {
  fetchBrandingSettings,
  updateBrandingSettings,
  fetchContentSettings,
  updateContentSettings,
  type BrandingSettings,
  type ContentSettings,
} from "@/app/actions/brandingSettings";

type UploadingFile = {
  name: string;
  status: "uploading" | "success" | "error";
  message?: string;
};

type TabId = "branding" | "content" | "chat" | "files" | "embed";

const colorOptions = [
  "amber",
  "blue",
  "green",
  "purple",
  "red",
  "pink",
  "indigo",
  "cyan",
  "teal",
  "emerald",
  "custom",
];
const iconOptions = ["bolt", "brain", "puzzle", "chat", "shield", "clock"];

// Helper to check if a color is a hex value
const isHexColor = (color: string) =>
  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

// Get display value for color (preset name or "custom")
const getColorDisplayValue = (color: string) => {
  if (isHexColor(color)) return "custom";
  return colorOptions.includes(color) ? color : "custom";
};

// Color preview map for preset colors
const colorPreviewMap: Record<string, string> = {
  amber: "#f59e0b",
  blue: "#3b82f6",
  green: "#22c55e",
  purple: "#a855f7",
  red: "#ef4444",
  pink: "#ec4899",
  indigo: "#6366f1",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  emerald: "#10b981",
};

// Get the actual hex value for preview
const getColorPreview = (color: string) => {
  if (isHexColor(color)) return color;
  return colorPreviewMap[color] || "#f59e0b";
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("branding");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Chat settings state
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(256);
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");

  // Branding settings state
  const [isLoadingBranding, setIsLoadingBranding] = useState(false);
  const [isSavingBranding, setIsSavingBranding] = useState(false);
  const [brandingError, setBrandingError] = useState<string | null>(null);
  const [brandingSuccess, setBrandingSuccess] = useState(false);
  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>({
    companyName: "",
    tagline: "",
    description: "",
    chatbotName: "",
    welcomeMessage: "",
    suggestedQuestions: [],
    inputPlaceholder: "",
    primaryColor: "amber",
    userMessageColor: "amber",
    chatButtonColor: "blue",
    supportEmail: "",
    websiteUrl: "",
    privacyPolicyUrl: "",
    termsOfServiceUrl: "",
    adminTitle: "",
    showPoweredBy: true,
    features: [],
  });

  // Content settings state
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [contentSuccess, setContentSuccess] = useState(false);
  const [contentSettings, setContentSettings] = useState<ContentSettings>({
    heroHeading: "",
    heroSubheading: "",
    heroCtaText: "",
    heroCtaLink: "",
    featuresHeading: "",
    featuresSubheading: "",
    showHowItWorks: false,
    howItWorksHeading: "",
    howItWorksSteps: [],
    showBenefits: false,
    benefitsHeading: "",
    benefits: [],
    showBottomCta: false,
    bottomCtaHeading: "",
    bottomCtaDescription: "",
    bottomCtaButtonText: "",
    bottomCtaButtonLink: "",
    footerText: "",
    showFooterLinks: false,
  });

  // File upload state
  const [files, setFiles] = useState<TrainlyFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Embed code state
  const [embedCopied, setEmbedCopied] = useState(false);

  const router = useRouter();

  // Load files on mount
  useEffect(() => {
    loadFiles();
    loadBrandingSettings();
    loadContentSettings();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Branding settings handlers
  const loadBrandingSettings = async () => {
    setIsLoadingBranding(true);
    setBrandingError(null);
    try {
      const settings = await fetchBrandingSettings();
      setBrandingSettings(settings);
    } catch (error) {
      setBrandingError(
        error instanceof Error
          ? error.message
          : "Failed to load branding settings",
      );
    } finally {
      setIsLoadingBranding(false);
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBranding(true);
    setBrandingError(null);
    setBrandingSuccess(false);
    try {
      const result = await updateBrandingSettings(brandingSettings);
      if (result.success) {
        setBrandingSuccess(true);
        setTimeout(() => setBrandingSuccess(false), 3000);
      } else {
        setBrandingError(result.error || "Failed to save branding settings");
      }
    } catch (error) {
      setBrandingError(
        error instanceof Error
          ? error.message
          : "Failed to save branding settings",
      );
    } finally {
      setIsSavingBranding(false);
    }
  };

  // Content settings handlers
  const loadContentSettings = async () => {
    setIsLoadingContent(true);
    setContentError(null);
    try {
      const settings = await fetchContentSettings();
      setContentSettings(settings);
    } catch (error) {
      setContentError(
        error instanceof Error
          ? error.message
          : "Failed to load content settings",
      );
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContent(true);
    setContentError(null);
    setContentSuccess(false);
    try {
      const result = await updateContentSettings(contentSettings);
      if (result.success) {
        setContentSuccess(true);
        setTimeout(() => setContentSuccess(false), 3000);
      } else {
        setContentError(result.error || "Failed to save content settings");
      }
    } catch (error) {
      setContentError(
        error instanceof Error
          ? error.message
          : "Failed to save content settings",
      );
    } finally {
      setIsSavingContent(false);
    }
  };

  // Chat settings handlers
  const loadSettings = async () => {
    setIsLoadingSettings(true);
    setSettingsError(null);
    try {
      const res = await fetchChatSettings();
      setCustomPrompt(res.customPrompt || "");
      if (typeof res.temperature === "number") {
        setTemperature(res.temperature);
      }
      if (typeof res.maxTokens === "number") {
        setMaxTokens(res.maxTokens);
      }
      if (res.selectedModel) {
        setSelectedModel(res.selectedModel);
      }
    } catch (error) {
      setSettingsError(
        error instanceof Error ? error.message : "Failed to load chat settings",
      );
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsError(null);
    setSettingsSuccess(false);
    try {
      await updateChatSettings({
        customPrompt,
        temperature,
        maxTokens,
        selectedModel,
      });
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (error) {
      setSettingsError(
        error instanceof Error
          ? error.message
          : "Failed to update chat settings",
      );
    } finally {
      setIsSavingSettings(false);
    }
  };

  const loadFiles = async () => {
    setIsLoadingFiles(true);
    setFilesError(null);
    try {
      const result = await listTrainlyFiles();
      setFiles(result.files);
    } catch (error) {
      setFilesError(
        error instanceof Error ? error.message : "Failed to load files",
      );
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    for (const file of Array.from(selectedFiles)) {
      setUploadingFiles((prev) => [
        ...prev,
        { name: file.name, status: "uploading" },
      ]);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadTrainlyFile(formData);

        if (result.success) {
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.name === file.name
                ? { ...f, status: "success", message: "Uploaded successfully" }
                : f,
            ),
          );
          await loadFiles();
        } else {
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.name === file.name
                ? {
                    ...f,
                    status: "error",
                    message: result.error || "Upload failed",
                  }
                : f,
            ),
          );
        }
      } catch (error) {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.name === file.name
              ? {
                  ...f,
                  status: "error",
                  message:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : f,
          ),
        );
      }
    }

    setTimeout(() => {
      setUploadingFiles((prev) => prev.filter((f) => f.status === "uploading"));
    }, 3000);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    setDeletingFileId(fileId);
    try {
      const result = await deleteTrainlyFile(fileId);
      if (result.success) {
        await loadFiles();
      } else {
        setFilesError(result.error || "Failed to delete file");
      }
    } catch (error) {
      setFilesError(
        error instanceof Error ? error.message : "Failed to delete file",
      );
    } finally {
      setDeletingFileId(null);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getEmbedCode = () => {
    const currentUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://your-domain.com";
    return `<!-- ${branding.chatbotName} Chat Widget -->
<script src="${currentUrl}/widget.js" defer></script>`;
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  const tabs = [
    { id: "branding" as const, label: "Branding", icon: "🎨" },
    { id: "content" as const, label: "Content", icon: "📝" },
    { id: "chat" as const, label: "AI Settings", icon: "🤖" },
    { id: "files" as const, label: "Knowledge Base", icon: "📁" },
    { id: "embed" as const, label: "Embed", icon: "🔗" },
  ];

  return (
    <main className="gradient-bg grid-pattern min-h-screen">
      {/* Header */}
      <header className="border-b border-amber-500/10 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">
                {branding.adminTitle}
              </h1>
              <p className="text-xs text-amber-500/60 font-mono">
                no-code chatbot builder
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview
            </a>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-4 py-2 text-sm text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/10 transition-colors disabled:opacity-50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-amber-500 text-black"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* Branding Tab */}
        {activeTab === "branding" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>🎨</span>
                  Branding & Identity
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Customize your chatbot&apos;s appearance and branding
                </p>
              </div>
              <button
                onClick={loadBrandingSettings}
                disabled={isLoadingBranding || isSavingBranding}
                className="text-sm text-amber-400 hover:text-amber-300 disabled:opacity-50 flex items-center gap-1"
              >
                <svg
                  className={`w-4 h-4 ${isLoadingBranding ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isLoadingBranding ? "Loading…" : "Reload"}
              </button>
            </div>

            {brandingError && (
              <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                {brandingError}
              </div>
            )}

            {brandingSuccess && (
              <div className="mb-4 text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
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
                Branding saved! Refresh the page to see changes.
              </div>
            )}

            <form onSubmit={handleSaveBranding} className="space-y-6">
              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider">
                  Company Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={brandingSettings.companyName}
                      onChange={(e) =>
                        setBrandingSettings({
                          ...brandingSettings,
                          companyName: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      Chatbot Name
                    </label>
                    <input
                      type="text"
                      value={brandingSettings.chatbotName}
                      onChange={(e) =>
                        setBrandingSettings({
                          ...brandingSettings,
                          chatbotName: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                      placeholder="AI Assistant"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Tagline</label>
                  <input
                    type="text"
                    value={brandingSettings.tagline}
                    onChange={(e) =>
                      setBrandingSettings({
                        ...brandingSettings,
                        tagline: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                    placeholder="Your catchy tagline here"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Description</label>
                  <textarea
                    value={brandingSettings.description}
                    onChange={(e) =>
                      setBrandingSettings({
                        ...brandingSettings,
                        description: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                    placeholder="A brief description of your service..."
                  />
                </div>
              </div>

              {/* Chat Widget Settings */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider">
                  Chat Widget
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      Welcome Message
                    </label>
                    <input
                      type="text"
                      value={brandingSettings.welcomeMessage}
                      onChange={(e) =>
                        setBrandingSettings({
                          ...brandingSettings,
                          welcomeMessage: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                      placeholder="How can I help you today?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      Input Placeholder
                    </label>
                    <input
                      type="text"
                      value={brandingSettings.inputPlaceholder}
                      onChange={(e) =>
                        setBrandingSettings({
                          ...brandingSettings,
                          inputPlaceholder: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                      placeholder="Type a message..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">
                    Suggested Questions (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={brandingSettings.suggestedQuestions.join(", ")}
                    onChange={(e) =>
                      setBrandingSettings({
                        ...brandingSettings,
                        suggestedQuestions: e.target.value
                          .split(",")
                          .map((q) => q.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                    placeholder="What can you do?, Tell me more"
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider">
                  Colors
                </h3>
                <p className="text-xs text-gray-500">
                  Choose a preset color or select &quot;custom&quot; to pick
                  your own
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Primary Color */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      <div
                        className="w-10 h-10 rounded-lg border border-white/20 flex-shrink-0 cursor-pointer overflow-hidden"
                        style={{
                          backgroundColor: getColorPreview(
                            brandingSettings.primaryColor,
                          ),
                        }}
                      >
                        <input
                          type="color"
                          value={getColorPreview(brandingSettings.primaryColor)}
                          onChange={(e) =>
                            setBrandingSettings({
                              ...brandingSettings,
                              primaryColor: e.target.value,
                            })
                          }
                          className="w-full h-full opacity-0 cursor-pointer"
                          title="Pick custom color"
                        />
                      </div>
                      <select
                        value={getColorDisplayValue(
                          brandingSettings.primaryColor,
                        )}
                        onChange={(e) => {
                          if (e.target.value !== "custom") {
                            setBrandingSettings({
                              ...brandingSettings,
                              primaryColor: e.target.value,
                            });
                          }
                        }}
                        className="flex-1 bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        {colorOptions.map((color) => (
                          <option
                            key={color}
                            value={color}
                            className="bg-gray-900"
                          >
                            {color === "custom" ? "🎨 Custom" : color}
                          </option>
                        ))}
                      </select>
                    </div>
                    {isHexColor(brandingSettings.primaryColor) && (
                      <input
                        type="text"
                        value={brandingSettings.primaryColor}
                        onChange={(e) =>
                          setBrandingSettings({
                            ...brandingSettings,
                            primaryColor: e.target.value,
                          })
                        }
                        placeholder="#ff5733"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none"
                      />
                    )}
                  </div>

                  {/* User Message Color */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      User Message Color
                    </label>
                    <div className="flex gap-2">
                      <div
                        className="w-10 h-10 rounded-lg border border-white/20 flex-shrink-0 cursor-pointer overflow-hidden"
                        style={{
                          backgroundColor: getColorPreview(
                            brandingSettings.userMessageColor,
                          ),
                        }}
                      >
                        <input
                          type="color"
                          value={getColorPreview(
                            brandingSettings.userMessageColor,
                          )}
                          onChange={(e) =>
                            setBrandingSettings({
                              ...brandingSettings,
                              userMessageColor: e.target.value,
                            })
                          }
                          className="w-full h-full opacity-0 cursor-pointer"
                          title="Pick custom color"
                        />
                      </div>
                      <select
                        value={getColorDisplayValue(
                          brandingSettings.userMessageColor,
                        )}
                        onChange={(e) => {
                          if (e.target.value !== "custom") {
                            setBrandingSettings({
                              ...brandingSettings,
                              userMessageColor: e.target.value,
                            });
                          }
                        }}
                        className="flex-1 bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        {colorOptions.map((color) => (
                          <option
                            key={color}
                            value={color}
                            className="bg-gray-900"
                          >
                            {color === "custom" ? "🎨 Custom" : color}
                          </option>
                        ))}
                      </select>
                    </div>
                    {isHexColor(brandingSettings.userMessageColor) && (
                      <input
                        type="text"
                        value={brandingSettings.userMessageColor}
                        onChange={(e) =>
                          setBrandingSettings({
                            ...brandingSettings,
                            userMessageColor: e.target.value,
                          })
                        }
                        placeholder="#ff5733"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Chat Button Color */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      Chat Button Color
                    </label>
                    <div className="flex gap-2">
                      <div
                        className="w-10 h-10 rounded-lg border border-white/20 flex-shrink-0 cursor-pointer overflow-hidden"
                        style={{
                          backgroundColor: getColorPreview(
                            brandingSettings.chatButtonColor,
                          ),
                        }}
                      >
                        <input
                          type="color"
                          value={getColorPreview(
                            brandingSettings.chatButtonColor,
                          )}
                          onChange={(e) =>
                            setBrandingSettings({
                              ...brandingSettings,
                              chatButtonColor: e.target.value,
                            })
                          }
                          className="w-full h-full opacity-0 cursor-pointer"
                          title="Pick custom color"
                        />
                      </div>
                      <select
                        value={getColorDisplayValue(
                          brandingSettings.chatButtonColor,
                        )}
                        onChange={(e) => {
                          if (e.target.value !== "custom") {
                            setBrandingSettings({
                              ...brandingSettings,
                              chatButtonColor: e.target.value,
                            });
                          }
                        }}
                        className="flex-1 bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        {colorOptions.map((color) => (
                          <option
                            key={color}
                            value={color}
                            className="bg-gray-900"
                          >
                            {color === "custom" ? "🎨 Custom" : color}
                          </option>
                        ))}
                      </select>
                    </div>
                    {isHexColor(brandingSettings.chatButtonColor) && (
                      <input
                        type="text"
                        value={brandingSettings.chatButtonColor}
                        onChange={(e) =>
                          setBrandingSettings({
                            ...brandingSettings,
                            chatButtonColor: e.target.value,
                          })
                        }
                        placeholder="#ff5733"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider">
                    Features (Landing Page)
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setBrandingSettings({
                        ...brandingSettings,
                        features: [
                          ...brandingSettings.features,
                          { title: "", description: "", icon: "bolt" },
                        ],
                      })
                    }
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Feature
                  </button>
                </div>
                <div className="space-y-3">
                  {brandingSettings.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-start bg-black/20 rounded-xl p-4"
                    >
                      <select
                        value={feature.icon}
                        onChange={(e) => {
                          const newFeatures = [...brandingSettings.features];
                          newFeatures[index] = {
                            ...feature,
                            icon: e.target.value,
                          };
                          setBrandingSettings({
                            ...brandingSettings,
                            features: newFeatures,
                          });
                        }}
                        className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm text-white focus:outline-none"
                      >
                        {iconOptions.map((icon) => (
                          <option
                            key={icon}
                            value={icon}
                            className="bg-gray-900"
                          >
                            {icon}
                          </option>
                        ))}
                      </select>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...brandingSettings.features];
                            newFeatures[index] = {
                              ...feature,
                              title: e.target.value,
                            };
                            setBrandingSettings({
                              ...brandingSettings,
                              features: newFeatures,
                            });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
                          placeholder="Feature title"
                        />
                        <input
                          type="text"
                          value={feature.description}
                          onChange={(e) => {
                            const newFeatures = [...brandingSettings.features];
                            newFeatures[index] = {
                              ...feature,
                              description: e.target.value,
                            };
                            setBrandingSettings({
                              ...brandingSettings,
                              features: newFeatures,
                            });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
                          placeholder="Feature description"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newFeatures = brandingSettings.features.filter(
                            (_, i) => i !== index,
                          );
                          setBrandingSettings({
                            ...brandingSettings,
                            features: newFeatures,
                          });
                        }}
                        className="text-gray-500 hover:text-red-400 transition-colors p-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider">
                  Options
                </h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={brandingSettings.showPoweredBy}
                    onChange={(e) =>
                      setBrandingSettings({
                        ...brandingSettings,
                        showPoweredBy: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded bg-white/5 border border-white/20 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-300">
                    Show &quot;Powered by Trainly&quot; badge
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSavingBranding}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {isSavingBranding ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
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
                    Save Branding
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>📝</span>
                  Landing Page Content
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Edit the text and sections on your landing page
                </p>
              </div>
              <button
                onClick={loadContentSettings}
                disabled={isLoadingContent || isSavingContent}
                className="text-sm text-amber-400 hover:text-amber-300 disabled:opacity-50 flex items-center gap-1"
              >
                <svg
                  className={`w-4 h-4 ${isLoadingContent ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isLoadingContent ? "Loading…" : "Reload"}
              </button>
            </div>

            {contentError && (
              <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                {contentError}
              </div>
            )}

            {contentSuccess && (
              <div className="mb-4 text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
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
                Content saved! Refresh the page to see changes.
              </div>
            )}

            <form onSubmit={handleSaveContent} className="space-y-6">
              {/* Hero Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider">
                  Hero Section
                </h3>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Main Heading</label>
                  <input
                    type="text"
                    value={contentSettings.heroHeading}
                    onChange={(e) =>
                      setContentSettings({
                        ...contentSettings,
                        heroHeading: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                    placeholder="Intelligent conversations, instant answers"
                  />
                  <p className="text-xs text-gray-500">
                    Tip: Add a comma to highlight the second part in color
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Subheading</label>
                  <textarea
                    value={contentSettings.heroSubheading}
                    onChange={(e) =>
                      setContentSettings({
                        ...contentSettings,
                        heroSubheading: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                    placeholder="A brief description that appears below the main heading..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={contentSettings.heroCtaText}
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          heroCtaText: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                      placeholder="Try it now"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      CTA Link (optional)
                    </label>
                    <input
                      type="text"
                      value={contentSettings.heroCtaLink}
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          heroCtaLink: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                      placeholder="https://calendly.com/your-link"
                    />
                    <p className="text-xs text-gray-500">
                      Leave empty to show chat widget pointer instead
                    </p>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider">
                  Features Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={contentSettings.featuresHeading}
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          featuresHeading: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                      placeholder="Why Choose Us"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      Section Subheading
                    </label>
                    <input
                      type="text"
                      value={contentSettings.featuresSubheading}
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          featuresSubheading: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                      placeholder="Built with cutting-edge technology..."
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Feature cards are configured in the Branding tab
                </p>
              </div>

              {/* Bottom CTA */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider">
                    Bottom Call-to-Action
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contentSettings.showBottomCta}
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          showBottomCta: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded bg-white/5 border border-white/20 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-400">Show section</span>
                  </label>
                </div>
                {contentSettings.showBottomCta && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Heading</label>
                        <input
                          type="text"
                          value={contentSettings.bottomCtaHeading}
                          onChange={(e) =>
                            setContentSettings({
                              ...contentSettings,
                              bottomCtaHeading: e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                          placeholder="Ready to get started?"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Description
                        </label>
                        <input
                          type="text"
                          value={contentSettings.bottomCtaDescription}
                          onChange={(e) =>
                            setContentSettings({
                              ...contentSettings,
                              bottomCtaDescription: e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                          placeholder="Get in touch with us today"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={contentSettings.bottomCtaButtonText}
                          onChange={(e) =>
                            setContentSettings({
                              ...contentSettings,
                              bottomCtaButtonText: e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                          placeholder="Book a Free Call"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Button Link
                        </label>
                        <input
                          type="text"
                          value={contentSettings.bottomCtaButtonLink}
                          onChange={(e) =>
                            setContentSettings({
                              ...contentSettings,
                              bottomCtaButtonLink: e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                          placeholder="https://calendly.com/your-link"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider">
                  Footer
                </h3>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Footer Text</label>
                  <input
                    type="text"
                    value={contentSettings.footerText}
                    onChange={(e) =>
                      setContentSettings({
                        ...contentSettings,
                        footerText: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                    placeholder="© 2024 Your Company. All rights reserved."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingContent}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {isSavingContent ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
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
                    Save Content
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Chat Settings Tab */}
        {activeTab === "chat" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>🤖</span>
                  AI Settings
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Configure how your chatbot responds
                </p>
              </div>
              <button
                onClick={loadSettings}
                disabled={isLoadingSettings || isSavingSettings}
                className="text-sm text-amber-400 hover:text-amber-300 disabled:opacity-50 flex items-center gap-1"
              >
                <svg
                  className={`w-4 h-4 ${isLoadingSettings ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isLoadingSettings ? "Loading…" : "Load Current"}
              </button>
            </div>

            {settingsError && (
              <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                {settingsError}
              </div>
            )}

            {settingsSuccess && (
              <div className="mb-4 text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
                Settings saved successfully!
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSaveSettings}>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">
                  System Prompt
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                  placeholder="Set a system prompt to define the assistant's behavior..."
                  disabled={isSavingSettings}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 font-medium">
                    Temperature
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                    disabled={isSavingSettings}
                  />
                  <p className="text-xs text-gray-500">
                    0 = focused, 2 = creative
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 font-medium">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4096"
                    value={maxTokens}
                    onChange={(e) =>
                      setMaxTokens(parseInt(e.target.value, 10) || 0)
                    }
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                    disabled={isSavingSettings}
                  />
                  <p className="text-xs text-gray-500">Response length limit</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 font-medium">
                    Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                    disabled={isSavingSettings}
                  >
                    <option value="gpt-4o-mini" className="bg-gray-900">
                      GPT-4o Mini
                    </option>
                    <option value="gpt-4o" className="bg-gray-900">
                      GPT-4o
                    </option>
                    <option value="gpt-4-turbo" className="bg-gray-900">
                      GPT-4 Turbo
                    </option>
                    <option value="gpt-3.5-turbo" className="bg-gray-900">
                      GPT-3.5 Turbo
                    </option>
                  </select>
                  <p className="text-xs text-gray-500">OpenAI model to use</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-5 py-2.5 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 disabled:opacity-60 transition-colors flex items-center gap-2"
              >
                {isSavingSettings ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
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
                    Save Settings
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Knowledge Base Tab */}
        {activeTab === "files" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>📁</span>
                  Knowledge Base
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Upload documents to train your chatbot
                </p>
              </div>
              <button
                onClick={loadFiles}
                disabled={isLoadingFiles}
                className="text-sm text-amber-400 hover:text-amber-300 disabled:opacity-50 flex items-center gap-1"
              >
                <svg
                  className={`w-4 h-4 ${isLoadingFiles ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isLoadingFiles ? "Loading…" : "Refresh"}
              </button>
            </div>

            {filesError && (
              <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                {filesError}
                <button
                  onClick={() => setFilesError(null)}
                  className="ml-2 text-red-300 hover:text-red-200"
                >
                  ✕
                </button>
              </div>
            )}

            {/* File Upload Area */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.md,.json,.csv,.pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="context-file-upload"
              />
              <label
                htmlFor="context-file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-amber-500/50 hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-3 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-400">Click to upload files</p>
                  <p className="text-xs text-gray-500 mt-1">
                    .txt, .md, .json, .csv, .pdf, .docx
                  </p>
                </div>
              </label>
            </div>

            {/* Upload Progress */}
            {uploadingFiles.length > 0 && (
              <div className="mb-4 space-y-2">
                {uploadingFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between px-4 py-2 rounded-lg ${
                      file.status === "uploading"
                        ? "bg-amber-500/10 border border-amber-500/30"
                        : file.status === "success"
                          ? "bg-green-500/10 border border-green-500/30"
                          : "bg-red-500/10 border border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {file.status === "uploading" && (
                        <svg
                          className="w-4 h-4 text-amber-400 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      {file.status === "success" && (
                        <svg
                          className="w-4 h-4 text-green-400"
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
                      )}
                      {file.status === "error" && (
                        <svg
                          className="w-4 h-4 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                      <span
                        className={`text-sm ${
                          file.status === "uploading"
                            ? "text-amber-300"
                            : file.status === "success"
                              ? "text-green-300"
                              : "text-red-300"
                        }`}
                      >
                        {file.name}
                      </span>
                    </div>
                    <span
                      className={`text-xs ${
                        file.status === "uploading"
                          ? "text-amber-400"
                          : file.status === "success"
                            ? "text-green-400"
                            : "text-red-400"
                      }`}
                    >
                      {file.status === "uploading"
                        ? "Uploading..."
                        : file.message}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Uploaded Files List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300 font-medium">
                  Uploaded Files
                </label>
                <span className="text-xs text-gray-500">
                  {files.length} file{files.length !== 1 ? "s" : ""}
                </span>
              </div>

              {isLoadingFiles ? (
                <div className="flex items-center justify-center py-8">
                  <svg
                    className="w-6 h-6 text-amber-400 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No files uploaded yet. Upload documents to expand the
                  chatbot&apos;s knowledge.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {files.map((file) => (
                    <div
                      key={file.file_id}
                      className="flex items-center justify-between px-4 py-3 bg-black/30 rounded-lg group hover:bg-black/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <svg
                          className="w-5 h-5 text-amber-400 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-200 truncate">
                            {file.filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatBytes(file.size_bytes)} • {file.chunk_count}{" "}
                            chunk{file.chunk_count !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteFile(file.file_id)}
                        disabled={deletingFileId === file.file_id}
                        className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50 flex-shrink-0 ml-2"
                      >
                        {deletingFileId === file.file_id ? (
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Embed Code Tab */}
        {activeTab === "embed" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <span>🔗</span>
              Embed on Your Website
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              Add this code to your website to embed the chatbot. Place it
              before the closing{" "}
              <code className="text-amber-400">&lt;/body&gt;</code> tag.
            </p>

            <div className="relative">
              <pre className="bg-black/50 border border-white/10 rounded-xl p-4 text-xs text-gray-300 overflow-x-auto font-mono">
                {getEmbedCode()}
              </pre>
              <button
                onClick={copyEmbedCode}
                className="absolute top-3 right-3 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
              >
                {embedCopied ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5"
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
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <p className="text-sm text-amber-400/80">
                <strong>Note:</strong> After deploying your chatbot, update the
                URL in the embed code to your production domain.
              </p>
            </div>

            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-sm font-medium text-white mb-3">Works on:</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "WordPress",
                  "Shopify",
                  "Webflow",
                  "Wix",
                  "Squarespace",
                  "HTML",
                ].map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
