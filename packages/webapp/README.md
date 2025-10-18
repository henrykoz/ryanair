# Ryanair Flight Search Web App

A mobile-first web application for searching Ryanair flights and redirecting to Ryanair's booking page.

## Features

- **Mobile-first design** - Optimized for touch interactions
- **One-way and return flights** - Toggle between trip types
- **Country-grouped airport selection** - Easy to find airports by country
- **Geolocation support** - Find nearby airports automatically
- **Date range picker** - Mobile-optimized date selection
- **Direct booking** - Opens search results on Ryanair's website
- **PWA support** - Install as a mobile app

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Build

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **@2bad/ryanair** - Ryanair API client
- **date-fns** - Date manipulation
- **Radix UI** - Accessible component primitives

## Architecture

- `/app` - Next.js app router pages and layouts
- `/app/api` - API routes for fetching airports and searching flights
- `/components` - Reusable React components
- `/components/ui` - shadcn/ui components
- `/lib` - Utility functions
- `/public` - Static assets and PWA files

## API Routes

- `GET /api/airports` - Fetch all airports grouped by country
- `GET /api/nearby-airports?lat={lat}&lng={lng}` - Find nearby airports
- `POST /api/search` - Search for flights (currently unused, direct redirect to Ryanair)

## How It Works

1. User selects trip type (one-way/return)
2. User selects origin and destination airports
3. User selects travel dates
4. App generates a Ryanair booking URL with search parameters
5. User is redirected to Ryanair's website to complete booking

## License

MIT
