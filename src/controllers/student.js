const Student = require('../models/student')
const Course = require('../models/course')

const addStudent = async (req, res) => {
    const { firstName, lastName, email } = req.body 

    /** todo data validation */

    const student = new Student({
        firstName, lastName, email
    })

    // try {
    //     await student.save()
    // } catch (err) {
    //     console.log(err)
    //     return res.send(err)
    // }

    //相当于 =>
    // student.save().then().catch(e => { return res.send(e) })
    
    /**用express-async-errors package， 可以不用trycatch */
    await student.save()

    res.status(201).json(student)
}

const getStudentById = async (req, res) => {
    const { id } = req.params 

    const student = await Student.findById(id).populate('courses', 'name description -_id').exec()

    if (!student) {
        return res.status(404).send('student not found')
    }

    res.json(student)
};

const updateStudentById = async (req, res) => {
    const { id } = req.params 

    const { firstName, lastName, email } = req.body
    
    // console.log(firstName)

    //id, {fields allowed to update}, {new:true}
    const student = await Student.findByIdAndUpdate(id, { firstName, lastName, email }, { new: true }).exec()
    
    if (!student) {
      return res.status(404).json({msg: 'student not found'});
    }

    res.json(student)
 };

const getAllStudents = async (req, res) => { 
    const students = await Student.find().exec()

    res.json(students)
};

const deleteStudentById = async (req, res) => {
    const { id } = req.params 

    const student = await Student.findByIdAndDelete(id).exec()

    if (!student) {
      return res.status(404).json({ msg: "student not found" });
    }

    /** delete course reference */
    //updateMany({search condition}, {operation})
    //search cond => 找到students[] 里面有 被删除 student._id 的 course documents
    //operation: 把 被删除student的id 从 students[] 里面删除
    await Course.updateMany({ students: student._id }, {
        $pull: {
            students: student._id
        }
    }).exec()

    res.sendStatus(204)
};
 
// POST /vi/students/:id/courses/:code
const addCourseToStudent = async (req, res) => {
    const { id, code } = req.params
    
    const student = await Student.findById(id).exec()
    const course = await Course.findById(code).exec()

    if (!student || !course) {
        return res.status(404).json({error: 'course or student not found'})
    }

    //往student document 里的 courses push course._id
    //student.courses.push()
    student.courses.addToSet(course._id) // => 用addToSet 方法对数组添加的好处是，能让数组项不重复

    course.students.addToSet(student._id)

    await student.save()
    await course.save()

    return res.json(student)
}

// DELETE /vi/students/:id/courses/:code
const removeCourseFromStudent = async (req, res) => {
    const { id, code } = req.params
    
    const student = await Student.findById(id).exec()
    const course = await Course.findById(code).exec()

    if (!student || !course) {
        return res.status(404).json({error: 'course or student not found'})
    }

    //往student document 里的 courses 删除 course.id
    //student.courses.push()
    student.courses.pull(course._id) 

    course.students.pull(student._id)

    await student.save()
    await course.save()

    return res.json(student)
}

module.exports = {
    addStudent,
    getStudentById,
    updateStudentById,
    getAllStudents,
    deleteStudentById,
    addCourseToStudent,
    removeCourseFromStudent
}