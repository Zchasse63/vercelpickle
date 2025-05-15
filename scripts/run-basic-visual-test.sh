#!/bin/bash

# Script to run basic visual test with Applitools Eyes

# Set Applitools API key if not already set
if [ -z "$APPLITOOLS_API_KEY" ]; then
  export APPLITOOLS_API_KEY="I98tZjs0IhFP4EANPq99uT0bq0JANDL34j3nnLon105gWbk110"
  echo "Using default Applitools API key. Set APPLITOOLS_API_KEY environment variable to override."
else
  echo "Using Applitools API key from environment variable."
fi

# Start the development server in the background
echo "Starting development server..."
npm run dev:full &
DEV_SERVER_PID=$!

# Wait for the server to start
echo "Waiting for server to start..."
sleep 15

# Run the basic visual test
echo "Running basic visual test..."
npx cypress run --spec "cypress/e2e/applitools-basic.cy.ts"

# Capture the exit code
EXIT_CODE=$?

# Kill the development server
echo "Stopping development server..."
kill $DEV_SERVER_PID

# Exit with the same code as the tests
exit $EXIT_CODE
