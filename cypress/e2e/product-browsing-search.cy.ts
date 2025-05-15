// Product Browsing and Search Tests
/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

/**
 * This test file implements comprehensive testing for product browsing and search functionality
 * including filtering, sorting, pagination, and search capabilities.
 * 
 * It uses a combination of functional and visual testing to ensure both
 * functionality and appearance are correct.
 */

describe('Product Browsing - Marketplace', () => {
  beforeEach(() => {
    // Set up test environment with appropriate mocks
    cy.setupTestEnvironment({
      mockProducts: true,
      mockCategories: true
    });

    // Visit marketplace with retry for resilience
    cy.visitWithRetry('/marketplace', { failOnStatusCode: false });
  });

  it('should display product grid with filters and sorting options', () => {
    // Verify marketplace page elements
    cy.getByTestId('product-grid').should('be.visible');
    cy.getByTestId('filter-sidebar').should('be.visible');
    cy.getByTestId('sort-dropdown').should('be.visible');
    cy.getByTestId('product-card').should('have.length.at.least', 1);
    
    // Take visual snapshot of marketplace
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Product Browsing - Marketplace',
    });
    
    cy.eyesCheckWindow({
      tag: 'Marketplace Grid',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should filter products by category', () => {
    // Get initial product count
    cy.getByTestId('product-card').its('length').as('initialCount');
    
    // Open category filter
    cy.getByTestId('category-filter').click();
    
    // Select a category
    cy.getByTestId('category-option').first().click();
    
    // Apply filter
    cy.getByTestId('apply-filters-button').click();
    
    // Verify filtered results
    cy.get('@initialCount').then(initialCount => {
      cy.getByTestId('product-card').its('length').should('be.lte', Number(initialCount));
    });
    
    // Verify active filter indicator
    cy.getByTestId('active-filters').should('be.visible');
    
    // Take visual snapshot of filtered results
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Category Filtered Products',
    });
    
    cy.eyesCheckWindow({
      tag: 'Category Filtered Results',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should filter products by price range', () => {
    // Open price filter
    cy.getByTestId('price-filter').click();
    
    // Set price range
    cy.getByTestId('min-price-input').clear().type('10');
    cy.getByTestId('max-price-input').clear().type('50');
    
    // Apply filter
    cy.getByTestId('apply-filters-button').click();
    
    // Verify active filter indicator
    cy.getByTestId('active-filters').should('contain', 'Price');
    
    // Verify product prices are within range
    cy.getByTestId('product-card').each($product => {
      cy.wrap($product).within(() => {
        cy.getByTestId('product-price').invoke('text').then(priceText => {
          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          expect(price).to.be.at.least(10);
          expect(price).to.be.at.most(50);
        });
      });
    });
  });

  it('should sort products by price', () => {
    // Open sort dropdown
    cy.getByTestId('sort-dropdown').click();
    
    // Select "Price: Low to High"
    cy.contains('Price: Low to High').click();
    
    // Verify products are sorted by price
    let previousPrice = 0;
    cy.getByTestId('product-card').each($product => {
      cy.wrap($product).within(() => {
        cy.getByTestId('product-price').invoke('text').then(priceText => {
          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          expect(price).to.be.at.least(previousPrice);
          previousPrice = price;
        });
      });
    });
    
    // Take visual snapshot of sorted products
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Price Sorted Products',
    });
    
    cy.eyesCheckWindow({
      tag: 'Price Sorted Results',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should paginate through product results', () => {
    // Verify pagination controls
    cy.getByTestId('pagination').should('be.visible');
    
    // Get products on first page
    cy.getByTestId('product-card').first().within(() => {
      cy.getByTestId('product-name').invoke('text').as('firstPageProduct');
    });
    
    // Go to next page
    cy.getByTestId('next-page-button').click();
    
    // Verify URL includes page parameter
    cy.url().should('include', 'page=2');
    
    // Verify products are different on second page
    cy.get('@firstPageProduct').then(firstPageProduct => {
      cy.getByTestId('product-card').first().within(() => {
        cy.getByTestId('product-name').invoke('text').should('not.equal', firstPageProduct);
      });
    });
    
    // Take visual snapshot of second page
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Product Pagination',
    });
    
    cy.eyesCheckWindow({
      tag: 'Second Page Results',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should combine multiple filters', () => {
    // Apply category filter
    cy.getByTestId('category-filter').click();
    cy.getByTestId('category-option').first().click();
    
    // Apply price filter
    cy.getByTestId('price-filter').click();
    cy.getByTestId('min-price-input').clear().type('10');
    cy.getByTestId('max-price-input').clear().type('50');
    
    // Apply filters
    cy.getByTestId('apply-filters-button').click();
    
    // Verify active filter indicators
    cy.getByTestId('active-filters').should('be.visible');
    
    // Take visual snapshot of multi-filtered results
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Multi-Filtered Products',
    });
    
    cy.eyesCheckWindow({
      tag: 'Multi-Filtered Results',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should clear all filters', () => {
    // Get initial product count
    cy.getByTestId('product-card').its('length').as('initialCount');
    
    // Apply some filters
    cy.getByTestId('category-filter').click();
    cy.getByTestId('category-option').first().click();
    cy.getByTestId('apply-filters-button').click();
    
    // Verify filters applied
    cy.getByTestId('active-filters').should('be.visible');
    
    // Clear all filters
    cy.getByTestId('clear-filters-button').click();
    
    // Verify filters cleared
    cy.getByTestId('active-filters').should('not.exist');
    
    // Verify product count is back to initial
    cy.get('@initialCount').then(initialCount => {
      cy.getByTestId('product-card').should('have.length', Number(initialCount));
    });
  });
});

