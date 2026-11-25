import { Router } from "express";
import Class from "../models/Class.js";
import { authenticate, teacherOnly } from "../middleware/auth.js";

const router = Router();
router.get("/", authenticate, async (_req, res) => {
  try {
    const classes = await Class.find().populate("teacher", "name").sort({ createdAt: -1 }).lean();
    res.json(classes);
  } catch { res.status(500).json({ message: "Could not load classes." }); }
});

router.post("/", authenticate, teacherOnly, async (req, res) => {
  try {
    const { title, subject, description = "", meetingUrl = "", resourceUrl = "" } = req.body;
    if (!title?.trim() || !subject?.trim())
      return res.status(400).json({ message: "Title and subject are required." });
    for (const value of [meetingUrl, resourceUrl]) {
      if (value && !/^https?:\/\//i.test(value))
        return res.status(400).json({ message: "Meeting and resource links must start with http:// or https://." });
    }
    const created = await Class.create({ title, subject, description, meetingUrl, resourceUrl, teacher: req.user.id });
    res.status(201).json(created);
  } catch { res.status(500).json({ message: "Could not create class." }); }
});
export default router;
