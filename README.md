# ForgeMuse AI 🎨✨

> **From Imagination to Creation** — An AI-powered creative studio for songs, stories, scripts, and more.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com/atlas)
[![IBM Granite](https://img.shields.io/badge/IBM-Granite%20AI-blue?logo=ibm)](https://ibm.com/products/watsonx-ai)

---

## 🌟 Overview

ForgeMuse AI is a production-quality, full-stack AI creative studio that acts as a **creative collaborator** rather than a simple content generator. It provides six specialized AI modules for different creative projects, all powered by IBM Granite AI through Watsonx.

### Key Features

| Feature | Description |
|---|---|
| 🎵 **Song Creator** | Generate complete songs with verses, choruses, bridges, chord progressions, musical key |
| ✍️ **Lyrics Improver** | Multi-round AI analysis improving flow, rhyming, imagery, and emotional impact |
| 📖 **Story Generator** | Create original stories with characters, chapters, and alternative endings |
| 🎬 **Script Writer** | Write original movie/short-film scripts (copyright-safe) |
| 📝 **Blog Writer** | SEO-optimized blog posts with structured sections |
| 📱 **Social Media** | Platform-optimized posts for Twitter, Instagram, LinkedIn & more |
| 📣 **Ad Copy** | Conversion-focused advertisement copy variants |
| 💬 **AI Chat** | Conversational creative collaborator with project context |
| 📦 **Export** | PDF, DOCX, and TXT export for all projects |
| 🌙 **Dark/Light Mode** | Glassmorphism UI with smooth theme switching |

---

## 🏗️ Architecture

```
forgemuse-ai/
├── frontend/                    # Next.js 14 App Router
│   ├── app/
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Landing page
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx       # Auth guard + sidebar
│   │       ├── page.tsx         # Dashboard overview
│   │       ├── chat/page.tsx    # AI Chat
│   │       ├── projects/page.tsx
│   │       ├── settings/page.tsx
│   │       └── create/
│   │           ├── page.tsx     # Module selector
│   │           ├── song/page.tsx
│   │           ├── lyrics/page.tsx
│   │           ├── story/page.tsx
│   │           ├── script/page.tsx
│   │           ├── blog/page.tsx
│   │           ├── social/page.tsx
│   │           └── ad/page.tsx
│   ├── components/
│   │   ├── landing/             # Landing page sections
│   │   ├── auth/                # Auth forms
│   │   ├── dashboard/           # Sidebar, TopBar
│   │   └── providers/           # Auth, Theme context
│   ├── lib/
│   │   └── export.ts            # PDF/DOCX/TXT export
│   └── tailwind.config.js
│
└── backend/                     # Node.js + Express
    └── src/
        ├── index.js             # Express app + MongoDB
        ├── models/
        │   ├── User.js          # User schema with usage limits
        │   └── Project.js       # Project schema
        ├── routes/
        │   ├── auth.js          # Register, login, reset password
        │   ├── projects.js      # CRUD for projects
        │   └── ai.js            # All AI generation endpoints
        ├── services/
        │   └── aiService.js     # IBM Granite integration + fallbacks
        └── middleware/
            └── auth.js          # JWT auth + rate limiting
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB Atlas** account (free tier works)
- **IBM Cloud account** with Watsonx access (for Granite AI)

### 1. Clone the repository

```bash
git clone https://github.com/your-org/forgemuse-ai.git
cd forgemuse-ai
```

### 2. Set up the Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials (see Environment Variables section below)
npm run dev
# Backend running at http://localhost:5000
```

### 3. Set up the Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local
npm run dev
# Frontend running at http://localhost:3000
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/forgemuse-ai

# JWT Authentication
JWT_SECRET=your-super-secret-key-at-least-32-characters
JWT_EXPIRES_IN=7d

# IBM Granite (Watsonx)
IBMCLOUD_API_KEY=your-ibm-cloud-api-key
IBM_GRANITE_URL=https://us-south.ml.cloud.ibm.com
IBM_GRANITE_PROJECT_ID=your-watsonx-project-id
IBM_GRANITE_MODEL_ID=ibm/granite-13b-chat-v2

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=ForgeMuse AI <noreply@forgemuseai.com>

# CORS
FRONTEND_URL=http://localhost:3000

# Development: use mock AI responses instead of calling Granite
USE_MOCK_AI=false
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=ForgeMuse AI
```

---

## 🤖 IBM Granite AI Integration

ForgeMuse AI uses **IBM Granite 13B Chat v2** through IBM Watsonx.

### Setup Steps

1. Create an [IBM Cloud account](https://cloud.ibm.com/registration)
2. Go to [IBM Watsonx](https://dataplatform.cloud.ibm.com/wx/home)
3. Create a new **Project** and note your **Project ID**
4. Create an **API Key** in IBM Cloud IAM
5. Add credentials to `backend/.env`

### AI Architecture

The AI service layer in [`backend/src/services/aiService.js`](backend/src/services/aiService.js) provides:

- **Modular prompts** — Each creative module has its own system prompt, easily customizable
- **JSON response parsing** — All AI outputs are structured JSON for consistent rendering
- **Graceful fallbacks** — If IBM Granite is unavailable, mock responses maintain UI functionality
- **Copyright detection** — Script generator detects and refuses copyrighted content requests
- **Token management** — Automatic IBM IAM token refresh

### Using Alternative LLMs

The AI service is designed to be model-agnostic. To use a different LLM:

```javascript
// In backend/src/services/aiService.js
// Replace callGranite() with your preferred LLM client
async function callGranite(prompt, systemPrompt = '', maxTokens = 2048) {
  // Replace with: OpenAI, Anthropic, Ollama, etc.
}
```

---

## 📡 API Documentation

### Authentication

All protected routes require `Authorization: Bearer <token>` header.

#### Register
```
POST /api/auth/register
Body: { name, email, password }
Response: { token, user }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { user }
```

#### Forgot Password
```
POST /api/auth/forgot-password
Body: { email }
```

#### Reset Password
```
POST /api/auth/reset-password/:token
Body: { password }
```

### Projects

#### List Projects
```
GET /api/projects?sort=-updatedAt&type=song&limit=50&page=1&search=keyword
Response: { projects, pagination }
```

#### Create Project
```
POST /api/projects
Body: { title, type, content, excerpt, metadata }
Response: { project }
```

#### Update Project
```
PUT /api/projects/:id
Body: { title?, content?, excerpt? }
```

#### Delete Project
```
DELETE /api/projects/:id
```

### AI Generation

All AI endpoints require auth + check usage limits.

#### Song Creator
```
POST /api/ai/song
Body: { theme, emotion, genre, language, mood, structure }
Response: { result: { title, verse1, chorus, verse2, bridge, outro, chordProgression, musicalKey, tempo } }
```

#### Lyrics Improver
```
POST /api/ai/improve-lyrics
Body: { lyrics, focusArea, additionalNotes, round }
Response: { result: { originalLyrics, improvedLyrics, improvements: {...} } }
```

#### Story Generator
```
POST /api/ai/story
Body: { prompt, genre, tone, length, protagonist, setting }
Response: { result: { title, synopsis, characters, chapters, ending, alternativeEnding } }
```

#### Script Writer
```
POST /api/ai/script
Body: { concept, genre, scriptType, protagonist, antagonist, setting }
Response: { result: { title, logline, characters, scenes } } | { copyrightRefused: true, message }
```

#### Blog Writer
```
POST /api/ai/blog
Body: { topic, category, tone, length, keywords, targetAudience }
Response: { result: { title, introduction, sections, conclusion, seoMeta } }
```

#### Social Media
```
POST /api/ai/social
Body: { topic, platform, postType, tone, callToAction, hashtags }
Response: { result: { posts: [{ platform, content, hashtags }] } }
```

#### Ad Copy
```
POST /api/ai/ad
Body: { product, audience, uniqueValue, adType, tone, callToAction }
Response: { result: { variants: [{ headline, body, cta }] } }
```

#### AI Chat
```
POST /api/ai/chat
Body: { message, context, history: [{ role, content }] }
Response: { reply }
```

---

## 🌐 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Set root directory to `frontend`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your backend URL
5. Deploy

```bash
# Or via Vercel CLI
cd frontend
npx vercel --prod
```

### Backend → Render

1. Create a new **Web Service** at [render.com](https://render.com)
2. Connect your GitHub repo
3. Set:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `backend`
4. Add all environment variables from `backend/.env`
5. Deploy

### Backend → Railway

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
cd backend
railway init
railway up
```

---

## 📱 Usage Guide

### Free Plan
- 10 AI generations per month
- Access to all 6 creative modules
- AI chat assistant
- 5 saved projects
- TXT export

### Pro Plan ($19/month)
- Unlimited AI generations
- Unlimited saved projects
- PDF & DOCX export
- Priority AI generation

### Creating Your First Song

1. Sign up or log in
2. Go to **Create** → **Song Creator**
3. Enter your theme, select genre and mood
4. Click **Generate Song**
5. Review the generated lyrics with chord progressions
6. Click **Save** to store in My Projects
7. Export as TXT/PDF when ready

### Improving Existing Lyrics

1. Go to **Create** → **Lyrics Improver**
2. Paste your existing lyrics
3. Select a focus area (Flow, Imagery, etc.)
4. Click **Improve Lyrics**
5. Compare original vs. improved side-by-side
6. Click **Round 2** for further refinement
7. Use the AI Chat to discuss specific changes

---

## 🔒 Security Features

- **JWT authentication** with configurable expiry
- **bcrypt password hashing** (12 rounds)
- **Rate limiting** (200/15min global, 10/min for AI)
- **Helmet.js** security headers
- **CORS** whitelist
- **Input validation** with express-validator
- **MongoDB injection protection** via Mongoose

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [IBM Watsonx](https://ibm.com/products/watsonx-ai) for the Granite AI models
- [Next.js](https://nextjs.org/) team for the excellent framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Lucide React](https://lucide.dev/) for the beautiful icons

---

<p align="center">Made with ❤️ by the ForgeMuse AI Team · <strong>From Imagination to Creation</strong></p>
