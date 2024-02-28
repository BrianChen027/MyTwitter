const mongoose = require('mongoose');

const dbURI = "mongodb+srv://TwitterUserA:76gb2EGUCjObxKI7@cluster0.crkbhbr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected!"))
  .catch((error) => console.log("Database connection error:", error));
