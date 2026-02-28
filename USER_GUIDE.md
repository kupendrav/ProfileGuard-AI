# ProfileGuard AI — User Guide

A step-by-step guide to using each tool in ProfileGuard AI.

---

## Getting Started

1. **Open the app** at [https://kupendrav.github.io/ProfileGuard-AI/](https://kupendrav.github.io/ProfileGuard-AI/)
2. Use the **sidebar** (or hamburger menu on mobile) to navigate between tools.

---

## 🛡️ Tool 1: Compliance Risk Scanner

**Purpose:** Check your Google Business Profile for policy violations *before* Google flags you.

### How to Use

1. Click **Risk Scanner** in the sidebar.
2. Fill in your business details:
   - **Business Name** — Must match your legal name exactly. Adding keywords like "Best Plumber in NYC" triggers suspension.
   - **Primary Category** — e.g. "Plumber", "Dentist", "Restaurant".
   - **Phone Number** — Use your primary business line.
   - **Address** — Enter your full street address. ⚠️ Virtual offices / coworking spaces (WeWork, Regus) are high-risk.
   - **Website URL** — Your business website.
   - **Business Description** — Describe your services factually.
3. Click **Run Compliance Scan**.
4. Review the results:
   - **Risk Score** (0–100) and **Risk Level** (LOW / MEDIUM / HIGH / CRITICAL).
   - **Identified Issues** — Specific policy violations found.
   - **Action Plan** — Recommended fixes to apply before Google catches them.

### Example Input

| Field | Example Value |
|---|---|
| Business Name | Acme Plumbing LLC |
| Category | Plumber |
| Phone | (555) 123-4567 |
| Address | 123 Main Street, Suite 100, Chicago, IL 60601 |
| Website | https://acmeplumbing.com |
| Description | Licensed residential and commercial plumbing services including drain cleaning, pipe repair, and emergency water heater replacement. |

---

## 🔧 Tool 2: Verification Troubleshooter

**Purpose:** Diagnose and fix technical verification issues (death loops, upload failures, rejections).

### How to Use

1. Click **Verification Fix** in the sidebar.
2. Select your issue type:

   | Issue | When to Select |
   |---|---|
   | **Video Stuck Processing** | You uploaded a verification video but it's been "Processing" for days/weeks |
   | **Mobile Upload Failed** | The upload fails immediately or the app crashes during recording |
   | **No Options Available** | Google says "No more ways to verify" and removed all options |
   | **Instant Rejection** | Video was rejected by AI within seconds of upload |

3. *(Optional)* Add details like how long it's been stuck, your device, or number of attempts.
4. Click **Diagnose Fix**.
5. Follow the numbered **Action Plan** steps provided.

### Example

- **Issue:** Video Stuck Processing
- **Details:** "Uploaded 3 weeks ago on Android, tried re-uploading twice, still says Processing"
- **Result:** Step-by-step guide to clear cache, re-record at lower resolution, and escalate via support ticket.

---

## 📝 Tool 3: Reinstatement Appeal Wizard

**Purpose:** Generate a professional, policy-compliant appeal letter to get your suspended profile reinstated.

### How to Use

1. Click **Appeal Wizard** in the sidebar.
2. **Step 1 — Business Details:**
   - Enter your business name, phone, address, and website.
   - Click **Next Step**.
3. **Step 2 — Suspension Context:**
   - Select the reason for your suspension:
     - Verification Failure (Loop/Rejected)
     - Quality Issues (Name/Spam)
     - Suspicious Activity (Edits)
     - Content Policy Violation
     - Virtual Office/Address Issue
   - In the **Evidence & Additional Details** box, describe:
     - What evidence you have (utility bills, business license, lease agreement)
     - What happened (e.g., "Changed phone number and was suspended the next day")
     - Any verification issues encountered
   - Click **Generate Appeal**.
4. **Step 3 — Your Letter:**
   - Review the generated appeal letter.
   - Click the **Copy** button to copy it to your clipboard.
   - Paste it into Google's [reinstatement form](https://support.google.com/business/contact/grr_form).

### Example Input

| Field | Value |
|---|---|
| Business Name | Sunrise Dental Clinic |
| Phone | (312) 555-9876 |
| Address | 456 Oak Avenue, Chicago, IL 60601 |
| Website | https://sunrisedental.com |
| Reason | Suspicious Activity (Edits) |
| Details | "Updated business hours for holiday schedule on Dec 20. Profile was suspended within 24 hours. We have our dental license and utility bills as proof of address." |

---

## 🔍 Tool 4: Review Spam Auditor

**Purpose:** Detect if your reviews contain patterns that trigger Google's spam filters (causing reviews to disappear or get "ghosted").

### How to Use

1. Click **Review Audit** in the sidebar.
2. Paste your recent reviews in the text box — one review per line or paragraph.
3. Click **Analyze Reviews**.
4. Review the results:
   - **Flagged Count** — Number of reviews that look suspicious.
   - **Analysis** — Overall assessment of your review health.
   - **Suspicious Items** — Each flagged review with a specific reason (e.g., "Incentivized pattern", "Generic bot-like language").

### Example Input

Paste something like this:

```
"Best service ever! Highly recommend this place to everyone!"
"Amazing experience, 5 stars all the way! Best dentist in town!"
"Great work, very professional and affordable. Best dental clinic!"
"Dr. Smith fixed my cavity quickly. The office was clean and the receptionist was helpful with my insurance paperwork."
"Terrible place, avoid at all costs. Rude staff."
```

### What to Look For

- Reviews with **vague generic praise** ("Best ever!", "Highly recommend!") often get flagged.
- Clusters of short positive reviews posted **around the same time** suggest incentivized reviews.
- Reviews with **URLs, profanity, or competitor mentions** can get stuck in "Review Limbo".

---

## 📊 Dashboard (Overview)

The **Overview** page shows:

- **Global Suspension Stats** — Year-over-year trends to understand the current enforcement climate.
- **Top Suspension Triggers** — Pie chart showing the most common reasons businesses get suspended.
- **Suspension Surge Graph** — Historical trend from 2019–2024 showing enforcement ramp-up.

Use this to time your profile edits — avoid making changes during high-enforcement periods.

---

## 💡 Tips for Best Results

1. **Scan before you edit** — Always run the Compliance Scanner before making profile changes.
2. **Don't change phone + hours on the same day** — Multiple edits in one session trigger "Suspicious Activity" flags.
3. **Keep evidence ready** — Utility bills, business licenses, and lease agreements speed up appeals dramatically.
4. **Use the Verification Troubleshooter first** — Many "suspensions" are actually verification bugs, not policy violations.
5. **Check reviews monthly** — Run the Review Auditor to catch ghost reviews before they accumulate and trigger account-level flags.

---

## ⚙️ Requirements

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (the AI tools require the Gemini API)
- No installation needed — runs entirely in the browser

---

*Built with React, TypeScript, Tailwind CSS, and Google Gemini 2.5 Flash.*
