async function findImageLabels(imagePath) {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');
  
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
  
    // Performs label detection on the image file
    const [result] = await client.labelDetection(imagePath);
    const labels = result.labelAnnotations;
    const labelNames = [];
    labels.forEach(label => labelNames.push(label.description));
    return labelNames
  }
  
module.exports = {
  findImageLabels
}