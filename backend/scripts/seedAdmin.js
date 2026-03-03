const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Admin = require("../models/Admin");

dotenv.config();

async function main() {
  const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("MONGO_URI, ADMIN_EMAIL, and ADMIN_PASSWORD are required in .env");
  }

  await mongoose.connect(MONGO_URI);

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await Admin.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase().trim() },
    {
      email: ADMIN_EMAIL.toLowerCase().trim(),
      passwordHash,
    },
    { upsert: true, new: true }
  );

  console.log("Admin user created/updated successfully.");
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
