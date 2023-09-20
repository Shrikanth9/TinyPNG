const axios = require("axios");
const { log } = require("console");
const fs = require("fs");
const path = require("path")

const apiKey = "P0Vk8CDChF5VkT2w7C8fWj1FQM5RbzCF";
const imageDir = "Images" // Provide the image directory path here

// Function to compress an image using the TinyPNG API

async function fetchUrl(inputFilePath) {
  try {
      const fileData = fs.readFileSync(inputFilePath);
      const response = await axios.post(
      "https://api.tinify.com/shrink",
      fileData,
      {
        auth: {
          username: "api",
          password: apiKey,
        },
      }
    );

    const compressedUrl = response.data.output.url;
    return compressedUrl;
  } catch (error) {
    console.error("Error compressing image:", error.message);
    return null;
  }

}
async function compressImage(inputFilePath, outputFilePath) {
    

  const url = await fetchUrl(inputFilePath);
  
  
  const compressedImage = await axios.get(url, {
      responseType: "arraybuffer",
    });
    
    fs.writeFileSync(outputFilePath, compressedImage.data);
    console.log("Image compressed and saved:", outputFilePath);
} 




  fs.mkdir(`${imageDir}-tinified`, (err) => {
    if (err) {
      console.log("Error creating TinyPNG folder")
    } else {
      console.log('TinyPNG Folder created successfully.');
      tinify();
    }

   
  });

  async function tinify() {

    fs.readdir(imageDir, (err, files) => {
      if (err) {
        console.error('Error reading directory:');
        return;
      }

      files.forEach(async file => {
   
        const inputFilePath = path.join(imageDir, file)
        const outputFilePath = path.join(`${imageDir}-tinified`, file);
  
        await compressImage(inputFilePath, outputFilePath)
      });
    })
  }
  
  // compressImage("Images/bird.png", "tinified/bird.png")


