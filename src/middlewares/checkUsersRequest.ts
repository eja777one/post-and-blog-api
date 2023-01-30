import rateLimit from 'express-rate-limit';

export const checkUsersRequest = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 6, // Limit each IP to 6 requests per `window` (here, per 10 sec)
  standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})