(() => {
  "use strict";

  const STORE = { users: "eventora.users", current: "eventora.currentUser", events: "eventora.events", newsletter: "eventora.newsletter" };
  const STORE_COLLECTIONS = { [STORE.users]: "users", [STORE.events]: "events" };
  const demoUsers = [
    { id: "demo-admin", name: "Eventora Admin", email: "admin@eventora.demo", phone: "", role: "admin", password: "admin123", active: true },
    { id: "demo-organizer", name: "Jordan Lee", email: "organizer@eventora.demo", phone: "", role: "organizer", password: "organizer123", active: true },
    { id: "demo-customer", name: "Taylor Reed", email: "customer@eventora.demo", phone: "", role: "customer", password: "customer123", active: true }
  ];
  const sampleEvents = [
    { id: "ev-design", name: "The Future of Design", category: "Technology", date: "2026-12-03", location: "Brooklyn, NY", image: "photo-1497366754035-f200968a6e72", owner: "demo-organizer", price: 49, capacity: 180, availableSeats: 180, description: "A practical look at the ideas and tools shaping tomorrow's creative work." },
    { id: "ev-jazz", name: "Blue Note Sessions", category: "Music", date: "2026-11-28", location: "Manhattan, NY", image: "photo-1514525253161-7a46d19cd819", owner: "demo-organizer", price: 35, capacity: 120, availableSeats: 120, description: "An intimate evening of live jazz from rising New York musicians." },
    { id: "ev-makers", name: "Makers & Meaning", category: "Workshop", date: "2026-12-11", location: "Queens, NY", image: "photo-1516321318423-f06f85e504b3", owner: "demo-organizer", price: 20, capacity: 40, availableSeats: 40, description: "Build, experiment, and share ideas in a welcoming hands-on studio." },
    { id: "ev-ideas", name: "Ideas in Motion", category: "Business", date: "2026-12-18", location: "Brooklyn, NY", image: "photo-1517245386807-bb43f82c33c4", owner: "demo-organizer", price: 59, capacity: 240, availableSeats: 240, description: "A day of talks and conversations for people building what comes next." },
    { id: "ev-culture", name: "A Night of Stories", category: "Cultural", date: "2027-01-09", location: "Manhattan, NY", image: "photo-1516280440614-37939bbacd81", owner: "demo-organizer", price: 28, capacity: 100, availableSeats: 100, description: "True stories, local voices, and a room full of attentive listeners." },
    { id: "ev-tech", name: "Next Wave Summit", category: "Technology", date: "2027-01-21", location: "Brooklyn, NY", image: "photo-1540575467063-178a50c2df87", owner: "demo-organizer", price: 89, capacity: 400, availableSeats: 400, description: "Meet the teams and technologies changing how we work and live." },
    { id: "ev-learning", name: "Learning in Public", category: "Education", date: "2026-12-06", location: "Queens, NY", image: "photo-1523580494863-6f3031224c94", owner: "demo-organizer", price: 15, capacity: 70, availableSeats: 70, description: "Short, useful lessons from educators who love sharing what they know." },
    { id: "ev-run", name: "The Riverside 5K", category: "Sports", date: "2026-12-20", location: "Manhattan, NY", image: "photo-1461896836934-ffe607ba8211", owner: "demo-organizer", price: 25, capacity: 500, availableSeats: 500, description: "A relaxed community run with routes for first-timers and regulars." },
    { id: "ev-film", name: "Independent Film Night", category: "Entertainment", date: "2027-01-15", location: "Brooklyn, NY", image: "photo-1489599849927-2ee91cede3ba", owner: "demo-organizer", price: 32, capacity: 150, availableSeats: 150, description: "A screening of independent shorts followed by a filmmaker Q&A." },
    { id: "ev-founders", name: "Founders at Work", category: "Business", date: "2027-02-02", location: "Manhattan, NY", image: "photo-1551836022-d5d88e9218df", owner: "demo-organizer", price: 45, capacity: 200, availableSeats: 200, description: "Honest conversations about the real work behind early-stage companies." },
    { id: "ev-ceramics", name: "Clay After Hours", category: "Workshop", date: "2027-02-12", location: "Queens, NY", image: "photo-1565193566173-7a0ee3dbe261", owner: "demo-organizer", price: 38, capacity: 26, availableSeats: 26, description: "Try hand-building with clay in a guided, beginner-friendly workshop." },
    { id: "ev-festival", name: "Winter Sound Festival", category: "Music", date: "2027-02-20", location: "Brooklyn, NY", image: "photo-1470229722913-7c0e2dbbafd3", owner: "demo-organizer", price: 55, capacity: 800, availableSeats: 800, description: "A full evening of live sets, food stalls, and local music makers." }
  ];
  const sampleCategories = ["Technology", "Education", "Sports", "Music", "Business", "Cultural", "Entertainment", "Workshop"].map((name) => ({ id: name.toLowerCase(), name }));

  const read = (key, fallback) => {
    const collection = STORE_COLLECTIONS[key];
    if (collection && window.EventoraDB?.ready) return window.EventoraDB.getAll(collection);
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  const write = (key, value) => {
    const collection = STORE_COLLECTIONS[key];
    if (collection && window.EventoraDB?.ready) return window.EventoraDB.replaceAll(collection, value);
    localStorage.setItem(key, JSON.stringify(value));
  };
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const users = () => read(STORE.users, demoUsers);
  const getCurrentUser = () => {
    const identity = read(STORE.current, null);
    if (!identity) return null;
    return users().find((user) => user.id === identity.id) || null;
  };
  const allEvents = () => read(STORE.events, sampleEvents);
  const allBookings = () => window.EventoraDB.getAll("bookings");
  const saveUsers = (value) => write(STORE.users, value);
  const toast = (message, isError = false) => {
    const region = document.querySelector(".toast-region");
    if (!region) return;
    const item = document.createElement("div");
    item.className = `toast${isError ? " error" : ""}`;
    item.textContent = message;
    region.append(item);
    window.setTimeout(() => item.remove(), 3200);
  };
  const getUserOrRedirect = () => {
    const user = getCurrentUser();
    if (!user || !user.active) {
      localStorage.removeItem(STORE.current);
      window.location.replace("login.html");
      return null;
    }
    return user;
  };

  function initializeData() {
    window.EventoraDB.initialize({ users: demoUsers, events: sampleEvents, categories: sampleCategories });
    const storedUsers = read(STORE.users, null);
    if (!storedUsers) saveUsers(demoUsers);
    else {
      const merged = [...storedUsers];
      demoUsers.forEach((demo) => { if (!merged.some((user) => user.id === demo.id)) merged.push(demo); });
      saveUsers(merged);
    }
    const storedEvents = read(STORE.events, []);
    const mergedEvents = [...storedEvents];
    sampleEvents.forEach((event) => {
      const index = mergedEvents.findIndex((stored) => stored.id === event.id);
      if (index < 0) mergedEvents.push(event);
      else mergedEvents[index] = { ...event, ...mergedEvents[index] };
    });
    if (JSON.stringify(mergedEvents) !== JSON.stringify(storedEvents)) write(STORE.events, mergedEvents);
  }

  function setupNavigation() {
    const toggle = document.querySelector(".menu-toggle");
    toggle?.addEventListener("click", () => {
      const nav = document.querySelector(".site-nav");
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelector(".workspace-menu")?.addEventListener("click", () => document.querySelector(".workspace-sidebar")?.classList.toggle("open"));
    const user = getCurrentUser();
    const publicNav = document.querySelector(".site-nav");
    const navActions = document.querySelector(".nav-actions");
    if (user?.active && publicNav && navActions) {
      if (!publicNav.querySelector('a[href="dashboard.html"]')) {
        const dashboardLink = document.createElement("a");
        dashboardLink.href = "dashboard.html";
        dashboardLink.textContent = "Dashboard";
        publicNav.append(dashboardLink);
      }
      const logoutButton = document.createElement("button");
      logoutButton.type = "button";
      logoutButton.id = "nav-logout-button";
      logoutButton.className = "button button-small";
      logoutButton.textContent = "Log out";
      navActions.replaceChildren(logoutButton);
    }
    const logout = () => {
      localStorage.removeItem(STORE.current);
      window.location.href = "index.html";
    };
    document.getElementById("logout-button")?.addEventListener("click", logout);
    document.getElementById("nav-logout-button")?.addEventListener("click", logout);
  }

  function formatDate(dateString) {
    const date = new Date(`${dateString}T12:00:00`);
    return { day: new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date), month: new Intl.DateTimeFormat("en", { month: "short" }).format(date) };
  }

  function renderEvents(query = "", filters = {}) {
    const grid = document.getElementById("event-grid");
    if (!grid) return;
    let matches = allEvents().filter((event) => event.status !== "cancelled" && `${event.name} ${event.category} ${event.location}`.toLowerCase().includes(query.trim().toLowerCase()));
    if (filters.category) matches = matches.filter((event) => event.category === filters.category);
    if (filters.date) matches = matches.filter((event) => event.date === filters.date);
    if (filters.location) matches = matches.filter((event) => event.location.toLowerCase().includes(filters.location.toLowerCase()));
    if (filters.sort === "price-low") matches.sort((first, second) => first.price - second.price);
    else if (filters.sort === "price-high") matches.sort((first, second) => second.price - first.price);
    else matches.sort((first, second) => first.date.localeCompare(second.date));
    const visibleEvents = Number.isInteger(filters.limit) ? matches.slice(0, filters.limit) : matches;
    grid.innerHTML = visibleEvents.map((event) => {
      const date = formatDate(event.date);
      const price = event.price ? `$${Number(event.price).toFixed(0)}` : "Free";
      const detailsUrl = `event-details.html?id=${encodeURIComponent(event.id)}`;
      return `<article class="event-card"><div class="event-image" style="background-image:url('https://images.unsplash.com/${escapeHtml(event.image)}?auto=format&fit=crop&w=900&q=80')"><span class="event-tag">${escapeHtml(event.category)}</span><span class="event-date"><b>${date.day}</b><small>${date.month}</small></span></div><div class="event-info"><h3>${escapeHtml(event.name)}</h3><div class="event-meta"><span><i class="fa-solid fa-location-dot"></i>${escapeHtml(event.location)}</span><span><i class="fa-solid fa-ticket"></i>${price}</span></div><a class="event-detail-action" href="${detailsUrl}">View details <i class="fa-solid fa-arrow-right"></i></a></div></article>`;
    }).join("");
    const emptyState = document.getElementById("event-empty");
    if (emptyState) emptyState.hidden = matches.length > 0;
    const count = document.getElementById("event-count");
    if (count) count.textContent = `${matches.length} ${matches.length === 1 ? "event" : "events"}`;
  }

  function setupHome() {
    renderEvents("", { limit: 6 });
    document.getElementById("event-search")?.addEventListener("submit", (event) => {
      event.preventDefault();
      window.location.href = `events.html?search=${encodeURIComponent(document.getElementById("search-input").value.trim())}`;
    });
    document.getElementById("newsletter-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("newsletter-email").value.trim().toLowerCase();
      const subscriptions = read(STORE.newsletter, []);
      if (!subscriptions.includes(email)) subscriptions.push(email);
      write(STORE.newsletter, subscriptions);
      event.currentTarget.reset();
      toast("You’re on the list. Watch your inbox!");
    });
  }

  function setupEvents() {
    const form = document.getElementById("event-filters");
    if (!form) return;
    const search = new URLSearchParams(location.search).get("search") || "";
    document.getElementById("events-search").value = search;
    const refresh = () => renderEvents(document.getElementById("events-search").value, {
      category: document.getElementById("category-filter").value,
      date: document.getElementById("date-filter").value,
      location: document.getElementById("location-filter").value.trim().toLowerCase(),
      sort: document.getElementById("sort-filter").value
    });
    form.addEventListener("input", refresh);
    form.addEventListener("change", refresh);
    form.addEventListener("reset", () => window.setTimeout(refresh, 0));
    refresh();
  }

  function renderEventReviews(event, user) {
    const reviews = window.EventoraDB.getAll("reviews");
    const approved = reviews.filter((review) => review.eventId === event.id && review.status === "approved");
    const average = approved.length ? approved.reduce((sum, review) => sum + Number(review.rating), 0) / approved.length : 0;
    document.getElementById("review-average").textContent = approved.length ? `${average.toFixed(1)} / 5 · ${approved.length} review${approved.length === 1 ? "" : "s"}` : "No reviews yet";
    document.getElementById("approved-reviews").innerHTML = approved.map((review) => `<article class="review-item"><div class="review-item-heading"><strong>${escapeHtml(review.userName)}</strong><span>${"★".repeat(Number(review.rating))}${"☆".repeat(5 - Number(review.rating))}</span></div><p>${escapeHtml(review.comment)}</p></article>`).join("");

    const form = document.getElementById("review-form");
    const message = document.getElementById("review-access-message");
    form.hidden = true;
    if (!user || !user.active || user.role !== "customer") {
      message.textContent = "Reviews are available to customers after booking this event.";
      return;
    }
    const hasBooking = allBookings().some((booking) => booking.userId === user.id && booking.eventId === event.id && booking.status === "confirmed");
    if (!hasBooking) {
      message.textContent = "Book this event to leave a review.";
      return;
    }
    const existing = reviews.find((review) => review.eventId === event.id && review.userId === user.id);
    if (existing) {
      message.textContent = existing.status === "approved" ? "Your review is published." : existing.status === "rejected" ? "Your previous review was not approved. You can submit an updated review." : "Your review is waiting for admin approval.";
      if (existing.status === "rejected") {
        document.getElementById("review-rating").value = String(existing.rating);
        document.getElementById("review-comment").value = existing.comment;
        form.hidden = false;
      }
      return;
    }
    message.textContent = "Your review will appear after admin approval.";
    form.hidden = false;
  }

  function setupEventReviews(event) {
    const form = document.getElementById("review-form");
    if (!form) return;
    const user = getCurrentUser();
    renderEventReviews(event, user);
    window.addEventListener("storage", (storageEvent) => {
      if (storageEvent.key === "eventora.database") renderEventReviews(event, getCurrentUser());
    });
    form.addEventListener("submit", (submitEvent) => {
      submitEvent.preventDefault();
      const error = document.getElementById("review-error");
      const comment = document.getElementById("review-comment").value.trim();
      const rating = Number(document.getElementById("review-rating").value);
      const hasBooking = allBookings().some((booking) => booking.userId === user?.id && booking.eventId === event.id && booking.status === "confirmed");
      if (!user || user.role !== "customer" || !hasBooking) {
        error.textContent = "A confirmed customer booking is required to review this event.";
        return;
      }
      if (!comment || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        error.textContent = "Choose a rating and write a short review.";
        return;
      }
      const existing = window.EventoraDB.getAll("reviews").find((review) => review.eventId === event.id && review.userId === user.id);
      const reviewData = { rating, comment, status: "pending", createdAt: new Date().toISOString(), userName: user.name };
      if (existing) window.EventoraDB.update("reviews", existing.id, reviewData);
      else window.EventoraDB.insert("reviews", { ...reviewData, userId: user.id, eventId: event.id, bookingId: allBookings().find((booking) => booking.userId === user.id && booking.eventId === event.id && booking.status === "confirmed").id });
      error.textContent = "";
      renderEventReviews(event, user);
      toast("Review submitted for admin approval.");
    });
  }

  function setupEventDetails() {
    if (!document.body.matches('[data-page="event-details"]')) return;
    const eventId = new URLSearchParams(location.search).get("id");
    const event = allEvents().find((item) => item.id === eventId);
    const content = document.getElementById("event-details-content");
    const notFound = document.getElementById("event-not-found");
    if (!event) {
      content.hidden = true;
      notFound.hidden = false;
      return;
    }
    content.hidden = false;
    const user = getCurrentUser();
    setupEventReviews(event);

    const owner = users().find((user) => user.id === event.owner);
    const eventDate = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date(`${event.date}T12:00:00`));
    const eventPrice = Number(event.price) || 0;
    const capacity = Number(event.availableSeats ?? event.capacity ?? 0);
    document.title = `${event.name} | Eventora`;
    document.getElementById("detail-category").textContent = event.category;
    document.getElementById("detail-title").textContent = event.name;
    document.getElementById("detail-description").textContent = event.description || "Join this Eventora gathering and make a little more happen.";
    document.getElementById("detail-date").textContent = eventDate;
    document.getElementById("detail-location").textContent = event.location;
    document.getElementById("detail-organizer").textContent = owner?.name || "Eventora Organizer";
    document.getElementById("detail-seats").textContent = `${capacity} available`;
    document.getElementById("detail-long-description").textContent = event.description || "Come together, meet new people, and enjoy an experience created by the Eventora community.";
    document.getElementById("booking-base-price").textContent = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(eventPrice);
    document.getElementById("detail-image").style.backgroundImage = `url('https://images.unsplash.com/${escapeHtml(event.image || "photo-1492684223066-81342ee5ff30")}?auto=format&fit=crop&w=1800&q=85')`;
    document.getElementById("booking-availability").textContent = `${capacity} seats available`;

    const bookingForm = document.getElementById("booking-form");
    const accessMessage = document.getElementById("booking-access-message");
    if (event.status === "cancelled") {
      accessMessage.textContent = "This event has been cancelled by an administrator.";
      bookingForm.hidden = true;
      return;
    }
    if (!user || !user.active) {
      const returnPath = `event-details.html?id=${encodeURIComponent(event.id)}`;
      accessMessage.innerHTML = `<p>Sign in as a customer to reserve tickets.</p><a class="button button-wide" href="login.html?next=${encodeURIComponent(returnPath)}">Log in to book <i class="fa-solid fa-arrow-right"></i></a>`;
      bookingForm.hidden = true;
      return;
    }
    if (user.role !== "customer") {
      accessMessage.textContent = "Ticket booking is available to customer accounts.";
      bookingForm.hidden = true;
      return;
    }
    accessMessage.hidden = true;
    bookingForm.hidden = false;

    const quantityInput = document.getElementById("ticket-quantity");
    const typeSelect = document.getElementById("ticket-type");
    const total = document.getElementById("booking-total");
    const multipliers = { regular: 1, vip: 1.75, premium: 2.5 };
    const updateTotal = () => {
      const quantity = Math.max(1, Number(quantityInput.value) || 1);
      quantityInput.value = String(Math.min(quantity, Math.max(1, Number(event.availableSeats ?? event.capacity ?? 0))));
      const amount = eventPrice * multipliers[typeSelect.value] * Number(quantityInput.value);
      total.textContent = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    };
    document.querySelectorAll("[data-quantity-change]").forEach((button) => button.addEventListener("click", () => {
      const next = Number(quantityInput.value) + Number(button.dataset.quantityChange);
      quantityInput.value = String(Math.min(Math.max(1, next), Math.max(1, Number(event.availableSeats ?? event.capacity ?? 0))));
      updateTotal();
    }));
    quantityInput.addEventListener("input", updateTotal);
    typeSelect.addEventListener("change", updateTotal);
    updateTotal();
    if (capacity < 1) {
      bookingForm.hidden = true;
      accessMessage.textContent = "This event is sold out.";
      return;
    }

    bookingForm.addEventListener("submit", (submitEvent) => {
      submitEvent.preventDefault();
      const error = document.getElementById("booking-error");
      error.textContent = "";
      const currentEvent = allEvents().find((item) => item.id === event.id);
      const quantity = Number(quantityInput.value);
      const availableSeats = Number(currentEvent?.availableSeats ?? currentEvent?.capacity ?? 0);
      if (!currentEvent || !Number.isInteger(quantity) || quantity < 1 || quantity > availableSeats) {
        error.textContent = "That quantity is no longer available. Update the number of tickets and try again.";
        return;
      }
      const unitPrice = eventPrice * multipliers[typeSelect.value];
      const bookingId = `booking-${crypto.randomUUID()}`;
      try {
        window.EventoraDB.insert("bookings", {
          id: bookingId,
          userId: user.id,
          eventId: event.id,
          eventName: event.name,
          quantity,
          ticketType: typeSelect.value,
          unitPrice,
          totalAmount: unitPrice * quantity,
          status: "confirmed",
          bookedAt: new Date().toISOString()
        });
        window.EventoraDB.update("events", event.id, { availableSeats: availableSeats - quantity });
      } catch {
        window.EventoraDB.remove("bookings", bookingId);
        error.textContent = "Your booking could not be saved. Please try again.";
        return;
      }
      document.getElementById("booking-availability").textContent = `${availableSeats - quantity} seats available`;
      document.getElementById("detail-seats").textContent = `${availableSeats - quantity} available`;
      document.getElementById("booking-confirmation-id").textContent = bookingId;
      document.getElementById("booking-confirmation").hidden = false;
      updateTotal();
      renderEventReviews(event, user);
      toast("Your tickets are booked.");
    });
  }

  function setupRegistration() {
    const form = document.getElementById("register-form");
    if (!form) return;
    form.querySelector(".password-toggle")?.addEventListener("click", togglePassword);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("full-name").value.trim();
      const email = document.getElementById("register-email").value.trim().toLowerCase();
      const phone = document.getElementById("register-phone").value.trim();
      const role = document.getElementById("register-role").value;
      const password = document.getElementById("register-password").value;
      const error = document.getElementById("register-error");
      error.textContent = "";
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || !document.getElementById("terms").checked) {
        error.textContent = "Enter a valid name, email and password (8+ characters), then accept the demo account notice.";
        return;
      }
      const currentUsers = users();
      if (currentUsers.some((user) => user.email.toLowerCase() === email)) {
        error.textContent = "An account with this email already exists. Please log in instead.";
        return;
      }
      currentUsers.push({ id: `user-${crypto.randomUUID()}`, name, email, phone, role, password, active: true });
      saveUsers(currentUsers);
      toast("Account created. You can now log in.");
      form.reset();
      window.setTimeout(() => { window.location.href = "login.html?registered=1"; }, 650);
    });
  }

  function togglePassword(event) {
    const button = event.currentTarget;
    const input = button.parentElement.querySelector("input");
    const visible = input.type === "password";
    input.type = visible ? "text" : "password";
    button.setAttribute("aria-label", visible ? "Hide password" : "Show password");
    button.innerHTML = `<i class="fa-regular fa-eye${visible ? "-slash" : ""}"></i>`;
  }

  function setupLogin() {
    const form = document.getElementById("login-form");
    if (!form) return;
    form.querySelector(".password-toggle")?.addEventListener("click", togglePassword);
    if (new URLSearchParams(location.search).has("registered")) toast("Account created. Log in to continue.");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("login-email").value.trim().toLowerCase();
      const password = document.getElementById("login-password").value;
      const user = users().find((item) => item.email.toLowerCase() === email && item.password === password && item.active);
      const error = document.getElementById("login-error");
      if (!user) { error.textContent = "Those details didn't match an active demo account."; return; }
      error.textContent = "";
      write(STORE.current, { id: user.id });
      if (document.getElementById("remember-me").checked) localStorage.setItem("eventora.remember", "true");
      else localStorage.removeItem("eventora.remember");
      toast(`Welcome back, ${user.name.split(" ")[0]}!`);
      const requestedPage = new URLSearchParams(location.search).get("next");
      const destination = requestedPage && /^event-details\.html(?:\?.*)?$/.test(requestedPage) ? requestedPage : "dashboard.html";
      window.setTimeout(() => { window.location.href = destination; }, 350);
    });
  }

  const statCard = (label, value, icon) => `<article class="stat-card"><div><span>${label}</span><span class="stat-icon"><i class="${icon}"></i></span></div><strong>${value}</strong></article>`;

  function setupDashboard() {
    if (!document.body.matches('[data-page="dashboard"]')) return;
    const user = getUserOrRedirect();
    if (!user) return;
    const name = escapeHtml(user.name.split(" ")[0]);
    const roleLabel = user.role[0].toUpperCase() + user.role.slice(1);
    document.getElementById("welcome-title").textContent = `Welcome back, ${name}`;
    document.getElementById("welcome-copy").textContent = user.role === "admin" ? "Here’s a snapshot of your Eventora community." : user.role === "organizer" ? "Your event workspace is ready for its next great idea." : "Here’s a snapshot of your Eventora plans.";
    document.getElementById("role-eyebrow").textContent = `${roleLabel.toUpperCase()} WORKSPACE`;
    document.getElementById("role-chip").textContent = roleLabel;
    document.getElementById("top-user-name").textContent = user.name;
    document.getElementById("user-avatar").textContent = user.name.charAt(0).toUpperCase();
    const eventList = allEvents();
    const stats = user.role === "admin"
      ? [["Registered users", users().length, "fa-solid fa-users"], ["Listed events", eventList.length, "fa-regular fa-calendar"], ["Active organizers", users().filter((item) => item.role === "organizer").length, "fa-solid fa-bullhorn"], ["System status", "Ready", "fa-solid fa-circle-check"]]
      : user.role === "organizer"
        ? [["My events", eventList.filter((item) => item.owner === user.id).length, "fa-regular fa-calendar"], ["Upcoming", eventList.filter((item) => item.owner === user.id && item.date >= new Date().toISOString().slice(0, 10)).length, "fa-regular fa-clock"], ["Attendees", "0", "fa-solid fa-users"], ["Demo revenue", "$0", "fa-solid fa-chart-line"]]
        : (() => {
          const myBookings = allBookings().filter((booking) => booking.userId === user.id);
          const upcomingIds = new Set(eventList.filter((item) => item.date >= new Date().toISOString().slice(0, 10)).map((item) => item.id));
          const upcomingBookings = myBookings.filter((booking) => upcomingIds.has(booking.eventId)).length;
          const spending = myBookings.reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);
          return [["My bookings", String(myBookings.length), "fa-regular fa-ticket"], ["Upcoming events", String(upcomingBookings), "fa-regular fa-calendar"], ["Total spending", `$${spending.toFixed(2)}`, "fa-solid fa-wallet"], ["Profile status", "Ready", "fa-regular fa-user"]];
        })();
    document.getElementById("stats-grid").innerHTML = stats.map((stat) => statCard(...stat)).join("");
    const body = document.getElementById("dashboard-body");
    const action = document.getElementById("primary-action");
    if (user.role === "organizer" || user.role === "admin") {
      document.getElementById("panel-title").textContent = user.role === "admin" ? "Events across Eventora" : "Your events";
      action.href = "#create-event";
      action.innerHTML = 'Create event <i class="fa-solid fa-plus"></i>';
      const managedEvents = eventList.filter((item) => user.role === "admin" || item.owner === user.id);
      body.innerHTML = `<div class="data-list">${managedEvents.map((item) => {
        const cancelled = item.status === "cancelled";
        const status = cancelled ? "Cancelled" : item.status === "pending" ? "Pending" : "Published";
        const adminAction = user.role === "admin" ? `<button class="table-action" type="button" data-event-action="${cancelled ? "restore" : "cancel"}" data-event-id="${escapeHtml(item.id)}">${cancelled ? "Restore" : "Cancel event"}</button>` : "";
        return `<div class="data-row ${user.role === "admin" ? "admin-event-row" : ""}"><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.location)} · ${escapeHtml(item.date)} · $${Number(item.price || 0).toFixed(2)}</small></div><span class="status-pill ${cancelled ? "status-cancelled" : ""}">${status}</span><small>${escapeHtml(item.category)}</small>${adminAction}</div>`;
      }).join("") || `<div class="dashboard-message"><h3>No events yet</h3><p>Create your first event to start building an audience.</p><button class="button" id="empty-create-event" type="button">Create event <i class="fa-solid fa-plus"></i></button></div>`}</div>`;
      action.addEventListener("click", (event) => { event.preventDefault(); openEventModal(); });
      document.getElementById("empty-create-event")?.addEventListener("click", openEventModal);
      if (user.role === "admin") {
        body.addEventListener("click", (event) => {
          const button = event.target.closest("[data-event-action]");
          if (!button) return;
          const status = button.dataset.eventAction === "cancel" ? "cancelled" : "approved";
          window.EventoraDB.update("events", button.dataset.eventId, { status });
          toast(status === "cancelled" ? "Event cancelled. Existing bookings were retained." : "Event restored.");
          window.setTimeout(() => window.location.reload(), 250);
        });
        setupAdminReviewQueue();
      }
    } else {
      document.getElementById("panel-title").textContent = "Your Eventora, your way";
      const myBookings = allBookings().filter((booking) => booking.userId === user.id);
      const bookingRows = myBookings.map((booking) => `<div class="data-row"><div><strong>${escapeHtml(booking.eventName)}</strong><small>${Number(booking.quantity)} ticket(s) · ${escapeHtml(booking.ticketType)} · ${new Date(booking.bookedAt).toLocaleDateString()}</small></div><span class="status-pill">${escapeHtml(booking.status)}</span><strong>$${Number(booking.totalAmount).toFixed(2)}</strong></div>`).join("");
      body.innerHTML = myBookings.length
        ? `<div class="data-list">${bookingRows}</div><a class="button" href="events.html">Explore more events <i class="fa-solid fa-arrow-right"></i></a>`
        : '<div class="dashboard-message"><h3>Ready when you are</h3><p>Explore upcoming events and find something you’ll be glad you made time for.</p><a class="button" href="events.html">Browse events <i class="fa-solid fa-arrow-right"></i></a></div>';
    }
    setupCreateEvent(user);
  }

  function setupAdminReviewQueue() {
    const panel = document.getElementById("admin-review-panel");
    const list = document.getElementById("admin-review-list");
    const count = document.getElementById("pending-review-count");
    if (!panel || !list || !count) return;
    panel.hidden = false;
    const render = () => {
      const pending = window.EventoraDB.getAll("reviews").filter((review) => review.status === "pending");
      count.textContent = `${pending.length} pending`;
      list.innerHTML = pending.length ? pending.map((review) => {
        const eventName = allEvents().find((item) => item.id === review.eventId)?.name || "Unknown event";
        return `<article class="moderation-review"><div><strong>${escapeHtml(review.userName)} · ${Number(review.rating)}/5</strong><small>${escapeHtml(eventName)}</small><p>${escapeHtml(review.comment)}</p></div><div class="moderation-actions"><button class="table-action approve-action" type="button" data-review-action="approve" data-review-id="${escapeHtml(review.id)}">Approve</button><button class="table-action reject-action" type="button" data-review-action="reject" data-review-id="${escapeHtml(review.id)}">Reject</button></div></article>`;
      }).join("") : '<p class="empty-moderation">No customer reviews need moderation.</p>';
    };
    list.addEventListener("click", (event) => {
      const button = event.target.closest("[data-review-action]");
      if (!button) return;
      const status = button.dataset.reviewAction === "approve" ? "approved" : "rejected";
      window.EventoraDB.update("reviews", button.dataset.reviewId, { status, moderatedAt: new Date().toISOString() });
      toast(status === "approved" ? "Review approved and published." : "Review rejected.");
      render();
    });
    render();
  }

  function openEventModal() {
    const modal = document.getElementById("event-modal");
    if (!modal) return;
    modal.hidden = false;
    document.getElementById("event-name").focus();
  }

  function setupCreateEvent(user) {
    const modal = document.getElementById("event-modal");
    if (!modal) return;
    modal.querySelector(".modal-close").addEventListener("click", () => { modal.hidden = true; });
    modal.addEventListener("click", (event) => { if (event.target === modal) modal.hidden = true; });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") modal.hidden = true; });
    document.getElementById("create-event-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("event-name").value.trim();
      const date = document.getElementById("event-date").value;
      const location = document.getElementById("event-location").value.trim();
      const price = Number(document.getElementById("event-price").value);
      const error = document.getElementById("event-error");
      if (!name || !date || date < new Date().toISOString().slice(0, 10) || !location || !Number.isFinite(price) || price < 0) { error.textContent = "Enter an event name, a future date, a location, and a valid non-negative ticket price."; return; }
      const events = allEvents();
      events.unshift({ id: `event-${crypto.randomUUID()}`, name, date, location, price, capacity: 100, availableSeats: 100, status: "approved", category: document.getElementById("event-category").value, image: "photo-1492684223066-81342ee5ff30", owner: user.id, description: "A new gathering from the Eventora community." });
      write(STORE.events, events);
      toast("Your event has been created.");
      window.setTimeout(() => window.location.reload(), 300);
    });
  }

  function setupProfile() {
    if (!document.body.matches('[data-page="profile"]')) return;
    const user = getUserOrRedirect();
    if (!user) return;
    const initial = user.name.charAt(0).toUpperCase();
    document.getElementById("profile-name-heading").textContent = user.name;
    document.getElementById("profile-role-badge").textContent = user.role[0].toUpperCase() + user.role.slice(1);
    document.getElementById("profile-avatar").textContent = initial;
    document.getElementById("user-avatar").textContent = initial;
    document.getElementById("top-user-name").textContent = user.name;
    document.getElementById("profile-name").value = user.name;
    document.getElementById("profile-email").value = user.email;
    document.getElementById("profile-phone").value = user.phone || "";
    document.getElementById("profile-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("profile-name").value.trim();
      if (!name) { document.getElementById("profile-error").textContent = "Name cannot be empty."; return; }
      const updatedUsers = users().map((item) => item.id === user.id ? { ...item, name, phone: document.getElementById("profile-phone").value.trim() } : item);
      saveUsers(updatedUsers);
      document.getElementById("profile-name-heading").textContent = name;
      document.getElementById("top-user-name").textContent = name;
      document.getElementById("profile-avatar").textContent = name.charAt(0).toUpperCase();
      document.getElementById("user-avatar").textContent = name.charAt(0).toUpperCase();
      document.getElementById("profile-error").textContent = "";
      toast("Profile changes saved.");
    });
  }

  initializeData();
  setupNavigation();
  setupHome();
  setupEvents();
  setupEventDetails();
  setupRegistration();
  setupLogin();
  setupDashboard();
  setupProfile();
})();