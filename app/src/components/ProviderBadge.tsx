import { useState, useEffect } from 'react';
import { getProviderInfo } from '../services/aiService';

const LABELS: Record<string, string> = {
  anthropic: 'Anthropic · Claude',
  openai:    'OpenAI · GPT-4o-mini',
  local:     'Local fallback',
};

export function ProviderBadge() {
  const [info, setInfo] = useState<{ provider: string; model: string } | null>(null);

  useEffect(() => {
    getProviderInfo().then(setInfo).catch(() => setInfo({ provider: 'local', model: 'local-fallback' }));
  }, []);

  if (!info) return <span className="provider-badge provider-badge-loading">Connecting…</span>;

  const isAI = info.provider !== 'local';
  return (
    <span className={`provider-badge ${isAI ? 'provider-badge-ai' : 'provider-badge-local'}`} title={`Model: ${info.model}`}>
      {isAI ? '✦' : '○'} {LABELS[info.provider] ?? info.provider}
    </span>
  );
}
