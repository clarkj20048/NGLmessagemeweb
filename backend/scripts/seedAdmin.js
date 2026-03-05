const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const { ensureStoreFile, upsertAdmin } = require("../utils/jsonStore");

dotenv.config();

async function main() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
  }

  await ensureStoreFile();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await upsertAdmin(ADMIN_EMAIL, passwordHash);

  console.log("Admin user created/updated successfully.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
