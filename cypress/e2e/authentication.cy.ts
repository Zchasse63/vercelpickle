// Authentication Tests
describe('Authentication - Login', () => {
  beforeEach(() => {
    cy.visit('/home');
    cy.fixture('users.json').as('users');
  });

  it('should open login modal from header', () => {
    // Click login button in header
    cy.getByTestId('login-button').click();
    
    // Verify login modal opened
    cy.getByTestId('login-modal').should('be.visible');
    cy.getByTestId('login-email').should('be.visible');
    cy.getByTestId('login-password').should('be.visible');
    cy.getByTestId('login-submit').should('be.visible');
  });

  it('should login as buyer successfully', function() {
    // Click login button
    cy.getByTestId('login-button').click();
    
    // Fill login form
    cy.getByTestId('login-email').type(this.users.buyers[0].email);
    cy.getByTestId('login-password').type(this.users.buyers[0].password);
    cy.getByTestId('login-submit').click();
    
    // Verify successful login
    cy.getByTestId('user-menu-trigger').should('be.visible');
    
    // Open user menu to verify user name
    cy.getByTestId('user-menu-trigger').click();
    cy.contains(this.users.buyers[0].name).should('be.visible');
  });

  it('should login as seller successfully', function() {
    // Click login button
    cy.getByTestId('login-button').click();
    
    // Fill login form
    cy.getByTestId('login-email').type(this.users.sellers[0].email);
    cy.getByTestId('login-password').type(this.users.sellers[0].password);
    cy.getByTestId('login-submit').click();
    
    // Verify successful login
    cy.getByTestId('user-menu-trigger').should('be.visible');
    
    // Open user menu to verify user name
    cy.getByTestId('user-menu-trigger').click();
    cy.contains(this.users.sellers[0].name).should('be.visible');
    
    // Verify seller dashboard access
    cy.visit('/seller');
    cy.getByTestId('seller-dashboard').should('be.visible');
  });

  it('should login as admin successfully', function() {
    // Click login button
    cy.getByTestId('login-button').click();
    
    // Fill login form
    cy.getByTestId('login-email').type(this.users.admins[0].email);
    cy.getByTestId('login-password').type(this.users.admins[0].password);
    cy.getByTestId('login-submit').click();
    
    // Verify successful login
    cy.getByTestId('user-menu-trigger').should('be.visible');
    
    // Verify admin dashboard access
    cy.visit('/admin');
    cy.getByTestId('admin-sidebar').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    // Click login button
    cy.getByTestId('login-button').click();
    
    // Fill login form with invalid credentials
    cy.getByTestId('login-email').type('invalid@example.com');
    cy.getByTestId('login-password').type('wrongpassword');
    cy.getByTestId('login-submit').click();
    
    // Verify error message
    cy.getByTestId('login-error').should('be.visible');
  });

  it('should navigate to forgot password page', () => {
    // Click login button
    cy.getByTestId('login-button').click();
    
    // Click forgot password link
    cy.getByTestId('forgot-password-link').click();
    
    // Verify forgot password page
    cy.url().should('include', '/auth/forgot-password');
    cy.contains('Reset Password').should('be.visible');
  });

  it('should navigate to registration from login modal', () => {
    // Click login button
    cy.getByTestId('login-button').click();
    
    // Click register link
    cy.getByTestId('register-link').click();
    
    // Verify registration form
    cy.getByTestId('register-form').should('be.visible');
  });
});

describe('Authentication - Registration', () => {
  beforeEach(() => {
    cy.visit('/home');
  });

  it('should open registration modal from header', () => {
    // Click register button in header
    cy.getByTestId('register-button').click();
    
    // Verify registration modal opened
    cy.getByTestId('register-form').should('be.visible');
  });

  it('should register as buyer successfully', () => {
    // Generate unique email to avoid conflicts
    const uniqueEmail = `buyer_${Date.now()}@example.com`;
    
    // Click register button
    cy.getByTestId('register-button').click();
    
    // Fill registration form
    cy.getByTestId('name-input').type('New Buyer');
    cy.getByTestId('email-input').type(uniqueEmail);
    cy.getByTestId('password-input').type('Password123!');
    cy.getByTestId('confirm-password-input').type('Password123!');
    cy.getByTestId('buyer-radio').click();
    
    // Submit form
    cy.getByTestId('register-button').click();
    
    // Verify successful registration (redirected to dashboard or confirmation page)
    cy.url().should('include', '/buyer/dashboard');
    // Or if there's a confirmation message:
    // cy.getByTestId('registration-success').should('be.visible');
  });

  it('should register as seller successfully', () => {
    // Generate unique email to avoid conflicts
    const uniqueEmail = `seller_${Date.now()}@example.com`;
    
    // Click register button
    cy.getByTestId('register-button').click();
    
    // Fill registration form
    cy.getByTestId('name-input').type('New Seller');
    cy.getByTestId('email-input').type(uniqueEmail);
    cy.getByTestId('password-input').type('Password123!');
    cy.getByTestId('confirm-password-input').type('Password123!');
    cy.getByTestId('seller-radio').click();
    
    // Submit form
    cy.getByTestId('register-button').click();
    
    // Verify successful registration (redirected to seller onboarding or dashboard)
    cy.url().should('include', '/seller/onboarding');
    // Or if redirected directly to dashboard:
    // cy.url().should('include', '/seller/dashboard');
  });

  it('should show error for existing email', function() {
    cy.fixture('users.json').then((users) => {
      // Click register button
      cy.getByTestId('register-button').click();
      
      // Fill registration form with existing email
      cy.getByTestId('name-input').type('Duplicate User');
      cy.getByTestId('email-input').type(users.buyers[0].email); // Use existing email
      cy.getByTestId('password-input').type('Password123!');
      cy.getByTestId('confirm-password-input').type('Password123!');
      cy.getByTestId('buyer-radio').click();
      
      // Submit form
      cy.getByTestId('register-button').click();
      
      // Verify error message
      cy.getByTestId('register-error').should('be.visible');
      cy.getByTestId('register-error').should('contain', 'already exists');
    });
  });

  it('should show error for password mismatch', () => {
    // Click register button
    cy.getByTestId('register-button').click();
    
    // Fill registration form with mismatched passwords
    cy.getByTestId('name-input').type('Password Mismatch User');
    cy.getByTestId('email-input').type('mismatch@example.com');
    cy.getByTestId('password-input').type('Password123!');
    cy.getByTestId('confirm-password-input').type('DifferentPassword123!');
    cy.getByTestId('buyer-radio').click();
    
    // Submit form
    cy.getByTestId('register-button').click();
    
    // Verify error message
    cy.getByTestId('register-error').should('be.visible');
    cy.getByTestId('register-error').should('contain', 'match');
  });

  it('should navigate to login from registration modal', () => {
    // Click register button
    cy.getByTestId('register-button').click();
    
    // Click login link
    cy.getByTestId('login-link').click();
    
    // Verify login form
    cy.getByTestId('login-form').should('be.visible');
  });
});

describe('Authentication - Logout', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      // Login as a buyer
      cy.login(users.buyers[0].email, users.buyers[0].password);
    });
    cy.visit('/home');
  });

  it('should logout successfully', () => {
    // Open user menu
    cy.getByTestId('user-menu-trigger').click();
    
    // Click logout
    cy.getByTestId('logout-menu-item').click();
    
    // Verify logged out (login button visible)
    cy.getByTestId('login-button').should('be.visible');
    
    // Verify protected routes are no longer accessible
    cy.visit('/buyer/dashboard');
    cy.url().should('include', '/auth/login');
  });
});