describe('Product Search Functionality', () => {
  beforeEach(() => {
    // Set up test environment with appropriate mocks
    cy.setupTestEnvironment({
      mockProducts: true,
      mockSearch: true
    });

    // Visit marketplace with retry for resilience
    cy.visitWithRetry('/marketplace', { failOnStatusCode: false });
  });

  it('should search for products by keyword', () => {
    // Enter search term
    cy.getByTestId('search-input').type('organic{enter}');
    
    // Verify search results page
    cy.url().should('include', 'search=organic');
    cy.getByTestId('search-results-heading').should('contain', 'organic');
    cy.getByTestId('product-card').should('have.length.at.least', 1);
    
    // Take visual snapshot of search results
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Product Search Results',
    });
    
    cy.eyesCheckWindow({
      tag: 'Keyword Search Results',
      fully: true
    });
    
    cy.eyesClose();
    
    // Verify search term highlighted in results
    cy.getByTestId('product-card').each($product => {
      cy.wrap($product).within(() => {
        cy.get('body').then($body => {
          const productText = $body.text().toLowerCase();
          expect(productText).to.include('organic');
        });
      });
    });
  });

  it('should handle search with no results', () => {
    // Enter search term that won't match anything
    cy.getByTestId('search-input').type('xyznonexistentproduct{enter}');
    
    // Verify no results message
    cy.getByTestId('no-results-message').should('be.visible');
    cy.getByTestId('product-card').should('not.exist');
    
    // Take visual snapshot of no results
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'No Search Results',
    });
    
    cy.eyesCheckWindow({
      tag: 'No Results Found',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should provide search suggestions', () => {
    // Start typing search term
    cy.getByTestId('search-input').type('org');
    
    // Verify search suggestions appear
    cy.getByTestId('search-suggestions').should('be.visible');
    cy.getByTestId('suggestion-item').should('have.length.at.least', 1);
    
    // Take visual snapshot of search suggestions
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Search Suggestions',
    });
    
    cy.eyesCheckWindow({
      tag: 'Search Suggestions Dropdown',
      target: 'region',
      selector: '[data-testid="search-suggestions"]',
      fully: true
    });
    
    cy.eyesClose();
    
    // Click on a suggestion
    cy.getByTestId('suggestion-item').first().click();
    
    // Verify search results page
    cy.url().should('include', 'search=');
    cy.getByTestId('product-card').should('have.length.at.least', 1);
  });

  it('should filter search results', () => {
    // Search for a term
    cy.getByTestId('search-input').type('fresh{enter}');
    
    // Verify search results
    cy.getByTestId('search-results-heading').should('contain', 'fresh');
    
    // Apply category filter to search results
    cy.getByTestId('category-filter').click();
    cy.getByTestId('category-option').first().click();
    cy.getByTestId('apply-filters-button').click();
    
    // Verify filtered search results
    cy.getByTestId('active-filters').should('be.visible');
    
    // Take visual snapshot of filtered search results
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Filtered Search Results',
    });
    
    cy.eyesCheckWindow({
      tag: 'Filtered Search Results',
      fully: true
    });
    
    cy.eyesClose();
  });
});
