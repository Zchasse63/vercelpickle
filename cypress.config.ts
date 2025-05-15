import { defineConfig } from 'cypress'
import eyesPlugin from '@applitools/eyes-cypress'

export default eyesPlugin(defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000, // Increase default timeout to 10 seconds
    pageLoadTimeout: 30000, // Increase page load timeout to 30 seconds
    retries: {
      runMode: 2, // Retry failed tests twice in run mode
      openMode: 1, // Retry failed tests once in open mode
    },
    specPattern: [
      'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
      })
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
  env: {
    // Applitools configuration
    APPLITOOLS_API_KEY: 'I98tZjs0IhFP4EANPq99uT0bq0JANDL34j3nnLon105gWbk110',
    // Test configuration
    testMode: 'full', // 'full', 'basic', or 'minimal'
  },
}))
