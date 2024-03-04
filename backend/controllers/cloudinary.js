const cloudinaryModule=require('cloudinary')

const cloudinary = cloudinaryModule.v2;

// Configuration 
cloudinary.config({
    cloud_name: "degdse5on",
    api_key: "661817392641162",
    api_secret: "MqXdxVCP1_lb6BXezX6wp-WqmNo"
  });
  
  module.exports=cloudinary
