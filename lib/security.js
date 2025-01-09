// security.js

// Middleware for enhanced security
import { NextResponse } from 'next/server';

// Utility: Sanitize input to prevent XSS attacks
function sanitizeInput(input) {
    return input.replace(/<[^>]*>?/gm, ''); // Strip HTML tags
}



// Middleware: Rate limiting to prevent brute force
let requestCounter = {};
const MAX_REQUESTS = 100;
const TIME_WINDOW = 15 * 60 * 1000; // 15 minutes

export function rateLimiter(req) {
    const ip = req.headers.get('x-forwarded-for') || req.ip;
    const currentTime = Date.now();

    if (!requestCounter[ip]) {
        requestCounter[ip] = { count: 1, startTime: currentTime };
    } else {
        const elapsedTime = currentTime - requestCounter[ip].startTime;

        if (elapsedTime < TIME_WINDOW) {
            requestCounter[ip].count++;
            if (requestCounter[ip].count > MAX_REQUESTS) {
                return new NextResponse('Too Many Requests', { status: 429 });
            }
        } else {
            // Reset the counter
            requestCounter[ip] = { count: 1, startTime: currentTime };
        }
    }

    return NextResponse.next();
}



// Apply middlewares in your app
export default function middleware(req, res) {
    const response = rateLimiter(req);
    if (response.status !== 200) return response;

    cspMiddleware(req, res);
    return validateTokens(req);
}

// Usage: Integrate the middleware in your next.config.js or API routes
