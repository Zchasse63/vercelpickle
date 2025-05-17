#!/usr/bin/env node

/**
 * Dashboard Data Updater
 * 
 * This script generates the data for the refactoring dashboard.
 * It reads the REFACTORING_STATUS.md file and generates a JSON file for the dashboard.
 * 
 * Usage:
 *   node scripts/update-dashboard.js
 */

const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

// Configuration
const STATUS_FILE_PATH = path.join(process.cwd(), 'REFACTORING_STATUS.md');
const DASHBOARD_DATA_PATH = path.join(process.cwd(), 'dashboard/data.json');

// Read the status file
function readStatusFile() {
  try {
    return fs.readFileSync(STATUS_FILE_PATH, 'utf8');
  } catch (error) {
    console.error('Error reading status file:', error);
    process.exit(1);
  }
}

// Parse the markdown content
function parseMarkdown(markdown) {
  const lines = markdown.split('\n');
  const data = {
    sections: [],
    lastUpdated: format(new Date(), 'yyyy-MM-dd'),
    overallProgress: 0
  };

  let currentSection = null;
  let inProgressTable = false;
  let inSectionTable = false;

  for (const line of lines) {
    // Extract last updated date
    if (line.startsWith('Last updated:')) {
      data.lastUpdated = line.replace('Last updated:', '').trim();
    }

    // Extract overall progress
    if (line.includes('| **Overall** |')) {
      const match = line.match(/\| \*\*Overall\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \| \*\*[^0-9]*(\d+)%\*\* \|/);
      if (match) {
        const completed = parseInt(match[1]);
        const total = parseInt(match[2]);
        const percentage = parseInt(match[3]);
        data.overallProgress = percentage;
      }
    }

    // Extract section headers
    const sectionMatch = line.match(/^## ([^#]+)$/);
    if (sectionMatch && !line.includes('Progress Summary')) {
      const sectionName = sectionMatch[1].trim();
      currentSection = {
        name: sectionName,
        tasks: [],
        completed: 0,
        total: 0,
        percentage: 0,
        isFocus: false
      };
      data.sections.push(currentSection);
      inSectionTable = false;
      continue;
    }

    // Extract progress summary data
    if (inProgressTable && line.startsWith('|') && !line.includes('Section') && !line.includes('---') && !line.includes('Overall')) {
      const columns = line.split('|').map(col => col.trim()).filter(col => col);
      if (columns.length >= 4) {
        const sectionName = columns[0];
        const completed = parseInt(columns[1]);
        const total = parseInt(columns[2]);
        const progressText = columns[3];
        const percentage = parseInt(progressText.match(/(\d+)%/)?.[1] || '0');
        
        // Find the corresponding section and update its progress
        const section = data.sections.find(s => s.name === sectionName);
        if (section) {
          section.completed = completed;
          section.total = total;
          section.percentage = percentage;
          
          // Mark Admin Dashboard as current focus
          if (sectionName === 'Admin Dashboard') {
            section.isFocus = true;
          }
        }
      }
    }

    // Check if we're in the progress summary table
    if (line.includes('| Section | Completed | Total | Progress |')) {
      inProgressTable = true;
      continue;
    }

    // Check if we're in a section task table
    if (line.includes('| Task | Status |') && currentSection) {
      inSectionTable = true;
      continue;
    }

    // Skip table separator lines
    if (line.includes('|------|--------|') && inSectionTable) {
      continue;
    }

    // Extract task data
    if (inSectionTable && line.startsWith('|') && currentSection) {
      const columns = line.split('|').map(col => col.trim()).filter(col => col);
      if (columns.length >= 4) {
        const task = {
          name: columns[0],
          status: columns[1].includes('✅') ? 'completed' : 'pending',
          date: columns[2],
          commitId: columns[3]?.replace(/`/g, '') || ''
        };
        currentSection.tasks.push(task);
      }
    }
  }

  return data;
}

// Save the dashboard data
function saveDashboardData(data) {
  try {
    // Create the dashboard directory if it doesn't exist
    const dashboardDir = path.dirname(DASHBOARD_DATA_PATH);
    if (!fs.existsSync(dashboardDir)) {
      fs.mkdirSync(dashboardDir, { recursive: true });
    }
    
    fs.writeFileSync(DASHBOARD_DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log('Dashboard data updated successfully');
  } catch (error) {
    console.error('Error saving dashboard data:', error);
    process.exit(1);
  }
}

// Main function
function main() {
  const content = readStatusFile();
  const data = parseMarkdown(content);
  saveDashboardData(data);
}

// Run the script
main();
