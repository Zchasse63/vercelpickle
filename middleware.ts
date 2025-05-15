import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs before any route is processed
export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;

  // Create a response object from the incoming request
  const response = NextResponse.next();

  // Set the Content-Type header for all routes
  // This ensures Cypress can properly visit the pages
  response.headers.set('Content-Type', 'text/html; charset=utf-8');

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all dashboard routes and their sub-routes
    '/buyer/:path*',
    '/seller/:path*',
    '/admin/:path*',
    // Match the root dashboard routes
    '/buyer',
    '/seller',
    '/admin',
  ],
};
