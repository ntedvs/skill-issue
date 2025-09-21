# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**skill-issue** is an AI-powered platform that helps college students analyze their job application competitiveness. Students upload resumes and provide job posting URLs, then the system analyzes skill gaps and provides actionable insights for improving their candidacy.

**Key workflow:**

1. User uploads resume → PDF text extraction → OpenAI skill extraction
2. User provides job URL → web scraping or manual input → OpenAI job analysis
3. AI compares resume skills vs job requirements → generates structured report with recommendations

## Development Commands

```bash
# Development
pnpm dev              # Start Next.js dev server with Turbopack
pnpm build            # Build for production with Turbopack
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm drizzle          # Run Drizzle Kit commands (migrations, studio, etc.)
```

## Core Architecture

### Database Schema (PostgreSQL + Drizzle ORM)

- **users**: Basic user accounts (email-only)
- **resumes**: Uploaded PDFs with extracted text and AI-identified skills
- **reports**: Job analysis results comparing resume skills vs job requirements
- **sessions/verifications**: NextAuth.js tables for magic link authentication

### Authentication Flow

- **Magic link authentication** via NextAuth.js + Nodemailer
- Email-only signup/login (no passwords)
- Server actions handle form submissions with `useActionState`

### AI Integration Patterns

**Resume Processing:**

- PDF → `pdfreader` → raw text extraction
- Raw text → OpenAI GPT-5-mini → structured skill extraction

**Job Analysis:**

- URL → Zyte API web scraping (with manual fallback)
- Job content + resume skills → OpenAI GPT-4o with structured outputs → comprehensive analysis
- Uses Zod schemas with `zodTextFormat` for reliable structured responses

### Key Technical Patterns

**Server Actions:**

- Located in `actions.ts` files within route directories
- Handle form processing, database operations, and AI API calls
- Use `redirect()` for navigation after successful operations

**Component Structure:**

- Server components for data fetching and auth checks
- Client components only when needed (file uploads, form interactions)
- Keep logic server-side when possible

**Error Handling:**

- Scraping failures gracefully fall back to manual text input
- Form state preserved across submissions using `useActionState`
- Authorization checks ensure users only see their own data

### External Services

- **Zyte API**: Web scraping job postings with automatic fallback
- **OpenAI**: Structured text analysis using latest models
- **Neon**: PostgreSQL database hosting
- **Email SMTP**: For magic link delivery

### File Organization

- `/src/app/`: Next.js 15 App Router pages and API routes
- `/src/lib/`: Shared utilities (auth, database, OpenAI client)
- `/src/drizzle/`: Database schema and types
- `/src/utils/`: Server-side utilities (PDF processing)

### Environment Variables Required

- `DATABASE_URL`: Neon PostgreSQL connection
- `AUTH_SECRET`: NextAuth.js secret
- `EMAIL_SERVER`: SMTP connection string
- `OPENAI_API_KEY`: OpenAI API access
- `ZYTE`: Zyte API key for web scraping
