# AI Chat — Frontend

Next.js (App Router) frontend for the AI Chat app. It provides Google login, a
real-time chat room, AI reply suggestions, and a Razorpay premium upgrade.

The backend (Node.js + Express + Socket.IO) lives in a **separate repository**.
This app talks to it over HTTP (axios) and WebSocket (socket.io-client).

## Tech stack

- Next.js (App Router) + React
- Tailwind CSS
- socket.io-client (real-time)
- axios (HTTP)
- @react-oauth/google (Google login)

## Features

- Google OAuth login — the token is verified by the backend
- Real-time single-room chat
- "Suggest reply" powered by Gemini (premium feature)
- Razorpay checkout to unlock premium
- Premium unlocks instantly over WebSocket after a successful payment

## Pages

| Route | Description |
|-------|-------------|
| `/` | Login (redirects to the dashboard once signed in) |
| `/dashboard` | Plan status and the "Create order" upgrade |
| `/chat` | Real-time chat room |
| `/profile` | Profile details and sign out |

`/dashboard`, `/chat` and `/profile` share a layout (sidebar + top bar) that
guards the routes and owns the socket connection.

## Project structure

```
app/
  page.tsx             login
  layout.tsx           root layout
  (app)/               authenticated shell (sidebar + top bar)
    layout.tsx
    dashboard/page.tsx
    chat/page.tsx
    profile/page.tsx
  components/
    ChatRoom.tsx
    AppContext.tsx     shares the user + premium status
lib/
  axios.ts             axios instance (adds the auth header)
  socket.ts            socket.io client
  razorpay.ts          loads the Razorpay checkout script
  auth.ts              user type + localStorage helpers
```

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env.local` file:

   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   ```

   These must line up with the backend: the Google client ID is the same one
   the backend verifies against, and the Razorpay key id pairs with the
   backend's secret.

3. Run:

   ```
   npm run dev
   ```

   The app runs on `http://localhost:3000`. The backend must be running too.

> Add `http://localhost:3000` to the **Authorized JavaScript origins** of your
> Google OAuth client, otherwise login is blocked.

## Deployment (Vercel)

- Import the repo into Vercel.
- Add the three `NEXT_PUBLIC_*` environment variables.
- After deploying, add the Vercel URL to the Google OAuth client's authorized
  origins, and point `NEXT_PUBLIC_BACKEND_URL` at the deployed backend.
