// Product Filtering Tests
describe('Product Filtering - Marketplace', () => {
  beforeEach(() => {
    cy.visit('/marketplace');
    // Wait for the page to load
    cy.getByTestId('marketplace-layout').should('be.visible');
    cy.getByTestId('product-grid').should('be.visible');
  });

  it('should filter products by category', () => {
    // Get initial product count
    cy.getByTestId('product-card').then($initialProducts => {
      const initialCount = $initialProducts.length;
      
      // Open category filter
      cy.getByTestId('category-filter').click();
      
      // Select a category (e.g., "Fresh Produce")
      cy.getByTestId('category-option-fresh-produce').click();
      
      // Apply filter
      cy.getByTestId('apply-filters-button').click();
      
      // Verify filtered results
      cy.getByTestId('product-card').should($filteredProducts => {
        // Either we have fewer products or the same number
        expect($filteredProducts.length).to.be.at.most(initialCount);
      });
      
      // Verify active filter indicator
      cy.getByTestId('active-filters').should('contain', 'Fresh Produce');
    });
  });

  it('should filter products by price range', () => {
    // Open price filter
    cy.getByTestId('price-filter').click();
    
    // Set min price
    cy.getByTestId('min-price-input').clear().type('10');
    
    // Set max price
    cy.getByTestId('max-price-input').clear().type('50');
    
    // Apply filter
    cy.getByTestId('apply-filters-button').click();
    
    // Verify filtered results - all products should be within price range
    cy.getByTestId('product-card').each($product => {
      cy.wrap($product).within(() => {
        cy.getByTestId('product-price').invoke('text').then(priceText => {
          // Extract numeric price value (remove currency symbol and formatting)
          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          expect(price).to.be.at.least(10);
          expect(price).to.be.at.most(50);
        });
      });
    });
    
    // Verify active filter indicator
    cy.getByTestId('active-filters').should('contain', 'Price: $10 - $50');
  });

  it('should sort products by price', () => {
    // Open sort dropdown
    cy.getByTestId('sort-dropdown').click();
    
    // Select "Price: Low to High"
    cy.getByTestId('sort-option-price-asc').click();
    
    // Get all product prices and verify they are in ascending order
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
    
    // Now sort by "Price: High to Low"
    cy.getByTestId('sort-dropdown').click();
    cy.getByTestId('sort-option-price-desc').click();
    
    // Get all product prices and verify they are in descending order
    let highestPrice = Number.MAX_VALUE;
    cy.getByTestId('product-card').each($product => {
      cy.wrap($product).within(() => {
        cy.getByTestId('product-price').invoke('text').then(priceText => {
          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          expect(price).to.be.at.most(highestPrice);
          highestPrice = price;
        });
      });
    });
  });

  it('should filter products by search term', () => {
    // Get initial product count
    cy.getByTestId('product-card').then($initialProducts => {
      const initialCount = $initialProducts.length;
      
      // Enter search term
      cy.getByTestId('search-input').type('organic{enter}');
      
      // Verify filtered results
      cy.getByTestId('product-card').should($filteredProducts => {
        // We should have fewer or equal number of products
        expect($filteredProducts.length).to.be.at.most(initialCount);
      });
      
      // Verify product names contain search term (case insensitive)
      cy.getByTestId('product-card').each($product => {
        cy.wrap($product).within(() => {
          cy.getByTestId('product-name').invoke('text').then(name => {
            const lowerCaseName = name.toLowerCase();
            // Either name or description should contain "organic"
            if (!lowerCaseName.includes('organic')) {
              cy.getByTestId('product-description').invoke('text').then(description => {
                const lowerCaseDesc = description.toLowerCase();
                expect(lowerCaseDesc).to.include('organic');
              });
            }
          });
        });
      });
    });
  });

  it('should combine multiple filters', () => {
    // Get initial product count
    cy.getByTestId('product-card').then($initialProducts => {
      const initialCount = $initialProducts.length;
      
      // Apply category filter
      cy.getByTestId('category-filter').click();
      cy.getByTestId('category-option-fresh-produce').click();
      
      // Apply price filter
      cy.getByTestId('price-filter').click();
      cy.getByTestId('min-price-input').clear().type('10');
      cy.getByTestId('max-price-input').clear().type('30');
      
      // Apply filters
      cy.getByTestId('apply-filters-button').click();
      
      // Verify filtered results
      cy.getByTestId('product-card').should($filteredProducts => {
        // We should have fewer products after filtering
        expect($filteredProducts.length).to.be.at.most(initialCount);
      });
      
      // Verify active filter indicators
      cy.getByTestId('active-filters').should('contain', 'Fresh Produce');
      cy.getByTestId('active-filters').should('contain', 'Price: $10 - $30');
      
      // Verify products match both filters
      cy.getByTestId('product-card').each($product => {
        cy.wrap($product).within(() => {
          // Verify price range
          cy.getByTestId('product-price').invoke('text').then(priceText => {
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            expect(price).to.be.at.least(10);
            expect(price).to.be.at.most(30);
          });
          
          // Verify category (if visible)
          cy.getByTestId('product-category').should('contain', 'Fresh Produce');
        });
      });
    });
  });

  it('should clear all filters', () => {
    // Get initial product count
    cy.getByTestId('product-card').then($initialProducts => {
      const initialCount = $initialProducts.length;
      
      // Apply some filters
      cy.getByTestId('category-filter').click();
      cy.getByTestId('category-option-fresh-produce').click();
      cy.getByTestId('apply-filters-button').click();
      
      // Verify filters applied
      cy.getByTestId('active-filters').should('be.visible');
      
      // Clear all filters
      cy.getByTestId('clear-filters-button').click();
      
      // Verify filters cleared
      cy.getByTestId('active-filters').should('not.exist');
      
      // Verify product count is back to initial
      cy.getByTestId('product-card').should('have.length', initialCount);
    });
  });
});
