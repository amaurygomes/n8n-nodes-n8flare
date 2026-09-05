<div align="center">

# N8Flare ⚡
### Enterprise Serverless Edge Compiler & Deployer for n8n

> **Transpile, audit, and deploy entire n8n workflows directly to Cloudflare Workers (V8 Edge Runtime) with sub-20ms global latency and zero server overhead.**

[![npm version](https://img.shields.io/npm/v/n8n-nodes-n8flare.svg?style=flat-square&color=F38020)](https://www.npmjs.com/package/n8n-nodes-n8flare)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![n8n community node](https://img.shields.io/badge/n8n-community%20node-EA4B71.svg?style=flat-square)](https://n8n.io)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers%20v4-F38020.svg?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/ibanez/n8n-nodes-n8flare)

[Features](#-key-features) • [Comparison](#-why-n8flare) • [Operations](#-supported-operations) • [Installation](#-installation) • [Quick Start](#-quick-start-guide) • [Architecture](#-architecture) • [Author](#-author)

</div>

---

## 💡 Why N8Flare?

Standard n8n workflows process webhooks, state machines, and chatbots on your central server (Node.js single-thread). Under traffic spikes, bursty WhatsApp webhooks, or slow third-party APIs, your n8n instance can experience queued executions, memory spikes, and webhook timeouts.

**N8Flare** solves this by compiling your workflow logic into high-performance **ES Modules** that run on **Cloudflare's global edge network across 330+ cities worldwide**.

| Metric / Feature | Standalone n8n | n8n + N8Flare Edge |
| :--- | :--- | :--- |
| **Response Latency** | 300ms – 2500ms | **15ms – 28ms** (PoP closest to user) |
| **Concurrency Limit** | Bound by CPU & Memory | **100,000+ requests/sec** (Automatic Edge Scaling) |
| **Server Load** | 100% processed on host | **95% absorbed at the edge** |
| **Session & State** | PostgreSQL / DataTables | **Cloudflare KV** (sub-5ms distributed read) |
| **Cold Starts** | N/A (always running) | **0ms (V8 Isolates)** |
| **AI Processing** | Heavy local or Paid API calls | **Cloudflare Workers AI** (Llama 3.1 8B built-in) |
| **Custom Domains** | Manual Nginx / Traefik / SSL | **Automated Zero-DNS SSL provisioning** |

---

## ✨ Key Features

- ⚡ **Full V8 Edge Transpilation**: Converts n8n Code nodes, conditional routers, and webhooks into modern Cloudflare Worker ES Modules.
- 💬 **WhatsApp & Evolution API Optimized**: Built-in anti-loop protection, admin self-testing support, and typing delay simulation.
- 🔄 **Direct Third-Party Fetch on Edge**: Execute authenticated API calls (e.g. Stripe, CRMs, ERPs, Webhooks) directly from Cloudflare V8 without hitting your host.
- 💾 **Native Storage Bindings**:
  - **Cloudflare KV (`SESSIONS`)**: Ultra-fast key-value storage with automatic expiration TTL (replaces DataTables).
  - **Cloudflare D1 (`DB`)**: Serverless SQL database for edge relational queries.
  - **Cloudflare R2 (`BUCKET`)**: S3-compatible zero-egress object storage.
- 🧠 **Built-in Workers AI**: Integrates Meta Llama 3.1 8B Instruct directly into your conversational flow for intelligent natural language fallback.
- 🌐 **Automated Custom Domains & SSL**: Bind `workflow.yourdomain.com` in 1-click with automatic Cloudflare Universal SSL.
- 🛡️ **Pre-Flight Audit Checklist**: Automatically detects unreachable Docker/localhost URLs and warns before deployment.
- 🔐 **Zero-Friction Secret Sync**: Seamlessly syncs API keys, tokens, and credentials directly to Cloudflare encrypted secrets.

---

## 🛠️ Supported Operations

| Operation | Description |
| :--- | :--- |
| **Deploy to Cloudflare Edge** | Transpiles workflow logic, builds `multipart/form-data` ES Module bundles, and deploys directly to Cloudflare Workers v4. |
| **Attach Custom Domain** | Dynamically routes your branded domain or subdomain (e.g. `workflow.agnez.com.br`) to the Worker with automated SSL and DNS. |
| **Audit & Pre-Flight Checklist** | Analyzes workflow nodes, warns about unreachable endpoints (`localhost`/Docker), and prepares a readiness report. |
| **Preview Worker Code** | Inspects generated Cloudflare Worker JavaScript code, environment variables, and bindings before publishing. |
| **Test / Ping Edge Latency** | Sends synthetic pings to the deployed Worker, measuring edge latency and reporting the Cloudflare Data Center (CF-Ray / Colo). |
| **Get Edge Analytics & Metrics** | Real-time monitoring of p50/p99 latency, cache hit ratios, and estimated host server load reduction. |
| **Sync Secrets to Edge** | Encrypts and synchronizes API keys, database credentials, and tokens directly into Cloudflare Worker environment variables. |

---

## 📦 Installation

### Option 1: Visual Installation via n8n (Recommended)

1. Open your n8n instance.
2. Navigate to **Settings > Community Nodes**.
3. Click **Install**.
4. In the **npm package name** field, type:
   ```text
   n8n-nodes-n8flare
   ```
5. Check the agreement box and click **Install**.

### Option 2: Self-Hosted / Docker Installation

If you run n8n in Docker, add the package to your volume or Dockerfile:

```bash
# Inside your n8n data directory:
cd ~/.n8n/nodes
npm install n8n-nodes-n8flare
```

Restart your n8n container to load the node.

---

## 🔑 Quick Start Guide

### 1. Configure Cloudflare Credentials
1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Copy your **Account ID** (found on the right sidebar under *Workers & Pages*).
3. Go to **My Profile > API Tokens > Create Token**.
4. Use the **Edit Cloudflare Workers** template, or grant:
   - `Account - Cloudflare Workers - Edit`
   - `Account - Workers KV Storage - Edit`
   - `Zone - Workers Routes - Edit` *(optional, for Custom Domains)*
5. In n8n, create a new **Cloudflare (N8Flare) API** credential and paste your **Account ID** and **API Token**.

### 2. Add N8Flare to Your Workflow
1. Add the **N8Flare** node to any workflow containing Webhooks or Chatbots.
2. Select **Operation:** `Audit & Pre-Flight Checklist` to review node compatibility.
3. Switch to **Operation:** `Deploy to Cloudflare Edge` and click **Execute Step**.
4. Your workflow is now running globally on:
   ```text
   https://<worker-name>.<your-subdomain>.workers.dev
   ```

### 3. Attach Your Custom Domain (Optional)
1. Select **Operation:** `Attach Custom Domain`.
2. Type your domain: `workflow.yourdomain.com` (leave Zone ID blank for auto-discovery).
3. Click **Execute Step** — Cloudflare provisions SSL and DNS automatically.

---

## 🧩 Architecture

```text
               ┌───────────────────────────────┐
               │    End User / WhatsApp / CRM   │
               └───────────────┬───────────────┘
                               │ HTTP Request (Sub-20ms)
                               ▼
            ┌─────────────────────────────────────┐
            │   Cloudflare Edge (330+ Cities)     │
            │  ─────────────────────────────────  │
            │       N8Flare Worker Runtime        │
            └───────┬──────────────┬──────────────┘
                     │              │
        KV Session Cache      Direct API Fetch
       (Sub-5ms Read/Write)   (Stripe, CRMs, ERPs, etc.)
             │                      │
             ▼                      ▼
     ┌───────────────┐      ┌───────────────┐
     │ Cloudflare KV │      │  External API │
     └───────────────┘      └───────────────┘
             │
             │ (Async Heavy Tasks / Sync Only)
             ▼
  ┌─────────────────────────────────────┐
  │       Central n8n Instance          │
  │  (Protected from peaks and spikes)  │
  └─────────────────────────────────────┘
```

---

## 💻 Local Development

```bash
# 1. Clone the repository
git clone https://github.com/amaurygomes/n8n-nodes-n8flare.git
cd n8n-nodes-n8flare

# 2. Install dependencies
npm install

# 3. Build TypeScript and copy assets
npm run build

# 4. Lint and check standards
npm run lint
```

---

## 👤 Author

**Amaury Gomes Ibanez**
- Website: [amaurygomes.com.br](https://amaurygomes.com.br) / [agnez.com.br](https://agnez.com.br)
- Email: [amaury_mju@hotmail.com](mailto:amaury_mju@hotmail.com)
- GitHub: [@amaurygomes](https://github.com/amaurygomes)

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE.md).
