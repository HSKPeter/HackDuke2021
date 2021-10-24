# Read For You

## Introduction
* ***Read For You*** is a project developed within 24 hours in the hackathon HackDuke 2021 (23 Oct 2021 - 24 Oct 2021), that hopes to empower the visually impaired group.
* The project was hosted on *https://readforyou.tech/*, using the services from the Google Cloud Platform and domain.com
* When a user uploads an image, words describing the image will be read out and displayed on screen. When a user uploads a document file (txt, docx, doc) the text will be read out and the contents will be displayed on screen.

## Setup for Project Development
1. Install npm modules
```bash
npm i
```

2. Set the environment variable for Google API
```bash
export GOOGLE_APPLICATION_CREDENTIALS="./apiKey.json"
```

3. Run ```index.js``` to host the website locally
```bash
node index.js
```

4. Visit ```http://localhost:8080/``` in the browser

## Tech Stacks
* Express.js
* Google Cloud Vision API
* Google Cloud Platform
* Nginx