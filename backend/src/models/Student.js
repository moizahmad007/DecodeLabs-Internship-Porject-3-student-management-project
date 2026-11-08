import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, "Name is required"],
    trim: true, minlength: [2, "Name must contain at least 2 characters"],
    maxlength: [60, "Name cannot exceed 60 characters"]
  },
  email: {
    type: String, required: [true, "Email is required"],
    trim: true, lowercase: true, unique: true, maxlength: 120,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"]
  },
  course: {
    type: String, required: [true, "Course is required"],
    trim: true, minlength: 2, maxlength: 80
  },
  semester: {
    type: Number, required: [true, "Semester is required"],
    min: [1, "Semester must be at least 1"],
    max: [12, "Semester cannot exceed 12"],
    validate: { validator: Number.isInteger, message: "Semester must be a whole number" }
  }
}, { timestamps: true, versionKey: false });

export default mongoose.model("Student", studentSchema);
