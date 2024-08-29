const express = require("express");
const Student = require("../Models/Student");
const studentRoutes = express.Router();
const Book = require("../Models/Book");

studentRoutes.get("/countStudent", async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    res.status(200).json({ total: studentCount });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

studentRoutes.get("/", async (req, res) => {
  try {
    const student = await Student.find().populate("book");
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/students
studentRoutes.post("/", async (req, res) => {
  try {
    const { name, class: studentClass, book } = req.body;

    // Create a new student document
    const newStudent = new Student({
      name,
      class: studentClass,
      book,
    });
    // Save the student to the database
    const savedStudent = await newStudent.save();
    console.log(savedStudent.book[0]);

    // Respond with the saved student data
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error("Error creating student:", error);
    res
      .status(500)
      .json({ message: "Failed to create student", error: error.message });
  }
});

// delete student name if he returns his boo
studentRoutes.delete("/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findByIdAndDelete(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // const bookId = student.book[0];
    // const book = await Book.findById(bookId);
    // book.student = null;
    // await book.save();
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.log("Error:", error); // Log error for debugging
    res.status(500).json({ message: error.message });
  }
});

module.exports = studentRoutes;
