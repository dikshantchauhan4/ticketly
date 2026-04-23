import { seedData } from "./sampleData.js";

const DB_NAME = "ticketly-indexeddb";
const DB_VERSION = 1;

const STORES = {
  departments: { keyPath: "id" },
  teams: {
    keyPath: "id",
    indexes: [{ name: "departmentId", keyPath: "departmentId" }]
  },
  employees: {
    keyPath: "id",
    indexes: [
      { name: "departmentId", keyPath: "departmentId" },
      { name: "teamId", keyPath: "teamId" },
      { name: "role", keyPath: "role" }
    ]
  },
  tickets: {
    keyPath: "id",
    indexes: [
      { name: "status", keyPath: "status" },
      { name: "departmentId", keyPath: "departmentId" },
      { name: "teamId", keyPath: "teamId" },
      { name: "assigneeId", keyPath: "assigneeId" },
      { name: "createdById", keyPath: "createdById" }
    ]
  },
  messages: {
    keyPath: "id",
    indexes: [{ name: "ticketId", keyPath: "ticketId" }]
  },
  attachments: {
    keyPath: "id",
    indexes: [
      { name: "ticketId", keyPath: "ticketId" },
      { name: "messageId", keyPath: "messageId" }
    ]
  }
};

let connection;

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function txDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function ensureStores(db) {
  Object.entries(STORES).forEach(([storeName, config]) => {
    if (!db.objectStoreNames.contains(storeName)) {
      const store = db.createObjectStore(storeName, { keyPath: config.keyPath });
      config.indexes?.forEach((index) => {
        store.createIndex(index.name, index.keyPath, { unique: false });
      });
    }
  });
}

export function openTicketlyDb() {
  if (connection) {
    return Promise.resolve(connection);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      ensureStores(request.result);
    };

    request.onsuccess = () => {
      connection = request.result;
      connection.onversionchange = () => connection.close();
      resolve(connection);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function getAllRecords(storeName) {
  const db = await openTicketlyDb();
  const tx = db.transaction(storeName, "readonly");
  const done = txDone(tx);
  const records = await requestToPromise(tx.objectStore(storeName).getAll());
  await done;
  return records;
}

export async function putRecord(storeName, record) {
  const db = await openTicketlyDb();
  const tx = db.transaction(storeName, "readwrite");
  const done = txDone(tx);
  tx.objectStore(storeName).put(record);
  await done;
  return record;
}

export async function putMany(storeName, records) {
  if (!records.length) {
    return records;
  }

  const db = await openTicketlyDb();
  const tx = db.transaction(storeName, "readwrite");
  const done = txDone(tx);
  const store = tx.objectStore(storeName);
  records.forEach((record) => store.put(record));
  await done;
  return records;
}

export async function loadDatabase() {
  const [departments, teams, employees, tickets, messages, attachments] =
    await Promise.all([
      getAllRecords("departments"),
      getAllRecords("teams"),
      getAllRecords("employees"),
      getAllRecords("tickets"),
      getAllRecords("messages"),
      getAllRecords("attachments")
    ]);

  return { departments, teams, employees, tickets, messages, attachments };
}

export async function seedDatabaseIfNeeded() {
  const employees = await getAllRecords("employees");
  if (employees.length > 0) {
    return false;
  }

  await Promise.all([
    putMany("departments", seedData.departments),
    putMany("teams", seedData.teams),
    putMany("employees", seedData.employees),
    putMany("tickets", seedData.tickets),
    putMany("messages", seedData.messages),
    putMany("attachments", seedData.attachments)
  ]);

  return true;
}
