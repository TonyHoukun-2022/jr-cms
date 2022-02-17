// console.log(`environment ${process.env.NODE_ENV} from errorHandler`)
const environment = process.env.NODE_ENV

module.exports = (error, req, res, next) => {
    
    
    console.log(error)
    return res.status(500).json({
        error: 'Server Error! Please try later'
    })
}