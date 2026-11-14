# Backend folder

This project intentionally has no running backend: the assignment brief requires a frontend-only demo that works with VS Code Live Server and LocalStorage. An importable MySQL schema and twelve event records are in `database/eventora.sql` for XAMPP/phpMyAdmin.

The role-aware demo database currently lives in `frontend/js/database.js` and persists in LocalStorage. The SQL schema is separate and is not connected to the browser. A future backend can replace that adapter with authenticated API endpoints while keeping the page structure:

- `users`: id, name, email, phone, role, active
- `events`: id, name, category, date, location, owner
- `bookings`: id, userId, eventId, quantity, status
- `reviews`: id, bookingId, userId, eventId, rating, comment, moderation status
- `venues`: id, name, address, capacity, facilities
- `payments`: id, bookingId, amount, status

Reviews are tied to a booking and remain pending until an admin approves them. Event status supports cancellation without deleting existing bookings.

Do not treat browser-stored passwords, roles, or profile data as secure. Production authentication and authorization must be enforced by a server.

For XAMPP, start MySQL, open phpMyAdmin, select **Import**, and choose `database/eventora.sql`. The SQL users table has no seeded accounts because passwords must be stored as server-generated hashes, not copied from the plaintext LocalStorage demo credentials.