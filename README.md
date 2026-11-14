# Eventora

A responsive event discovery and role-based account demo built with HTML, CSS, and vanilla JavaScript. No build step, package installation, or server-side code is required.

## Run

Open `frontend/index.html` directly, or open the `frontend` folder with VS Code Live Server. The Home, Events, About, registration, login, dashboard, and profile pages work as static files.

## Demo accounts

- Admin: `admin@eventora.demo` / `admin123`
- Organizer: `organizer@eventora.demo` / `organizer123`
- Customer: `customer@eventora.demo` / `customer123`

New users can register as a customer or organizer. Admin is provided as a demo account and is not selectable on the public sign-up form.

## Pages

- `frontend/index.html`: Eventora home, event search, sample listings, newsletter form
- `frontend/events.html`: searchable, filterable, sortable event catalog
- `frontend/event-details.html`: event details, customer ticket booking, and moderated reviews
- `frontend/about.html`: About Eventora
- `frontend/register.html`: Account creation with role selection and validation
- `frontend/login.html`: Demo authentication and role-based dashboard entry
- `frontend/dashboard.html`: Customer, organizer, or admin workspace
- `frontend/profile.html`: Profile editor showing the account role and email

## Demo data and limitations

The browser-side database is stored as one versioned LocalStorage record with `users`, `events`, `bookings`, `reviews`, `venues`, `payments`, `categories`, and `notifications` collections. Existing user and event keys are migrated on first load. The reusable CRUD helpers are in `frontend/js/database.js`; clear this browser's site data to reset the demo. This is not a real authentication system; passwords and role data stored client-side can be inspected or changed. Do not enter real credentials or payment information. See `backend/README.md` for the intended future server-side data contract.

## Demo booking

Open the Events page, choose **View details** on an event, then log in with the customer demo account. Select a ticket type and quantity and confirm the booking. The booking is saved in the LocalStorage `bookings` collection and available seats are reduced. Customers with a booking can submit one review per event; reviews stay pending until an admin approves them, then appear on that event's details page. If the event details page is open in another tab, the approved review appears there automatically. Admins can also cancel or restore events from the dashboard. Organizers and admins can set a ticket price when creating an event.

The default admin account is `admin@eventora.demo` / `admin123`. Admin credentials are for this browser-only academic demo; they are not seeded into the MySQL users table.

## XAMPP MySQL import

1. Start **MySQL** from the XAMPP Control Panel.
2. Open `http://localhost/phpmyadmin`.
3. Choose **Import**, select `database/eventora.sql`, then choose **Import** at the bottom of the page.
4. The script creates `eventora_db`, its users/events/categories/venues/bookings/reviews/payments tables, event cancellation status, and 12 sample events.

The SQL database is provided for XAMPP, but the static website still reads and writes LocalStorage. Browsers cannot connect directly to MySQL; using this SQL database in the live website requires a backend API. The original project constraints prohibit a backend server, so no database credentials are exposed in frontend JavaScript. The users table starts empty; accounts created in the demo remain in LocalStorage, and a production backend must store securely generated password hashes.

Import the [database/eventora.sql](database/eventora.sql) file through phpMyAdmin to create the MySQL schema and sample event rows. After login, the Home, Events, and About navbar shows a Dashboard link and a Log out button. Dashboard event links open the Events page without ending the current demo session; use Log out explicitly to clear it.