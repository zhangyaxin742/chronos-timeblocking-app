# CHRONOS

A mobile-first timeblocking application that empowers users to take control of their time through visual, flexible timeblocking.

## Features

- **Visual Timeblocking**: Highlighter-inspired design with translucent color blocks
- **Natural Language Duration**: Enter durations like "90 min", "1.5 hours", "1h 30m"
- **Task Integration**: Native task lists within timeblocks
- **Category System**: Color-coded categories for organizing your time
- **Dark/Light Theme**: Automatic system detection with manual override

## Tech Stack

- **Frontend**: React + Next.js with TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **State Management**: Zustand

## Project Structure

```
chronos/
├── apps/
│   ├── web/          # Next.js PWA
│   └── api/          # Supabase Edge Functions
├── packages/
│   └── shared/       # Shared types and utilities
└── supabase/         # Database migrations and config
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file in `apps/web/` with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## License

MIT
