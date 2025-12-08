import React, { useState } from 'react';
import { BusinessProfile, ScanResult } from '../types';
import { analyzeProfileCompliance } from '../services/geminiService';
import { AlertCircle, CheckCircle, Search, Loader2, MapPin, AlertTriangle } from 'lucide-react';

export const ComplianceScanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [profile, setProfile] = useState<BusinessProfile>({
    name: '',
    address: '',
    phone: '',
    website: '',
    category: '',
    description: ''
  });

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const scanResult = await analyzeProfileCompliance(profile);
      setResult(scanResult);
    } catch (error) {
      console.error("Scan failed", error);
      alert("Failed to analyze profile. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-brand-100 rounded-lg">
            <Search className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Profile Diagnostics</h2>
            <p className="text-sm text-slate-500">Deep scan for NAP consistency, virtual office flags, and edit risks.</p>
          </div>
        </div>

        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="e.g. Acme Plumbing & Heating"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
            <p className="text-xs text-slate-400 mt-1">Must match legal entity exactly to avoid "Keyword Stuffing" flags.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Primary Category</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="e.g. Plumber"
                value={profile.category}
                onChange={e => setProfile({...profile, category: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="(555) 123-4567"
                value={profile.phone}
                onChange={e => setProfile({...profile, phone: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="Full street address"
              value={profile.address}
              onChange={e => setProfile({...profile, address: e.target.value})}
            />
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Warning: Virtual Offices/Coworking spaces are high risk.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
            <input 
              type="url" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="https://example.com"
              value={profile.website}
              onChange={e => setProfile({...profile, website: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Description</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="Describe your business services..."
              value={profile.description}
              onChange={e => setProfile({...profile, description: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
            {loading ? 'Analyzing...' : 'Run Compliance Scan'}
          </button>
        </form>
      </div>

      {/* Results Panel */}
      <div className="space-y-6">
        {!result && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl">
            <AlertCircle className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-center">Results will appear here after analysis.</p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
             <div className="relative w-20 h-20">
               <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-100 rounded-full"></div>
               <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
             </div>
             <p className="text-brand-700 font-medium">Checking NAP consistency & Policy Violations...</p>
          </div>
        )}

        {result && (
          <div className="animate-fade-in space-y-6">
            {/* Score Card */}
            <div className={`p-6 rounded-xl border-2 ${getRiskColor(result.riskLevel)}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wider">Risk Level</h3>
                  <p className="text-3xl font-black mt-1">{result.riskLevel}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium opacity-80">Risk Score</span>
                  <div className="text-4xl font-bold">{result.riskScore}/100</div>
                </div>
              </div>
              <div className="w-full bg-black/10 rounded-full h-2 mt-2">
                <div 
                  className="bg-current h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${result.riskScore}%` }}
                ></div>
              </div>
            </div>

            {/* Analysis */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-500" />
                AI Analysis
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">{result.analysis}</p>
            </div>

            {/* Issues List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-red-600 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Identified Issues
              </h4>
              <ul className="space-y-2">
                {result.issues.length > 0 ? (
                  result.issues.map((issue, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
                      {issue}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-500 italic">No critical issues detected.</li>
                )}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-emerald-600 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Action Plan
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-blue-800 text-sm">Safe Editing Protocol</h4>
                <p className="text-xs text-blue-700 mt-1">
                  Do not make multiple edits at once. Wait 72 hours between changing Hours, Phone, or Website to avoid triggering "Suspicious Activity" hard suspensions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};