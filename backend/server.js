const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

const dashboardRoutes = require("./routes/dashboard");
const verifyToken = require("./routes/validate-token");
app.use('/dashboard', verifyToken, dashboardRoutes);

const adminRoute = require("./routes/admin");
app.use('/admins', adminRoute)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});