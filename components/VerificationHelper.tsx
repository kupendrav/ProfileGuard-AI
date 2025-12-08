import React, { useState } from 'react';
import { VerificationIssueType, VerificationAdvice } from '../types';
import { getVerificationAdvice } from '../services/geminiService';
import { Video, Smartphone, Lock, ShieldBan, Wrench, CheckCircle2, AlertTriangle } from 'lucide-react';

export const VerificationHelper: React.FC = () => {
  const [issueType, setIssueType] = useState<VerificationIssueType | null>(null);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<VerificationAdvice | null>(null);

  const handleDiagnose = async () => {
    if (!issueType) return;
    setLoading(true);
    try {
      const result = await getVerificationAdvice(issueType, details);
      setAdvice(result);
    } catch (error) {
      console.error(error);
      alert('Failed to generate advice.');
    } finally {
      setLoading(false);
    }
  };

  const OptionCard = ({ type, icon: Icon, title, desc }: { type: VerificationIssueType, icon: any, title: string, desc: string }) => (
    <button
      onClick={() => {
        setIssueType(type);
        setAdvice(null);
      }}
      className={`text-left w-full p-4 rounded-xl border transition-all flex items-start gap-4 ${
        issueType === type 
          ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500 shadow-sm' 
          : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-slate-50'
      }`}
    >
      <div className={`p-3 rounded-lg flex-shrink-0 ${issueType === type ? 'bg-brand-200 text-brand-800' : 'bg-slate-100 text-slate-500'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className={`font-bold ${issueType === type ? 'text-brand-900' : 'text-slate-800'}`}>{title}</h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Verification Troubleshooter</h2>
        <p className="text-slate-500 mt-2">Diagnose "Death Loops", upload failures, and AI rejections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OptionCard 
          type={VerificationIssueType.DEATH_LOOP}
          icon={Video}
          title="Video Stuck Processing"
          desc="Video uploaded successfully but status says 'Processing' for days/weeks."
        />
        <OptionCard 
          type={VerificationIssueType.UPLOAD_BUG}
          icon={Smartphone}
          title="Mobile Upload Failed"
          desc="Upload fails immediately or app crashes during recording."
        />
        <OptionCard 
          type={VerificationIssueType.LOCKOUT}
          icon={Lock}
          title="No Options Available"
          desc="System says 'No more ways to verify' or removes video option."
        />
        <OptionCard 
          type={VerificationIssueType.AI_REJECTION}
          icon={ShieldBan}
          title="Instant Rejection"
          desc="Video rejected by AI immediately after upload (Sensitive Content)."
        />
      </div>

      {issueType && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Additional Details (Optional)
          </label>
          <div className="flex gap-4">
            <input 
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="e.g., 'Tried 3 times', 'Using iPhone 14', 'Pending for 3 weeks'"
            />
            <button 
              onClick={handleDiagnose}
              disabled={loading}
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md flex items-center gap-2"
            >
              {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div> : <Wrench className="w-5 h-5" />}
              Diagnose Fix
            </button>
          </div>
        </div>
      )}

      {advice && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden animate-fade-in">
          <div className="p-6 bg-slate-900 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500 rounded-lg text-white">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Recommended Solution</h3>
            </div>
            <p className="text-slate-300 ml-12 text-sm">{advice.explanation}</p>
          </div>
          
          <div className="p-8">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-brand-600" />
              Action Plan
            </h4>
            <div className="space-y-4">
              {advice.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700 mt-1">{step}</p>
                </div>
              ))}
            </div>

            {advice.technicalFix && (
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is a known technical bug in the GBP platform. If these steps fail, you must bypass the standard support form by selecting "Other" to avoid auto-replies.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};