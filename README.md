# Finalyze-AI

A personal finance web app that allows users to upload a CSV/Excel bank statement and get AI-powered insights about their spending with daily, weekly, and monthly trend analysis.

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript 5.3+
- **Styling**: Tailwind CSS 3.3
- **Charts**: Recharts 3.3 (pie + bar charts)
- **AI**: Google Gemini API

## Features

✅ Upload CSV/Excel bank statements
✅ Transaction categorization with AI
✅ Daily/Weekly/Monthly spending trends
✅ Spending breakdown by category
✅ AI-generated insights & recommendations
✅ Responsive & mobile-friendly design

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:3000

### Environment Variables

Create or edit `.env.local`:

```bash
GENERATIVE_API_KEY=your_gemini_api_key_here
```

**Note**: The app works without an API key (mocked responses for development).

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts              # Upload & analysis API
│   ├── page.tsx                          # Home page
│   ├── layout.tsx                        # Root layout
│   └── globals.css
├── components/                           # React components
├── types/index.ts                        # TypeScript interfaces
└── utils/
    ├── csvParser.ts                      # CSV parsing
    └── mockData.ts                       # Mock data
```

## License

MIT