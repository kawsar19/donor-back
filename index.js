const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
const authRouter = require('./routes/auth');
const noteRouter = require('./routes/note');
const volunteersRouter = require('./routes/volunteers');
const donorsRoute = require('./routes/donors');
const patientRoute = require('./routes/patient');
// Middleware
app.use(express.json());

const DB_STRING =process.env.DB_STRING

// Connect to MongoDB Atlas
mongoose
  .connect(DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB Atlas', err);
    process.exit(1);
  });

// Use the auth router

app.get('/',(req,res)=>{
  res.send("hello notes api")
})
app.use('/api', authRouter);
app.use('/api', noteRouter);
app.use('/api', volunteersRouter);
app.use('/api', donorsRoute);
app.use('/api', patientRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
