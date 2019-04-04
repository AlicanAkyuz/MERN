const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profiles = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

//Connect to mongoDB throguh mongoose
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDb Conencted"))
  .catch(err => console.log(err));

// passport middleware
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

// Use routes
app.use("/api/users", users);
app.use("/api/profile", profiles);
app.use("/api/posts", posts);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
