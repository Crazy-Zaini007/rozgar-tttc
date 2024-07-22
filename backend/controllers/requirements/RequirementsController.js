const User = require('../../database/userdb/UserSchema')
const Requirements =require('../../database/requirements/RequirementsModel')
const cloudinary = require('../cloudinary')
const mongoose = require('mongoose')

//adding a new Requirement

const addRequirement=async(req, res)=>{

    const {title,content,picture}=req.body
    
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
        res.status(404).json({ message: "User not found" })
    }
    if(user){
           // uploading image to cloudinary
           let uploadImage;
           if (picture) {
             uploadImage = await cloudinary.uploader.upload(picture, {
               upload_preset: "rozgar",
             })
           }

           const newRequirement=new Requirements({
            title,
            content,
            picture: uploadImage?.secure_url || '',
            date:new Date().toISOString().split("T")[0],
            updatingDate:new Date().toISOString().split("T")[0],
            status:'Pending'
           })


           await newRequirement.save()
           res.status(200).json({ data: newRequirement, message: `New requirement added Successfully` })
    }
}

//delete a requirement

const deleteRequirement = async(req, res) => {
    
    const {reqId}=req.body
    if (!mongoose.Types.ObjectId.isValid(reqId)) {
        return res.status(400).json({ message: 'Invalid Expense ID' });
    }
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
        res.status(404).json({ message: "User not found" })
    }
    if(user){
        const requirementToDelete = await Requirements.findById(reqId);
        if (!requirementToDelete) {
            return res.status(404).json({ message: 'Requirement not found' });
        }
        if(requirementToDelete){
            await Requirements.findByIdAndDelete(reqId)
            res.status(200).json({ data: requirementToDelete, message: `Requirement deleted Successfully` });
        }
    }
}

//updating a Requirement

const updateRequirement=async(req, res) => {
    const {title,content,status,reqId}=req.body
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
        res.status(404).json({ message: "User not found" })
    }
    if(user){
        let requirementToUpdate=await Requirements.findById(reqId)
        if (!requirementToUpdate) {
            return res.status(404).json({ message: 'Requirement not found' });
        }
        if(requirementToUpdate){
            requirementToUpdate.title=title
            requirementToUpdate.content=content
            requirementToUpdate.updatingDate=new Date().toISOString().split("T")[0]
            requirementToUpdate.status=status
            await requirementToUpdate.save()
            res.status(200).json({ data: requirementToUpdate, message: `Requirement deleted Successfully` });
        }
    }
}

// adding a new Comment to the Requirement

const addComment=async(req,res)=>{
    const {reqId,description,image,commentBy}=req.body
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
        res.status(404).json({ message: "User not found" })
    }
    if(user){
        let requirementToUpdate=await Requirements.findById(reqId)
        if (!requirementToUpdate) {
            return res.status(404).json({ message: 'Requirement not found to update' });
        }

        if(requirementToUpdate){
            let uploadImage;
           if (image) {
             uploadImage = await cloudinary.uploader.upload(image, {
               upload_preset: "rozgar",
             })
           }
            const newComment={
                description,
                image:uploadImage?.secure_url || '',
                commentBy
            }

            requirementToUpdate.comments.push(newComment)
            await requirementToUpdate.save()
           res.status(200).json({  message: `Sent successfully` })
        }

    }
}

// deleting comment
const deleteComment = async (req, res) => {
    const { reqId, commentId } = req.body;
    const userId = req.user._id;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const requirementToUpdate = await Requirements.findById(reqId);
      if (!requirementToUpdate) {
        return res.status(404).json({ message: 'Requirement not found to update' });
      }
  
      const commentIndex = requirementToUpdate.comments.findIndex(c => c._id.toString() === commentId.toString());
      if (commentIndex === -1) {
        return res.status(404).json({ message: 'message not found' });
      }

      requirementToUpdate.comments.splice(commentIndex, 1);
      requirementToUpdate.updatingDate=new Date().toISOString().split("T")[0]
      await requirementToUpdate.save();
  
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting comment', error });
    }
  };


//   getting all Requirements

const getAllRequirements=async(req,res)=>{

    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
        res.status(404).json({ message: "User not found" })
    }
    if(user){
        const allRequirements=await Requirements.find({})
        let sortedRequirements=allRequirements.sort((a, b) => new Date(b.updatingDate) - new Date(a.updatingDate));
        res.status(200).json({ data: sortedRequirements})
        
    }
}

module.exports={addRequirement,deleteRequirement,updateRequirement,addComment,deleteComment,getAllRequirements}