/**
 * Database & Auth Configuration
 * Central config for the REST API module
 */

export const config = {
  database: {
    url: process.env.DATABASE_URL || "mongodb://127.0.0.1/katalis-dev-5",
  },
  auth: {
    secret:
      process.env.BETTER_AUTH_SECRET ||
      process.env.PAYLOAD_SECRET ||
      "change-me-in-production",
    baseURL:
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  upload: {
    dir: "public/uploads",
    urlPrefix: "/uploads",
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
    ],
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
} as const;
