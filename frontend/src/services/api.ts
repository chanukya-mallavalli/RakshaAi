import type { HealthStatus, AnalysisResult, HistoryItem } from '../types';

const API_BASE_URL = import.meta.env.
VITE_API_BASE_URL || 'https://rakshaai-zj73.onrender.com/api/v1';


// ─── Health ───────────────────────────────────────────────
export async function fetchHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error(`Health check failed: ${response.statusText}`);
  return response.json();
}

// ─── Message Analysis ────────────────────────────────────
export async function analyzeMessage(message: string, senderInfo?: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/analyze/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sender_info: senderInfo }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Analysis failed: ${response.statusText}`);
  }
  return response.json();
}

// ─── Link Analysis ────────────────────────────────────────
export async function analyzeLink(url: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/analyze/link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Link analysis failed: ${response.statusText}`);
  }
  return response.json();
}

// ─── Call Analysis ────────────────────────────────────────
export async function analyzeCall(transcript: string, callerNumber?: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/analyze/call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, caller_number: callerNumber }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Call analysis failed: ${response.statusText}`);
  }
  return response.json();
}

// ─── Screenshot / QR Analysis ────────────────────────────
export async function analyzeFile(file: File, type: 'screenshot' | 'qr'): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/analyze/${type}`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `${type} analysis failed: ${response.statusText}`);
  }
  return response.json();
}

// ─── History ─────────────────────────────────────────────
export async function fetchHistory(limit = 20, offset = 0): Promise<HistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/history/?limit=${limit}&offset=${offset}`);
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
}

export async function deleteHistoryItem(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/history/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete history item');
}

export async function clearAllHistory(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/history/`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to clear history');
}
