const express = require('express');
const multer = require('multer');
const path = require('path');
const {findImageLabels} = require('./findImageLabels')
const textract = require('textract');

const app = express()
const port = 3000

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'files/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

app.use(express.static(path.join(__dirname, 'public')));

const imageFilter = function(req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|docx|DOCX|doc|DOCX)$/)) {
      req.fileValidationError = 'Only image files / .docx files are allowed!';
      return cb(new Error('Only image files / .docx files'), false);
  }
  cb(null, true);
};


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
      console.log(filename)

      if (isImage(filename)){
        const labels = await findImageLabels(req.file.path)
        // const labels = ['testing1', 'testing2']
        res.status(200).json({ labels })
        return 
      }

      if (isWordDoc(filename)){
        console.log(filename)
        textract.fromFileWithPath(filename, function( error, text ) {
          res.status(200).json({ labels: [text] })
        })        
        return
      }

      // // Display uploaded image for user validation
      // const labels = await findImageLabels(req.file.path)
      // // const labels = ['testing1', 'testing2']
      // res.status(200).json({ labels })
      // res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
  });
});

function isImage(filename){
  const fileType = path.extname(filename).toLowerCase()
  const isPNG = fileType === '.png'
  const isJPG = fileType === '.jpg'
  const isJPEG = fileType === '.png'
  return isPNG || isJPG ||isJPEG
}

function isWordDoc(filename){
  const fileType = path.extname(filename).toLowerCase()
  const isDOC = fileType === '.doc'
  const isDOCX = fileType === '.docx'
  return isDOC || isDOCX
}

// app.post('/upload', async (req, res) => {
//   res.status(200).json({ message: "success" })
// })

app.listen(port, () => {
  console.log(`Listening at PORT ${port}`)
})