'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { branding } from '@/config/branding';
import {
  fetchChatSettings,
  updateChatSettings,
  listTrainlyFiles,
  uploadTrainlyFile,
  deleteTrainlyFile,
  type TrainlyFile
} from '@/app/actions/trainlySettings';

type UploadingFile = {
  name: string;
  status: 'uploading' | 'success' | 'error';
  message?: string;
};

export default function AdminDashboard() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(256);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

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
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const loadSettings = async () => {
    setIsLoadingSettings(true);
    setSettingsError(null);
    try {
      const res = await fetchChatSettings();
      setCustomPrompt(res.customPrompt || '');
      if (typeof res.temperature === 'number') {
        setTemperature(res.temperature);
      }
      if (typeof res.maxTokens === 'number') {
        setMaxTokens(res.maxTokens);
      }
      if (res.selectedModel) {
        setSelectedModel(res.selectedModel);
      }
    } catch (error) {
      setSettingsError(
        error instanceof Error ? error.message : 'Failed to load chat settings'
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
        error instanceof Error ? error.message : 'Failed to update chat settings'
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
        error instanceof Error ? error.message : 'Failed to load files'
      );
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    for (const file of Array.from(selectedFiles)) {
      setUploadingFiles(prev => [...prev, { name: file.name, status: 'uploading' }]);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const result = await uploadTrainlyFile(formData);

        if (result.success) {
          setUploadingFiles(prev =>
            prev.map(f => f.name === file.name
              ? { ...f, status: 'success', message: 'Uploaded successfully' }
              : f
            )
          );
          await loadFiles();
        } else {
          setUploadingFiles(prev =>
            prev.map(f => f.name === file.name
              ? { ...f, status: 'error', message: result.error || 'Upload failed' }
              : f
            )
          );
        }
      } catch (error) {
        setUploadingFiles(prev =>
          prev.map(f => f.name === file.name
            ? { ...f, status: 'error', message: error instanceof Error ? error.message : 'Upload failed' }
            : f
          )
        );
      }
    }

    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(f => f.status === 'uploading'));
    }, 3000);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    setDeletingFileId(fileId);
    try {
      const result = await deleteTrainlyFile(fileId);
      if (result.success) {
        await loadFiles();
      } else {
        setFilesError(result.error || 'Failed to delete file');
      }
    } catch (error) {
      setFilesError(
        error instanceof Error ? error.message : 'Failed to delete file'
      );
    } finally {
      setDeletingFileId(null);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getEmbedCode = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';
    return `<!-- ${branding.chatbotName} Chat Widget -->
<script src="${currentUrl}/widget.js" defer></script>`;
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  return (
    <main className="gradient-bg grid-pattern min-h-screen">
      {/* Header */}
      <header className="border-b border-amber-500/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">{branding.adminTitle}</h1>
              <p className="text-xs text-amber-500/60 font-mono">manage your chatbot</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Preview
            </a>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-4 py-2 text-sm text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/10 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Chat Settings */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Chat Settings
            </h2>
            <button
              onClick={loadSettings}
              disabled={isLoadingSettings || isSavingSettings}
              className="text-sm text-amber-400 hover:text-amber-300 disabled:opacity-50 flex items-center gap-1"
            >
              <svg className={`w-4 h-4 ${isLoadingSettings ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoadingSettings ? 'Loading…' : 'Load Current'}
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
              <label className="text-sm text-gray-300 font-medium">System Prompt</label>
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
                <label className="text-sm text-gray-300 font-medium">Temperature</label>
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
                <p className="text-xs text-gray-500">0 = focused, 2 = creative</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">Max Tokens</label>
                <input
                  type="number"
                  min="1"
                  max="4096"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                  disabled={isSavingSettings}
                />
                <p className="text-xs text-gray-500">Response length limit</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                  disabled={isSavingSettings}
                >
                  <option value="gpt-4o-mini" className="bg-gray-900">GPT-4o Mini</option>
                  <option value="gpt-4o" className="bg-gray-900">GPT-4o</option>
                  <option value="gpt-4-turbo" className="bg-gray-900">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo" className="bg-gray-900">GPT-3.5 Turbo</option>
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
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Settings
                </>
              )}
            </button>
          </form>
        </div>

        {/* Knowledge Base Upload */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Knowledge Base
            </h2>
            <button
              onClick={loadFiles}
              disabled={isLoadingFiles}
              className="text-sm text-amber-400 hover:text-amber-300 disabled:opacity-50 flex items-center gap-1"
            >
              <svg className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoadingFiles ? 'Loading…' : 'Refresh'}
            </button>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            Upload documents to train the chatbot with additional knowledge. Files are processed and indexed automatically.
          </p>

          {filesError && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              {filesError}
              <button onClick={() => setFilesError(null)} className="ml-2 text-red-300 hover:text-red-200">✕</button>
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
                <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-400">Click to upload files</p>
                <p className="text-xs text-gray-500 mt-1">.txt, .md, .json, .csv, .pdf, .docx</p>
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
                    file.status === 'uploading' ? 'bg-amber-500/10 border border-amber-500/30' :
                    file.status === 'success' ? 'bg-green-500/10 border border-green-500/30' :
                    'bg-red-500/10 border border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {file.status === 'uploading' && (
                      <svg className="w-4 h-4 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {file.status === 'success' && (
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {file.status === 'error' && (
                      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={`text-sm ${
                      file.status === 'uploading' ? 'text-amber-300' :
                      file.status === 'success' ? 'text-green-300' : 'text-red-300'
                    }`}>{file.name}</span>
                  </div>
                  <span className={`text-xs ${
                    file.status === 'uploading' ? 'text-amber-400' :
                    file.status === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}>{file.status === 'uploading' ? 'Uploading...' : file.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Uploaded Files List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300 font-medium">Uploaded Files</label>
              <span className="text-xs text-gray-500">{files.length} file{files.length !== 1 ? 's' : ''}</span>
            </div>

            {isLoadingFiles ? (
              <div className="flex items-center justify-center py-8">
                <svg className="w-6 h-6 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No files uploaded yet. Upload documents to expand the chatbot&apos;s knowledge.
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.file_id}
                    className="flex items-center justify-between px-4 py-3 bg-black/30 rounded-lg group hover:bg-black/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-200 truncate">{file.filename}</p>
                        <p className="text-xs text-gray-500">{formatBytes(file.size_bytes)} • {file.chunk_count} chunk{file.chunk_count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteFile(file.file_id)}
                      disabled={deletingFileId === file.file_id}
                      className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50 flex-shrink-0 ml-2"
                    >
                      {deletingFileId === file.file_id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Embed Code */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Embed on Your Website
          </h2>

          <p className="text-sm text-gray-400 mb-4">
            Add this code to your website to embed the chatbot. Place it before the closing <code className="text-amber-400">&lt;/body&gt;</code> tag.
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
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <p className="text-sm text-amber-400/80">
              <strong>Note:</strong> After deploying your chatbot, update the URL in the embed code to your production domain.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
