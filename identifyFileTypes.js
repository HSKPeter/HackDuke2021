const path = require('path');

function isImage(filename) {
    const fileType = path.extname(filename).toLowerCase()
    const isPNG = fileType === '.png';
    const isJPG = fileType === '.jpg';
    const isJPEG = fileType === '.png';
    return isPNG || isJPG || isJPEG;
}

function isWordDoc(filename) {
    const fileType = path.extname(filename).toLowerCase()
    const isDOC = fileType === '.doc';
    const isDOCX = fileType === '.docx';
    return isDOC || isDOCX;
}

function isTextFile(filename){
    const fileType = path.extname(filename).toLowerCase()
    return fileType === '.txt';
}

module.exports = {
    isImage,
    isWordDoc,
    isTextFile
}