// Debug script to check Next.js routes
const fs = require('fs');
const path = require('path');

// Function to recursively scan the app directory
function scanAppDirectory(dir, baseDir) {
  const results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Check if this is a route directory (contains page.tsx or page.js)
      const hasPage = fs.existsSync(path.join(filePath, 'page.tsx')) ||
                     fs.existsSync(path.join(filePath, 'page.js'));

      if (hasPage) {
        // Convert file path to route
        const relativePath = path.relative(baseDir, filePath);
        const route = '/' + relativePath.replace(/\\/g, '/');
        results.push(route);
      }

      // Recursively scan subdirectories
      results.push(...scanAppDirectory(filePath, baseDir));
    }
  }

  return results;
}

// Scan the app directory
const appDir = path.join(__dirname, '../app');
const routes = scanAppDirectory(appDir, appDir);

// Print the routes
console.log('Available Next.js Routes:');
routes.sort().forEach(route => {
  console.log(route);
});

// Check for specific routes
const requiredRoutes = [
  '/buyer',
  '/buyer/settings',
  '/buyer/shipping',
  '/buyer/payment-methods'
];

console.log('\nChecking required routes:');
requiredRoutes.forEach(route => {
  const exists = routes.includes(route);
  console.log(`${route}: ${exists ? 'EXISTS' : 'MISSING'}`);
});
