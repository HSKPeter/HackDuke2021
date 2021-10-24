// Import packages
const express = require('express');
const multer = require('multer');
const {findImageLabels} = require('./findImageLabels');
const {isImage, isWordDoc, isTextFile} = require('./identifyFileTypes');
const path = require('path');
const textract = require('textract');
const fs = require('fs');

// Initiate the express server
const app = express()
const port = 3000

// Configure the multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'files/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const imageFilter = function(req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|docx|DOCX|doc|DOCX|txt|TXT)$/)) {
    const errorMessage = 'Only accept image files (.jpg / .jpeg / .png) / text files (.doc / .docx / .txt)';
    req.fileValidationError = errorMessage;
      return cb(new Error(errorMessage), false);
  }
  cb(null, true);
};

// Handle post request to the route of '/upload'
app.post('/upload', (req, res) => {
  // 'profile_pic' is the name of our file input field in the HTML form
  let upload = multer({ storage: storage, fileFilter: imageFilter }).single('image');

  upload(req, res, async function(err) {
      // req.file contains information of uploaded file
      // req.body contains information of text fields, if there were any

      if (req.fileValidationError) {
          return res.send(req.fileValidationError);
      }
      else if (!req.file) {
          return res.send('Please select an image to upload');
      }
      else if (err instanceof multer.MulterError) {
          return res.send(err);
      }
      else if (err) {
          return res.send(err);
      }

      const filename = req.file.path

      if (isImage(filename)){
        const labels = await findImageLabels(req.file.path)
        res.status(200).json({ labels })
        return 
      }

      if (isWordDoc(filename)){
        textract.fromFileWithPath(filename, function( error, text ) {
          res.status(200).json({ labels: [text] })
        })        
        return
      }


      if (isTextFile(filename)){
        const text = fs.readFileSync('test.txt', 'utf8');
        res.status(200).json({ labels: [text] })    
        return
      }

  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Listening at PORT ${port}`)
})