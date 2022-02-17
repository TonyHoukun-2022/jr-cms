const environment = process.env.NODE_ENV;

module.exports = (error, req, res, next) => {
    if (error.name === "ValidationError") {
      if (environment === "production") {
        console.log('error from validationHandler')
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json(error);
    }
    next()
}