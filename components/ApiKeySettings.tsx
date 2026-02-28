import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, Trash2, AlertTriangle } from 'lucide-react';
import { getApiKey, setApiKey, clearApiKey } from '../services/geminiService';

interface ApiKeySettingsProps {
  onKeyChange: () => void;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ onKeyChange }) => {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = getApiKey();
    setHasKey(!!existing);
    if (existing) {
      setKey(existing);
    }
  }, []);

  const handleSave = () => {
    if (key.trim()) {
      setApiKey(key.trim());
      setHasKey(true);
      setSaved(true);
      onKeyChange();
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleClear = () => {
    clearApiKey();
    setKey('');
    setHasKey(false);
    onKeyChange();
  };

  const maskedKey = key ? key.slice(0, 6) + '•'.repeat(Math.max(0, key.length - 10)) + key.slice(-4) : '';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-amber-100 p-2 rounded-lg">
          <Key className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Gemini API Key</h3>
          <p className="text-xs text-slate-500">Stored locally in your browser only</p>
        </div>
        {hasKey && (
          <span className="ml-auto flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <Check className="w-3 h-3" /> Configured
          </span>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          Your API key is stored in your browser's local storage and never sent to any server other than Google's Gemini API. 
          Get your key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google AI Studio</a>.
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={showKey ? 'text' : 'password'}
            value={showKey ? key : (hasKey && !key ? '••••••••••••••••' : key)}
            onChange={(e) => {
              setKey(e.target.value);
              setSaved(false);
            }}
            placeholder="Enter your Gemini API key"
            className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={!key.trim()}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {saved ? 'Saved!' : 'Save'}
        </button>
        {hasKey && (
          <button
            onClick={handleClear}
            className="px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 border border-red-200 transition-all"
            title="Remove API key"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
