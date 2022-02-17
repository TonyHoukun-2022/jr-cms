const express = require('express')
const { getAllStudents, deleteStudentById, updateStudentById, addStudent, getStudentById, addCourseToStudent, removeCourseFromStudent } = require('../controllers/student')


const studentRouter = express.Router()

studentRouter.get('/',  getAllStudents)
studentRouter.post("/", addStudent);
studentRouter.delete("/:id", deleteStudentById);
studentRouter.put("/:id", updateStudentById);
studentRouter.get("/:id", getStudentById);

studentRouter.post("/:id/courses/:code", addCourseToStudent)
studentRouter.delete("/:id/courses/:code", removeCourseFromStudent);

module.exports = studentRouter