#!/usr/bin/env node

/**
 * Refactoring Status Updater
 * 
 * This script automatically updates the REFACTORING_STATUS.md file based on commit messages.
 * It should be run as a pre-commit hook or manually after completing a task.
 * 
 * Usage:
 *   node scripts/update-refactoring-status.js
 * 
 * Commit Message Format:
 *   [Complete] <section>: <task description>
 * 
 * Example:
 *   [Complete] Marketplace: Implement lazy loading for product grid
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { format } = require('date-fns');

// Configuration
const STATUS_FILE_PATH = path.join(process.cwd(), 'REFACTORING_STATUS.md');
const SECTIONS = [
  'Checkout',
  'Buyer Dashboard',
  'Seller Dashboard',
  'Admin Dashboard',
  'Marketplace',
  'Home Page',
  'Type Definitions',
  'Data Access Layer'
];

// Read the current status file
function readStatusFile() {
  try {
    return fs.readFileSync(STATUS_FILE_PATH, 'utf8');
  } catch (error) {
    console.error('Error reading status file:', error);
    process.exit(1);
  }
}

// Parse the status file into sections
function parseStatusFile(content) {
  const sections = {};
  
  let currentSection = null;
  let inTable = false;
  let tableRows = [];
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Check for section headers
    const sectionMatch = line.match(/^## (.+)$/);
    if (sectionMatch && SECTIONS.includes(sectionMatch[1])) {
      if (currentSection && tableRows.length > 0) {
        sections[currentSection] = tableRows;
      }
      currentSection = sectionMatch[1];
      tableRows = [];
      inTable = false;
      continue;
    }
    
    // Check for table headers
    if (line.includes('| Task | Status |') && currentSection) {
      inTable = true;
      continue;
    }
    
    // Skip table separator line
    if (line.includes('|------|--------|') && inTable) {
      continue;
    }
    
    // Parse table rows
    if (inTable && line.startsWith('|') && currentSection) {
      const columns = line.split('|').map(col => col.trim()).filter(col => col);
      if (columns.length >= 2) {
        tableRows.push({
          task: columns[0],
          status: columns[1],
          date: columns[2] || '',
          commitId: columns[3] || ''
        });
      }
    }
  }
  
  // Add the last section
  if (currentSection && tableRows.length > 0) {
    sections[currentSection] = tableRows;
  }
  
  return sections;
}

// Update a task's status
function updateTaskStatus(sections, section, task, commitId) {
  if (!sections[section]) {
    console.error(`Section "${section}" not found in status file`);
    return false;
  }
  
  let updated = false;
  
  for (const row of sections[section]) {
    if (row.task.toLowerCase() === task.toLowerCase()) {
      row.status = '✅ Completed';
      row.date = format(new Date(), 'yyyy-MM-dd');
      row.commitId = commitId;
      updated = true;
      break;
    }
  }
  
  if (!updated) {
    console.warn(`Task "${task}" not found in section "${section}"`);
  }
  
  return updated;
}

// Generate the updated status file content
function generateStatusFileContent(sections) {
  let content = '# Pickle B2B Marketplace Refactoring Status\n\n';
  content += 'This document tracks the status of all refactoring tasks for the Pickle B2B Marketplace project.\n\n';
  
  // Calculate progress summary
  content += '## Progress Summary\n\n';
  content += '| Section | Completed | Total | Progress |\n';
  content += '|---------|-----------|-------|----------|\n';
  
  let totalCompleted = 0;
  let totalTasks = 0;
  
  for (const section of SECTIONS) {
    if (!sections[section]) continue;
    
    const sectionTasks = sections[section].length;
    const completedTasks = sections[section].filter(row => row.status.includes('✅')).length;
    
    totalTasks += sectionTasks;
    totalCompleted += completedTasks;
    
    const progressPercent = Math.round((completedTasks / sectionTasks) * 100);
    let progressIcon = '⬜ ';
    if (progressPercent === 100) progressIcon = '✅ ';
    else if (progressPercent > 0) progressIcon = '⏳ ';
    
    content += `| ${section} | ${completedTasks} | ${sectionTasks} | ${progressIcon}${progressPercent}% |\n`;
  }
  
  const overallProgress = Math.round((totalCompleted / totalTasks) * 100);
  let overallIcon = '⬜ ';
  if (overallProgress === 100) overallIcon = '✅ ';
  else if (overallProgress > 0) overallIcon = '⏳ ';
  
  content += `| **Overall** | **${totalCompleted}** | **${totalTasks}** | **${overallIcon}${overallProgress}%** |\n\n`;
  
  // Add each section
  for (const section of SECTIONS) {
    if (!sections[section]) continue;
    
    content += `## ${section}\n\n`;
    content += '| Task | Status | Completed Date | Commit ID |\n';
    content += '|------|--------|----------------|----------|\n';
    
    for (const row of sections[section]) {
      content += `| ${row.task} | ${row.status} | ${row.date} | \`${row.commitId}\` |\n`;
    }
    
    content += '\n';
  }
  
  content += '---\n\n';
  content += `Last updated: ${format(new Date(), 'yyyy-MM-dd')}\n`;
  
  return content;
}

// Save the updated status file
function saveStatusFile(content) {
  try {
    fs.writeFileSync(STATUS_FILE_PATH, content, 'utf8');
    console.log('Status file updated successfully');
  } catch (error) {
    console.error('Error saving status file:', error);
    process.exit(1);
  }
}

// Get the latest commit message and ID
function getLatestCommit() {
  try {
    const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
    const commitId = execSync('git log -1 --pretty=%h').toString().trim();
    return { message: commitMessage, id: commitId };
  } catch (error) {
    console.error('Error getting latest commit:', error);
    return { message: '', id: '' };
  }
}

// Parse the commit message to extract task information
function parseCommitMessage(message) {
  const regex = /\[Complete\]\s+([^:]+):\s+(.+)/i;
  const match = message.match(regex);
  
  if (!match) {
    return null;
  }
  
  const section = match[1].trim();
  const task = match[2].trim();
  
  // Map the section to one of our known sections
  const mappedSection = SECTIONS.find(s => 
    s.toLowerCase() === section.toLowerCase() || 
    section.toLowerCase().includes(s.toLowerCase())
  );
  
  if (!mappedSection) {
    console.warn(`Unknown section "${section}" in commit message`);
    return null;
  }
  
  return {
    section: mappedSection,
    task
  };
}

// Main function
function main() {
  // Get the latest commit
  const { message, id } = getLatestCommit();
  
  // Check if this is a completion commit
  const taskInfo = parseCommitMessage(message);
  if (!taskInfo) {
    console.log('No task completion found in the latest commit');
    return;
  }
  
  console.log(`Found task completion: ${taskInfo.section} - ${taskInfo.task}`);
  
  // Read and parse the status file
  const content = readStatusFile();
  const sections = parseStatusFile(content);
  
  // Update the task status
  const updated = updateTaskStatus(sections, taskInfo.section, taskInfo.task, id);
  
  if (updated) {
    // Generate and save the updated content
    const updatedContent = generateStatusFileContent(sections);
    saveStatusFile(updatedContent);
    console.log('Task status updated successfully');
  } else {
    console.log('No changes made to the status file');
  }
}

// Run the script
main();
