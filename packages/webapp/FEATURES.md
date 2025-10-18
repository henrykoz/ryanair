# Ryanair Flight Search - Features

## Implemented Features

### ✅ Search Interface
- **Trip Type Toggle**: Switch between one-way and return flights
- **Country-Grouped Airport Selection**: Airports organized by country with searchable dropdown
- **Date Pickers**: Mobile-optimized calendar components for departure and return dates
- **Validation**: Prevents searching without required fields

### ✅ Geolocation
- **Find Nearby Airports**: Button to detect user location and find closest airports
- Uses browser's Geolocation API
- Calculates distance using Haversine formula
- Auto-selects nearest airport as origin

### ✅ Direct Booking
- Generates proper Ryanair booking URLs with all search parameters
- Opens Ryanair website in new tab with pre-filled search
- Supports both one-way and return trips
- Passes passenger counts, dates, and airport codes

### ✅ Mobile-First Design
- Touch-friendly UI with minimum 44px tap targets
- Responsive layout optimized for mobile screens
- Custom CSS utility class `.touch-target` for consistent sizing
- Mobile-optimized date picker and dropdown components

### ✅ PWA Support
- Manifest file for installability
- Service worker for offline support
- App icons (need to add actual icon files)
- Proper meta tags for mobile web apps

### ✅ API Integration
Three API endpoints:
1. `/api/airports` - Fetches all Ryanair airports grouped by country
2. `/api/nearby-airports` - Finds airports near user's location
3. `/api/search` - Search endpoint (currently unused, direct redirect preferred)

## Technology Stack

### Frontend
- **Next.js 15**: App Router, Server Components, API Routes
- **React 19**: Latest React features
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Beautiful, accessible components

### UI Components (shadcn/ui)
- Button
- Card
- Command (airport search)
- Dialog
- Label
- Popover
- Toggle & ToggleGroup (trip type selection)
- Calendar (date picker)

### Backend Integration
- **@2bad/ryanair**: Client package for Ryanair API
- **date-fns**: Date manipulation
- **Zod**: Runtime type validation

## Project Structure

```
packages/webapp/
├── app/
│   ├── api/                    # API routes
│   │   ├── airports/          # Get airports list
│   │   ├── nearby-airports/   # Find nearby airports
│   │   └── search/            # Search flights (unused)
│   ├── globals.css            # Global styles + shadcn theme
│   ├── layout.tsx             # Root layout with metadata
│   └── page.tsx               # Main search page
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── calendar.tsx
│   │   ├── command.tsx
│   │   ├── dialog.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── toggle.tsx
│   │   └── toggle-group.tsx
│   ├── airport-select.tsx     # Custom airport selector
│   └── date-range-picker.tsx  # Custom date picker
├── lib/
│   ├── booking.ts             # Ryanair URL generation
│   └── utils.ts               # Utility functions (cn)
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── robots.txt
└── Configuration files...
```

## Usage

### Development
```bash
npm run dev -w @2bad/ryanair-webapp
```

Visit http://localhost:3000

### Building
```bash
# Build the client package first
npm run build -w @2bad/ryanair

# Then build the webapp
npm run build -w @2bad/ryanair-webapp
```

Note: There are currently some React 19 compatibility issues with production builds. The dev server works perfectly.

## Future Enhancements

Potential improvements:
- Add actual app icons (192x192 and 512x512)
- Show cheapest fares before redirecting to Ryanair
- Add passenger count selector (adults, children, infants)
- Recent searches/favorite routes
- Price alerts and notifications
- Multi-city/stopover support
- Filter by airline, time, price range
- Dark mode support
- Internationalization (i18n)
- Analytics integration

## Known Issues

- Production build fails due to React 19 compatibility with some Radix UI components
- Dev server works fine
- ESLint configuration conflicts (disabled for now)
- No actual icon files included (need to generate)

## Browser Support

- Modern browsers with ES2020 support
- Geolocation API required for "nearby airports" feature
- Service Workers for PWA features
- Tested on mobile browsers (Safari iOS, Chrome Android)
