'use server';

import { TrainlyClient } from '@trainly/react';

type NormalizedSettings = {
  customPrompt: string;
  temperature: number | null;
  maxTokens: number | null;
  selectedModel: string;
};

export type TrainlyFile = {
  file_id: string;
  filename: string;
  size_bytes: number;
  chunk_count: number;
};

export type ListFilesResult = {
  success: boolean;
  files: TrainlyFile[];
  total_files: number;
  total_size_bytes: number;
};

export type UploadResult = {
  success: boolean;
  filename?: string;
  size?: number;
  message?: string;
  error?: string;
};

export type DeleteResult = {
  success: boolean;
  filename?: string;
  chunks_deleted?: number;
  size_bytes_freed?: number;
  error?: string;
};

function normalizeSettings(raw: any): NormalizedSettings {
  const s = raw?.settings ?? raw ?? {};
  return {
    customPrompt: s.custom_prompt ?? s.customPrompt ?? '',
    temperature:
      s.temperature === undefined || s.temperature === null ? null : Number(s.temperature),
    maxTokens:
      s.max_tokens === undefined || s.max_tokens === null ? null : Number(s.max_tokens),
    selectedModel: s.selected_model ?? s.selectedModel ?? '',
  };
}

async function getClient(): Promise<TrainlyClient> {
  const apiKey = process.env.TRAINLY_API_KEY;
  const chatId = process.env.TRAINLY_CHAT_ID;
  const baseUrl = process.env.TRAINLY_BASE_URL || 'https://api.trainlyai.com';

  if (!apiKey || !chatId) {
    throw new Error('Missing TRAINLY_API_KEY or TRAINLY_CHAT_ID environment variables');
  }

  const client = new TrainlyClient({
    apiKey,
    chatId,
    baseUrl,
  } as any);

  await client.connect();
  return client;
}

export async function fetchChatSettings(): Promise<NormalizedSettings> {
  const client = await getClient();
  const getter = (client as any).getChatSettings;

  if (typeof getter !== 'function') {
    throw new Error('getChatSettings is not available in the installed Trainly SDK');
  }

  const res = await getter.call(client);
  if (!res || res.success !== true) {
    throw new Error('Failed to fetch chat settings');
  }
  return normalizeSettings(res);
}

export async function updateChatSettings(settings: {
  customPrompt: string;
  temperature: number;
  maxTokens: number;
  selectedModel: string;
}): Promise<any> {
  const client = await getClient();
  const updater = (client as any).updateChatSettings;

  const payload = {
    custom_prompt: settings.customPrompt,
    temperature: settings.temperature,
    max_tokens: settings.maxTokens,
    selected_model: settings.selectedModel,
  };

  if (typeof updater !== 'function') {
    throw new Error('updateChatSettings is not available in the installed Trainly SDK');
  }

  const res = await updater.call(client, payload);
  if (!res || res.success !== true) {
    throw new Error('Failed to update chat settings');
  }


  const updateRes = await client.updateChatSettings(payload);


  return updateRes;
}

// File management functions
export async function listTrainlyFiles(): Promise<ListFilesResult> {
  const client = await getClient();
  const lister = (client as any).listFiles;

  if (typeof lister !== 'function') {
    throw new Error('listFiles is not available in the installed Trainly SDK');
  }

  const res = await lister.call(client);
  if (!res || res.success !== true) {
    throw new Error('Failed to list files');
  }

  return {
    success: true,
    files: res.files || [],
    total_files: res.total_files || 0,
    total_size_bytes: res.total_size_bytes || 0,
  };
}

export async function uploadTrainlyFile(formData: FormData): Promise<UploadResult> {
  const file = formData.get('file') as File;

  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  const client = await getClient();
  const uploader = (client as any).upload;

  if (typeof uploader !== 'function') {
    throw new Error('upload is not available in the installed Trainly SDK');
  }

  const res = await uploader.call(client, file);

  if (!res || res.success !== true) {
    return { success: false, error: res?.message || 'Upload failed' };
  }

  return {
    success: true,
    filename: res.filename,
    size: res.size,
    message: res.message,
  };
}

export async function deleteTrainlyFile(fileId: string): Promise<DeleteResult> {
  if (!fileId) {
    return { success: false, error: 'No file ID provided' };
  }

  const client = await getClient();
  const deleter = (client as any).deleteFile;

  if (typeof deleter !== 'function') {
    throw new Error('deleteFile is not available in the installed Trainly SDK');
  }

  const res = await deleter.call(client, fileId);

  if (!res || res.success !== true) {
    return { success: false, error: res?.message || 'Delete failed' };
  }

  return {
    success: true,
    filename: res.filename,
    chunks_deleted: res.chunks_deleted,
    size_bytes_freed: res.size_bytes_freed,
  };
}

