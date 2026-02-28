# 🛡️ ProfileGuard AI — Interview Preparation Guide

> **One-liner:** An AI-powered compliance toolkit that helps local businesses prevent, diagnose, and recover from Google Business Profile suspensions using Google Gemini 2.5 Flash.

> **Live Demo:** [https://kupendrav.github.io/ProfileGuard-AI/](https://kupendrav.github.io/ProfileGuard-AI/)
> **Source Code:** [https://github.com/kupendrav/ProfileGuard-AI](https://github.com/kupendrav/ProfileGuard-AI)

---

## 📌 Project Overview (Elevator Pitch)

*"Google suspends 80% more businesses year-over-year due to automated enforcement — often catching legitimate businesses. ProfileGuard AI is a React + Gemini 2.5 Flash web app that gives business owners 4 AI-powered tools to scan for compliance risks, fix verification bugs, audit reviews for spam triggers, and auto-generate professional appeal letters — all from the browser."*

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client-Side SPA)                │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐│
│  │Dashboard │  │Compliance│  │  Appeal   │  │  Verification    ││
│  │(Recharts)│  │ Scanner  │  │  Wizard   │  │  Troubleshooter  ││
│  └──────────┘  └────┬─────┘  └────┬─────┘  └───────┬──────────┘│
│                     │             │                 │           │
│       ┌─────────────▼─────────────▼─────────────────▼─────┐    │
│       │           geminiService.ts (Service Layer)        │    │
│       │  • analyzeProfileCompliance()                     │    │
│       │  • generateAppealLetter()                         │    │
│       │  • auditReviews()                                 │    │
│       │  • getVerificationAdvice()                        │    │
│       └──────────────────────┬────────────────────────────┘    │
│                              │                                  │
│  ┌───────────────────────────▼───────────────────────────────┐  │
│  │  React 19 + TypeScript + Tailwind CSS (via CDN)          │  │
│  │  Vite 6 (Build Tool) · Lucide Icons · Recharts           │  │
│  └──────────────────────────────────────────────────────────-┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │  HTTPS (REST)
                               ▼
                ┌──────────────────────────────┐
                │   Google Gemini 2.5 Flash    │
                │   (generativelanguage API)   │
                │                              │
                │  • Structured JSON output    │
                │  • Schema-enforced responses │
                │  • Context-aware prompts     │
                └──────────────────────────────┘
```

---

## 🧰 Technology Stack

| Layer | Technology | Why I Chose It |
|-------|-----------|----------------|
| **UI Framework** | React 19 | Latest stable, component-based, excellent ecosystem |
| **Language** | TypeScript 5.8 | Type safety, enums for business logic, better DX |
| **Styling** | Tailwind CSS (CDN) | Utility-first, rapid prototyping, no build step for CSS |
| **AI Engine** | Google Gemini 2.5 Flash | Fast inference, structured JSON output, schema enforcement |
| **Charts** | Recharts 3.5 | Declarative, React-native charting (PieChart, BarChart) |
| **Icons** | Lucide React | Tree-shakeable, clean SVG icon library |
| **Build Tool** | Vite 6 | Instant HMR, fast ESBuild bundling, excellent TS support |
| **Deployment** | GitHub Pages + gh-pages | Free static hosting, CI-friendly, custom domain support |
| **AI SDK** | @google/genai 1.31 | Official Google SDK with typed schema responses |

---

## 🔑 Key Technical Concepts to Explain

### 1. Structured AI Output (Schema-Enforced JSON)

This is the most important technical decision. Instead of parsing free-text AI responses, I use Gemini's **`responseSchema`** feature to force the AI to return data in an exact JSON structure.

```typescript
// Example: Compliance Scanner forces this exact shape
config: {
  responseMimeType: "application/json",
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      riskScore: { type: Type.INTEGER },        // Always 0-100
      riskLevel: { type: Type.STRING,            // Constrained to 4 values
                   enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
      issues:    { type: Type.ARRAY, items: { type: Type.STRING } },
      recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
      analysis:  { type: Type.STRING }
    }
  }
}
```

**Why this matters (interview talking point):**
> *"I didn't just ask the AI for text and regex-parse it. I used Gemini's schema enforcement so the API guarantees a valid JSON structure. This eliminates parsing errors, makes the response directly castable to TypeScript interfaces, and creates a contract between the AI layer and the UI layer."*

---

### 2. Prompt Engineering Strategy

Each tool uses a domain-specific prompt with **explicit knowledge injection**:

```
┌─────────────────────────────────────────────┐
│          PROMPT STRUCTURE                   │
├─────────────────────────────────────────────┤
│  1. ROLE CONTEXT                            │
│     "Analyze for 2024-2025 policies..."     │
│                                             │
│  2. CRITICAL CHECKS (Domain Knowledge)      │
│     • NAP Consistency rules                 │
│     • Virtual Office crackdown details      │
│     • Keyword stuffing definitions          │
│     • Edit trigger warnings                 │
│                                             │
│  3. USER DATA (Dynamic Injection)           │
│     ${profile.name}, ${profile.address}...  │
│                                             │
│  4. OUTPUT FORMAT                           │
│     "Return JSON with riskScore..."         │
└─────────────────────────────────────────────┘
```

**Key insight:** The prompts aren't generic — they embed real Google policy knowledge (virtual office crackdowns, video processing death loops, review IP filtering) so the AI responds with actionable, current advice rather than generic answers.

---

### 3. Component Architecture

```
App.tsx (Router + Layout)
│
├── Dashboard.tsx ──────── StatsCard.tsx (×4)
│                          PieChart (Recharts)
│                          BarChart (Recharts)
│
├── ComplianceScanner.tsx ─ Form → geminiService.analyzeProfileCompliance()
│                          Risk score display + progress bar
│
├── VerificationHelper.tsx ─ 4 issue cards → geminiService.getVerificationAdvice()
│                           Step-by-step action plan
│
├── ReviewAuditor.tsx ───── Textarea → geminiService.auditReviews()
│                          Flagged reviews list
│
└── AppealGenerator.tsx ─── 3-step wizard → geminiService.generateAppealLetter()
                           Copy-to-clipboard output
