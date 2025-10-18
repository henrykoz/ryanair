# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an unofficial TypeScript client library for Ryanair's API, published as `@2bad/ryanair`. The repository is structured as an npm workspace monorepo with two packages:

- **packages/client** (`@2bad/ryanair`): The main TypeScript API client library
- **packages/mcp** (`@2bad/ryanair-mcp`): A Model Context Protocol (MCP) server that exposes Ryanair API functionality as tools for AI assistants

## Build and Development Commands

### Root-level commands (run from repository root)

```bash
npm ci                      # Install dependencies (use this instead of npm install)
npm run test --ws           # Run all tests across all workspaces
npm run test:unit --ws      # Run unit tests with coverage
npm run test:integration --ws # Run integration tests with coverage
```

### Package-specific commands (run from package directories or use -w flag)

**Client package** (`packages/client`):

```bash
npm run build -w @2bad/ryanair           # Build the library (SWC + TypeScript types)
npm run test -w @2bad/ryanair            # Run all tests
npm run test:unit -w @2bad/ryanair       # Run unit tests only
npm run test:integration -w @2bad/ryanair # Run integration tests (makes actual API calls)
npm run check -w @2bad/ryanair           # Run all checks (biome + eslint)
npm run fix -w @2bad/ryanair             # Auto-fix linting and formatting issues
```

**MCP package** (`packages/mcp`):

```bash
npm run build -w @2bad/ryanair-mcp       # Build the MCP server
npm run dev -w @2bad/ryanair-mcp         # Run MCP inspector for debugging
```

### Single test execution

```bash
# Run a specific test file
npx vitest run packages/client/source/airports/getActive.test.ts

# Run tests in watch mode for a specific file
npx vitest packages/client/source/helpers/unit.test.ts
```

## Architecture

### Client Package Structure

The client package (`packages/client`) is organized by API domain:

- **airports/**: Airport-related functionality (find airports, routes, destinations, schedules)
- **flights/**: Flight availability and dates
- **fares/**: Pricing and fare search functionality
- **helpers/**: Utility functions (booking URLs, date handling, geodesy calculations)
- **client/**: HTTP client configuration using `got` library with custom cookies and debouncing

**Key architectural patterns:**

1. **Path aliases**: The codebase uses `~/` as an alias for the source directory (e.g., `~/airports/index.ts`). This is configured in `tsconfig.json` under `paths` and resolved at runtime via `vite-tsconfig-paths`.

2. **HTTP Client**: All API calls go through a custom `got` client (`client/index.ts`) that:
   - Includes required Ryanair cookies (`rid`, `rid.sig`, etc.) in headers
   - Implements automatic request debouncing (500ms delay between calls)
   - Sets `client: desktop` header and expects JSON responses

3. **Type validation**: Uses Zod schemas extensively for runtime type validation of API responses.

4. **Testing separation**:
   - Unit tests use `.unit.test.ts` suffix
   - Integration tests use `.integration.test.ts` suffix (these make actual API calls)

### MCP Package Structure

The MCP package (`packages/mcp`) provides AI tool access to the Ryanair API:

- **tools/**: MCP tool definitions organized by domain (airports, flights, fares, booking)
- **utils/**: Logging and utility functions
- Implements the Model Context Protocol specification using `@modelcontextprotocol/sdk`
- All tools are registered in `index.ts` and exposed via stdio transport

### Shared Configuration

- **TypeScript**: Uses `@2bad/tsconfig` as a base configuration with path aliases
- **Build**: SWC for transpilation + TypeScript for type generation
- **Linting**: Biome for formatting + ESLint for code quality
- **Testing**: Vitest with separate unit/integration test suites and v8 coverage
- **Package manager**: npm with workspace support (requires Node.js >=22)

## API Module Organization

The client exports three main API modules, each with focused responsibilities:

**airports module:**

- `getActive()`, `getActiveV3()` - List all active airports
- `getClosest()` - Find nearest airport based on geolocation
- `getNearby(lat, lon)` - Find airports within radius
- `getDestinations(origin)` - Available destinations from an airport
- `getInfo(iataCode)` - Detailed airport information
- `findRoutes(origin, destination)` - Search flight routes
- `getSchedules*()` - Flight schedule queries

**flights module:**

- `getDates(origin, dest)` - Available flight dates between airports
- `getAvailable(origin, dest, date)` - Flight availability for specific date

**fares module:**

- `getCheapestPerDay(origin, dest, outboundDate)` - Daily cheapest fares
- `findDailyFaresInRange(origin, dest, startDate, endDate)` - Fares across date range
- `findCheapestRoundTrip(origin, dest, outbound, inbound, params)` - Best round-trip deals

**helpers module:**

- `createBookingLink()` - Generate Ryanair booking URLs
- Date utilities and geodesy calculations

## Important Notes

- This is an **ESM-only package** - no CommonJS support
- API calls require specific cookies that are hardcoded in `client/index.ts` (may need updating if Ryanair changes their requirements)
- Integration tests make real API calls and are subject to Ryanair's rate limits and API availability
- The debounce mechanism in the HTTP client is critical - removing it may result in blocked requests
- All IATA airport codes are 3-letter strings (e.g., 'DUB', 'BER', 'STN')
