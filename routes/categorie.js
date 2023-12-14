// Import necessary modules
const express = require('express');
const router = express.Router();
const multer = require('multer'); // For handling file uploads
const path = require('path');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/categories'); // Ensure that 'uploads' is the correct folder path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage });
const Categorie = require("../models/categories");


router.post('/add', upload.single('imgCat'), (req, res) => {
  const { nameCat } = req.body;
  const imgCat = req.file.filename; // Multer automatically adds a 'file' property to the request object

  const newCategory = new Categorie({
    nameCat,
    imgCat
  });

  newCategory.save()
    .then(category => {
      res.status(201).json(category);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