```

**State management:** React `useState` only — no Redux/Context needed. Each tool is self-contained with its own form state, loading state, and result state. This keeps the app simple and avoids over-engineering.

---

### 4. Type System Design

```typescript
// Enums constrain business logic at compile time
enum SuspensionReason {
  VERIFICATION = 'Verification Failure (Loop/Rejected)',
  QUALITY      = 'Quality Issues (Name/Spam)',
  SUSPICIOUS   = 'Suspicious Activity (Edits)',
  CONTENT      = 'Content Policy Violation',
  VIRTUAL_OFFICE = 'Virtual Office/Address Issue'
}

// Interfaces define the AI ↔ UI contract
interface ScanResult {
  riskScore: number;                              // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  issues: string[];
  recommendations: string[];
  analysis: string;
}
```

**Interview point:** *"The TypeScript interfaces mirror the Gemini response schemas exactly. So there's a single source of truth — the AI schema, the TS interface, and the UI rendering all agree on the data shape."*

---

## 📊 Data Flow Diagram (Per Tool)

```
  USER INPUT                    AI PROCESSING                   UI RENDERING
 ┌──────────┐               ┌────────────────┐              ┌──────────────┐
 │ Form data│──setState()──▶│ geminiService   │──response──▶│ Result Panel │
 │ (React)  │               │ .analyzeProfile │              │ (Conditional)│
 └──────────┘               │  Compliance()   │              └──────────────┘
                            │                 │
      ┌─────────────────────┤  1. Build prompt│
      │ Loading = true      │  2. Call Gemini │
      │ Result = null       │  3. Parse JSON  │
      │ (UI shows spinner)  │  4. Return typed│
      └─────────────────────┤     result      │
                            └────────────────-┘
