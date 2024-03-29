//login logics
const User = require('../models/user')
const { generateToken } = require('../utils/jwt')

const login = async (req, res) => {
    const { username, password } = req.body 
    
    const existingUser = await User.findOne({ username }).exec()
    
    if (!existingUser) {
        return res.status(401).json({error: 'invalid username or password'})
    }

    const isPasswordValid = await existingUser.validatePassword(password)

    if (!isPasswordValid) {
        return res.status(401).json({error: 'invalid username or password'})
    }

    const token = generateToken({ username })

    res.json({username, token})
}

module.exports = {
    login
}