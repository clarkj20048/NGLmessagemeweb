const express = require("express");
const mongoose = require("mongoose");

const Message = require("../models/Message");
const { validateMessagePayload } = require("../utils/validation");
const { saveMessageInput } = require("../utils/jsonStore");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { sanitized, errors, isValid } = validateMessagePayload(req.body);

    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    if (!mongoose.Types.ObjectId.isValid(sanitized.profileId)) {
      return res.status(400).json({ message: "Validation failed", errors: { profileId: "Invalid profile id." } });
    }

    const saved = await Message.findByIdAndUpdate(
      sanitized.profileId,
      {
        anonymousName: sanitized.anonymousName,
        message: sanitized.message,
      },
      { new: true }
    );

    if (!saved) {
      return res.status(404).json({ message: "Profile not found." });
    }
    await saveMessageInput(saved);

    return res.status(200).json({
      message: "Message submitted successfully.",
      data: {
        id: saved._id,
        anonymousName: saved.anonymousName,
        message: saved.message,
        createdAt: saved.createdAt,
      },
    });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to save message" });
  }
});

module.exports = router;
