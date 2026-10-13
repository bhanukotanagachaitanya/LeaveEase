/**
 * Enterprise Security Middleware for LeaveEase
 * - Security HTTP Headers
 * - NoSQL Operator Injection Sanitization
 * - In-Memory Brute-Force Rate Limiting
 */

// In-Memory Rate Limiter Store
const rateLimitStore = new Map();

// Periodic cleanup of expired rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Configurable Sliding-Window Rate Limiter
 * @param {number} maxRequests Max requests in the window
 * @param {number} windowMs Window duration in milliseconds
 * @param {string} message Custom error message
 */
const createRateLimiter = (maxRequests = 100, windowMs = 60 * 1000, message = 'Too many requests. Please try again later.') => {
  return (req, res, next) => {
    // Identify client by IP or forwarded IP
    const clientIp = (
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      '127.0.0.1'
    ).toString().split(',')[0].trim();

    const key = `${req.baseUrl || req.path}:${clientIp}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds
      });
    }

    record.count += 1;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    next();
  };
};

/**
 * Strict HTTP Security Headers
 */
const securityHeaders = (req, res, next) => {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent clickjacking via iframes
  res.setHeader('X-Frame-Options', 'DENY');
  // Cross-Site Scripting (XSS) filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Strict Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Disable dangerous browser permissions
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  // HSTS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
};

/**
 * Recursive sanitizer to strip MongoDB query operators ($gt, $ne, $where, etc.)
 */
const sanitizeNoSql = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeNoSql);
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Strip keys starting with $ or containing a period
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    clean[key] = typeof value === 'object' ? sanitizeNoSql(value) : value;
  }
  return clean;
};

/**
 * NoSQL Injection Protection Middleware
 */
const noSqlSanitizer = (req, res, next) => {
  if (req.body) req.body = sanitizeNoSql(req.body);
  if (req.params) req.params = sanitizeNoSql(req.params);
  // Sanitize query without mutating req.query reference
  if (req.query) {
    const cleanQuery = sanitizeNoSql(req.query);
    for (const key of Object.keys(req.query)) {
      if (!cleanQuery.hasOwnProperty(key)) {
        delete req.query[key];
      }
    }
  }
  next();
};

// Specialized Rate Limiters
const authLimiter = createRateLimiter(15, 5 * 60 * 1000, 'Too many login attempts. Please wait 5 minutes before trying again.');
const apiLimiter = createRateLimiter(250, 60 * 1000, 'API rate limit exceeded. Please slow down requests.');

module.exports = {
  securityHeaders,
  noSqlSanitizer,
  authLimiter,
  apiLimiter
};
