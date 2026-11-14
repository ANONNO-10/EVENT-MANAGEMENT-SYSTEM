(() => {
  "use strict";

  const DATABASE_KEY = "eventora.database";
  const LEGACY_KEYS = { users: "eventora.users", events: "eventora.events" };
  const collectionNames = ["users", "events", "bookings", "venues", "payments", "categories", "notifications", "reviews"];
  let initialized = false;
  let database;

  const parse = (value) => {
    try { return value ? JSON.parse(value) : null; } catch { return null; }
  };
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const persist = () => {
    database.updatedAt = new Date().toISOString();
    localStorage.setItem(DATABASE_KEY, JSON.stringify(database));
  };
  const assertCollection = (name) => {
    if (!initialized) throw new Error("Initialize EventoraDB before using it.");
    if (!collectionNames.includes(name)) throw new Error(`Unknown database collection: ${name}`);
  };

  function initialize(defaults = {}) {
    if (initialized) return;
    const saved = parse(localStorage.getItem(DATABASE_KEY));
    const collections = {};

    collectionNames.forEach((name) => {
      if (Array.isArray(saved?.collections?.[name])) {
        collections[name] = saved.collections[name];
        return;
      }
      const legacy = LEGACY_KEYS[name] ? parse(localStorage.getItem(LEGACY_KEYS[name])) : null;
      collections[name] = Array.isArray(legacy) ? legacy : Array.isArray(defaults[name]) ? defaults[name] : [];
    });

    database = {
      version: Number.isInteger(saved?.version) ? saved.version : 1,
      collections,
      updatedAt: saved?.updatedAt || new Date().toISOString()
    };
    persist();
    Object.values(LEGACY_KEYS).forEach((key) => localStorage.removeItem(key));
    initialized = true;
  }

  function getAll(name) {
    assertCollection(name);
    return clone(database.collections[name]);
  }

  function getById(name, id) {
    assertCollection(name);
    const record = database.collections[name].find((item) => item.id === id);
    return record ? clone(record) : null;
  }

  function insert(name, record) {
    assertCollection(name);
    if (!record || typeof record !== "object" || Array.isArray(record)) throw new TypeError("A database record must be an object.");
    const item = { ...clone(record), id: record.id || `${name}-${crypto.randomUUID()}` };
    if (database.collections[name].some((existing) => existing.id === item.id)) throw new Error(`Duplicate id in ${name}: ${item.id}`);
    database.collections[name].push(item);
    persist();
    return clone(item);
  }

  function update(name, id, changes) {
    assertCollection(name);
    const index = database.collections[name].findIndex((item) => item.id === id);
    if (index < 0) return null;
    database.collections[name][index] = { ...database.collections[name][index], ...clone(changes), id };
    persist();
    return clone(database.collections[name][index]);
  }

  function remove(name, id) {
    assertCollection(name);
    const records = database.collections[name];
    const remaining = records.filter((item) => item.id !== id);
    if (remaining.length === records.length) return false;
    database.collections[name] = remaining;
    persist();
    return true;
  }

  function replaceAll(name, records) {
    assertCollection(name);
    if (!Array.isArray(records)) throw new TypeError(`${name} must be an array.`);
    database.collections[name] = clone(records);
    persist();
  }

  window.EventoraDB = Object.freeze({
    get ready() { return initialized; },
    collections: Object.freeze([...collectionNames]),
    initialize,
    getAll,
    getById,
    insert,
    update,
    remove,
    replaceAll
  });

  window.addEventListener("storage", (event) => {
    if (!initialized || event.key !== DATABASE_KEY || !event.newValue) return;
    const saved = parse(event.newValue);
    if (!saved || typeof saved !== "object" || !saved.collections || typeof saved.collections !== "object") return;

    const collections = { ...database.collections };
    collectionNames.forEach((name) => {
      if (Array.isArray(saved.collections[name])) collections[name] = saved.collections[name];
    });
    database = {
      version: Number.isInteger(saved.version) ? saved.version : database.version,
      collections,
      updatedAt: saved.updatedAt || database.updatedAt
    };
  });
})();