```

**Error handling pattern:** Every AI call is wrapped in `try/catch` with `finally { setLoading(false) }`. On failure, it alerts the user and keeps the form intact so they can retry.

---

## 🎯 Features Breakdown (What Each Tool Does)

### Tool 1: Compliance Risk Scanner
```
INPUT:  Business Name, Category, Phone, Address, Website, Description
OUTPUT: Risk Score (0-100), Risk Level, Issues[], Recommendations[]
AI:     Checks NAP consistency, virtual office patterns, keyword stuffing
```

### Tool 2: Verification Troubleshooter
```
INPUT:  Issue Type (4 options) + Optional Details
OUTPUT: Steps[], Explanation, TechnicalFix (boolean)
AI:     Diagnoses death loops, upload bugs, lockouts, AI rejections
```

### Tool 3: Reinstatement Appeal Wizard
```
INPUT:  Business Details → Suspension Reason + Evidence (3-step form)
OUTPUT: Full formal appeal letter (plain text)
AI:     Generates evidence-first, policy-compliant appeal letters
```

### Tool 4: Review Spam Auditor
```
INPUT:  Raw review text (pasted)
OUTPUT: Flagged Count, Analysis, Suspicious Reviews with reasons
AI:     Detects incentivized patterns, bot spam, filter-trigger keywords
```

### Dashboard (Static)
```
DISPLAYS: 4 stat cards, Pie chart (suspension triggers), Bar chart (trends)
DATA:     Hardcoded industry statistics (2019-2024)
LIB:      Recharts (PieChart, BarChart, ResponsiveContainer)
```

---

## 🔧 Build & Deployment Pipeline

```
  LOCAL DEV                    BUILD                      DEPLOY
┌──────────┐              ┌──────────┐              ┌──────────────┐
│ npm run  │              │ npm run  │              │ npm run      │
│   dev    │              │  build   │              │   deploy     │
│          │              │          │              │              │
│ Vite HMR │──vite────▶  │ vite     │──gh-pages──▶│ GitHub Pages │
│ :3000    │   build      │ build    │   -d dist    │ (gh-pages    │
│          │              │ → dist/  │              │  branch)     │
└──────────┘              └──────────┘              └──────────────┘
                          │                         │
                          │ • Tree-shakes unused    │ • Pushes dist/
                          │   code                  │   to gh-pages
                          │ • Minifies to ~235KB    │   branch
                          │   gzip                  │ • Auto-serves
                          │ • Embeds API key via    │   at *.github.io
                          │   process.env           │
                          └─────────────────────────┘
