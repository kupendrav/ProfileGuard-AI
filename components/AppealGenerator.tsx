import React, { useState } from 'react';
import { BusinessProfile, SuspensionReason } from '../types';
import { generateAppealLetter } from '../services/geminiService';
import { FileText, Send, Wand2, Copy, Check } from 'lucide-react';

export const AppealGenerator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [reason, setReason] = useState<SuspensionReason>(SuspensionReason.VERIFICATION);
  const [details, setDetails] = useState('');
  const [profile, setProfile] = useState<BusinessProfile>({
    name: '',
    address: '',
    phone: '',
    website: '',
    category: '',
    description: ''
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const letter = await generateAppealLetter(profile, reason, details);
      setGeneratedLetter(letter);
      setStep(3);
    } catch (error) {
      console.error(error);
      alert('Error generating letter.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step >= s ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        {step === 1 && (
          <div className="p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="Official Legal Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input 
                  type="text" 
                  value={profile.phone}
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input 
                  type="text" 
                  value={profile.address}
                  onChange={e => setProfile({...profile, address: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="Must match utility bills exactly"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                <input 
                  type="text" 
                  value={profile.website}
                  onChange={e => setProfile({...profile, website: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!profile.name || !profile.address}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Suspension Context</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Suspension</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.values(SuspensionReason).map((r) => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className={`p-4 rounded-lg border text-left transition-all text-sm ${
                      reason === r 
                        ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500' 
                        : 'border-slate-200 hover:border-brand-300 text-slate-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Evidence & Additional Details</label>
              <textarea 
                value={details}
                onChange={e => setDetails(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none h-40"
                placeholder="List your evidence (License, Utility Bill). If Video Verification failed, mention if it's stuck in processing."
              ></textarea>
              <p className="text-xs text-slate-500 mt-2">Gemini will optimize this for the 2024-2025 reinstatement backlog.</p>
            </div>

            <div className="flex justify-between items-center">
              <button 
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-slate-800 font-medium px-4"
              >
                Back
              </button>
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                {loading ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Appeal Letter
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-0 flex flex-col h-full animate-fade-in">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                Drafted Appeal
              </h3>
              <div className="flex gap-3">
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-md transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy Text'}
                </button>
                <button 
                  onClick={() => setStep(2)}
                  className="text-sm text-slate-500 hover:text-slate-800"
                >
                  Edit Inputs
                </button>
              </div>
            </div>
            <div className="p-8 bg-white min-h-[400px]">
              <div className="prose prose-slate max-w-none whitespace-pre-wrap font-serif text-slate-800 leading-relaxed">
                {generatedLetter}
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200">
               <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex gap-3">
                 <div className="text-yellow-600 mt-0.5"><Send className="w-5 h-5" /></div>
                 <div>
                   <h4 className="text-sm font-bold text-yellow-800">Next Steps</h4>
                   <p className="text-sm text-yellow-700 mt-1">
                     Copy this letter into the official <a href="#" className="underline">Google Business Profile Reinstatement Form</a>. Ensure you attach the files referenced in the letter as PDFs.
                   </p>
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};