import React, { useState, useCallback } from 'react';
import { ViewState } from './types';
import { Dashboard } from './components/Dashboard';
import { ComplianceScanner } from './components/ComplianceScanner';
import { AppealGenerator } from './components/AppealGenerator';
import { ReviewAuditor } from './components/ReviewAuditor';
import { VerificationHelper } from './components/VerificationHelper';
import { ApiKeySettings } from './components/ApiKeySettings';
import { getApiKey } from './services/geminiService';
import { LayoutDashboard, Stethoscope, FileSignature, MessageSquareWarning, ShieldCheck, Menu, X, Wrench, Settings, AlertTriangle } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(!!getApiKey());

  const checkApiKey = useCallback(() => {
    setHasApiKey(!!getApiKey());
  }, []);

  const renderView = () => {
    switch (view) {
      case ViewState.DASHBOARD: return <Dashboard />;
      case ViewState.SCANNER: return <ComplianceScanner />;
      case ViewState.APPEAL: return <AppealGenerator />;
      case ViewState.REVIEWS: return <ReviewAuditor />;
      case ViewState.VERIFICATION: return <VerificationHelper />;
      case ViewState.SETTINGS: return <ApiKeySettings onKeyChange={checkApiKey} />;
      default: return <Dashboard />;
    }
  };

  const NavItem = ({ target, icon: Icon, label }: { target: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        setView(target);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        view === target 
          ? 'bg-brand-600 text-white shadow-md' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-brand-500 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ProfileGuard</h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest">AI Compliance</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem target={ViewState.DASHBOARD} icon={LayoutDashboard} label="Overview" />
            <NavItem target={ViewState.SCANNER} icon={Stethoscope} label="Risk Scanner" />
            <NavItem target={ViewState.VERIFICATION} icon={Wrench} label="Verification Fix" />
            <NavItem target={ViewState.REVIEWS} icon={MessageSquareWarning} label="Review Audit" />
            <NavItem target={ViewState.APPEAL} icon={FileSignature} label="Appeal Wizard" />
            <NavItem target={ViewState.SETTINGS} icon={Settings} label="Settings" />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-2">Powered by</p>
              <div className="flex items-center gap-2 font-semibold text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Gemini 2.5 Flash
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header (Mobile) */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-600" />
            <span className="font-bold text-slate-800">ProfileGuard AI</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-600">
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">
                {view === ViewState.DASHBOARD && 'Compliance Dashboard'}
                {view === ViewState.SCANNER && 'Business Risk Scanner'}
                {view === ViewState.APPEAL && 'Reinstatement Appeal Generator'}
                {view === ViewState.REVIEWS && 'Review Manipulation Audit'}
                {view === ViewState.VERIFICATION && 'Verification Troubleshooter'}
                {view === ViewState.SETTINGS && 'Settings'}
              </h2>
              <p className="text-slate-500 mt-1">
                {view === ViewState.DASHBOARD && 'Monitor global trends and your account health status.'}
                {view === ViewState.SCANNER && 'Detect policy violations before suspension occurs.'}
                {view === ViewState.APPEAL && 'Generate professional, policy-compliant appeal letters.'}
                {view === ViewState.REVIEWS && 'Identify fake or spam reviews that trigger algorithm flags.'}
                {view === ViewState.VERIFICATION && 'Resolve technical verification bugs, death loops, and rejections.'}
                {view === ViewState.SETTINGS && 'Configure your API key and application settings.'}
              </p>
            </div>
            {!hasApiKey && view !== ViewState.SETTINGS && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => setView(ViewState.SETTINGS)}>
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">API Key Required</p>
                  <p className="text-xs text-amber-600">Click here to add your Gemini API key in Settings to use AI features.</p>
                </div>
              </div>
            )}
            {renderView()}
          </div>
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}