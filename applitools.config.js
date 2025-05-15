module.exports = {
  // Your Applitools API key
  apiKey: process.env.APPLITOOLS_API_KEY || 'I98tZjs0IhFP4EANPq99uT0bq0JANDL34j3nnLon105gWbk110',

  // The name of the application under test
  appName: 'Pickle B2B Marketplace',

  // The name of the test for the batch
  batchName: 'Pickle Visual Tests',

  // The browser configurations to test
  browser: [
    // Start with just Chrome for simplicity
    {width: 1280, height: 720, name: 'chrome'},
  ],

  // Concurrency level for visual tests
  testConcurrency: 1,

  // Batch will complete automatically when tests are done
  dontCloseBatches: false,

  // Match level for the visual comparisons
  matchLevel: 'Strict',

  // Enable visual grid runner
  enableVisualGridRunner: true,

  // Fail tests if visual differences are found
  failCypressOnDiff: true,

  // Automatically save differences as baselines
  // Set to false for CI environments
  saveNewTests: true,

  // Automatically save failed tests as baselines
  // Set to false for CI environments
  saveFailedTests: false,

  // Disable batching if needed
  disableBatching: false,

  // Ignore regions by CSS selector
  // ignoreRegions: [
  //   {selector: '.dynamic-content'},
  //   {selector: '.timestamp'},
  // ],

  // Threshold for pixel differences
  // matchTimeout: 5000,

  // Viewport size for responsive testing
  // viewportSize: {width: 1280, height: 720},

  // Wait before capturing screenshots
  // waitBeforeScreenshot: 1000,

  // Stitch mode for full page screenshots
  // stitchMode: 'CSS',

  // Logging level
  logLevel: 'info',
};
