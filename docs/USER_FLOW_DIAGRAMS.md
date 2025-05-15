# Pickle B2B Marketplace - User Flow Diagrams

**Last Updated:** `2025-05-11`

This document provides visual representations of the key user flows in the Pickle B2B Marketplace platform.

## Guest User Flows

### Browse and View Products

```mermaid
graph TD
    A[Guest User] --> B[Visit Home Page]
    B --> C[Browse Categories]
    B --> D[View Featured Products]
    B --> E[Search for Products]
    C --> F[View Category Products]
    D --> G[View Product Details]
    E --> H[View Search Results]
    F --> G
    H --> G
    G --> I{Add to Cart?}
    I -->|Yes| J[Prompt to Login]
    J --> K[Login/Register Flow]
    I -->|No| L[Continue Browsing]
```

### Registration Flow

```mermaid
graph TD
    A[Guest User] --> B[Click Register]
    B --> C[Enter Email/Password]
    C --> D[Select Account Type]
    D -->|Buyer| E[Complete Buyer Registration]
    D -->|Seller| F[Complete Seller Registration]
    E --> G[Verify Email]
    F --> G
    G --> H[Account Created]
    H -->|Buyer| I[Redirect to Buyer Dashboard]
    H -->|Seller| J[Redirect to Seller Dashboard]
```

## Buyer User Flows

### Shopping and Checkout

```mermaid
graph TD
    A[Buyer] --> B[Browse Products]
    B --> C[View Product Details]
    C --> D[Add to Cart]
    D --> E[Continue Shopping?]
    E -->|Yes| B
    E -->|No| F[View Cart]
    F --> G[Update Quantities]
    F --> H[Remove Items]
    F --> I[Proceed to Checkout]
    I --> J[Enter Shipping Information]
    J --> K[Enter Payment Information]
    K --> L[Review Order]
    L --> M[Place Order]
    M --> N[Order Confirmation]
```

### Order Management

```mermaid
graph TD
    A[Buyer] --> B[View Order History]
    B --> C[Select Order]
    C --> D[View Order Details]
    D --> E{Order Status}
    E -->|Processing| F[Cancel Order?]
    F -->|Yes| G[Confirm Cancellation]
    G --> H[Order Cancelled]
    E -->|Shipped| I[Track Shipment]
    E -->|Delivered| J[Leave Review]
```

## Seller User Flows

### Product Management

```mermaid
graph TD
    A[Seller] --> B[View Product Listings]
    B --> C[Add New Product]
    B --> D[Edit Existing Product]
    B --> E[Delete Product]
    C --> F[Enter Product Details]
    F --> G[Upload Images]
    G --> H[Set Inventory]
    H --> I[Add Specifications]
    I --> J[Submit for Review]
    J --> K[Product Pending Approval]
    D --> L[Update Product Information]
    L --> M[Save Changes]
    M --> N[Product Updated]
    E --> O[Confirm Deletion]
    O --> P[Product Deleted]
```

### Order Processing

```mermaid
graph TD
    A[Seller] --> B[View Incoming Orders]
    B --> C[Select Order]
    C --> D[View Order Details]
    D --> E{Order Status}
    E -->|New| F[Accept/Reject Order]
    F -->|Accept| G[Order Accepted]
    F -->|Reject| H[Order Rejected]
    G --> I[Process Order]
    I --> J[Arrange Shipping]
    J --> K[Enter Tracking Information]
    K --> L[Mark as Shipped]
    L --> M[Order Shipped]
```

## Admin User Flows

### User Management

```mermaid
graph TD
    A[Admin] --> B[View User List]
    B --> C[Filter Users]
    B --> D[Select User]
    D --> E[View User Details]
    E --> F[Edit User Information]
    E --> G{User Status}
    G -->|Active| H[Suspend User]
    G -->|Suspended| I[Activate User]
    E --> J[Delete User]
    F --> K[Save Changes]
    H --> L[User Suspended]
    I --> M[User Activated]
    J --> N[Confirm Deletion]
    N --> O[User Deleted]
```

### Product Moderation

```mermaid
graph TD
    A[Admin] --> B[View Product List]
    B --> C[Filter Products]
    B --> D[Select Product]
    D --> E[View Product Details]
    E --> F{Product Status}
    F -->|Pending| G[Approve/Reject Product]
    G -->|Approve| H[Product Approved]
    G -->|Reject| I[Enter Rejection Reason]
    I --> J[Product Rejected]
    F -->|Active| K[Edit Product]
    F -->|Active| L[Remove Product]
    K --> M[Save Changes]
    L --> N[Confirm Removal]
    N --> O[Product Removed]
```

## Integration Points

### Authentication Flow

```mermaid
graph TD
    A[User] --> B[Login/Register]
    B --> C[Authentication Service]
    C --> D{Valid Credentials?}
    D -->|Yes| E[Generate JWT]
    D -->|No| F[Error Message]
    E --> G[Store Token]
    G --> H{User Role}
    H -->|Buyer| I[Buyer Dashboard]
    H -->|Seller| J[Seller Dashboard]
    H -->|Admin| K[Admin Dashboard]
```

### Payment Processing

```mermaid
graph TD
    A[Buyer] --> B[Enter Payment Details]
    B --> C[Payment Service]
    C --> D{Payment Authorized?}
    D -->|Yes| E[Create Order]
    D -->|No| F[Payment Error]
    E --> G[Update Inventory]
    G --> H[Send Confirmation]
    H --> I[Order Complete]
```

These diagrams provide a visual representation of the key user flows in the Pickle B2B Marketplace platform. They can be used as a reference for development, testing, and documentation purposes.
