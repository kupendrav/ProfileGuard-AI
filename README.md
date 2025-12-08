# ProfileGuard AI

**An AI-powered compliance and reinstatement toolkit for Google Business Profiles.**

![ProfileGuard AI Banner](https://img.shields.io/badge/Status-Active-success) ![Tech Stack](https://img.shields.io/badge/Built%20With-React%20%7C%20Gemini%202.5%20%7C%20Tailwind-blue)

## 🚨 The Problem
Google Business Profile (GBP) suspensions have surged by over **80% since 2023**. Automated algorithms, designed to combat spam, frequently flag legitimate local businesses for minor edits, creating a crisis where businesses lose their digital storefronts overnight.

Common issues include:
- **Verification "Death Loops":** Video uploads getting stuck in "Processing" indefinitely.
- **Trigger-Happy Suspensions:** Changing a phone number or hour often triggers an immediate "Suspicious Activity" ban.
- **Review "Ghosting":** Legitimate reviews disappearing due to aggressive IP-based spam filtering.

## 🛡️ The Solution
**ProfileGuard AI** acts as an intelligent layer between the business owner and Google's automated systems. It uses **Google Gemini 2.5 Flash** to audit data before it is submitted, diagnose technical bugs that support agents miss, and draft professional legal appeals.

## ✨ Key Features

### 1. Compliance Risk Scanner
*   **Function:** Deeply analyzes business details (Name, Address, Website) before they are saved.
*   **AI Logic:** Checks for "Keyword Stuffing" in business names, "Virtual Office" address patterns (a major ban trigger), and NAP (Name, Address, Phone) inconsistencies.
*   **Outcome:** Provides a Risk Score (0-100) and specific remediation steps.

### 2. Verification Troubleshooter
*   **Function:** specific diagnostics for technical verification failures.
*   **Capabilities:**
    *   **Death Loop Fix:** Identifies when a video is stuck in processing and suggests cache-clearing or resolution-change workarounds.
    *   **Upload Bug:** Diagnoses mobile upload failures caused by local storage conflicts.
    *   **AI Rejection:** Explains why the AI might have instantly rejected a video (e.g., sensitive banking info in background).

### 3. Reinstatement Appeal Wizard
*   **Function:** Generates formal appeal letters for suspended profiles.
*   **AI Logic:** Contextualizes the appeal based on the suspension type (Soft vs. Hard). It structures the letter to prioritize evidence (utility bills, licenses) to speed up human review during the current 3-week backlog.

### 4. Review Spam Auditor
*   **Function:** Analyzes why reviews are not showing up ("Ghosting").
*   **AI Logic:** Scans review text for "Incentivized" patterns (e.g., vague praise often posted from store Wi-Fi IPs) and flagged keywords that trigger Google's 2025 spam filters.

### 5. Health Dashboard
*   **Function:** Real-time visualization of account health.
*   **Metrics:** Tracks global suspension trends to warn users of high-risk periods for making profile edits.

## 🛠️ Technical Stack

*   **Frontend Framework:** React 19 (via Vite/CRA structure)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **AI Engine:** Google Gemini API (`gemini-2.5-flash`)
    *   Used for semantic analysis of policies, reviews, and legal drafting.
*   **Visualization:** Recharts
*   **Icons:** Lucide React

## 🚀 How to Run

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Environment:**
    *   Create a `.env` file.
    *   Add your Gemini API key: `API_KEY=your_key_here`
4.  **Start the development server:**
    ```bash
    npm start
    ```

## 📝 License
This project is a technical prototype designed to demonstrate the capabilities of LLMs in solving bureaucratic technical challenges.
