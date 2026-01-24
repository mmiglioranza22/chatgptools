import { doubleCsrf } from "csrf-csrf";

export const csrf = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET!,
  cookieName: "csrf",
  cookieOptions: {
    httpOnly: false,
    secure: true,
    sameSite: "strict",
    path: "/",
  },

  size: 32, // 256-bit random value
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],

  ignoredMethods: ["GET", "HEAD", "OPTIONS"],

  // Timestamped rotation
  expiresIn: 60 * 15, // 15 minutes
});
