export const POST_PER_PAGE = 5;
export const MAX_POST_PER_PAGE = 20;

// Absolute URL for server-side fetches to our own API routes.
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
