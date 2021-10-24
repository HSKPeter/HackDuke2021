// Import packages
const express = require('express');
const multer = require('multer');
const { findImageLabels } = require('./findImageLabels');
const { isImage, isWordDoc, isTextFile } = require('./identifyFileTypes');
const path = require('path');
const textract = require('textract');
const fs = require('fs');

// // Initiate the express server
const app = express()
const port = 8080

// Configure the multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files/');
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|docx|DOCX|doc|DOCX|txt|TXT)$/)) {
    const errorMessage = 'Only accept image files (.jpg / .jpeg / .png) / text files (.doc / .docx / .txt)';
    req.fileValidationError = errorMessage;
    return cb(new Error(errorMessage), false);
  }
  cb(null, true);
};

// Handle post request to the route of '/upload'
app.post('/upload', (req, res) => {
  let upload = multer({ storage: storage, fileFilter: fileFilter }).single('uploadFile');

  upload(req, res, async function (err) {
    const errorMessageToClients = "Sorry. We only support image files and text files.";
    if (req.fileValidationError) {
      res.status(400).json({ labels: [errorMessageToClients]});
      return;
    }
    else if (!req.file) {
      res.status(400).json({ labels: [errorMessageToClients]});
      return;
    }
    else if (err instanceof multer.MulterError) {
      res.status(400).json({ labels: [errorMessageToClients]});
      return;
    }
    else if (err) {
      res.status(400).json({ labels: [errorMessageToClients]});
      return;
    }

    const filename = req.file.path

    if (isImage(filename)) {
      const labels = await findImageLabels(req.file.path);
      res.status(200).json({ labels });
      return
    }

    if (isWordDoc(filename)) {
      textract.fromFileWithPath(filename, function (error, text) {
        res.status(200).json({ labels: [text] });
      })
      return
    }


    if (isTextFile(filename)) {
      const text = fs.readFileSync('test.txt', 'utf8');
      res.status(200).json({ labels: [text] });
      return
    }

  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Listening at PORT ${port}`);
})