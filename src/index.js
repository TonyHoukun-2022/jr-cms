const app = require('./app');
const connectDB = require('./utils/db');
const PORT = process.env.PORT || 3000;

connectDB()

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
