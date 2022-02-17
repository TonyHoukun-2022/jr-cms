const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    //通过mongoose model 创建的document 都会自动生成一个id, 如果像自己定义这个id, 可以如下配置 _id =>
    _id: {
        type: String,
        uppercase: true,
        //virtual property => exist in mongoose but not in mongoDB document
        alias: 'code' //mongoose 会识别code 属性， 值和id相同
    },
    name: { 
        type: String, 
        required: true,
    },
    description: {
        type: String,
        default: ''
    },
    // code: {
    //     type: String,
    // }
    __v: {
        type: Number,
        //不想让__v 返回
        select: false
    },
    //course ：student => 1 : M
    students: [
        {
            //student document 的 _id 是 mongoose 自己生成的，不是自定义的，所以要用mongoose 的 ObjectId Type
            type: mongoose.Types.ObjectId ,
            ref: 'Student' //ref to Student Model
        }
    ],
    //假如 course: student => 1:1
    // student: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Student'
    // }
}, {
    //mongoose obj to json on browser options
    toJSON: {
        //虚拟属性显示 code 和 _id: 自己本身的默认虚拟属性 => id
        virtuals: true
    },
    //不显示id
    id: false,
    timestamps: true
})

//mongodb 会把 Course model 创建的 collection 变成 => courses
const Model = mongoose.model('Course', schema)

module.exports = Model

// module.exports = mongoose.Model('Model', new mongoose.Schema({}))

/**
 * mongoose schema => {
 *   _id, 
 *   code (same value as _id),
 *   description,
 *   name
 * 
 * }
 */