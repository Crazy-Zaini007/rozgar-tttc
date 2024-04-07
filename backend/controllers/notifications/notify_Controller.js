const Notification = require('../../database/notifications/NotifyModel.js');
const User = require('../../database/userdb/UserSchema.js');

// Getting notifications
const getNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user) {
            // Calculate the time threshold for notifications older than 3 days
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            
            // Find and delete notifications older than 3 days
            await Notification.deleteMany({ createdAt: { $lt: sevenDaysAgo } });
            
            // Retrieve all notifications after deletion
            const allNotification = await Notification.find({}).sort({ createdAt: -1 });
            
            res.status(200).json({ data: allNotification });
        }
    } catch (error) {
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

      if(user){
        const {notifyId}=req.body
        const notifyToDelete=await Notification.findById(notifyId)
        if(!notifyToDelete){
            res.status(404).json({ message: "Notification not found" });
            return;
          }

          if(notifyToDelete){
            const delNotify=await Notification.findByIdAndDelete(notifyId)
        res.status(200).json({message:"Notification removed successfully !"})
          }
        }
        
    } catch (error) {
        console.error(error);
    res.status(500).json({ message: error.message });
    }
    }
    
module.exports={getNotification,deleteNotification}