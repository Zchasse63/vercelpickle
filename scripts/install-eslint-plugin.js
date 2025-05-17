#!/usr/bin/env node

/**
 * Script to install the local ESLint plugin
 * 
 * This script creates a symlink to the local ESLint plugin in node_modules
 * so that ESLint can find it without having to publish it to npm.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the project root directory
const projectRoot = path.resolve(__dirname, '..');

// Get the plugin directory
const pluginDir = path.join(projectRoot, 'eslint-plugin-pickle');

// Get the node_modules directory
const nodeModulesDir = path.join(projectRoot, 'node_modules');

// Get the target directory
const targetDir = path.join(nodeModulesDir, 'eslint-plugin-pickle');

// Check if the plugin directory exists
if (!fs.existsSync(pluginDir)) {
  console.error(`Plugin directory not found: ${pluginDir}`);
  process.exit(1);
}

// Check if the node_modules directory exists
if (!fs.existsSync(nodeModulesDir)) {
  console.error(`node_modules directory not found: ${nodeModulesDir}`);
  process.exit(1);
}

// Check if the target directory already exists
if (fs.existsSync(targetDir)) {
  console.log(`Target directory already exists: ${targetDir}`);
  console.log('Removing existing directory...');
  
  try {
    // Remove the existing directory
    if (process.platform === 'win32') {
      // On Windows, use rmdir /s /q
      execSync(`rmdir /s /q "${targetDir}"`);
    } else {
      // On Unix-like systems, use rm -rf
      execSync(`rm -rf "${targetDir}"`);
    }
    
    console.log('Existing directory removed.');
  } catch (error) {
    console.error(`Failed to remove existing directory: ${error.message}`);
    process.exit(1);
  }
}

// Create the symlink
try {
  console.log(`Creating symlink from ${pluginDir} to ${targetDir}...`);
  
  if (process.platform === 'win32') {
    // On Windows, use mklink /j
    execSync(`mklink /j "${targetDir}" "${pluginDir}"`);
  } else {
    // On Unix-like systems, use ln -s
    execSync(`ln -s "${pluginDir}" "${targetDir}"`);
  }
  
  console.log('Symlink created successfully.');
} catch (error) {
  console.error(`Failed to create symlink: ${error.message}`);
  
  // Try to copy the directory instead
  console.log('Trying to copy the directory instead...');
  
  try {
    if (process.platform === 'win32') {
      // On Windows, use xcopy /e /i /h
      execSync(`xcopy "${pluginDir}" "${targetDir}" /e /i /h`);
    } else {
      // On Unix-like systems, use cp -r
      execSync(`cp -r "${pluginDir}" "${targetDir}"`);
    }
    
    console.log('Directory copied successfully.');
  } catch (copyError) {
    console.error(`Failed to copy directory: ${copyError.message}`);
    process.exit(1);
  }
}

console.log('ESLint plugin installed successfully.');
