# Read For You

## Introduction
* ***Read For You*** is a web application developed within 24 hours in the hackathon HackDuke 2021 (23 Oct 2021 - 24 Oct 2021).
* ***Read For You*** aims to empower the visually impaired group by providing image description and text to speech services.
* This project is hosted on *https://readforyou.tech/*, using the services from the Google Cloud Platform and domain.com
* When a user uploads an image, words describing the image will be read out and displayed on screen. When a user uploads a document file (txt, docx, doc) the text will be read out and the contents will be displayed on screen.
* (Click [here](https://docs.google.com/presentation/d/1WRcCWvhQonEmEPk43DZ1LMFHDcc7Pj009TAR4v32sUM/edit#slide=id.gd9d240c117_0_0) to learn more about this project)

## Setup for Project Development
1. Install npm modules
```bash
npm i
```
2.  Setup the Google Cloud Vision services
    * Generate an API Key from the Google Cloud Platform  
    * Create a JSON file named ```apiKey.json``` 
    * Insert the API Key in ```apiKey.json``` 

3. Set the environment variable for Google API
```bash
export GOOGLE_APPLICATION_CREDENTIALS="./apiKey.json"
```

4. Run ```index.js``` to host the website locally
```bash
node index.js
```

5. Visit ```http://localhost:8080/``` in the browser

## Tech Stacks
* Express.js
* Google Cloud Vision API
* Google Cloud Platform
* Nginx