```

**Vite config highlights:**
- `base: '/ProfileGuard-AI/'` — Sets correct asset paths for GitHub Pages subdirectory
- `process.env.API_KEY` → `JSON.stringify(env.GEMINI_API_KEY)` — Build-time env injection
- `@vitejs/plugin-react` — JSX transform + Fast Refresh

---

## 🗂️ Project File Structure

```
ProfileGuard-AI/
│
├── index.html              ← Entry HTML (Tailwind CDN + custom config)
├── index.tsx               ← React root mount (createRoot)
├── App.tsx                 ← Main layout: sidebar + router + views
├── types.ts                ← Enums + Interfaces (shared contracts)
│
├── services/
│   └── geminiService.ts    ← All 4 AI functions (single service file)
│
├── components/
│   ├── Dashboard.tsx       ← Stats + Recharts visualizations
│   ├── StatsCard.tsx       ← Reusable metric card
│   ├── ComplianceScanner.tsx  ← Risk scanning form + results
│   ├── VerificationHelper.tsx ← Issue selection + troubleshooting
│   ├── ReviewAuditor.tsx      ← Review paste + spam analysis
│   └── AppealGenerator.tsx    ← 3-step appeal wizard
│
├── vite.config.ts          ← Build config, env vars, base path
├── tsconfig.json           ← TypeScript compiler options
├── package.json            ← Dependencies + scripts
├── .env                    ← API key (gitignored)
└── .gitignore              ← Excludes node_modules, dist, .env
```

**Note:** Only 10 source files total — intentionally compact. The AI service layer is a single file because all 4 functions share the same pattern (build prompt → call Gemini → parse JSON → return typed result).

---

## 💬 Interview Q&A Cheat Sheet

### Q: "Why did you build this?"
> Google Business Profile suspensions have surged 80%+ since 2023. Automated enforcement catches legitimate businesses for minor things like changing a phone number. I built this to help business owners proactively scan for risks and recover faster when suspended.

### Q: "Why React + TypeScript?"
> React 19 for its mature component model and hooks. TypeScript because the AI responses need strict type contracts — the Gemini schema maps 1:1 to TypeScript interfaces, giving me compile-time safety from the API layer to the UI.

### Q: "Why Gemini 2.5 Flash specifically?"
> Three reasons: (1) It supports **structured JSON output with schema enforcement**, so I don't need to parse free text. (2) "Flash" is optimized for speed — users get results in 2-3 seconds. (3) Google's own policies are what we're analyzing, so their model has the best contextual understanding.

### Q: "How do you handle AI errors / hallucinations?"
> Two layers: (1) Schema enforcement locks the response structure — the AI can't return unexpected fields or types. (2) Every API call is wrapped in try/catch with user-friendly error alerts. The form state is preserved on failure so users can retry without re-entering data.

### Q: "Why no backend server?"
> It's a static SPA deployed to GitHub Pages. The Gemini API is called directly from the browser via the `@google/genai` SDK. This eliminates server costs, simplifies deployment, and reduces latency. The tradeoff is the API key is embedded in the bundle — for production, I'd add a thin proxy or user-provided key.

### Q: "How would you scale this?"
> (1) Add a backend API proxy to protect the Gemini key. (2) Add user accounts with Firebase Auth. (3) Store scan history in Firestore. (4) Add rate limiting. (5) Implement caching for repeated scans of the same profile.

### Q: "What was the hardest part?"
> Prompt engineering. Getting the AI to return consistent, actionable advice (not generic safety disclaimers) required injecting specific Google policy knowledge into every prompt. For example, the compliance scanner knows that WeWork addresses trigger "Virtual Office" suspensions — that's not something the AI knows by default.

### Q: "What would you improve?"
> (1) Add a backend to secure the API key. (2) Support bulk profile scanning via CSV upload. (3) Add real-time GBP API integration to auto-fetch profile data. (4) Implement appeal tracking to monitor reinstatement status. (5) Add PDF export for appeal letters.

---

## 📏 Code Metrics

| Metric | Value |
|--------|-------|
| Total Source Files | 10 |
| TypeScript/TSX Files | 9 |
| Lines of Code (approx.) | ~1,200 |
| Components | 6 |
| AI Service Functions | 4 |
| TypeScript Interfaces | 4 |
| TypeScript Enums | 3 |
| npm Dependencies | 5 runtime + 4 dev |
| Build Size (gzip) | ~235 KB |
| Deployment | GitHub Pages (static) |

---

## 🎨 UI/UX Design Decisions

```
┌─────────────────────────────────────────────────────────┐
│  SIDEBAR (Dark: slate-900)  │  MAIN CONTENT (Light)     │
│                             │                            │
│  ┌─Logo──────────────┐     │  ┌─Page Header────────┐   │
│  │ 🛡️ ProfileGuard   │     │  │ Title + Description │   │
│  │ AI COMPLIANCE     │     │  └────────────────────-┘   │
│  └───────────────────┘     │                            │
│                             │  ┌─Tool Content──────-┐   │
│  ▸ Overview                 │  │                     │   │
│  ▸ Risk Scanner             │  │  Form    │  Results │   │
│  ▸ Verification Fix         │  │  Panel   │  Panel   │   │
│  ▸ Review Audit             │  │          │          │   │
│  ▸ Appeal Wizard            │  │          │          │   │
│                             │  └─────────────────────┘   │
│  ┌─Footer────────────┐     │                            │
│  │ Powered by        │     │                            │
│  │ 🟢 Gemini 2.5     │     │                            │
│  └───────────────────┘     │                            │
└─────────────────────────────────────────────────────────┘
```

- **Layout:** Fixed sidebar + scrollable main content
- **Mobile:** Sidebar collapses into hamburger menu with overlay
- **Color system:** Brand blue (#0ea5e9), risk colors (emerald → red), dark sidebar
- **Typography:** Inter font family via Google Fonts
- **Feedback:** Loading spinners, progress bars, animated fade-ins, disabled states

---

## 🚀 How to Run Locally (Demo Commands)

```bash
# Clone
git clone https://github.com/kupendrav/ProfileGuard-AI.git
cd ProfileGuard-AI

# Set up API key
echo "GEMINI_API_KEY=your_key_here" > .env

# Install & run
npm install
npm run dev        # → http://localhost:3000

# Deploy to GitHub Pages
npm run deploy     # Builds + pushes to gh-pages branch
```

---

*Last updated: February 2026*
