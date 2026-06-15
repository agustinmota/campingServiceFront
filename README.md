# Refugio del Lago Frontend

React frontend for Refugio del Lago, a full-stack cabin and campsite reservation platform. The app provides a public booking experience, authenticated guest flows, and an admin management panel for bookings, availability, accommodations, analytics, and calendar operations.

Backend repository: [campingService](https://github.com/agustinmota/campingService)

Frontend repository: [campingServiceFront](https://github.com/agustinmota/campingServiceFront)

## Table of Contents

- [Project Summary](#project-summary)
- [Main Features](#main-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Routes](#routes)
- [Authentication and Roles](#authentication-and-roles)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Railway Deployment](#railway-deployment)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Backend Integration](#backend-integration)
- [Design System](#design-system)
- [Known Technical Debt](#known-technical-debt)
- [Portfolio Roadmap](#portfolio-roadmap)

## Project Summary

Refugio del Lago is the frontend for a campground and lakefront accommodation booking system. It is built as a separated React/Vite application that consumes a Node/Express API.

The application supports:

- Public accommodation discovery.
- Availability search by dates, type, and guests.
- User registration and login.
- Authenticated booking creation.
- Authenticated cabin and campsite rows can be clicked to start a booking.
- User booking history.
- Admin dashboard and analytics.
- Admin booking status management.
- Admin calendar view.
- Cabin and campsite management.

## Main Features

### Public Experience

- Full home page inspired by a hospitality/lake retreat brand.
- Transparent top navbar behavior on scroll.
- Accommodation cards with images, descriptions, capacity, and prices.
- Prices are displayed with an explicit `USD` currency prefix.
- Availability search with:
  - Check-in
  - Check-out
  - Accommodation type
  - Guest count
- "See more" behavior for accommodation lists.
- Login and create-account flows.
- Logo navigation back to the home page from auth screens.
- Logged-in users can view their own bookings from the home page.

### Reservation Flow

- Users can select a cabin or campsite from the home page.
- Users can also select cabins or campsites from `/app/cabins` and `/app/campsites`.
- If logged in, the user is sent directly to the reservation form.
- If not logged in, protected routing sends the user to login first.
- The reservation form sends holder data:
  - First name
  - Last name
  - Document
  - Phone
- The backend calculates total amount and validates capacity/date conflicts.

### Admin Experience

- Role-protected admin dashboard.
- Summary cards and analytics:
  - Monthly revenue
  - Occupancy rate
  - Guests this month
  - Projected revenue
  - Booking status breakdown
  - Top accommodations
- Booking management:
  - Create booking
  - Delete booking
  - Update status flow
  - Filter by status, holder, accommodation, and date
- Calendar view:
  - Month navigation
  - Reserved/occupied status colors
  - Accommodation list selector
  - Click occupied/reserved days to identify the accommodation
- Cabin and campsite management:
  - Create
  - Edit
  - Delete
  - Description fields
  - Image URL or uploaded image data

## Tech Stack

- React 18
- Vite
- Redux Toolkit
- React Redux
- React Router
- Axios
- Tailwind CSS
- Lucide React icons
- Vitest
- React Testing Library
- jsdom

## Architecture

High-level frontend flow:

```text
React views/components
  -> Redux slices
  -> Axios API client
  -> Express backend API
```

The frontend is organized by feature:

- `auth`
- `bookings`
- `cabins`
- `calendar`
- `campsites`
- `dashboard`
- `public`
- `reservations`
- `resources`

Shared frontend logic lives in `src/shared`:

- Auth token/session helpers.
- Date parsing and formatting utilities.
- Booking status labels/constants.
- Accommodation mapping helpers.
- Protected route components.

## Routes

### Public Routes

| Route | Description |
| --- | --- |
| `/` | Public home page |
| `/login` | Login page |
| `/register` | User registration page |

### Authenticated Routes

| Route | Description |
| --- | --- |
| `/app` | Role-aware redirect |
| `/app/reserve/:type/:id` | Reservation form |
| `/app/cabins` | Cabin list for users and cabin management for admins |
| `/app/campsites` | Campsite list for users and campsite management for admins |

### Admin Routes

| Route | Description |
| --- | --- |
| `/app/dashboard` | Admin summary and analytics |
| `/app/bookings` | Booking management |
| `/app/calendar` | Booking calendar |

## Authentication and Roles

The app stores the JWT and user data in `localStorage`:

```text
camping_token
camping_user
```

Session handling includes:

- Expired token detection.
- Automatic session cleanup.
- A shared session-expired event.
- Redux logout when a request returns `401`.

Role behavior:

- `user`: can browse, reserve, and access guest-facing views.
- `admin`: can access dashboard, bookings, calendar, and management tools.

## Getting Started

### Prerequisites

Install:

- Node.js 20 or newer recommended
- npm
- Backend API running locally

### Clone the Frontend

```bash
git clone https://github.com/agustinmota/campingServiceFront.git
cd campingServiceFront
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

### Start Development Server

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | No | Backend API URL. Defaults to `http://localhost:3000`. |

## Railway Deployment

The frontend is deployed as a separate Railway service from the backend.

Production frontend URL:

```text
https://campingservicefront-production.up.railway.app
```

Production backend URL consumed by the frontend:

```text
https://campingservice-production.up.railway.app
```

Railway frontend variable:

```env
VITE_API_URL=https://campingservice-production.up.railway.app
```

Important:

- `VITE_API_URL` must include `https://`.
- Do not set `VITE_API_URL` to the frontend domain.
- Do not include route paths such as `/tokens/login` or `/user/create` in `VITE_API_URL`.
- After changing `VITE_API_URL`, redeploy the frontend because Vite injects environment variables at build time.

Railway build command:

```bash
npm run build
```

Railway start command:

```bash
npm start
```

The production start script serves the `dist` folder with SPA fallback support, so routes such as `/login` work when refreshed directly in the browser.

## Available Scripts

### Development

```bash
npm run dev
```

Starts Vite in development mode.

### Production Build

```bash
npm run build
```

Builds the app into `dist`.

### Preview Build

```bash
npm run preview
```

Serves the production build locally.

### Production Start

```bash
npm start
```

Serves the built `dist` folder with `serve` and React Router fallback support. This is the recommended start command for Railway.

### Tests

```bash
npm test
```

Runs the Vitest suite once.

### Watch Tests

```bash
npm run test:watch
```

Runs Vitest in watch mode.

## Testing

The frontend test setup uses:

- Vitest
- jsdom
- React Testing Library
- jest-dom matchers
- user-event

Current test coverage includes:

- Auth token persistence and expired-session cleanup.
- Date parsing, date keys, normalization, and month/day comparison.
- USD currency formatting.
- Accommodation mapping for public and admin views.
- Booking filters by status, holder, accommodation, and date.
- Booking table rendering, status updates, delete action, and empty states.

Current result:

```text
15 passing tests
```

Important bug caught by tests:

- Date strings like `2026-06-01` were being parsed as UTC and shown as the previous day in local timezones. The app now parses date-only strings as local calendar dates through `src/shared/dateUtils.js`.

## Project Structure

```text
campingServiceFront
  public/
    Static assets, including logo and images

  src/
    features/
      auth/
        Login, register, and auth Redux state

      bookings/
        Admin booking page, filters, table, and booking tests

      cabins/
        Cabin management

      calendar/
        Admin calendar view

      campsites/
        Campsite management

      dashboard/
        Admin analytics and summary page

      public/
        Public home page

      reservations/
        Authenticated reservation form

      resources/
        Shared resource Redux slice

    services/
      Axios API client

    shared/
      Shared utilities and route guards

    store/
      Redux store

    test/
      Vitest setup

  index.html
  vite.config.js
  tailwind.config.js
```

## Backend Integration

The frontend expects the backend API to expose:

- `POST /tokens/login`
- `POST /user/create`
- `GET /cabin`
- `GET /cabin/available`
- `GET /campsite`
- `GET /campsite/available`
- `POST /booking/create`
- `GET /booking/mybookings`
- `GET /booking`
- `PUT /booking/status/:id`
- Cabin and campsite CRUD routes

Axios is configured in:

```text
src/services/api.js
```

The API client:

- Uses `VITE_API_URL`.
- Sends Bearer tokens when available.
- Clears expired sessions.
- Converts backend response errors into readable `Error` messages.

## Design System

The visual design is inspired by a lakefront hospitality brand:

- Refined serif display typography.
- Forest, gold, cream, and ink color palette.
- Large photographic hero.
- Admin layout with sidebar navigation.
- Compact operational controls for management screens.
- Lucide icons for navigation and action buttons.

Tailwind configuration is in:

```text
tailwind.config.js
```

The main stylesheet is:

```text
src/styles.css
```

## Known Technical Debt

Recommended improvements:

- Add integration tests with mocked API responses.
- Add tests for protected routes and role redirects.
- Add form validation tests for login/register/reservation.
- Replace base64 image storage with object storage in production.
- Add loading skeletons for public accommodation search.
- Add pagination or virtualized tables for large admin datasets.
- Add CI with `npm test` and `npm run build`.

## Portfolio Roadmap

Good next upgrades:

- Deploy frontend and backend.
- Add screenshots or a short demo GIF to this README.
- Add Storybook or component documentation for reusable UI pieces.
- Add Playwright end-to-end tests for login, booking, and admin status flow.
- Add payment-status simulation.
- Add email confirmation UI states.
- Add accessibility audit and improvements.

## License

This project is currently intended for educational and portfolio use.
