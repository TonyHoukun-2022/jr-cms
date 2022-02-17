const Joi = require('joi');
const Course = require('../models/course')
const Student = require('../models/student')

/** mongoose query chain 概念如下 */
// const obj = {
//     add(newB) {
//         this.a = this.sum()
//         this.b = newB
//         return this
//     },
//     sum() {
//         return this.a + this.b
//     },
//     a: 1,
//     b:2
// }
// obj.add(2).add(3).add(2).sum()

/** CRUD logics */
const getAllCourses = async (req, res) => {
    //mongo shell => db.courses.find()
    //exec(), 执行前面query, 最好加上
    //找出所有的course document 并以 array 返回

    //大量数据的时候可以进行分页处理 limit/skip
    const courses = await Course.find().exec()

    //mongoose query chain 
    //后端数据sorting
    // Course.find().sort().limit()

    //默认status200
    res.json(courses)
}

const getCourseById = async (req, res) => { 
    const { id } = req.params

    //Course.find({ _id: id})
    const course = await Course.findById(id).exec()

    if (!course) {
        return res.status(404).json({
            error: 'course not found'
        })
    }

    res.json(course)
};

const addCourse = async (req, res) => { 
    const { code, name, description } = req.body

    /** todo => validation data */
    const schema = Joi.object({
        name: Joi.string().required(),
        //必须以字母开头，数字结尾 => COMP101
        code: Joi.string().regex(/^[a-zA-Z]+[0-9]+$/).required(),
        description: Joi.string()
    })

    //allowUnknown true => 允许client 传入 courseSchema 未定义的 property, 
    //stripUnknown => 将未定义properites 从 mongoose obj 中 删除
    schema.validateAsync(req.body, {allowUnknown: true, stripUnknown: true})

    //todo => check course if exist

    //创建mongoose obj，存在server
    const course = new Course({ code, name, description })

    //实际存到mongo db
    await course.save()
    
    //创建成功201
    res.status(201).json(course)
};

const updateCourseById = async (req, res) => { 
    const { id } = req.params

    const { name, description } = req.body

    //findByIdAndUpdate {new:true} 保证返回的course是最新update 的 course
    //only allow to update name and description fields of a course document
    const course = await Course.findByIdAndUpdate(id, { name, description }, {new: true}).exec()
    
    if (!course) {
        return res.status(404).json({
        error: "course not found",
    });
    }

    res.json(course)
};

const deleteCourseById = async (req, res) => { 
    const { id } = req.params

    const course = await Course.findByIdAndDelete(id).exec()

     if (!course) {
       return res.status(404).json({
         error: "course not found",
       });
     }
    
    /**delete student reference */
    await Student.updateMany({ courses: course._id }, {
        $pull: {
            courses: course._id
        }
    })
    
    res.sendStatus(204)

};

module.exports = {
    getAllCourses,
    getCourseById,
    addCourse,
    updateCourseById,
    deleteCourseById
}