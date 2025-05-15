#!/bin/bash

# Script to run tests for the Pickle B2B Marketplace

# Set error handling
set -e

# Function to display help
show_help() {
  echo "Usage: ./run-tests.sh [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  --unit          Run unit tests only (Jest)"
  echo "  --convex        Run Convex backend tests only"
  echo "  --e2e           Run end-to-end tests only"
  echo "  --guest         Run guest user tests only"
  echo "  --buyer         Run buyer tests only"
  echo "  --seller        Run seller tests only"
  echo "  --admin         Run admin tests only"
  echo "  --all           Run all tests (default)"
  echo "  --help          Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./run-tests.sh --unit"
  echo "  ./run-tests.sh --convex"
  echo "  ./run-tests.sh --e2e --guest"
  echo "  ./run-tests.sh --all"
}

# Default values
RUN_UNIT=false
RUN_CONVEX=false
RUN_E2E=false
RUN_GUEST=false
RUN_BUYER=false
RUN_SELLER=false
RUN_ADMIN=false
RUN_ALL=true

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --unit)
      RUN_UNIT=true
      RUN_ALL=false
      shift
      ;;
    --convex)
      RUN_CONVEX=true
      RUN_ALL=false
      shift
      ;;
    --e2e)
      RUN_E2E=true
      RUN_ALL=false
      shift
      ;;
    --guest)
      RUN_GUEST=true
      RUN_E2E=true
      RUN_ALL=false
      shift
      ;;
    --buyer)
      RUN_BUYER=true
      RUN_E2E=true
      RUN_ALL=false
      shift
      ;;
    --seller)
      RUN_SELLER=true
      RUN_E2E=true
      RUN_ALL=false
      shift
      ;;
    --admin)
      RUN_ADMIN=true
      RUN_E2E=true
      RUN_ALL=false
      shift
      ;;
    --all)
      RUN_ALL=true
      shift
      ;;
    --help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

# If --all is specified, run everything
if [ "$RUN_ALL" = true ]; then
  RUN_UNIT=true
  RUN_CONVEX=true
  RUN_E2E=true
  RUN_GUEST=true
  RUN_BUYER=true
  RUN_SELLER=true
  RUN_ADMIN=true
fi

# Run unit tests if specified
if [ "$RUN_UNIT" = true ]; then
  echo "Running unit tests..."
  npm test
fi

# Run Convex tests if specified
if [ "$RUN_CONVEX" = true ]; then
  echo "Running Convex backend tests..."
  npm run test:convex:run
fi

# Run E2E tests if specified
if [ "$RUN_E2E" = true ]; then
  # Start the development server in the background
  echo "Starting development server..."
  npm run dev:full &
  DEV_SERVER_PID=$!

  # Wait for the server to start
  echo "Waiting for server to start..."
  sleep 10

  # Run the appropriate Cypress tests
  if [ "$RUN_GUEST" = true ]; then
    echo "Running guest user tests..."
    npx cypress run --spec "cypress/e2e/guest-user.cy.js"
  fi

  if [ "$RUN_BUYER" = true ]; then
    echo "Running buyer tests..."
    npx cypress run --spec "cypress/e2e/buyer-user.cy.js"
  fi

  if [ "$RUN_SELLER" = true ]; then
    echo "Running seller tests..."
    npx cypress run --spec "cypress/e2e/seller-user.cy.js"
  fi

  if [ "$RUN_ADMIN" = true ]; then
    echo "Running admin tests..."
    npx cypress run --spec "cypress/e2e/admin-user.cy.js"
  fi

  # Kill the development server
  echo "Stopping development server..."
  kill $DEV_SERVER_PID
fi

echo "All tests completed!"
