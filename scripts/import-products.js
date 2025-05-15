#!/usr/bin/env node

/**
 * Script to import products from the Pickleproducts.json file into the Convex database
 * 
 * Usage:
 * 1. Make sure Convex is running: npx convex dev
 * 2. Run this script: node scripts/import-products.js
 */

const { execSync } = require('child_process');

console.log('Starting product import process...');

// First, initialize the system to ensure we have an admin user and business profile
console.log('Initializing system (creating admin user and business profile if needed)...');
try {
  execSync('npx convex run setup:initializeSystem', { stdio: 'inherit' });
  console.log('System initialized successfully.');
} catch (error) {
  console.error('Error initializing system:', error.message);
  process.exit(1);
}

// Now, run the import products action
console.log('Importing products...');
try {
  execSync('npx convex run importProducts:importProducts', { stdio: 'inherit' });
  console.log('Products imported successfully.');
} catch (error) {
  console.error('Error importing products:', error.message);
  process.exit(1);
}

console.log('Product import process completed successfully!');
