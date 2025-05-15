# Pickle B2B Marketplace

A specialized B2B food marketplace platform connecting food producers and suppliers with business buyers such as restaurants, grocery stores, and catering services.

<div align="center">
  <img src="/public/pickle-logo.png" alt="Pickle Logo" width="200" />
</div>

## Project Status

**Current Status**: Development Phase - Seller Dashboard Enhancement & Backend Integration

We've completed TypeScript fixes throughout the codebase, implemented UI components with shadcn/ui, and integrated Framer Motion for animations. The project has made significant progress with Convex backend integration, enhanced product schema implementation, and UI refinements. Recent improvements include enhanced seller dashboard components, fixed sidebar navigation, and improved Cypress testing infrastructure. Current focus is on completing seller dashboard components, integrating Pexels API for product images, and ensuring proper integration between frontend and backend.

## Features

- **Multi-sided Marketplace**: Separate interfaces for buyers, sellers, and administrators
- **Product Catalog**: Comprehensive product listings with categories, search, and filtering
- **Order Management**: Complete order lifecycle from placement to delivery
- **User Management**: Role-based access control for different user types
- **Analytics Dashboard**: Detailed insights for all user types
- **Payment Processing**: Secure payment handling with Stripe integration
- **Support System**: Ticket-based customer support

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animation**: Framer Motion
- **State Management**: React Context API, React Query
- **Database**: Convex
- **Authentication**: NextAuth.js
- **Payment Processing**: Stripe
- **Testing**: Jest, React Testing Library, Cypress
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Zchasse63/vercelpickle.git
   cd vercelpickle
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server with Convex backend:
   ```bash
   npm run dev:full
   # or
   yarn dev:full
   ```

   > ⚠️ **IMPORTANT**: Always use `dev:full` instead of `dev` to ensure the Convex backend is running. The application requires the Convex server for most functionality to work properly.

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Testing

### Running Tests

```bash
# Run all unit and integration tests
npm test

# Run end-to-end tests
npm run cypress:run

# Run Cypress tests in interactive mode
npm run cypress:open

# Run tests for specific files
npm run cypress:run -- --spec "cypress/e2e/seller-dashboard.cy.ts"
npm run cypress:run -- --spec "cypress/e2e/marketplace.cy.ts"

# Run all tests
npm run test:all
```

### Cypress Testing Notes

- When writing Cypress tests for UI components that use modern React patterns, use `{ force: true }` with click operations to handle elements that might be covered or have pointer-events disabled.
- Use data-testid attributes consistently across components for reliable test selectors.
- For components using Radix UI or other complex UI libraries, avoid using `.select()` and instead use `.click()` followed by selecting the option.

## Documentation

### Project Overview & Planning
- [Project Overview](/docs/PROJECT_OVERVIEW.md) - High-level overview of the project
- [Project Plan](/docs/PROJECT_PLAN.md) - Detailed project plan and timeline
- [Project Checklist](/docs/PROJECT_CHECKLIST.md) - Comprehensive project checklist
- [Next Steps](/docs/NEXT_STEPS.md) - Immediate and future development steps
- [Next Steps Summary](/docs/NEXT_STEPS_SUMMARY.md) - Prioritized summary of immediate tasks
- [Future Plans](/docs/FUTURE_PLANS.md) - Long-term vision and potential features

### User Experience
- [User Flows and Tests](/docs/USER_FLOWS_AND_TESTS.md) - Comprehensive user flows and test cases
- [User Flow Diagrams](/docs/USER_FLOW_DIAGRAMS.md) - Visual representations of user flows
- [Dashboard Navigation Improvements](/docs/DASHBOARD_NAVIGATION_IMPROVEMENTS.md) - Navigation enhancements

### Development Guides
- [Frontend-Backend Integration](/docs/FRONTEND_BACKEND_INTEGRATION.md) - Guide for integrating frontend with Convex
- [Animation System](/docs/ANIMATION_SYSTEM.md) - Overview of the animation system
- [Style Guide](/docs/STYLE_GUIDE.md) - Coding and design style guidelines
- [Performance Optimization](/docs/PERFORMANCE_OPTIMIZATION_GUIDE.md) - Performance best practices

### UI Components
- [Component Usage Guide](/docs/COMPONENT_USAGE_GUIDE.md) - How to use the UI components
- [UI Kit Documentation](/docs/UI_KIT_DOCUMENTATION.md) - Documentation for the UI kit
- [UI Issues Tracker](/docs/UI_ISSUES_TRACKER.md) - Tracking UI-related issues

### Testing Documentation
- [Testing Infrastructure](/docs/TESTING_INFRASTRUCTURE.md) - Overview of testing framework and tools
- [Testing Guide](/docs/TESTING_GUIDE.md) - Guide for writing and running tests
- [Cypress Testing Guide](/docs/CYPRESS_TESTING_GUIDE.md) - Best practices for Cypress testing
- [Test Issues](/docs/TEST_ISSUES.md) - Known testing issues and solutions

### Backend Documentation
- [API Documentation](/docs/API_DOCUMENTATION.md) - Documentation for the API
- [Convex Schemas](/docs/CONVEX_SCHEMAS.md) - Documentation for the Convex schemas
- [Pexels API Integration](/docs/PEXELS_API_INTEGRATION.md) - Guide for integrating Pexels API for product images

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Convex](https://www.convex.dev/)
- [Framer Motion](https://www.framer.com/motion/)
