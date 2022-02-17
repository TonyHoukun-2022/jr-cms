const express = require('express')
const authRouter = require('./auth')
const courseRouter = require('./course')
const studentRouter = require('./student')
const userRouter = require('./user')

const authGuard = require('../middleware/authGuard')

const router = express.Router()

//将 courseRouter route 与 /courses拼接
router.use('/courses', authGuard, courseRouter)

// router.use("/students", authGuard, studentRouter);
router.use("/students", studentRouter);

router.use('/users', userRouter)

//登陆路径
//可以命名为/login
router.use('/auth', authRouter)

module.exports = router