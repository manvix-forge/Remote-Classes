import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  subject: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, trim: true, maxlength: 1000, default: "" },
  meetingUrl: { type: String, trim: true, default: "" },
  resourceUrl: { type: String, trim: true, default: "" },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Class", classSchema);
