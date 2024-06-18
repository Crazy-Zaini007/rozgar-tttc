const Notes =require('../../database/notes/NotesModel')
const User = require('../../database/userdb/UserSchema')

const addNote=async(req,res)=>{
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }
        if(user){
            const{title,content}=req.body
            const existingNote=await Notes.findOne({title:title.toLowerCase()})
            if(existingNote){
            res.status(404).json({ message: `Notes with Title: ${title} already exists !` })
            }
            if(!existingNote){
                const newNote=new Notes({
                    title,
                    content,
                    date:new Date().toISOString().split("T")[0]
                })

                await newNote.save()
                res.status(200).json({message:`Note with Title: ${title} saved successfully !`})
            }
        } 
    } catch (error) {
        
    }
}


const getNotes=async(req,res)=>{
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }
        if(user){
          
            const allNotes=await Notes.find({}).sort({ updatedAt: -1 })
                res.status(200).json({data:allNotes})
        } 
    } catch (err) {
        res.status(500).json({ message: err.message })
        
    }
}


const deleteNote=async(req,res)=>{
    try {
        const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if(user){
        const {noteId}=req.body
        const noteToDelete=await Notes.findById(noteId)
        if(!noteToDelete){
            res.status(404).json({ message: "Note not found" });
            return;
          }
          if(noteToDelete){
            const delNote=await Notes.findByIdAndDelete(noteId)
            res.status(200).json({message:"Note deleted successfully !"})
          }
        }
        
    } catch (error) {
        console.error(error);
    res.status(500).json({ message: error.message });
    }
    }
    
    
const updateNote=async(req,res)=>{
    try {
        const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if(user){
        const {noteId,title,content}=req.body
        const noteToUpdate=await Notes.findById(noteId)
        if(!noteToUpdate){
            res.status(404).json({ message: "Note not found" });
            return;
          }
          if(noteToUpdate){
            if(title.toLowerCase !==noteToUpdate.title.toLowerCase()){
                const existingNote=await Notes.findOne({title:title.toLowerCase()})
                if(existingNote){
                res.status(404).json({ message: `Notes with Title: ${title} already exists !` })
                }
                if(!existingNote){
                    noteToUpdate.title=title
                    noteToUpdate.content=content
                   
                    await noteToUpdate.save()
                    res.status(200).json({message:"Note updated successfully !"})

                }
            }
            else{
                noteToUpdate.title=title
                noteToUpdate.content=content
                noteToUpdate.date=date
                await noteToUpdate.save()
                res.status(200).json({message:"Note updated successfully !"})
            }

          }

        }
        
    } catch (error) {
        console.error(error);
    res.status(500).json({ message: error.message });
    }
    }
    
    module.exports={addNote,getNotes,deleteNote,updateNote}