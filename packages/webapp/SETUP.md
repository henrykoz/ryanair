# Setup Guide

## Quick Start

### 1. Install Dependencies

From the repository root:

```bash
npm install
```

This will install dependencies for all workspace packages including the webapp.

### 2. Build the Client Package

The webapp depends on `@2bad/ryanair`, so build it first:

```bash
npm run build -w @2bad/ryanair
```

### 3. Start the Development Server

```bash
npm run dev -w @2bad/ryanair-webapp
```

The app will be available at:
- Local: http://localhost:3000
- Network: http://your-ip:3000 (for testing on mobile devices)

### 4. Open in Browser

Navigate to http://localhost:3000 and you should see the Ryanair Flight Search interface.

## Testing on Mobile

To test on your phone/tablet while on the same network:

1. Start the dev server (step 3 above)
2. Note the "Network" URL shown in the terminal (e.g., http://192.168.0.13:3000)
3. On your mobile device, open that URL in a browser
4. Test touch interactions and responsive design

## Using the App

1. **Select Trip Type**: Choose "Return" or "One Way"
2. **Select Departure Airport**:
   - Click "From" dropdown
   - Search by city, airport name, or IATA code
   - Or click "Use my location" to find nearby airports
3. **Select Destination Airport**: Same process as departure
4. **Choose Dates**:
   - Select departure date
   - Select return date (if return trip)
5. **Click "Search on Ryanair"**: Opens Ryanair's website with your search pre-filled

## Project Commands

All commands should be run from the repository root:

```bash
# Development
npm run dev -w @2bad/ryanair-webapp

# Build for production (currently has issues)
npm run build -w @2bad/ryanair-webapp

# Start production server
npm start -w @2bad/ryanair-webapp
```

## Development Workflow

### Making Changes

1. Edit files in `packages/webapp/`
2. Changes are hot-reloaded automatically
3. Check the terminal for any errors

### Adding New Components

1. Use shadcn/ui CLI (if configured):
   ```bash
   npx shadcn@latest add [component-name]
   ```

2. Or manually create in `components/ui/`

### Modifying API Routes

API routes are in `app/api/`:
- Edit route handlers to change behavior
- Add new routes by creating new directories with `route.ts`

### Styling

- Global styles: `app/globals.css`
- Component styles: Use Tailwind classes
- Theme colors: Edit CSS variables in `globals.css`

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev -w @2bad/ryanair-webapp
```

### Module Not Found: @2bad/ryanair

Build the client package first:

```bash
npm run build -w @2bad/ryanair
```

### Geolocation Not Working

Geolocation requires:
- HTTPS in production (or localhost in development)
- User permission to access location
- Modern browser support

### Build Failures

Currently, production builds have React 19 compatibility issues. Use the dev server instead:

```bash
npm run dev -w @2bad/ryanair-webapp
```

## File Structure

```
packages/webapp/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page (search interface)
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   └── *.tsx          # Custom components
├── lib/               # Utility functions
├── public/            # Static files
├── next.config.ts     # Next.js configuration
├── tailwind.config.ts # Tailwind configuration
└── tsconfig.json      # TypeScript configuration
```

## Environment Variables

Currently, no environment variables are required. The app uses the Ryanair API client directly.

If you need to add environment variables:

1. Create `.env.local` in `packages/webapp/`
2. Add variables (e.g., `NEXT_PUBLIC_API_URL=...`)
3. Access in code: `process.env.NEXT_PUBLIC_API_URL`

## Next Steps

- Test the app on mobile devices
- Customize the design/colors
- Add additional features (see FEATURES.md)
- Deploy to Vercel or another hosting platform

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Set root directory to `packages/webapp`
4. Deploy

Note: Fix React 19 compatibility issues before deploying to production.

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Cloudflare Pages
- AWS Amplify
- Self-hosted with Node.js

## Support

For issues with:
- **Ryanair API**: See `packages/client/`
- **Next.js**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com
- **This webapp**: Open an issue in the repository
