'use server';

import { TrainlyClient } from '@trainly/react';

let clientPromise: Promise<TrainlyClient> | null = null;

async function getClient(): Promise<TrainlyClient> {
  if (!clientPromise) {
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

    // Mirror test_package.js init: connect once to validate.
    clientPromise = (async () => {
      await client.connect();
      return client;
    })();
  }

  return clientPromise;
}

export async function askTrainly(message: string) {
  const trimmed = typeof message === 'string' ? message.trim() : '';

  if (!trimmed) {
    throw new Error('Message is required');
  }

  try {
    const client = await getClient();
    const response = await client.ask(trimmed, { includeCitations: false });

    if (!response || typeof response.answer !== 'string') {
      throw new Error('Response should have answer property');
    }

    if (response.answer.length === 0) {
      throw new Error('Answer should not be empty');
    }

    return response;
  } catch (error) {
    // Surface a clearer message to the client while preserving original detail.
    const detail =
      error instanceof Error ? error.message : 'Unexpected error contacting Trainly';
    throw new Error(`Trainly request failed: ${detail}`);
  }
}

