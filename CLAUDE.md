# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frank's Book Log is an Astro-based static site for book reviews and reading tracking. Built with TypeScript, React components, and Tailwind CSS. The site uses a content-first architecture with JSON data files and Markdown reviews.

## Development Commands

```bash
# Development
npm run dev          # Start dev server on localhost:4321
npm start            # Alias for dev

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:update  # Update test snapshots
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Check Prettier formatting
npm run format:fix   # Fix formatting issues
npm run stylelint    # Run Stylelint on CSS
npm run stylelint:fix # Fix Stylelint issues
npm run check        # Run Astro type checking
npm run knip         # Check for unused dependencies/exports

# Content Management
npm run sync         # Sync content from backend system
npm run lint:spelling # Check spelling
npm run lint:spelling:fix # Update project dictionary
```

## Architecture & Key Patterns

### Content Architecture

- `/content/` - All content data (JSON and Markdown), kept separate from code
  - `/data/` - JSON data files with Zod validation schemas
  - `/reviews/` - Markdown review files
  - `/readings/` - Reading history entries
  - `/assets/` - Images (covers, avatars, backdrops)

### API Layer (`/src/api/`)

Replaces Gatsby's GraphQL with TypeScript functions that:

- Load and validate JSON/Markdown using Zod schemas
- Cache data in production for performance
- Link related data (authors, works, readings)
- Process Markdown with remark/rehype pipeline

#### API Data Layer (`/src/api/data/`)

Responsible for validating and loading the data files in `/content/data/` only. The functions in `/src/api/` further enrich and transform this data, while the `getProps` functions in `/src/components/` are responsbile for getting component props and ensuring we don't overfetch.

### Component Structure

- Page components in `/src/components/` with:
  - `Component.tsx` - Main component
  - `Component.spec.tsx` - Tests (Vitest + Testing Library)
  - `getProps.ts` - Data fetching for Astro pages
  - Reducers for complex state (`Component.reducer.ts`)

### Testing Strategy

Tests run in two environments:

- Components: jsdom environment for React components
- Pages: node environment for Astro pages

**Important:** Run only one Vitest instance at a time. Each instance consumes ~2GB RAM, so avoid spawning multiple test processes simultaneously.

### Build Pipeline

1. Astro builds static pages with React components
2. Pagefind creates search index post-build
3. Compressor optimizes output
4. Deploy to Netlify via GitHub Actions

## Important Implementation Details

### Content Hot Reload

Custom Vite plugin watches `/content/` directory for HMR during development.

### Search Implementation

Pagefind integration builds search index at build time and serves it in dev mode.

### Image Optimization

- Covers/avatars served as static assets
- Backdrops optimized through Astro's image pipeline
- Open Graph images generated dynamically

### Data Flow

1. Content synced from backend via `sync.js`
2. Validated through Zod schemas in `/src/api/data/`
3. Processed and linked in API layer
4. Consumed by components via `getProps` functions
5. Rendered server-side by Astro

### Path Aliases

- `~/` maps to `src/` directory

### Node/NPM Versions

- Node: 22.18.0
- NPM: 11.5.2
  (Managed via .nvmrc)
