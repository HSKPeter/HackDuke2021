const express = require('express');
const multer = require('multer');
const path = require('path');
const {findImageLabels} = require('./findImageLabels')

const app = express()
const port = 3000

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'image/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

app.use(express.static(path.join(__dirname, 'public')));

const imageFilter = function(req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
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

      // Display uploaded image for user validation
      const labels = await findImageLabels(req.file.path)
      // const labels = ['testing1', 'testing2']
      res.status(200).json({ labels })
      // res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
  });
});

// app.post('/upload', async (req, res) => {
//   res.status(200).json({ message: "success" })
// })

app.listen(port, () => {
  console.log(`Listening at PORT ${port}`)
})