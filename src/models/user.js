const mongoose = require('mongoose')
const joi = require('joi')
//hash bcrypt
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

// 1) bcrypt 写在 schema 里面 (不能用arrow func)
schema.methods.hashPassword = async function () {
    //hash original password to => salt (generated after 12 rounds) 
    this.password = await bcrypt.hash(this.password, 12)
}

//
schema.methods.validatePassword = async function (password) {
    //return true, false or error
    //compare typed in password with user.document.password
    return bcrypt.compare(password, this.password)
}
    
//collection => users
const Model = mongoose.model('User', schema)

module.exports = Model