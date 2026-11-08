import mongoose from "mongoose";
import Student from "../models/Student.js";

const allowedFields = ["name", "email", "course", "semester"];

function validateId(id) {
  return mongoose.isValidObjectId(id);
}

export async function createStudent(req, res, next) {
  try {
    const payload = Object.fromEntries(
      Object.entries(req.body || {}).filter(([key]) => allowedFields.includes(key))
    );
    const student = await Student.create(payload);
    res.status(201).json({ message: "Student created successfully", student });
  } catch (error) { next(error); }
}

export async function getStudents(req, res, next) {
  try {
    const students = await Student.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ count: students.length, students });
  } catch (error) { next(error); }
}

export async function getStudentById(req, res, next) {
  try {
    if (!validateId(req.params.id)) return res.status(400).json({ message: "Invalid student ID" });
    const student = await Student.findById(req.params.id).lean();
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ student });
  } catch (error) { next(error); }
}

export async function updateStudent(req, res, next) {
  try {
    if (!validateId(req.params.id)) return res.status(400).json({ message: "Invalid student ID" });
    const updates = Object.fromEntries(
      Object.entries(req.body || {}).filter(([key]) => allowedFields.includes(key))
    );
    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "Provide at least one valid field to update" });
    }
    const student = await Student.findByIdAndUpdate(
      req.params.id, updates,
      { new: true, runValidators: true, context: "query" }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) { next(error); }
}

export async function deleteStudent(req, res, next) {
  try {
    if (!validateId(req.params.id)) return res.status(400).json({ message: "Invalid student ID" });
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) { next(error); }
}
