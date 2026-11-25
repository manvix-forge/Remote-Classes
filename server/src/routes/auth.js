import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();
const makeToken = (user) => jwt.sign(
  { id: user._id.toString(), role: user.role, name: user.name },
  process.env.JWT_SECRET, { expiresIn: "2d" }
);

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 8)
      return res.status(400).json({ message: "Name, email and password (8+ characters) are required." });
    if (role && !["student", "teacher"].includes(role))
      return res.status(400).json({ message: "Role must be student or teacher." });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail }))
      return res.status(409).json({ message: "An account with this email already exists." });
    const user = await User.create({
      name: name.trim(), email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12), role: role || "student"
    });
    res.status(201).json({ token: makeToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { res.status(500).json({ message: "Could not register account." }); }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email?.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || "", user.passwordHash)))
      return res.status(401).json({ message: "Invalid email or password." });
    res.json({ token: makeToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch { res.status(500).json({ message: "Could not log in." }); }
});
export default router;
