# E-Commerce Frontend

Angular frontend application for consuming an E-Commerce REST API.

## Architecture

The application follows a clean architecture pattern with the following structure:

```
src/app
├── core
│    ├── interceptors
│    │    ├── error.interceptor.ts      # Centralized error handling
│    │    └── api-prefix.interceptor.ts # Auto-prefixes API URLs
│    ├── guards
│    └── models
│         ├── api-page.model.ts         # Paginated response model
│         ├── product.model.ts
│         ├── order.model.ts
│         ├── category.model.ts
│         └── user.model.ts
│
├── features
│    ├── products
│    │    ├── pages
│    │    ├── components
│    │    ├── services
│    │    └── product.routes.ts
│    │
│    ├── categories
│    ├── orders
│    └── users
│
├── shared
│    ├── components
│    ├── pipes
│    └── utils
│
├── environments
│    ├── environment.ts
│    └── environment.prod.ts
│
└── app.config.ts
```

## Key Principles

- **Services = HTTP + mapping** - All HTTP calls are in services
- **Components = UI only** - No HTTP calls in components
- **Backend is source of truth** - Always use backend response, never recalculate locally
- **Centralized error handling** - Via error interceptor
- **Strict typing** - All models aligned with backend API

## Features

- **Products**: List, view, create, edit, delete products with pagination
- **Categories**: Manage product categories
- **Orders**: Create orders, view order details, update status
- **Users**: User management

## API Configuration

The API URL is configured in `src/app/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.

## Running unit tests

To execute unit tests:

```bash
ng test
```

## Additional Resources

For more information on using the Angular CLI, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
