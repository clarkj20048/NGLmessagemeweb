const fs = require("fs/promises");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const filePath = path.join(dataDir, "submissions.json");

const defaultPayload = {
  submissions: [],
};

async function ensureStoreFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(filePath);
  } catch (_error) {
    await fs.writeFile(filePath, JSON.stringify(defaultPayload, null, 2), "utf8");
  }
}

async function readStore() {
  await ensureStoreFile();
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw || "{}");
  if (!Array.isArray(parsed.submissions)) {
    return { submissions: [] };
  }
  return parsed;
}

async function writeStore(payload) {
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

async function saveProfileInput(profile) {
  const store = await readStore();
  store.submissions.push({
    profileId: String(profile._id),
    email: profile.email,
    fullName: profile.fullName,
    age: profile.age,
    profileImage: profile.profileImage,
    anonymousName: "",
    message: "",
    profileCreatedAt: profile.createdAt,
    messageCreatedAt: null,
  });
  await writeStore(store);
}

async function saveMessageInput(messageDoc) {
  const store = await readStore();
  const profileId = String(messageDoc._id);
  const entry = store.submissions.find((item) => item.profileId === profileId);

  if (entry) {
    entry.anonymousName = messageDoc.anonymousName;
    entry.message = messageDoc.message;
    entry.messageCreatedAt = messageDoc.updatedAt || messageDoc.createdAt;
  } else {
    store.submissions.push({
      profileId,
      email: messageDoc.email || "",
      fullName: messageDoc.fullName || "",
      age: messageDoc.age || null,
      profileImage: messageDoc.profileImage || "",
      anonymousName: messageDoc.anonymousName,
      message: messageDoc.message,
      profileCreatedAt: messageDoc.createdAt || null,
      messageCreatedAt: messageDoc.updatedAt || messageDoc.createdAt || null,
    });
  }

  await writeStore(store);
}

module.exports = {
  ensureStoreFile,
  saveProfileInput,
  saveMessageInput,
};
