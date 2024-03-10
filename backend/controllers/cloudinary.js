const cloudinaryModule=require('cloudinary')

const cloudinary = cloudinaryModule.v2;

// Configuration 
cloudinary.config({
    cloud_name: "dnp3osckt",
    api_key: "612998946321666",
    api_secret: "9T8tkU-5GHgJrZhRlmGQ0i6Y_PM"
  });
  
  module.exports=cloudinary
