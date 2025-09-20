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
npm run lint:html    # Run ESLint on HTML templates
npm run format       # Check Prettier formatting
npm run format:fix   # Fix formatting issues
npm run stylelint    # Run Stylelint on CSS
npm run stylelint:fix # Fix Stylelint issues
npm run check        # Astro type checking
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
    - `reading-entries.json` - Complete reading history (formerly timeline-entries.json)
    - Other data files (authors, works, etc.)
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

Responsible for validating and loading the data files in `/content/data/` only. The functions in `/src/api/` further enrich and transform this data, while the `getProps` functions in `/src/features/` are responsible for getting component props and ensuring we don't overfetch.

**Key files follow kebab-case naming:**

- `reading-entries-json.ts` - Loads reading history data
- `authors-json.ts`, `reviews-markdown.ts` - Other data loaders
- All follow consistent naming pattern with hyphens

### Component Structure

**Features** (`/src/features/`):

- Major page features organized by domain (e.g., `author/`, `reviews/`, `readings/`, `stats/`)
- Each feature contains:
  - `Component.tsx` - Main feature component
  - `Component.spec.tsx` - Tests (Vitest + Testing Library)
  - `getProps.ts` - Data fetching for Astro pages
  - `Component.reducer.ts` - State management for complex interactions
  - Additional feature-specific components (e.g., `Filters.tsx`, `OpenGraphImage.tsx`)

**Shared Components** (`/src/components/`):

- Reusable UI components organized by functionality:
  - `/fields/` - Form inputs (SelectField, TextField, YearField, etc.)
  - `/filter-and-sort/` - Filtering and sorting logic with reducers
  - `/layout/` - Layout components (Header, Footer, Navigation)
  - `/cover-list/`, `/avatar-list/` - Content display components
  - Other shared utilities (Grade, Cover, Avatar, etc.)

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

## Recent Major Changes (Current Branch)

This branch completes significant architectural improvements:

### Component Reorganization Completed

- **Features-first architecture fully implemented**: All major page components successfully moved to `/src/features/`:
  - `author-titles/` - Individual author pages with their works
  - `authors/` - Authors listing page
  - `home/` - Homepage
  - `reading-log/` - Reading history with calendar view (formerly Readings)
  - `review/` - Individual review pages
  - `reviews/` - Reviews listing page
  - `stats/` - Statistics pages (alltime and yearly)

- **Shared components fully reorganized** in `/src/components/`:
  - `/article/` - Article rendering components
  - `/avatar/`, `/avatar-list/` - Avatar display components
  - `/bar-gradient/` - Visual gradient bars
  - `/cover/`, `/cover-list/` - Book cover display components
  - `/fields/` - Form inputs (SelectField, TextField, YearField, GradeField)
  - `/filter-and-sort/` - Reusable filtering and sorting logic
  - `/grade/` - Grade display components
  - `/grouping-list-item/` - List grouping utilities
  - `/layout/` - Layout components (Header, Footer, Navigation, Mast, Backdrop)
  - `/list-item-*` - Granular list item components for different data types
  - `/long-form-text/`, `/rendered-markdown/` - Text rendering
  - `/more-reviews/`, `/review-card/` - Review display components
  - `/open-graph-image/` - OG image utilities
  - `/sub-heading/` - Typography components

- **Astro layout consolidation**: Layout files moved to `/src/astro/`:
  - `AstroPageShell.astro` - Main page shell (formerly Layout.astro)
  - `navDrawer.ts`, `search.ts`, `search-ui.ts` - Supporting utilities

### Data Structure Updates Completed

- **Reading entries fully renamed**: All references to `timeline-entries.json` updated to `reading-entries.json`
- **API data layer consistently using kebab-case**:
  - `alltime-stats-json.ts`, `authors-json.ts`, `pages-markdown.ts`
  - `reading-entries-json.ts`, `readings-markdown.ts`
  - `reviewed-works-json.ts`, `reviews-markdown.ts`, `year-stats-json.ts`

### Feature-Specific Improvements

- **Reading Log (formerly Readings)**: New calendar view implementation with month navigation
- **Authors Page**: Added alphabet navigation for easier browsing
- **Filter and Sort**: Centralized and reusable filter/sort components with dedicated reducers
- **List Items**: Modular list item components for consistent display across features

### File Organization Patterns

- **Feature directories** contain complete domain logic:
  - Main component (`Feature.tsx`)
  - Props fetching (`getFeatureProps.ts`)
  - State management (`Feature.reducer.ts`) when needed
  - Filters (`FeatureFilters.tsx`) when applicable
  - Tests (`Feature.spec.tsx`)
  - Feature-specific utilities (sorting, filtering, grouping)

- **Shared components** are truly reusable across features
- **Clear separation** between feature-specific and shared code

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
3. Processed and linked in API layer (`/src/api/`)
4. Consumed by features via `getProps` functions in `/src/features/`
5. Rendered server-side by Astro

### Path Aliases

- `~/` maps to `src/` directory

### Node/NPM Versions

- Node: 22.19.0
- NPM: 11.6.0
  (Managed via .nvmrc)

## Testing Principles

### Testing Principles

- The purpose of tests is to tell me two things:
  1. Will this dependency update break the site?
  2. Will this change cause other, unintended changes?
- Rely on snapshot tests as all websites boil down to text output
- Two primary testing strategies:
  - **Pure Static Pages**:
    - Simple snapshot tests at both Astro page level and page component level
    - Astro level checks Astro code
    - Page-component level checks prop permutations
  - **Interactive Pages**:
    - Snapshots at Astro level
    - Snapshot tests at page component level using testing library
    - Exercise interactive elements like a user
  - Goal: By exercising all options and rendering all permutations, any uncovered code must be dead code safe to remove

## Development Workflow

1. **IMPORTANT**: Always create a new feature branch for new features:
   - `git checkout -b feat/feature-name` for features
   - `git checkout -b fix/bug-name` for bug fixes
   - `git checkout -b chore/task-name` for maintenance tasks
2. **IMPORTANT**: Always rebase on origin/main before pushing:
   - `git pull --rebase origin main`
3. Make changes with proper types
4. Run tests and linting
5. **IMPORTANT**: Before creating any PR, run:
   - `npm run test` - Must pass with no errors
   - `npm run lint` - Must pass with no errors
   - `npm run lint:spelling` - Must pass with no errors
   - `npm run check` - Must pass with no errors
   - `npm run knip` - Must pass with no errors
   - `npm run format` - Must pass with no errors

   - This ensures your PR is based on the latest code

6. Create PR with descriptive title
7. Ensure all CI checks pass

## Test Runner Notes

- **IMPORTANT**: When running test or test:coverage, make sure and run with max-workers=2

## TypeScript Best Practices

- Don't use the `any` type. The linter will error on it.
- **Use TypeScript types, not JSDoc types**: When functions have TypeScript type annotations, avoid duplicate type information in JSDoc comments. Use `@param name - description` instead of `@param {Type} name - description`. Keep the descriptive text but remove type annotations in curly braces.
