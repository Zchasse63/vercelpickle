# Pickle B2B Marketplace API Documentation

This document provides comprehensive documentation for the Pickle B2B Marketplace API. The API allows developers to integrate with the marketplace, access product data, manage orders, and more.

## Table of Contents

1. [Authentication](#authentication)
2. [Products API](#products-api)
3. [Orders API](#orders-api)
4. [Users API](#users-api)
5. [Sellers API](#sellers-api)
6. [Categories API](#categories-api)
7. [Search API](#search-api)
8. [Webhooks](#webhooks)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

## Authentication

All API requests require authentication using JWT (JSON Web Tokens).

### Obtaining a Token

```
POST /api/auth/token
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### Using the Token

Include the token in the Authorization header of all API requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Products API

### Get All Products

```
GET /api/products
```

**Query Parameters:**

| Parameter | Type   | Description                                |
|-----------|--------|--------------------------------------------|
| page      | number | Page number (default: 1)                   |
| limit     | number | Number of items per page (default: 20)     |
| sort      | string | Sort field (e.g., "price", "name")         |
| order     | string | Sort order ("asc" or "desc")               |
| category  | string | Filter by category ID                      |
| minPrice  | number | Minimum price filter                       |
| maxPrice  | number | Maximum price filter                       |
| inStock   | boolean| Filter for in-stock products only          |

**Response:**

```json
{
  "data": [
    {
      "id": "prod_123",
      "name": "Organic Apples",
      "description": "Fresh organic apples",
      "price": 2.99,
      "unit": "lb",
      "category": "fruits",
      "seller": {
        "id": "seller_456",
        "name": "Green Farms"
      },
      "stock": 100,
      "images": ["https://example.com/apple1.jpg"],
      "certifications": ["organic", "non-gmo"]
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20
  }
}
```

### Get Product by ID

```
GET /api/products/:id
```

**Response:**

```json
{
  "id": "prod_123",
  "name": "Organic Apples",
  "description": "Fresh organic apples",
  "longDescription": "Our apples are grown without pesticides...",
  "price": 2.99,
  "unit": "lb",
  "category": "fruits",
  "subcategory": "apples",
  "seller": {
    "id": "seller_456",
    "name": "Green Farms",
    "rating": 4.8,
    "reviews": 120
  },
  "stock": 100,
  "images": ["https://example.com/apple1.jpg"],
  "gallery": [
    "https://example.com/apple2.jpg",
    "https://example.com/apple3.jpg"
  ],
  "certifications": ["organic", "non-gmo"],
  "nutritionFacts": {
    "servingSize": "1 medium apple (182g)",
    "calories": 95,
    "totalFat": "0g",
    "sodium": "2mg",
    "totalCarbohydrate": "25g",
    "dietaryFiber": "4g",
    "sugars": "19g",
    "protein": "0g",
    "vitaminA": "2%",
    "vitaminC": "14%",
    "calcium": "1%",
    "iron": "1%"
  },
  "storageInfo": "Store in a cool, dry place or refrigerate for longer freshness.",
  "shippingInfo": "Ships within 2 business days."
}
```

### Create Product

```
POST /api/products
```

**Request Body:**

```json
{
  "name": "Organic Apples",
  "description": "Fresh organic apples",
  "longDescription": "Our apples are grown without pesticides...",
  "price": 2.99,
  "unit": "lb",
  "category": "fruits",
  "subcategory": "apples",
  "stock": 100,
  "images": ["https://example.com/apple1.jpg"],
  "gallery": [
    "https://example.com/apple2.jpg",
    "https://example.com/apple3.jpg"
  ],
  "certifications": ["organic", "non-gmo"],
  "nutritionFacts": {
    "servingSize": "1 medium apple (182g)",
    "calories": 95,
    "totalFat": "0g",
    "sodium": "2mg",
    "totalCarbohydrate": "25g",
    "dietaryFiber": "4g",
    "sugars": "19g",
    "protein": "0g",
    "vitaminA": "2%",
    "vitaminC": "14%",
    "calcium": "1%",
    "iron": "1%"
  },
  "storageInfo": "Store in a cool, dry place or refrigerate for longer freshness.",
  "shippingInfo": "Ships within 2 business days."
}
```

**Response:**

```json
{
  "id": "prod_123",
  "name": "Organic Apples",
  "description": "Fresh organic apples",
  "price": 2.99,
  "unit": "lb",
  "category": "fruits",
  "subcategory": "apples",
  "seller": {
    "id": "seller_456",
    "name": "Green Farms"
  },
  "stock": 100,
  "images": ["https://example.com/apple1.jpg"],
  "gallery": [
    "https://example.com/apple2.jpg",
    "https://example.com/apple3.jpg"
  ],
  "certifications": ["organic", "non-gmo"],
  "createdAt": "2023-05-01T12:00:00Z"
}
```

### Update Product

```
PUT /api/products/:id
```

**Request Body:**

Same as Create Product, with only the fields you want to update.

**Response:**

```json
{
  "id": "prod_123",
  "name": "Organic Red Apples",
  "description": "Fresh organic red apples",
  "price": 3.49,
  "unit": "lb",
  "category": "fruits",
  "subcategory": "apples",
  "seller": {
    "id": "seller_456",
    "name": "Green Farms"
  },
  "stock": 75,
  "images": ["https://example.com/apple1.jpg"],
  "gallery": [
    "https://example.com/apple2.jpg",
    "https://example.com/apple3.jpg"
  ],
  "certifications": ["organic", "non-gmo"],
  "updatedAt": "2023-05-15T14:30:00Z"
}
```

### Delete Product

```
DELETE /api/products/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Orders API

### Get All Orders

```
GET /api/orders
```

**Query Parameters:**

| Parameter | Type   | Description                                |
|-----------|--------|--------------------------------------------|
| page      | number | Page number (default: 1)                   |
| limit     | number | Number of items per page (default: 20)     |
| status    | string | Filter by status (e.g., "pending", "shipped") |
| from      | string | Start date (ISO format)                    |
| to        | string | End date (ISO format)                      |

**Response:**

```json
{
  "data": [
    {
      "id": "order_789",
      "status": "processing",
      "total": 149.95,
      "items": [
        {
          "productId": "prod_123",
          "name": "Organic Apples",
          "quantity": 10,
          "price": 2.99,
          "total": 29.90
        }
      ],
      "shipping": {
        "method": "standard",
        "cost": 9.95,
        "address": {
          "street": "123 Main St",
          "city": "Anytown",
          "state": "CA",
          "zip": "12345",
          "country": "USA"
        }
      },
      "createdAt": "2023-05-10T09:15:00Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 98,
    "itemsPerPage": 20
  }
}
```

### Get Order by ID

```
GET /api/orders/:id
```

**Response:**

```json
{
  "id": "order_789",
  "status": "processing",
  "total": 149.95,
  "items": [
    {
      "productId": "prod_123",
      "name": "Organic Apples",
      "quantity": 10,
      "price": 2.99,
      "total": 29.90
    }
  ],
  "shipping": {
    "method": "standard",
    "cost": 9.95,
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345",
      "country": "USA"
    },
    "tracking": {
      "number": "1Z999AA10123456784",
      "url": "https://example.com/track/1Z999AA10123456784"
    }
  },
  "payment": {
    "method": "credit_card",
    "status": "completed",
    "transactionId": "txn_456789"
  },
  "notes": "Please leave at front door",
  "createdAt": "2023-05-10T09:15:00Z",
  "updatedAt": "2023-05-10T14:30:00Z"
}
```

## Error Handling

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": [
      {
        "field": "price",
        "message": "Price must be greater than 0"
      }
    ]
  }
}
```

Common error codes:

| Code               | Description                                |
|--------------------|--------------------------------------------|
| unauthorized       | Authentication is required                 |
| forbidden          | User doesn't have permission               |
| not_found          | Resource not found                         |
| invalid_request    | Request validation failed                  |
| server_error       | Internal server error                      |

## Rate Limiting

API requests are rate limited to prevent abuse. The current limits are:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit information is included in the response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
```

When a rate limit is exceeded, the API will return a 429 Too Many Requests response.
