const Notifications=require('../../database/notifications/NotificationModel.js')
const User = require("../../database/userdb/UserSchema");


//getting notifications

const getNotifications =async(req,res)=>{

    try{
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
          }
        if(user && user.role==="Admin"){
            const allNotifications=await Notifications.find({}).sort({ createdAt: -1 });
            res.status(200).json({data:allNotifications})
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }

}

const deleteNotification=async(req,res)=>{
    try {
        const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if(user && user.role==="Admin"){
        const {notifyId}=req.body
        const notifyToDelete=await Notifications.findById(notifyId)
        if(!notifyToDelete){
            res.status(404).json({ message: "Notification not found" });
            return;
          }

          if(notifyToDelete){
            const delNotify=await Notifications.findByIdAndDelete(notifyId)
        res.status(200).json({message:"Notification removed successfully !"})
          }
        }
        
    } catch (error) {
        console.error(error);
    res.status(500).json({ message: error.message });
    }
    }
    
module.exports={getNotifications,deleteNotification}