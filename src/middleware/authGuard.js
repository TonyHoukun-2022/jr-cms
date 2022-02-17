//authorization by bearer token
const { validateToken } = require('../utils/jwt')

module.exports = (req, res, next) => {
    //从request header里面取authorization
    const authorizationHeader = req.header('Authorization')

    if (!authorizationHeader) {
        return res.sendStatus(401)
        //相当于
        // res.sendStatus(401)
        // return
    }

    const tokenArray = authorizationHeader.split(' ')

    if (tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') {
        return res.sendStatus(401)
    }

    //有效 => decoded payload || 无效 => null
    const decodedPayload = validateToken(tokenArray[1])

    if (!decodedPayload) {
        return res.sendStatus(401)
    }

    next()
}