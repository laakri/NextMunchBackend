const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const restaurantRoutes = require("./routes/restaurant");
const categorieRoutes = require("./routes/categorie");
const platRoutes= require("./routes/plat");
const app = express();

mongoose.set("strictQuery", false);

//conection to data
mongoose
  .connect(
    "mongodb+srv://team:DpP1PrG8cyrWA57T@cluster0.o0pyu4j.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/file-folder", express.static(path.join("file-folder")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-requested-With, Content-Type, Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  next();
});

app.use("/api/users", userRoutes);
app.use("/api/restos", restaurantRoutes);
app.use("/api/categorie", categorieRoutes);
app.use("/api/plats", platRoutes);





module.exports = app;
