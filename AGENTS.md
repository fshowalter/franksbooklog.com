# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) or similar agents when working with code in this repository.

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
npm run test -- --max-workers=2  # Run all tests
npm run test:coverage -- --max-workers=2 # Run tests with coverage report

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Check Prettier formatting
npm run format:fix   # Fix formatting issues
npm run stylelint    # Run Stylelint on CSS
npm run stylelint:fix # Fix Stylelint issues
npm run check        # Astro type checking
npm run knip         # Check for unused dependencies/exports

# Content Management
npm run sync         # Sync content from backend system
```

## Architecture & Key Patterns

### Content Architecture

- `/content/` - All content data (JSON and Markdown), kept separate from code
  - `/data/` - JSON data files with Zod validation schemas
    - `/reading-log/` - Complete reading history
    - `/reviewed-authors/` - Authors with reviewed works
    - `/reviewed-works/` - Reviewed works
    - `/year-stats/` - Reading stats per year
    - `all-time-stats.json` - All-time reading stats
  - `/reviews/` - Markdown review files
  - `/readings/` - Reading history entries
  - `/assets/` - Images (covers, avatars, backdrops)

### Astro Content Collections (`/src/collections/`)

- All collection definitions, loaders, and schemas.
- Main configuration file located at `/src/content.config.ts` (mandated by Astro)

### Component Structure

**Features** (`/src/features/`):

- Page features organized by domain (e.g., `author/`, `reviews/`, `readings/`, `stats/`)
- Each feature contains:
  - `Component.tsx` - Main feature component
  - `Component.spec.tsx` - Tests (Vitest + Testing Library)
  - `getProps.ts` - Props building for React components
  - `Component.reducer.ts` - State management for complex interactions
  - Additional feature-specific components (e.g., `Filters.tsx`, `OpenGraphImage.tsx`)

**Shared Components** (`/src/components/`):

- Reusable UI components organized by functionality:
  - `/fields/` - Form inputs (SelectField, TextField, YearField, etc.)
  - `/applied-filters/` - `AppliedFilters` component (exports `FilterChip` type too)
  - `/collection-filters/` - `CollectionFilters` component + `CollectionSortOptions` constant + test helper
  - `/filter-and-sort-container/` - `FilterAndSortContainer` component + header/section privates + test helper
  - `/reviewed-status-filter/` - `ReviewedStatusFilter` component + test helper
  - `/reviewed-work-filters/` - `ReviewedWorkFilters` component + `ReviewedWorkSortOptions` constant + test helper
  - `/work-filters/` - `WorkFilters` component + test helper
  - `/layout/` - Layout components (Header, Footer, Navigation)
  - `/cover-list/`, `/avatar-list/` - Content display components
  - Other shared utilities (Grade, Cover, Avatar, etc.)

### Testing Strategy

Tests run in jsdom environment for React components.

**Important:** Run only one Vitest instance at a time. Each instance consumes ~2GB RAM, so avoid spawning multiple test processes simultaneously.

## Important Implementation Details

### Path Aliases

- `~/` maps to `src/` directory

## Testing Principles

- The purpose of tests is to tell me two things:
  1. Will this dependency update break the site?
  2. Will this change cause other, unintended changes?
- Testing focuses on the interactive React components:
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
