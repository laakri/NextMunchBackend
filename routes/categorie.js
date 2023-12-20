// Import necessary modules
const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const path = require('path');

// Resolve the absolute path for the destination directory
const uploadDir = path.join(__dirname, '../../NextMunch/src/assets/images/categories');


// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
const Categorie = require("../models/categories");

router.post('/add', upload.single('imgCat'), (req, res) => {
  const { nameCat } = req.body;
  const imgCat = "../../../assets/images/categories/" + req.file.filename; 

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

router.get('/list', async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/delete', async (req, res) => {
  const { categoryIds } = req.body;
  try {
    // Assuming categoryIds is an array of category IDs to be deleted
    await Categorie.deleteMany({ _id: { $in: categoryIds } });
    res.json({ message: 'Categories deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/liste-categ",async(req,res)=>{
  try{
    const categories=await Categorie.find();

    res.status(200).json(categories);
  }catch(error){
    res.status(500).json({error:error.message});
  }
});

module.exports = router;
