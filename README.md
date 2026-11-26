<div align="center">

<img src="assets/aurelia-mark.svg" alt="Aurelia Logo Mark" width="88" height="88" />

# Aurelia — Hotel & Restaurant Billing System

**A modern hospitality operations, POS billing, analytics, and workforce management web platform with dynamic white-label branding and zero-dependency Node.js authentication.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-aurelia--webapp.vercel.app-FCA311?style=for-the-badge&logo=vercel&logoColor=000000)](https://aurelia-webapp.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Aurelia--webapp-14213D?style=for-the-badge&logo=github&logoColor=FFFFFF)](https://github.com/shraoshi-2006/Aurelia-webapp)
[![License: ISC](https://img.shields.io/badge/License-ISC-0284C7?style=for-the-badge)](./package.json)

<br />

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![jQuery](https://img.shields.io/badge/jQuery_3.7.1-0769AD?style=flat-square&logo=jquery&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js_4.4.4-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)
![jsPDF](https://img.shields.io/badge/jsPDF_%2B_AutoTable-14213D?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js_Built--in_SQLite-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Google Identity](https://img.shields.io/badge/Google_OAuth_2.0-4285F4?style=flat-square&logo=google&logoColor=white)

</div>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Brand Identity & Live Preview](#brand-identity--live-preview)
- [Project Structure](#project-structure)
- [Installation & Local Setup](#installation--local-setup)
- [Deployment](#deployment)
- [Security & Data Handling](#security--data-handling)
- [Future Improvements](#future-improvements)
- [Author & Project Information](#author--project-information)

---

## Project Overview

**Aurelia – Hotel & Restaurant Billing System** is a responsive hospitality management web application built to unify front-desk hotel billing, restaurant Point-of-Sale (POS) order processing, menu curation, customer relationship tracking, revenue analytics, and staff HR administration inside one glassmorphic interface.

### What Problem It Solves
Small and mid-sized hotels, boutique resorts, and restaurant properties frequently rely on fragmented spreadsheets, manual paper receipts, and disconnected tools for dining orders, room folios, guest histories, and staff payroll. Aurelia consolidates these workflows into an integrated browser application capable of running either backed by a zero-dependency Node.js + SQLite authentication server or seamlessly as a standalone static web deployment.

### Intended Users
- **Front Desk Supervisors & Cashiers:** Generate itemized GST bills, apply discounts, process UPI/Card/Cash payments, and issue print invoices or 80mm thermal PDF receipts.
- **Restaurant & Kitchen Staff:** Track live table and room-service order tickets and manage dietary-classified menu offerings.
- **General Managers & Administrators:** Monitor cash flow trends, tax/discount summaries, top-selling dishes, department rosters, payroll disbursements, and property branding.

---

## Key Features

### Billing, POS & Invoice Generation
- **Integrated & Standalone Billing:** Create and edit hotel and restaurant bills from both the main dashboard (`index.html`) and dedicated pages ([add-bill.html](billing-management/add-bill.html), [billing-details.html](billing-management/billing-details.html)).
- **GST Tax & Discount Engine:** Automatic 5% GST computation split into **CGST (2.5%) + SGST (2.5%)**, supporting flat and percentage discounts with real-time total recalculation.
- **Multi-Mode Payment Pills:** Interactive payment selection supporting **UPI**, **Card**, and **Cash** settlements.
- **Print Invoices & Thermal PDF Receipts:** Print-ready tax invoice layouts (`window.print()`) plus downloadable Pine Labs–style 80mm thermal payment receipt PDFs generated via `html2canvas` and `jsPDF` (with a direct vector `jsPDF` fallback).

### Dashboard & Financial Analytics
- **Executive Overview:** Real-time KPI summary cards and responsive activity views for revenue, transactions, and occupancy/operations.
- **Interactive Visualizations:** Powered by **Chart.js**, including cash flow comparisons and category budget/revenue doughnut charts.
- **Revenue & Sales Analytics:** Dedicated analytics module ([analytics.html](analytics.html) and dashboard view) featuring quick presets (**Today**, **7 Days**, **This Month**, **This Year**, **All Time**) and custom date-range filtering for total tax collected, discounts given, average bill value, net revenue, and Top 5 Popular Menu Items.

### POS Orders, Menu & Customer Management
- **Kitchen & Order Queue:** Dedicated order management view ([order.html](order.html)) tracking dining tables and room orders through preparation and completion workflows.
- **Menu & Category Curation:** Full food and beverage catalog ([menu.html](menu.html)) with category filtering, category CRUD modal, **Veg / Non-Veg** dietary switch toggles, and automated dish badge classification (such as Chef's Signature, Bestseller, Clay Oven, Slow Dum, and In-Room 24×7).
- **Customer Directory & History:** Unified customer management ([customer.html](customer.html)) supporting search, filtering, add/edit/delete operations, contact records, and spend/visit histories.
- **Universal Bulk Table Actions:** Multi-row selection checkboxes across eligible operational tables with Select All, live selected-count indicators, and bulk deletion controls.

### Authentication & User Profiles
- **Role-Based Auth Portal:** Sliding **Login**, **Register**, and **Forgot Password** views with role selector tabs (**Front Desk Supervisor** and **General Manager**), password visibility toggles, `#login` route guarding, and an interactive 3D concierge login visual.
- **Google OAuth 2.0 Sign-In:** Integrated with **Google Identity Services (GIS)** to authenticate staff with Google profiles.
- **Dual Backend / Static Fallback:** Connects automatically to `server.js` SQLite endpoints (`/api/auth/*`) when run locally on Node.js, and transparently switches to client-side `localStorage` / `sessionStorage` authentication when hosted on static platforms like Vercel or GitHub Pages.
- **Profile & Device Management:** Editable staff profile modal (name, username, email, phone, role, department, Employee ID), custom avatar photo upload/removal, and a click-to-copy **Device ID** badge (`DEV08` default).

### Dynamic Branding, Theme Customization & Data Controls
Four-card, two-column **Settings** console designed for rapid white-labeling:
1. **Website Branding & Identity:** Edit the website/hotel name inline, dynamically regenerate the circular medallion SVG emblem and browser tab favicon from the first letter of the brand name, or upload a custom logo image (automatically resized via HTML5 Canvas and synchronized across tabs via `localStorage` events).
2. **Appearance & Theme:** Live instant preview and persistent customization for **Sidebar Theme Color** (`#0284C7`, `#FFFFFF`, `#130481`, `#FCA311`, `#494D5F`) and **Card Border Color** (`#0284C7`, `#FFFFFF`, `#130481`, `#FCA311`), with zero-FOUC early startup loading and luminance-aware text contrast switching.
3. **Hotel Information:** Configure property name, GSTIN / Tax ID, and POS counter identifiers.
4. **Data Management:** One-click **Reset Sample Data to Baseline** protected by a confirmation modal (`#modal-reset-data`).

### Human Resources & Department Operations
Beyond core billing, the repository includes multi-page departmental and HR modules:
- **Departments:** Department creation and directory ([add_department.html](department/add_department.html), [all_department.html](department/all_department.html)).
- **Employee & Document Workflows:** Staff onboarding with live ID badge preview, full roster management, HR letter/agreement templates, and CSV sample template support (`sample_template.csv`).
- **Attendance, Leave & Payroll:** Daily punch logs, monthly attendance compliance reports, leave quotas and approval workflows, salary grade bands, salary disbursement batches, and interactive PDF payslip generation.

---

## Technology Stack

Every technology listed below is directly verified in the project source code:

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend Structure** | HTML5, Multi-View SPA Shell + Standalone Module Pages | Core dashboard (`index.html`) and modular hospitality routes |
| **Styling & Typography** | Tailwind CSS (CDN), Custom CSS Variables, Google Fonts (`Cormorant Garamond`, `Plus Jakarta Sans`, `Inter`) | Glassmorphic cards, dark/navy/amber accents, responsive breakpoints, print stylesheets |
| **Client Logic** | Vanilla JavaScript (ES6+), jQuery `3.7.1` | State management, DOM manipulation, billing/tax engine, cross-tab `localStorage` sync |
| **Data Visualization** | Chart.js `4.4.4` | Interactive revenue flow and category doughnut analytics charts |
| **PDF & Image Export** | jsPDF `2.5.1`, jspdf-autotable `3.8.2`, html2canvas `1.4.1` | 80mm Pine Labs thermal receipts, payslips, salary schedules, and tabular PDF exports |
| **UI Alerts & Feedback** | SweetAlert2 (`assets/sweetalert2.all.min.js` + CDN fallback), Custom Toast Engine | Confirmation dialogs, form validation alerts, and non-blocking notifications |
| **Authentication** | Google Identity Services (OAuth 2.0), Node.js `node:crypto` (`scrypt`) + Session Tokens | Google Sign-In, password hashing, and hybrid server/static session management |
| **Backend & Database** | Node.js Built-in `node:http`, `node:fs`, `node:path`, `node:sqlite` (`DatabaseSync`) | Zero-dependency HTTP server, clean-URL static serving, and WAL-mode SQLite auth storage (`auth.db`) |
| **Deployment** | Vercel (`vercel.json`, `.vercelignore`), GitHub Actions (`SamKirkland/FTP-Deploy-Action@v4.3.5`) | Static production hosting on Vercel and automated FTP sync to InfinityFree |

> **Zero External npm Runtime Dependencies:** `package.json` contains zero third-party `dependencies`; client libraries are loaded via verified CDN links or bundled directly inside `assets/`, while `server.js` uses only Node.js built-in modules.

---

## Brand Identity & Live Preview

Aurelia ships with its custom gold-accented vector emblem ([assets/aurelia-mark.svg](assets/aurelia-mark.svg)) and dynamically adapts both logos and theme variables in real time when customized in Settings.

- **Interactive Live Web App:** [https://aurelia-webapp.vercel.app/](https://aurelia-webapp.vercel.app/)

> **Note on Visual Previews:** The repository stores brand icons, staff avatars, and UI assets under `assets/` rather than pre-rendered application screenshot PNGs. Visit the live deployment linked above to explore the interactive login showcase, analytics charts, POS billing calculator, PDF receipt generator, and 4-card branding studio directly in your browser.

---

## Project Structure

```text
hotel_billing/
├── .github/
│   └── workflows/
│       └── deploy.yml                  # GitHub Actions FTP deploy workflow to InfinityFree htdocs
├── .gitignore                          # Excludes node_modules and SQLite runtime files (auth.db*)
├── .vercelignore                       # Excludes Node server & DB files for static Vercel hosting
├── assets/
│   ├── images/                         # Staff portraits, sample badges, and avatar images
│   ├── aurelia-mark.svg                # Primary Aurelia vector medallion emblem
│   ├── auth-bg-pattern.jpg             # Authentication view textured background
│   ├── html2canvas.min.js              # Bundled DOM-to-canvas engine for PDF receipt capture
│   ├── logo.png                        # Raster brand logo asset
│   ├── search-glass.png                # Search input icon assets
│   └── sweetalert2.all.min.js          # Bundled SweetAlert2 modal & dialog library
├── billing-management/
│   ├── add-bill.html                   # Standalone New Bill creation & draft POS calculator
│   └── billing-details.html            # Standalone Billing History & invoice ledger
├── department/
│   ├── add_department.html             # Department creation screen
│   └── all_department.html             # Department directory & grid overview
├── human-resources/
│   ├── add-employee.html               # Staff onboarding form with live preview card
│   ├── attendance-list.html            # Daily biometric & manual attendance logs
│   ├── attendance-report.html          # Monthly attendance compliance & export report
│   ├── disburse-salary-update.html     # Monthly salary batch disbursement & PDF export
│   ├── employee-list.html              # Full employee roster & status table
│   ├── holiday-list.html               # Hospitality holiday calendar & PDF/print export
│   ├── hr-document-template.html       # HR letters, agreements & template generator
│   ├── hr-employee-list.html           # Employee & HR document records view
│   ├── leave-assign.html               # Staff leave quota allocation
│   ├── leave-category.html             # Leave types & category manager
│   ├── leave-request.html              # Leave approval workflow & dispatch preview
│   ├── manage-salary.html              # Salary structure & banking details manager
│   ├── pay-slip.html                   # Interactive salary payslip & PDF generator
│   └── salary-grade.html               # Salary grades & compensation bands
├── analytics.html                      # Revenue, GST tax, discount & top-dish analytics page
├── auth.js                             # Auth UI controller, GIS Google Sign-In & static fallback
├── customer.html                       # Customer directory & transaction history page
├── dashboard.html                      # Standalone dashboard entry view
├── index.html                          # Main SPA shell (Auth portal, Dashboard, POS, Settings)
├── main.js                             # Core POS, GST billing, charts, PDF, branding & UI engine
├── menu.html                           # Menu catalog, dietary filters & category manager
├── order.html                          # Kitchen ticket & room/table order queue
├── package.json                        # Project metadata & Node execution scripts
├── README.md                           # Project documentation
├── sample_template.csv                 # Sample HR document CSV structure
├── server.js                           # Zero-dependency Node HTTP & node:sqlite auth server
└── vercel.json                         # Vercel static deployment config & HR clean URL rewrites
```

---

## Installation & Local Setup

You can run Aurelia locally either with the **built-in Node.js SQLite server** or as a **pure static web app**.

### 1. Clone the Repository

```bash
git clone https://github.com/shraoshi-2006/Aurelia-webapp.git
cd Aurelia-webapp
```

### 2. Option A — Run with the Node.js + SQLite Auth Server (Recommended for Full-Stack Testing)

`server.js` uses Node's built-in `node:sqlite` (`DatabaseSync`), so ensure **Node.js 22.5 or newer** is installed (no `npm install` step is needed because there are zero external npm dependencies):

```bash
node --version
npm start
```

Or invoke the server directly:

```bash
node server.js
```

Once started, open your browser and visit:

```text
http://localhost:3000
```

> On startup, `server.js` automatically initializes `auth.db` (SQLite in WAL mode) with `users` and `sessions` tables and seeds default demo staff accounts for local evaluation.

### 3. Option B — Run in Pure Static Frontend Mode

Because `auth.js` automatically falls back to browser storage on static hosts or alternate local ports, you can also serve the directory directly with any static file server (such as VS Code Live Server, Python `http.server`, or `npx serve .`):

```bash
npx serve .
```

> **Note:** On `localhost` / `127.0.0.1` ports other than `3000`, `auth.js` checks `http://localhost:3000` first; if the Node server is not running, interactive client-side fallback authentication keeps demo login, registration, and POS features functional offline.

---

## Deployment

### Vercel (Current Live Production Host)

The repository is configured for zero-build static deployment on Vercel via [vercel.json](vercel.json) and [.vercelignore](.vercelignore):

- **Static Output:** `"framework": null`, `"outputDirectory": "."`, `"cleanUrls": true`
- **Route Rewrites:** Maps clean routes (`/employee-list`, `/add-employee`, `/holiday-list`, `/hr-document-template`, `/hr-document-templates`) to files under `human-resources/`.
- **Client-Side Auth Mode:** `.vercelignore` excludes `server.js` and `auth.db*` from Vercel bundles. When accessed via `*.vercel.app`, `auth.js` detects the static host and operates cleanly with `localStorage`, `sessionStorage`, and Google Identity Services OAuth without requiring a persistent SQLite filesystem.

### GitHub Actions FTP Deployment

A workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml) automates deployment on pushes to `main` using `SamKirkland/FTP-Deploy-Action@v4.3.5` to upload static web files (excluding `.git*`, `.github*`, `*.md`, `*.zip`, and `.DS_Store`) to `htdocs/` using repository secrets.

---

## Security & Data Handling

- **Server-Side Password & Session Security (`server.js`):**
  - Passwords are hashed with **16-byte random per-user salts** using Node's `crypto.scryptSync` and verified via constant-time comparison (`crypto.timingSafeEqual`).
  - Session tokens are generated via `crypto.randomBytes(32)` and issued via **`HttpOnly; SameSite=Lax`** cookies (`aurelia_session`) as well as Bearer authorization headers, with 24-hour default expiry (30 days when *Remember Me* is enabled).
  - Password reset requests (`POST /api/auth/forgot-password`) return a generic non-enumerating `200 OK` JSON response so account existence is not leaked. *(Note: No outbound SMTP email provider is currently wired; reset requests log to the server console for local verification.)*
- **Client-Side Storage & Static Fallback Mode (`auth.js` & `main.js`):**
  - Branding preferences (`aurelia_custom_brand_name`, custom resized brand logo image, sidebar/border colors), hotel billing drafts, menu updates, customer updates, and static-host fallback accounts/sessions are persisted locally in `localStorage` and `sessionStorage`.
  - When deployed strictly as a static site (such as on Vercel), authentication operates purely in browser storage—intended for demonstration and client-side workflows rather than multi-tenant production security enforcement.
- **Google Identity Services (OAuth 2.0):**
  - Google Sign-In uses the official `https://accounts.google.com/gsi/client` OAuth 2.0 token client requesting `email profile openid` scopes. Authorized origins must be configured in Google Cloud Console for any custom domain.
- **Privacy & Repository Hygiene:**
  - Demo/seeded credentials, OAuth configuration identifiers, and hosting secrets are intentionally omitted from this documentation, and `.gitignore` prevents local `auth.db*` database artifacts from being committed.

---

## Future Improvements

The following enhancements represent **planned roadmap items** not yet implemented in the current codebase:

- **Persistent Cloud Database Backend:** Replace browser-local business data (`localStorage` POS bills, menu, customers, and HR records) and ephemeral `/tmp` serverless SQLite paths with a managed cloud database (e.g., PostgreSQL or Supabase) with full CRUD REST/GraphQL endpoints.
- **Automated Email & Notification Delivery:** Integrate an SMTP / transactional email provider for real password-reset links, guest invoice emailing, and HR leave notifications.
- **Automated Test Suite & Linting:** Introduce unit and end-to-end tests (such as Playwright and Node test runner suites) alongside automated CI checks.
- **Role-Based Access Enforcement (RBAC):** Enforce granular server-side permissions separating cashier/front-desk POS capabilities from general manager financial and payroll controls.
- **Thermal Printer Hardware Integration:** Add direct ESC/POS WebUSB or network receipt printer streaming alongside downloadable 80mm PDF receipts.

---

## Author & Project Information

- **Project:** Aurelia – Hotel & Restaurant Billing System
- **Developers:** **Shraoshi Basak** & **Piyush Barua**
- **GitHub Profiles:**
  - [Shraoshi Basak (@shraoshi-2006)](https://github.com/shraoshi-2006)
  - [Piyush Barua (@piyushbaruadebug)](https://github.com/piyushbaruadebug)
- **Repository:** [https://github.com/shraoshi-2006/Aurelia-webapp](https://github.com/shraoshi-2006/Aurelia-webapp)
- **Live Website:** [https://aurelia-webapp.vercel.app/](https://aurelia-webapp.vercel.app/)
- **License:** ISC
