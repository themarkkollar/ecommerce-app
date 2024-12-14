# Angular E-commerce Application

A modern e-commerce application built with Angular, featuring a product catalog and shopping cart functionality.

## Features

- Product catalog with grid layout
- Shopping cart management
- Responsive design
- Material Design UI components
- Minimum order quantity validation

## Technologies

- Angular 18.2
- Angular Material 17.0
- TypeScript 5.5
- RxJS 7.8
- SCSS for styling

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   `git clone [repository-url]`
2. Navigate to the project directory: `cd e-commerce-app`
3. Install dependencies: `npm install`

## Development Server

Run `npm start` or `ng serve` for a development server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running Tests

Run `npm test` to execute the unit tests via Karma.

## Project Structure

```src/
├── app/
│ ├── components/ # Reusable components
│ ├── models/ # TypeScript interfaces
│ ├── pages/ # Page components
│ ├── services/ # Angular services
│ └── app.config.ts # App configuration
├── environments/ # Environment configurations
└── styles.scss # Global styles
```

## Features in Detail

### Product Catalog

- Grid layout with responsive design
- Product cards showing image, name, price, and available quantity
- Add to cart functionality with quantity selection

### Shopping Cart

- Real-time cart updates
- Quantity adjustment controls
- Total price calculation
- Minimum order quantity validation
- Available quantity tracking
