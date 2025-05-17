# Pickle B2B Marketplace

A specialized B2B food marketplace platform connecting food producers and suppliers with business buyers such as restaurants, grocery stores, and catering services.

<div align="center">
  <img src="/public/pickle-logo.png" alt="Pickle Logo" width="200" />
</div>

## Project Status

**Current Status**: Refactoring Complete - Ready for Production Optimization

We've completed a comprehensive refactoring of the codebase, implementing code splitting, lazy loading, and a robust Data Access Layer (DAL). All components now follow consistent patterns with proper skeleton loaders and optimized data fetching. The project has achieved 100% completion of the planned refactoring tasks, including:

- **ESLint Custom Rules**: Implemented custom ESLint rules to enforce coding standards and best practices
- **Component Test Factory**: Created a test factory system to generate tests for similar components
- **Component Composition System**: Developed a flexible system for composing complex components from simpler ones
- **Jest Snapshot Testing Enhancement**: Implemented enhanced snapshot testing capabilities
- **Enhanced Dashboard Components**: Improved dashboard components with better performance and UX
- **Marketplace Optimizations**: Optimized marketplace components for better performance
- **Fully Typed Data Layer**: Implemented a fully typed data access layer for better type safety

The application is now more performant, maintainable, and follows best practices for Next.js and React development.

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

### Project Overview & Status
- [Project Overview](/docs/PROJECT_OVERVIEW.md) - High-level overview of the project
- [Implementation Report](/docs/IMPLEMENTATION_REPORT.md) - Comprehensive summary of all implemented improvements
- [Refactoring Status](/REFACTORING_STATUS.md) - Detailed status of all refactoring tasks
- [Tracking System](/TRACKING_SYSTEM.md) - How to use the refactoring tracking system
- [Future Improvements](/docs/FUTURE_IMPROVEMENTS.md) - Planned improvements and optimizations

### Architecture & Performance
- [Data Access Layer](/docs/DATA_ACCESS_LAYER.md) - Overview of the DAL architecture
- [Code Splitting Implementation](/docs/CODE_SPLITTING_IMPLEMENTATION.md) - Details of code splitting strategies
- [Performance Optimization Guide](/docs/PERFORMANCE_OPTIMIZATION_GUIDE.md) - Performance best practices
- [Bundle Analysis](/docs/BUNDLE_ANALYSIS.md) - Analysis of bundle sizes and optimization opportunities

### Development Guides
- [Frontend-Backend Integration](/docs/FRONTEND_BACKEND_INTEGRATION.md) - Guide for integrating frontend with Convex
- [Component Development](/docs/COMPONENT_DEVELOPMENT.md) - Guidelines for developing components
- [Style Guide](/docs/STYLE_GUIDE.md) - Coding and design style guidelines
- [Error Handling Guide](/docs/ERROR_HANDLING_GUIDE.md) - Best practices for error handling
- [ESLint Custom Rules](/docs/ESLINT_CUSTOM_RULES.md) - Documentation for custom ESLint rules

### UI Components
- [Component Usage Guide](/docs/COMPONENT_USAGE_GUIDE.md) - How to use the UI components
- [UI Kit Documentation](/docs/UI_KIT_DOCUMENTATION.md) - Documentation for the UI kit
- [Skeleton Loaders](/docs/SKELETON_LOADERS.md) - Guidelines for implementing skeleton loaders
- [Animation System](/docs/ANIMATION_SYSTEM.md) - Overview of the animation system
- [Component Composition System](/docs/COMPONENT_COMPOSITION_SYSTEM.md) - Guide for composing complex components

### Testing Documentation
- [Testing Infrastructure](/docs/TESTING_INFRASTRUCTURE.md) - Overview of testing framework and tools
- [Testing Guide](/docs/TESTING_GUIDE.md) - Guide for writing and running tests
- [Cypress Testing Guide](/docs/CYPRESS_TESTING_GUIDE.md) - Best practices for Cypress testing
- [Visual Testing](/docs/VISUAL_TESTING.md) - Guide for visual regression testing
- [Component Test Factory](/docs/COMPONENT_TEST_FACTORY.md) - Documentation for the component test factory
- [Snapshot Testing](/docs/SNAPSHOT_TESTING.md) - Guide for enhanced snapshot testing

### Backend Documentation
- [API Documentation](/docs/API_DOCUMENTATION.md) - Documentation for the API
- [Convex Schemas](/docs/CONVEX_SCHEMAS.md) - Documentation for the Convex schemas
- [Pexels API Integration](/docs/PEXELS_API_INTEGRATION.md) - Guide for integrating Pexels API for product images
- [Data Access Layer Implementation](/docs/DATA_ACCESS_LAYER_IMPLEMENTATION.md) - Details of DAL implementation

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
