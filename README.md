# QuizWiz

Single-tenant web app with a Vite React client.

## Prerequisites
- Node.js 18+ and npm
- A backend API endpoint (optional for now)

## Local Setup
1. Install dependencies:
   - Client:
     ```bash
     cd client
     npm install
     ```
2. Configure environment variables:
   - Copy `client/env.example` to `client/.env` and adjust values:
     ```bash
     cd client
     copy env.example .env  # Windows
     # or: cp env.example .env
     ```
3. Start the client:
   ```bash
   cd client
   npm run dev
   ```

## Environment Variables (Client)
- `VITE_API_BASE_URL`: Base URL for API (e.g., http://localhost:4000)
- `VITE_AUTH_ENABLED`: `true` to enable auth-related UI flows
- `VITE_ENV`: `development` | `staging` | `production`

## Deployment
You can deploy the client to Netlify or Vercel.

### Netlify
1. New site from Git
2. Build command: `npm run build`
3. Publish directory: `client/dist`
4. Base directory: `client`
5. Add environment variables in Netlify UI:
   - `VITE_API_BASE_URL`
   - `VITE_AUTH_ENABLED`
   - `VITE_ENV`

### Vercel
1. Import Git repository
2. Framework preset: `Vite`
3. Root directory: `client`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables in Vercel project settings

## Production Build Locally
```bash
cd client
npm run build
npm run preview
```

## Notes
- This is currently single-tenant. No tenant IDs are used.
- If you add a backend, ensure CORS is configured and set `VITE_API_BASE_URL` accordingly.
