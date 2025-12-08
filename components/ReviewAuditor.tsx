import React, { useState } from 'react';
import { auditReviews } from '../services/geminiService';
import { ReviewAuditResult } from '../types';
import { ShieldCheck, Bug, Search } from 'lucide-react';

export const ReviewAuditor: React.FC = () => {
  const [reviewsInput, setReviewsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewAuditResult | null>(null);

  const handleAudit = async () => {
    if (!reviewsInput.trim()) return;
    setLoading(true);
    try {
      const auditResult = await auditReviews(reviewsInput);
      setResult(auditResult);
    } catch (error) {
      console.error(error);
      alert('Audit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-600" />
            Review Spam Detector
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Paste recent reviews here to detect if they might be triggering "Review Manipulation" flags.
          </p>
        </div>
        <div className="flex-1 p-6 flex flex-col">
          <textarea
            className="flex-1 w-full p-4 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm"
            placeholder={`Paste reviews here, one per line or paragraph...
Example:
"Best service ever! Highly recommend."
"Terrible place, do not go here." (from suspicious account)
...`}
            value={reviewsInput}
            onChange={(e) => setReviewsInput(e.target.value)}
          />
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handleAudit}
            disabled={loading || !reviewsInput}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg shadow transition-all flex items-center justify-center gap-2"
          >
            {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div> : <Search className="w-5 h-5" />}
            Analyze Reviews
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">Audit Results</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Bug className="w-12 h-12 mb-3 opacity-20" />
              <p>Ready to scan.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-4 animate-pulse">
               <div className="h-4 bg-slate-200 rounded w-3/4"></div>
               <div className="h-4 bg-slate-200 rounded w-1/2"></div>
               <div className="h-32 bg-slate-100 rounded mt-8"></div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="text-center p-4 bg-slate-100 rounded-lg min-w-[100px]">
                  <div className="text-xs font-bold text-slate-500 uppercase">Flagged</div>
                  <div className={`text-3xl font-black ${result.flaggedCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {result.flaggedCount}
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  {result.analysis}
                </div>
              </div>

              {result.suspiciousReviews.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-3">Suspicious Items</h4>
                  <div className="space-y-3">
                    {result.suspiciousReviews.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-red-100 bg-red-50">
                        <p className="text-slate-800 italic mb-2">"{item.text}"</p>
                        <div className="text-xs font-semibold text-red-700 bg-red-100 inline-block px-2 py-1 rounded">
                          Flag: {item.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {result.flaggedCount === 0 && (
                 <div className="text-center py-12">
                   <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                   <h4 className="text-xl font-bold text-emerald-800">Clean Bill of Health</h4>
                   <p className="text-emerald-600">No obvious spam patterns detected in the provided reviews.</p>
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};