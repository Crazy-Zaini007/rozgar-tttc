const Reminders = require('../../database/reminders/RemindersModel.js');
const User = require('../../database/userdb/UserSchema.js');

// Getting notifications
const getReminders = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user ) {
            // Calculate the time threshold for notifications older than 3 days
            const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
            
            // Find and delete notifications older than 3 days
            await Reminders.deleteMany({ createdAt: { $lt: threeDaysAgo } });
            
            // Retrieve all notifications after deletion
            const allReminders = await Reminders.find({}).sort({ createdAt: -1 });
            
            res.status(200).json({ data: allReminders });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


const deleteReminders=async(req,res)=>{
    try {
        const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if(user ){
        const {notifyId}=req.body
        const notifyToDelete=await Reminders.findById(notifyId)
        if(!notifyToDelete){
            res.status(404).json({ message: "Reminder not found" });
            return;
          }

          if(notifyToDelete){
            const delNotify=await Reminders.findByIdAndDelete(notifyId)
        res.status(200).json({message:"Reminder removed successfully !"})
          }
        }
        
    } catch (error) {
        console.error(error);
    res.status(500).json({ message: error.message });
    }
    }
    
module.exports={getReminders,deleteReminders}