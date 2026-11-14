<div align="center">

# Eventora

### Discover events. Make memories.

A responsive event discovery and role-based account demo built with HTML, CSS, and vanilla JavaScript.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20Eventora-7655e8?style=for-the-badge)](https://anonno-10.github.io/EVENT-MANAGEMENT-SYSTEM/)
[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=github&style=for-the-badge)](https://github.com/ANONNO-10/EVENT-MANAGEMENT-SYSTEM/actions)

</div>

> **GitHub Pages:** The live URL is [anonno-10.github.io/EVENT-MANAGEMENT-SYSTEM](https://anonno-10.github.io/EVENT-MANAGEMENT-SYSTEM/). If it is not available yet, enable **Settings → Pages → Build and deployment → GitHub Actions** in the repository and wait for the deployment workflow to finish.

## About

Eventora is a browser-based event platform demo with customer, organizer, and admin experiences. No build step, package installation, or server-side code is required.

## Run locally

1. Download or clone this repository.
2. Open `frontend/index.html` in a browser, or open the `frontend` folder in VS Code and use **Live Server**.

The Home, Events, About, registration, login, dashboard, and profile pages work as static files.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@eventora.demo` | `admin123` |
| Organizer | `organizer@eventora.demo` | `organizer123` |
| Customer | `customer@eventora.demo` | `customer123` |

New users can register as a customer or organizer. Admin is a demo account and is not selectable on the public sign-up form.

## Features

- Search, filter, and sort the event catalog.
- Create accounts and access role-based dashboards.
- Book event tickets and track remaining seats.
- Submit customer reviews; approved reviews appear on the event details page.
- Moderate reviews and manage events as an admin.
- Save demo data in browser LocalStorage.

## Pages

| File | Description |
|---|---|
| `frontend/index.html` | Home, event search, sample listings, and newsletter form |
| `frontend/events.html` | Searchable, filterable, sortable event catalog |
| `frontend/event-details.html` | Event details, ticket booking, and moderated reviews |
| `frontend/about.html` | About Eventora |
| `frontend/register.html` | Account creation with role selection and validation |
| `frontend/login.html` | Demo authentication and role-based dashboard entry |
| `frontend/dashboard.html` | Customer, organizer, or admin workspace |
| `frontend/profile.html` | Profile editor |

## Try a demo booking and review

1. Open **Events**, choose **View details** on an event, and log in with the customer account above.
2. Select a ticket type and quantity, then confirm the demo booking.
3. Submit a review from that event's details page.
4. Log in as admin, approve the review from the dashboard, and return to the event details page to see it published.

Reviews remain pending until approved. Admins can also cancel or restore events from the dashboard. Organizers and admins can set ticket prices when creating events.

## Data and limitations

The browser-side database is stored as one versioned LocalStorage record containing `users`, `events`, `bookings`, `reviews`, `venues`, `payments`, `categories`, and `notifications`. Existing user and event keys are migrated on first load. Reusable CRUD helpers are in `frontend/js/database.js`. Clear this browser's site data to reset the demo.

This is **not a real authentication or payment system**. Passwords and role data stored client-side can be inspected or changed. Do not enter real credentials or payment information. See `backend/README.md` for the intended future server-side data contract.

## Optional: import the XAMPP MySQL schema

1. Start **MySQL** from the XAMPP Control Panel.
2. Open `http://localhost/phpmyadmin`.
3. Choose **Import**, select `database/eventora.sql`, then choose **Import** at the bottom of the page.

The script creates `eventora_db` and its users, events, categories, venues, bookings, reviews, and payments tables, along with 12 sample events. The static website still uses LocalStorage: browsers cannot connect directly to MySQL. A backend API is required to use this database in the live site. The users table starts empty; a production backend must store securely generated password hashes.
